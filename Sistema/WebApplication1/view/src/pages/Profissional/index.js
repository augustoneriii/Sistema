
import React, { useState, useEffect, useRef, useContext } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProfissionalService } from './service/ProfissionalService.js';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import Modal from '../../components/Modal/index.js';
import { SidebarContext } from '../../context/SideBarContext.js';

export default function Profissional() {
    let emptyProfissional = {
        IdProfissional: null,
        NomeProfissional: '',
        cpf: '',
        rg: '',
        telefone: '',
        endereco: '',
        nascimento: '',
        sexo: '',
        EmailProfissional: '',
        NomeProfissao: '',
        ConselhoProfissao: '',
        NomeConvenio: '',
        observacoes: ''
    };

    const { profissionalVisible, setProfissionalVisible } = useContext(SidebarContext);

    const [profissionais, setProfissionais] = useState([]);
    const [profissoes, setProfissoes] = useState([]);
    const [convenios, setConvenios] = useState([]);
    const [profissionalDialog, setProfissionalDialog] = useState(false);
    const [deleteProfissionalDialog, setDeleteProfissionalDialog] = useState(false);
    const [profissional, setProfissional] = useState(emptyProfissional);
    const [selectedProfissionais, setSelectedProfissionais] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [token] = useState(localStorage.getItem('token') || '');
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const currentToken = localStorage.getItem('token') || '';
        ProfissionalService.getProfissionais(currentToken)
            .then(response => {
                setProfissionais(response.data);
            })
            .catch(error => {
                console.error("Erro ao buscar profissionais:", error);
            });
    }, []);

    useEffect(() => {
        const currentToken = localStorage.getItem('token') || '';
        ProfissionalService.getProfissoes(currentToken)
            .then(response => {
                setProfissoes(response.data);
            })
            .catch(error => {
                console.error("Erro ao buscar profissionais:", error);
            });
    }, []);

    useEffect(() => {
        const currentToken = localStorage.getItem('token') || '';
        ProfissionalService.getConvenios(currentToken)
            .then(response => {
                setConvenios(response.data);
            })
            .catch(error => {
                console.error("Erro ao buscar profissionais:", error);
            });
    }, []);

    const dropdownConvenios = convenios.map(convenio => {
        return {
            label: convenio.nome,
            value: convenio.nome
        };
    });

    const dropdownProfissoes = profissoes.map(profissao => {
        return {
            label: profissao.nome,
            value: profissao.conselhoProfissional
        };
    });

    const dropdownSexo = [
        { label: 'Masculino', value: 'Masculino' },
        { label: 'Feminino', value: 'Feminino' }
    ];

    const openNew = () => {
        setProfissional(emptyProfissional);
        setSubmitted(false);
        setProfissionalDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProfissionalDialog(false);
    };

    const hideDeleteProfissionalDialog = () => {
        setDeleteProfissionalDialog(false);
    };

    const saveProfissional = () => {
        setSubmitted(true);

        if (profissional.nome.trim()) {
            let _profissionais = [...profissionais];
            let _profissional = { ...profissional };

            const currentToken = localStorage.getItem('token') || '';
            if (profissional.id) {
                const index = findIndexById(profissional.id);
                _profissionais[index] = _profissional;
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Profissional Atualizado', life: 3000 });
                ProfissionalService.updateProfissional(_profissional, currentToken);
            } else {
                _profissional.id = createId();
                _profissionais.push(_profissional);
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Profissional Criado', life: 3000 });
                ProfissionalService.createProfissional(_profissional, currentToken);
            }

            setProfissionais(_profissionais);
            setProfissionalDialog(false);
            setProfissional(emptyProfissional);
        }
    };

    const editProfissional = (profissional) => {
        setProfissional({ ...profissional });
        setProfissionalDialog(true);
    };

    const confirmDeleteProfissional = (profissional) => {
        setProfissional(profissional);
        setDeleteProfissionalDialog(true);
    };

    const deleteProfissional = () => {
        const currentToken = localStorage.getItem('token') || '';

        if (profissional && profissional.id) {

            ProfissionalService.deleteProfissional(profissional.id, currentToken)
                .then(() => {
                    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Profissional Deletado', life: 3000 });
                    setProfissionais(profissionais.filter(val => val.id !== profissional.id));
                    setDeleteProfissionalDialog(false);
                    setProfissional(emptyProfissional);
                })
                .catch(error => {
                    console.error("Erro ao deletar profissional:", error);
                });
        } else {
            console.error("Erro: id do profissional é undefined");
        }
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < profissionais.length; i++) {
            if (profissionais[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    };

    const createId = () => {
        return Math.random().toString(36).substr(2, 9);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _profissional = { ...profissional };
        _profissional[`${name}`] = val;
        setProfissional(_profissional);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Novo" icon="pi pi-plus" className="border-round p-button-success mr-2" onClick={openNew} />
            </React.Fragment>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="border-round p-button-rounded p-button-success mr-2" onClick={() => editProfissional(rowData)} />
                <Button icon="pi pi-trash" className="border-round p-button-rounded p-button-danger" onClick={() => confirmDeleteProfissional(rowData)} />
            </React.Fragment>
        );
    };

    const onProfissaoChange = (e) => {
        let _profissional = { ...profissional };
        _profissional.profissao = profissoes.find(prof => prof.conselhoProfissional === e.value);
        setProfissional(_profissional);
    };

    const header = (
        <div className="table-header">
            <h5 className="mx-0 my-1">Gerenciar Profissionais</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const profissionalDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="border-round p-button-text" onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" className="border-round p-button-text" onClick={saveProfissional} />
        </React.Fragment>
    );

    const deleteProfissionalDialogFooter = (
        <React.Fragment>
            <Button label="Não" icon="pi pi-times" className="border-round p-button-text" onClick={hideDeleteProfissionalDialog} />
            <Button label="Sim" icon="pi pi-check" className="border-round p-button-text" onClick={deleteProfissional} />
        </React.Fragment>
    );

    return (
        <>
            <Toast ref={toast} />
            <Modal header={header} modal={false} visible={profissionalVisible} style={{ width: '50vw' }} onHide={() => setProfissionalVisible(false)}>

                <Card>
                    <span className="p-text-center p-mb-4" style={{ fontSize: '24px', color: '#333', borderBottom: 'solid 1px #6c757d' }}>
                        Cadastro de Profissional
                    </span>
                </Card>

                <div className="card">
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={profissionais} selection={selectedProfissionais} onSelectionChange={e => setSelectedProfissionais(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} profissionais" globalFilter={globalFilter} header={header}>
                        <Column selectionMode="multiple" style={{ width: '3rem' }}></Column>
                        <Column field="NomeProfissional" header="Nome" sortable></Column>
                        <Column field="cpf" header="CPF" sortable></Column>
                        <Column field="telefone" header="Telefone" sortable></Column>
                        <Column field="EmailProfissional" header="E-mail" sortable></Column>
                        <Column field="NomeProfissao" header="Profissão" sortable></Column>
                        <Column field="ConselhoProfissional" header="Conselho" sortable></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>
                </div>

                <Dialog visible={profissionalDialog} style={{ width: '850px', margin: 'auto' }} header="Detalhes do Profissional" modal className="p-fluid" footer={profissionalDialogFooter} onHide={hideDialog}>
                    <div className="field">
                        <label htmlFor="email">E-Mail</label>
                        <InputText id="email" value={profissional.email} onChange={(e) => onInputChange(e, 'email')} />
                    </div>
                    <div className="field ">
                        <label htmlFor="nome">Nome</label>
                        <InputText id="nome" value={profissional.nome} onChange={(e) => onInputChange(e, 'nome')} required autoFocus className={classNames({ 'p-invalid': submitted && !profissional.nome })} />
                        {submitted && !profissional.nome && <small className="p-error">Nome é obrigatório.</small>}
                    </div>

                    <div className='grid'>
                        <div className="field col">
                            <label htmlFor="cpf">CPF</label>
                            <InputText id="cpf" value={profissional.cpf} onChange={(e) => onInputChange(e, 'cpf')} required className={classNames({ 'p-invalid': submitted && !profissional.cpf })} />
                            {submitted && !profissional.cpf && <small className="p-error">CPF é obrigatório.</small>}
                        </div>

                        <div className="field col">
                            <label htmlFor="rg">RG</label>
                            <InputText id="rg" value={profissional.rg} onChange={(e) => onInputChange(e, 'rg')} />
                        </div>

                        <div className="field col">
                            <label htmlFor="telefone">Telefone</label>
                            <InputText id="telefone" value={profissional.telefone} onChange={(e) => onInputChange(e, 'telefone')} />
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="endereco">Endereço</label>
                        <InputText id="endereco" value={profissional.endereco} onChange={(e) => onInputChange(e, 'endereco')} />
                    </div>

                    <div className='grid'>

                        <div className="field col">
                            <label htmlFor="nascimento">Nascimento</label>
                            <Calendar id="nascimento" value={profissional.nascimento} onChange={(e) => onInputChange(e, 'nascimento')} showIcon />
                        </div>

                        <div className="field col">
                            <label htmlFor="sexo">Sexo</label>
                            <Dropdown id="sexo" value={profissional.sexo} options={dropdownSexo} onChange={(e) => onInputChange(e, 'sexo')} placeholder="Selecione um sexo" />
                        </div>

                        <div className="field col">
                            <label htmlFor="profissao">Especialidade</label>
                            <Dropdown
                                id="profissao"
                                value={profissional.profissao_id}
                                options={dropdownProfissoes}
                                onChange={onProfissaoChange}
                                placeholder="Selecione uma profissão"
                            />
                        </div>
                    </div>

                    <div className='grid'>
                        <div className="field col">
                            <label htmlFor="conselho">
                                {profissional.profissao ? profissional.profissao.conselhoProfissional : "Conselho"}
                            </label>
                            <InputText
                                id="conselho"
                                disabled={!profissional.profissao}
                                value={profissional.conselho}
                                onChange={(e) => onInputChange(e, 'conselho')}
                            />
                        </div>

                        <div className="field col">
                            <label htmlFor="convenio">Convenio</label>
                            <Dropdown id="convenio" value={profissional.convenio} options={dropdownConvenios} onChange={(e) => onInputChange(e, 'convenio')} placeholder="Selecione um convenio" />
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="observacoes">Observações</label>
                        <InputTextarea id="observacoes" value={profissional.observacoes} onChange={(e) => onInputChange(e, 'observacoes')} rows={4} cols={30} />
                    </div>
                </Dialog>

                <Dialog visible={deleteProfissionalDialog} style={{ width: '450px' }} header="Confirmação" modal footer={deleteProfissionalDialogFooter} onHide={hideDeleteProfissionalDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-2" style={{ fontSize: '2rem' }} />
                        {profissional && <span>Tem certeza que deseja excluir o profissional <b>{profissional.nome}</b>?</span>}
                    </div>
                </Dialog>
            </Modal>
        </>
    );
}
