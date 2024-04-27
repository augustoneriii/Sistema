import React, { useContext, useRef, useState } from 'react';
import { SidebarContext } from '../../../context/SideBarContext';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Modal from '../../../components/Modal';
import { PerfilService } from './Service/PerfilService';
import { Toast } from 'primereact/toast';
import { Menu } from 'primereact/menu';
import { Checkbox } from 'primereact/checkbox';
import { FloatLabel } from 'primereact/floatlabel';
import { Commom } from '../../../utils/Commom.js'
import { useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';

function Perfil() {
    const { perfilVisible, setPerfilVisible } = useContext(SidebarContext);
    const [dataLoaded, setDataLoaded] = useState(false);

    const emptyPerfil = {
        id: null,
        nome: '',
        cpf: '',
        rg: '',
        telefone: '',
        endereco: '',
        nascimento: '',
        sexo: '',
        email: ''  
    };
    const [perfis, setPerfis] = useState([]);
    const [perfil, setPerfil] = useState(emptyPerfil);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);
    const [perfilDialog, setPerfilDialog] = useState(false);
    const menuRef = useRef(null);
    const [menuModel, setMenuModel] = useState([]);
    const [selectedPerfis, setSelectedPerfis] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const dt = useRef(null);

    useEffect(() => {
        async function fetchPerfil() {
            const currentToken = localStorage.getItem('token') || '';
            try {
                const response = await PerfilService.getDadosPessoais(currentToken);
                setPerfis(response.data); // Assuming response.data contains the array of perfis

                const perfilUsuarioLogado = await getPerfilUsuarioLogado(currentToken);
                setPerfil(perfilUsuarioLogado);
                setDataLoaded(true); // Marca que os dados foram carregados
            } catch (error) {
                console.error("Erro ao buscar perfil:", error);
            }
        }

        if (perfilVisible && !dataLoaded) {
            fetchPerfil();
        }
   
       
    }, [perfilVisible, dataLoaded, perfis]);

    const getPerfilUsuarioLogado = async (token) => {
        // Lógica para obter as informações do usuário logado (substitua isso pela sua lógica real)
        try {
            const response = await PerfilService.getDadosPessoais(token);
            const perfilUsuario = response.data; // Assuming response.data contains the perfil data
            return perfilUsuario;
        } catch (error) {
            throw error;
        }
    };
    const dropdownSexo = [
        { label: 'Masculino', value: 'M' },
        { label: 'Feminino', value: 'F' }
    ];

    const openNew = () => {
        setPerfis(emptyPerfil);
        setSubmitted(false);
        setPerfilDialog(true);
    };

    const savePerfil = () => {
        setSubmitted(true);

        if (perfil.nome.trim()) {
            let _perfis = [...perfis];
            let _perfil = { ...perfil };


            
            const currentToken = localStorage.getItem('token') || '';
            if (perfil.id) {
                const index = findIndexById(perfil.id);
                _perfis[index] = _perfil;
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Perfil Atualizado', life: 3000 });
                PerfilService.updateDadosPessoais(_perfil, currentToken);
            } else {
                _perfis.push(_perfil);
                PerfilService.createDadosPessoais(_perfil, currentToken);
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Perfil Criado', life: 3000 });
            }

            setPerfis(_perfis);
            setPerfilDialog(false);
            setPerfil(emptyPerfil);
        }
    };

    const editPerfil = (perfil) => {
        setPerfil({ ...perfil });
        setPerfilDialog(true);
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < perfis.length; i++) {
            if (perfis[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    };


    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _perfil = { ...perfil };

        // Verifica se o campo é o telefone e aplica a formatação
        if (name === 'telefone') {
            _perfil[`${name}`] = Commom.formatPhone(val);
        } else if (name === 'rg') {
            _perfil[`${name}`] = Commom.formatRg(val);
        } else if (name === 'cpf') {
            _perfil[`${name}`] = Commom.formatCpf(val);
        } else {
            _perfil[`${name}`] = val;
        }

        setPerfil(_perfil);
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
            { label: 'Editar', icon: 'pi pi-pencil', command: () => editPerfil(rowData) },
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
        <h1>Perfil</h1>
    );

    const onHideModal = () => {
        setPerfilVisible(false);
        setDataLoaded(false); // Reseta o carregamento de dados para false quando o modal é fechado
    };


    return (
        <>
        <Toast ref={toast} />

        <Modal header={header} modal={false} visible={perfilVisible} style={{ width: '80vw', height: '80vh' }} onHide={() => onHideModal()}>
                <div className='card'>
                    <div className='grid'>

                        <div className="field col-6">
                            <FloatLabel>
                                <label htmlFor="nome">Nome</label>
                                <InputText className='w-full' id="nome" value={perfil.nome} onChange={(e) => onInputChange(e, 'nome')} />
                            </FloatLabel>
                        </div>

                        <div className="field col-6">
                            <FloatLabel>
                                <label htmlFor="telefone">Telefone</label>
                                <InputText className='w-full' id="telefone" value={perfil.telefone} onChange={(e) => onInputChange(e, 'telefone')} maxLength={14} />
                            </FloatLabel>
                        </div>

                        <div className="field col-6">
                            <FloatLabel>
                                <label htmlFor="email">E-mail</label>
                                <InputText className='w-full' id="email" value={perfil.email} onChange={(e) => onInputChange(e, 'email')} />
                            </FloatLabel>
                        </div>
                        <div className="field col-6">
                            <FloatLabel>
                                <label htmlFor="rg">Rg</label>
                                <InputText className='w-full' id="rg" value={perfil.rg} onChange={(e) => onInputChange(e, 'rg')} maxLength={9} />
                            </FloatLabel>
                        </div>
                        <div className="field col-6">
                            <FloatLabel>
                                <label htmlFor="cpf">Cpf</label>
                                <InputText className='w-full' id="cpf" value={perfil.cpf} onChange={(e) => onInputChange(e, 'cpf')} maxLength={14} />
                            </FloatLabel>
                        </div>
                        <div className="field col-6">
                            <FloatLabel>
                                <label htmlFor="endereco">Endereço</label>
                                <InputText className='w-full ' id="endereco" value={perfil.endereco} onChange={(e) => onInputChange(e, 'endereco')}  />
                            </FloatLabel>
                        </div>
                        <div className="field col-6">
                            <label htmlFor="sexo" className="mr-2">Sexo</label>
                            <Dropdown id="sexo" value={perfil.sexo} options={dropdownSexo} onChange={(e) => onInputChange(e, 'sexo')} placeholder="Selecione um sexo" />
                        </div>
                        <div className="field col-6">
                            <label htmlFor="nascimento" className="mr-2">Nascimento</label>
                            <Calendar id="nascimento" value={perfil.nascimento} onChange={(e) => onInputChange(e, 'nascimento')} showIcon />
                        </div>
                        

                        

                        <div className="field col">
                            <Button label="Salvar" icon="pi pi-check" className="border-round p-button-text" onClick={savePerfil} />
                        </div>
                    </div>
                </div>

                {/*<div className="card">*/}
                {/*    <DataTable ref={dt} value={perfis} election={selectedPerfis} onSelectionChange={e => setSelectedPerfis(e.value)}*/}
                {/*        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} scrollable scrollHeight="200px"*/}
                {/*        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"*/}
                {/*        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} perfis" globalFilter={globalFilter}>*/}
                {/*        <Column body={actionButtonGroupTemplate}></Column>*/}
                {/*        <Column field="nome" header="Nome" sortable></Column>*/}
                {/*        <Column field="cpf" header="Cpf" sortable></Column>*/}
                {/*        <Column field="email" header="E-mail" sortable></Column>*/}
                {/*        <Column field="rg" header="Rg" sortable></Column>*/}
                {/*        <Column field="telefone" header="Telefone" sortable></Column>*/}
                {/*        <Column field="endereco" header="Endereço" sortable></Column>*/}
                {/*        <Column field="sexo" header="Sexo" sortable></Column>*/}
                {/*    </DataTable>*/}
                {/*</div>*/}
        </Modal>
        </>
        
    );
}

export default Perfil;