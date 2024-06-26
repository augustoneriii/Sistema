import React, { useContext } from 'react';
import { Button } from 'primereact/button';
import { SidebarContext } from '../../../context/SideBarContext';
import { InputText } from 'primereact/inputtext';
import { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProfissaoService } from './service/ProfissaoService.js';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Menu } from 'primereact/menu';
import Modal from '../../../components/Modal/index.js';
import { Checkbox } from 'primereact/checkbox';
import { FloatLabel } from 'primereact/floatlabel';
//import check e close icons do prime react
import 'primeicons/primeicons.css';
function Profissao() {
    const { profissaoVisible, setProfissaoVisible } = useContext(SidebarContext);
    const modalIdRef = useRef(Math.random().toString(36).substr(2, 9));


    let emptyProfissao = {
        id: null,
        nome: '',
        conselhoProfissional: '',
        ativo: null
    };

    const [profissoes, setProfissoes] = useState([]);
    const [profissaoDialog, setProfissaoDialog] = useState(false);
    //const [deleteProfissaoDialog, setDeleteProfissaoDialog] = useState(false);
    const [profissao, setProfissao] = useState(emptyProfissao);
    const [selectedProfissoes, setSelectedProfissoes] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [menuModel, setMenuModel] = useState([]);
    const menuRef = useRef(null);
    const [errorMessage, setErrorMessage] = useState(''); // Novo estado para controlar a mensagem de erro

    const [activeProfissoes, setActiveProfissoes] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);

    const [checked, setChecked] = useState(true); // Estado para controlar o valor do checkbox

    useEffect(() => {
        async function fetchProfissoes() {
            const currentToken = localStorage.getItem('token') || '';
            try {
                const response = await ProfissaoService.getProfissoes(currentToken);
                setProfissoes(response.data); // Assuming response.data contains the array of convenios
                setDataLoaded(true); // Marca que os dados foram carregados
            } catch (error) {
                console.error("Erro ao buscar profissoes:", error);
            }
        }

        if (profissaoVisible && !dataLoaded) {
            fetchProfissoes();
        }
        if (profissao.ativo === 1) {
            setChecked(true); // Marca o checkbox se o campo "ativo" for igual a 1
        } else {
            setChecked(false);
        }
        if (profissoes.length > 0) {
            const filteredProfissoes = profissoes.filter(profissao => profissao.ativo === 1); // Filtra os convenios ativos
            setActiveProfissoes(filteredProfissoes); // Atualiza o estado com os convenios ativos
        }

    }, [profissaoVisible, dataLoaded, profissao.ativo, profissoes]);

    const openNew = () => {
        setProfissao(emptyProfissao);
        setSubmitted(false);
        setProfissaoDialog(true);
    };

    /*const hideDeleteProfissaoDialog = () => {
        setDeleteProfissaoDialog(false);
    };*/

    const saveProfissao = () => {
        setSubmitted(true);

        if (profissao.nome.trim()) {
            let _profissoes = [...profissoes];
            let _profissao = { ...profissao };

            _profissao.ativo = checked ? 1 : 0; // Atualiza o campo "ativo" com base no estado do checkbox
            const currentToken = localStorage.getItem('token') || '';
            try {
                if (profissao.id) {
                    const index = findIndexById(profissao.id);
                    _profissoes[index] = _profissao;
                    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Profissao Atualizado', life: 3000 });
                    ProfissaoService.updateProfissao(_profissao, currentToken);
                } else {
                    _profissoes.push(_profissao);
                    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Profissao Criado', life: 3000 });
                    ProfissaoService.createProfissao(_profissao, currentToken);
                }
                setProfissoes(_profissoes);
                setProfissaoDialog(false);
                setProfissao(emptyProfissao);
            } catch (error) {
                console.error("Erro ao salvar profissao:", error);
                if (error.response && error.response.status === 400) {
                    toast.current.show({ severity: 'error', summary: 'Erro', detail: `Usuário não tem permissão para essa operação: ${error}`, life: 3000 });
                }

            }


        }
    };

    const conselhoProfissionalOptions = [
        { label: 'Conselho Regional de Medicina (CRM)', value: 'CRM' },
        { label: 'Conselho Regional de Enfermagem (Coren)', value: 'Coren' },
        { label: 'Conselho Regional de Odontologia (CRO)', value: 'CRO' },
        { label: 'Conselho Regional de Farmácia (CRF)', value: 'CRF' },
        { label: 'Conselho Regional de Psicologia (CRP)', value: 'CRP' },
        { label: 'Conselho Regional de Fisioterapia e Terapia Ocupacional (CREFITO)', value: 'CREFITO' },
        { label: 'Conselho Regional de Nutrição (CRN)', value: 'CRN' },
        { label: 'Conselho Regional de Biomedicina (CRBM)', value: 'CRBM' },
        { label: 'Conselho Regional de Biologia (CRBio)', value: 'CRBio' },
        { label: 'Conselho Regional de Fonoaudiologia (CREFONO)', value: 'CREFONO' }
    ];


    const editProfissao = (profissao) => {
        setProfissao({ ...profissao });
        setProfissaoDialog(true);
    };

    /*const confirmDeleteProfissao = (profissao) => {
        setProfissao(profissao);
        setDeleteProfissaoDialog(true);
    };

    const deleteProfissao = () => {
        const currentToken = localStorage.getItem('token') || '';
    
        if (profissao && profissao.id) {
            ProfissaoService.deleteProfissao(profissao.id, currentToken)
                .then(() => {
                    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Profissão Deletada', life: 3000 });
                    setProfissoes(profissoes.filter(val => val.id !== profissao.id));
                    setDeleteProfissaoDialog(false);
                    setProfissao(emptyProfissao);
                })
                .catch(error => {
                    toast.current.show({ severity: 'error', summary: 'Erro', detail: `Erro ao deletar profissão: ${error}`, life: 3000 });
                    console.error("Erro ao deletar profissão:", error);
                });
        } else {
            console.error("Erro: ID da profissão é undefined");
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'ID da profissão é indefinido', life: 3000 });
        }
    };*/


    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < profissoes.length; i++) {
            if (profissoes[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    };
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _profissao = { ...profissao };
        _profissao[`${name}`] = val;
        setProfissao(_profissao);
    };

    const onCheckboxChange = (e) => {
        setChecked(e.checked); // Atualiza o estado do checkbox
    };

    const leftToolbarTemplate = () => {
        return (
            <>
                <Button label="Novo" icon="pi pi-plus" className="border-round p-button-success mr-2" onClick={openNew} />
            </>
        );
    };

    const actionButtonGroupTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-bars" className="border-round p-button-rounded p-button-text" onClick={(e) => toggleMenu(rowData, e)} />
                <Menu model={menuModel} ref={menuRef} popup={true} id="popup_menu" />
            </>
        );
    };

    const toggleMenu = (rowData, e) => {
        setMenuModel([])

        let arrayMenu = [
            { label: 'Editar', icon: 'pi pi-pencil', command: () => editProfissao(rowData) },
            //{ label: 'Excluir', icon: 'pi pi-trash', command: () => confirmDeleteProfissao(rowData) }
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
        <h1>Profissões</h1>
    );

    /*const deleteProfissaoDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" className="border-round p-button-text" onClick={hideDeleteProfissaoDialog} />
            <Button label="Sim" icon="pi pi-check" className="border-round p-button-text" onClick={deleteProfissao} />
        </>
    );
    <Dialog visible={deleteProfissaoDialog} style={{ width: '450px' }} header="Confirmação" modal footer={deleteProfissaoDialogFooter} onHide={hideDeleteProfissaoDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-2" style={{ fontSize: '2rem' }} />
                        {profissao && <span>Tem certeza que deseja excluir o profissao <b>{profissao.nome}</b>?</span>}
                    </div>
                </Dialog>
    */

    return (
        <>
            <Toast ref={toast} />

            <Modal modalKey={modalIdRef.current} header={header} modal={false} visible={profissaoVisible} style={{ width: '30vw' }} onHide={() => setProfissaoVisible(false)}>
                <div className='card'>
                    <div className='grid'>
                        <div className="field col-12 mt-5">
                            <FloatLabel>
                                <label htmlFor="nome">Nome</label>
                                <InputText className='w-full' id="nome" value={profissao.nome} onChange={(e) => onInputChange(e, 'nome')} />
                            </FloatLabel>
                        </div>
                        <div className="field col-12">
                            <FloatLabel>
                                <Dropdown className='w-full' id="conselhoProfissional" value={profissao.conselhoProfissional} options={conselhoProfissionalOptions} onChange={(e) => onInputChange(e, 'conselhoProfissional')} />
                                <label htmlFor="conselhoProfissional">Conselho Profissional</label>
                            </FloatLabel>
                        </div>
                        <div className=" col-12 flex align-items-center">
                            <label className="mr-2" htmlFor="ativo">Ativo</label>
                            <Checkbox onChange={onCheckboxChange} checked={checked}></Checkbox>
                        </div>
                        <div className="field col-12">
                            <Button label="Salvar" icon="pi pi-check" className="border-round p-button-text" onClick={saveProfissao} />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <DataTable ref={dt} value={activeProfissoes} selection={selectedProfissoes} onSelectionChange={e => setSelectedProfissoes(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} scrollable scrollHeight="200px"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} profissoes" globalFilter={globalFilter}>
                        <Column body={actionButtonGroupTemplate}></Column>
                        <Column field="nome" header="Nome" sortable></Column>
                        <Column field="conselhoProfissional" header="Conselho Profissional" sortable></Column>
                        <Column field="ativo" header="Ativo" body={(rowData) => {
                            if (rowData.ativo === 1) { return <i className="pi pi-check" style={{ fontSize: '1rem' }}></i>; } else {
                                return <i className="pi pi-times" style={{ fontSize: '1rem' }}></i>;
                            }
                        }} sortable ></Column>
                    </DataTable>
                </div>
            </Modal >
        </>
    )
}

export default Profissao