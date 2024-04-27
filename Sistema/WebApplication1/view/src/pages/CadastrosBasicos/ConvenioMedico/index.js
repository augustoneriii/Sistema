import React, { useContext, useRef } from 'react';
import { Button } from 'primereact/button';
import { SidebarContext } from '../../../context/SideBarContext';
import { InputText } from 'primereact/inputtext';
import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ConvenioService } from './service/ConvenioService.js';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import Modal from '../../../components/Modal/index.js';
import { Menu } from 'primereact/menu';
import { Checkbox } from 'primereact/checkbox';
import { FloatLabel } from 'primereact/floatlabel';
import { Commom } from '../../../utils/Commom.js';
function ConvenioMedico() {
    const { convenioVisible, setConvenioVisible } = useContext(SidebarContext);
    // const [convenioVisible, setConvenioVisible] = useState(true);

    const emptyConvenio = {
        id: null,
        nome: '',
        telefone: '',
        email: '',
        site: '',
        ativo: null
    };

    const [convenios, setConvenios] = useState([]);
    const [convenioDialog, setConvenioDialog] = useState(false);
    //const [deleteConvenioDialog, setDeleteConvenioDialog] = useState(false);
    const [convenio, setConvenio] = useState(emptyConvenio);
    const [selectedConvenios, setSelectedConvenios] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const menuRef = useRef(null);
    const [menuModel, setMenuModel] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [checked, setChecked] = useState(true); // Estado para controlar o valor do checkbox
    const [activeConvenios, setActiveConvenios] = useState([]); // Estado para armazenar os convenios ativos



    const dt = useRef(null);


    useEffect(() => {
        async function fetchConvenios() {
            const currentToken = localStorage.getItem('token') || '';
            try {
                const response = await ConvenioService.getConvenios(currentToken);
                setConvenios(response.data); // Assuming response.data contains the array of convenios
                setDataLoaded(true); // Marca que os dados foram carregados
            } catch (error) {
                console.error("Erro ao buscar convenios:", error);
            }
        }

        if (convenioVisible && !dataLoaded) {
            fetchConvenios();
        }
        if (convenio.ativo === 1) {
            setChecked(true); // Marca o checkbox se o campo "ativo" for igual a 1
        } else {
            setChecked(false);
        }
        if (convenios.length > 0) {
            const filteredConvenios = convenios.filter(convenio => convenio.ativo === 1); // Filtra os convenios ativos
            setActiveConvenios(filteredConvenios); // Atualiza o estado com os convenios ativos
        }

    }, [convenioVisible, dataLoaded, convenio.ativo, convenios]);


    const onHideModal = () => {
        setConvenioVisible(false);
        setDataLoaded(false); // Reseta o carregamento de dados para false quando o modal é fechado
    };


    const openNew = () => {
        setConvenio(emptyConvenio);
        setSubmitted(false);
        setConvenioDialog(true);
    };

    /*const hideDeleteConvenioDialog = () => {
        setDeleteConvenioDialog(false);
    };*/

    const saveConvenio = () => {
        setSubmitted(true);

        if (convenio.nome.trim()) {
            let _convenios = [...convenios];
            let _convenio = { ...convenio };


            _convenio.ativo = checked ? 1 : 0; // Atualiza o campo "ativo" com base no estado do checkbox
            const currentToken = localStorage.getItem('token') || '';
            if (convenio.id) {
                const index = findIndexById(convenio.id);
                _convenios[index] = _convenio;
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Convenio Atualizado', life: 3000 });
                ConvenioService.updateConvenio(_convenio, currentToken);
            } else {
                _convenios.push(_convenio);
                ConvenioService.createConvenio(_convenio, currentToken);
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Convenio Criado', life: 3000 });
            }

            setConvenios(_convenios);
            setConvenioDialog(false);
            setConvenio(emptyConvenio);
        }
    };


    const editConvenio = (convenio) => {
        setConvenio({ ...convenio });
        setConvenioDialog(true);
    };

    /*
    const confirmDeleteConvenio = (convenio) => {
        setConvenio(convenio);
        setDeleteConvenioDialog(true);
    };

    const deleteConvenio = () => {
        const currentToken = localStorage.getItem('token') || '';

        if (convenio && convenio.id) {

            ConvenioService.deleteConvenio(convenio.id, currentToken)
                .then(() => {
                    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Convenio Deletado', life: 3000 });
                    setConvenios(convenios.filter(val => val.id !== convenio.id));
                    setDeleteConvenioDialog(false);
                    setConvenio(emptyConvenio);
                })
                .catch(error => {
                    toast.current.show({ severity: 'Error', summary: 'Error', detail: `Erro ao deletar convenio: ${error}`, life: 3000 });
                    console.error("Erro ao deletar convenio:", error);
                });
        } else {
            console.error("Erro: id do convenio é undefined");
        }
    };*/

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < convenios.length; i++) {
            if (convenios[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    };


    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _convenio = { ...convenio };

        // Verifica se o campo é o telefone e aplica a formatação
        if (name === 'telefone') {
            _convenio[`${name}`] = Commom.formatPhone(val);
        } else {
            _convenio[`${name}`] = val;
        }

        setConvenio(_convenio);
    };

    const onCheckboxChange = (e) => {
        setChecked(e.checked); // Atualiza o estado do checkbox
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Novo" icon="pi pi-plus" className="border-round p-button-success mr-2" onClick={openNew} />
            </React.Fragment>
        );
    };

    const actionButtonGroupTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-bars" className="border-round p-button-rounded p-button-text" onClick={(e) => toggleMenu(rowData, e)} />
                <Menu model={menuModel} ref={menuRef} popup={true} id="popup_menu" />
            </React.Fragment>
        );
    };

    const toggleMenu = (rowData, e) => {
        setMenuModel([])

        let arrayMenu = [
            { label: 'Editar', icon: 'pi pi-pencil', command: () => editConvenio(rowData) },
            //{ label: 'Excluir', icon: 'pi pi-trash', command: () => confirmDeleteConvenio(rowData) }
        ];

        arrayMenu.forEach((item) => {
            setMenuModel(prevState => [...prevState, item]);
        });

        if (menuRef.current) {
            menuRef.current.toggle(e);
        } else {
            console.error('Menu ref não está definido');
        }
    };

    const header = (
        <h1>Convenios Médicos</h1>
    );

    /*const deleteConvenioDialogFooter = (
        <React.Fragment>
            <Button label="Não" icon="pi pi-times" className="border-round p-button-text" onClick={hideDeleteConvenioDialog} />
            <Button label="Sim" icon="pi pi-check" className="border-round p-button-text" onClick={deleteConvenio} />
        </React.Fragment>
    );
    <Dialog visible={deleteConvenioDialog} style={{ width: '450px' }} header="Confirmação" modal footer={deleteConvenioDialogFooter} onHide={hideDeleteConvenioDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-2" style={{ fontSize: '2rem' }} />
                        {convenio && <span>Tem certeza que deseja excluir o convenio <b>{convenio.nome}</b>?</span>}
                    </div>
                </Dialog>
    */

    return (
        <>
            <Toast ref={toast} />

            <Modal header={header} modal={false} visible={convenioVisible} style={{ width: '50vw', height: '80vh' }} onHide={() => onHideModal()}>
                <div className='card'>
                    <div className='grid'>
                        
                        <div className="field col-6">
                            <FloatLabel>
                            <label htmlFor="nome">Nome</label>
                            <InputText className='w-full' id="nome" value={convenio.nome} onChange={(e) => onInputChange(e, 'nome')} />
                            </FloatLabel>
                        </div>
                     
                        <div className="field col-6">
                            <FloatLabel>
                            <label htmlFor="telefone">Telefone</label>
                                <InputText className='w-full' id="telefone" value={convenio.telefone} onChange={(e) => onInputChange(e, 'telefone')} maxLength={14} />
                            </FloatLabel>
                        </div>
                        
                        <div className="field col-6">
                            <FloatLabel>
                            <label htmlFor="email">E-mail</label>
                            <InputText className='w-full' id="email" value={convenio.email} onChange={(e) => onInputChange(e, 'email')} />
                            </FloatLabel>
                        </div>
     
                        <div className="field col-6">
                        <FloatLabel>
                            <label htmlFor="site">Site</label>
                            <InputText className='w-full' id="site" value={convenio.site} onChange={(e) => onInputChange(e, 'site')} />
                        </FloatLabel>
                        </div>
                        

                 
                        <div className=" col-6 flex align-items-center">
                            <label className="mr-2" htmlFor="ativo">Ativo</label>
                            <Checkbox onChange={onCheckboxChange} checked={checked}></Checkbox>
                        </div>
                       
                        <div className="field col">
                            <Button label="Salvar" icon="pi pi-check" className="border-round p-button-text" onClick={saveConvenio} />
                        </div>
                    </div>
                </div>
                    
                <div className="card">
                    <DataTable ref={dt} value={activeConvenios} selection={selectedConvenios} onSelectionChange={e => setSelectedConvenios(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} scrollable scrollHeight="200px"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} convenios" globalFilter={globalFilter}>
                        <Column body={actionButtonGroupTemplate}></Column>
                        <Column field="nome" header="Nome" sortable></Column>
                        <Column field="telefone" header="Telefone" sortable></Column>
                        <Column field="email" header="E-Mail" sortable></Column>
                        <Column field="site" header="Site" sortable></Column>
                        <Column field="ativo" header="ativo" sortable></Column>
                    </DataTable>
                </div>
                          
            </Modal>
        </>
    )
}

export default ConvenioMedico