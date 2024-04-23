
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
import { Checkbox } from 'primereact/checkbox';
import { FloatLabel } from 'primereact/floatlabel';
import { Commom } from '../../utils/Commom.js';

export default function Profissional() {
    let emptyProfissional = {
        id: null,
        nome: "",
        cpf: "",
        rg: "",
        telefone: "",
        email: "",
        endereco: "",
        nascimento: "",
        sexo: "",
        observacoes: "",
        image: "",
        profissaoId: null,
        convenioId: null,
        ativo: null
    };

    const { profissionalVisible, setProfissionalVisible } = useContext(SidebarContext);

    const [profissionais, setProfissionais] = useState([]);
    const [profissoes, setProfissoes] = useState([]);
    const [convenios, setConvenios] = useState([]);
    const [profissionalDialog, setProfissionalDialog] = useState(false);
    //const [deleteProfissionalDialog, setDeleteProfissionalDialog] = useState(false);
    const [profissional, setProfissional] = useState(emptyProfissional);
    const [selectedProfissionais, setSelectedProfissionais] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [token] = useState(localStorage.getItem('token') || '');
    const [conselho, setConselho] = useState("");
    const toast = useRef(null);
    const dt = useRef(null);
    const [checked, setChecked] = useState(true); // Estado para controlar o valor do checkbox

    useEffect(() => {
        const currentToken = localStorage.getItem('token') || '';
        ProfissionalService.getProfissionais(currentToken)
            .then(response => {
                setProfissionais(response.data);
            })
            .catch(error => {
                console.error("Erro ao buscar profissionais:", error);
            });
        if (profissional.ativo === 1) {
            setChecked(true); // Marca o checkbox se o campo "ativo" for igual a 1
        } else {
            setChecked(false);
        }
    }, [profissional.ativo]);

    useEffect(() => {
        if (profissional.conselho) {
            setConselho(profissional.conselho); // inicializa com o valor do conselho quando este estiver disponível
        }
    }, [profissional.conselho]);

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

    useEffect(() => {
        const currentToken = localStorage.getItem('token') || '';
        Promise.all([
            ProfissionalService.getProfissionais(currentToken),
            ProfissionalService.getProfissoes(currentToken)
        ]).then(([profissionaisResponse, profissoesResponse]) => {
            setProfissionais(profissionaisResponse.data);
            setProfissoes(profissoesResponse.data);
        }).catch(error => {
            console.error("Erro ao buscar profissionais e/ou profissões:", error);
        });
    }, []);

    
    const profissaoBodyTemplate = (rowData) => {
        return rowData.profissoes ? rowData.profissoes.nome : '';
    };

    const conselhoBodyTemplate = (rowData) => {
        return rowData.profissoes ? rowData.profissoes.conselhoProfissional : '';
    };
   
      const findProfissaoById = (id) => {
         console.log("ID da Profissão:", id);
         console.log("Profissões:", profissoes);
         return profissoes.find(profissao => profissao.id === id);
    };

    const convenioBodyTemplate = (rowData) => {
        return rowData.convenioMedicos && rowData.convenioMedicos.length > 0 ? rowData.convenioMedicos[0].nome : '';
    };
    const dropdownConvenios = convenios.map(convenio => {
        return {
            label: convenio.nome,
            value: convenio.id
        };
    });

    const dropdownProfissoes = profissoes.map(profissao => {
        return {
            label: profissao.nome,
            value: profissao.id
        };
    });

    const dropdownSexo = [
        { label: 'Masculino', value: 'M' },
        { label: 'Feminino', value: 'F' }
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

    /*const hideDeleteProfissionalDialog = () => {
        setDeleteProfissionalDialog(false);
    };*/

        const saveProfissional = () => {
            setSubmitted(true);

            if (profissional.nome.trim()) {
                let _profissionais = [...profissionais];
                let _profissional = {
                    id: profissional.id,
                    nome: profissional.nome,
                    cpf: profissional.cpf,
                    rg: profissional.rg,
                    telefone: profissional.telefone,
                    email: profissional.email,
                    endereco: profissional.endereco,
                    conselho: profissional.profissao.nome,
                    nascimento: profissional.nascimento,
                    sexo: profissional.sexo,
                    observacoes: profissional.observacoes,
                   // image: "string",
                    profissaoId: profissional.profissaoId,
                    convenioId: profissional.convenioId 
                }
                //let _profissional = { ...profissional, conselho: conselho }; // atualiza o conselho com o valor digitado

                _profissional.ativo = checked ? 1 : 0; // Atualiza o campo "ativo" com base no estado do checkbox
                
                const currentToken = localStorage.getItem('token') || '';
                if (profissional.id) {
                    const index = findIndexById(profissional.id);
                    _profissionais[index] = _profissional;
                    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Profissional Atualizado', life: 3000 });
                    ProfissionalService.updateProfissional(_profissional, currentToken);
                } else {
                    _profissionais.push(_profissional);
                    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Profissional Criado', life: 3000 });
                    ProfissionalService.saveProfissional(_profissional, currentToken);
                }

                setProfissionais(_profissionais);
                setProfissionalDialog(false);
                setProfissional(emptyProfissional);
            }
        };

    const editProfissional = (profissional) => {
        setProfissional({ ...profissional });
        setConselho(profissional.conselho || ''); // Garante que o conselho seja preenchido mesmo que seja nulo
        setProfissionalDialog(true);
    };

    /*const confirmDeleteProfissional = (profissional) => {
        setProfissional(profissional);
        setDeleteProfissionalDialog(true);
    };

    const deleteProfissional = () => {
        const currentToken = localStorage.getItem('token') || '';

        if (profissional && profissional.id) {
            console.log("Profissional antes da exclusão:", profissional);

            ProfissionalService.deleteProfissional(profissional.id, currentToken)
                .then(() => {
                    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Profissional Deletado', life: 3000 });

                    // Filtra o profissional excluído e atualiza o estado profissionais
                    const updatedProfissionais = profissionais.filter(val => val.id !== profissional.id);
                    console.log("Profissionais atualizados:", updatedProfissionais);
                    setProfissionais(updatedProfissionais);

                    setDeleteProfissionalDialog(false);
                    setProfissional(emptyProfissional);
                    ProfissionalService.getProfissoes(currentToken);
                })
                .catch(error => {
                    console.error("Erro ao deletar profissional:", error);
                });
        } else {
            console.error("Erro: id do profissional é undefined");
        }
    };
    const deleteProfissionalDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" className="border-round p-button-text" onClick={hideDeleteProfissionalDialog} />
            <Button label="Sim" icon="pi pi-check" className="border-round p-button-text" onClick={deleteProfissional} />
        </>
    );

    <Dialog visible={deleteProfissionalDialog} style={{ width: '450px' }} header="Confirmação" modal footer={deleteProfissionalDialogFooter} onHide={hideDeleteProfissionalDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-2" style={{ fontSize: '2rem' }} />
                        {profissional && <span>Tem certeza que deseja excluir o profissional <b>{profissional.nome}</b>?</span>}
                    </div>
                </Dialog>

                <Button icon="pi pi-trash" className="border-round p-button-rounded p-button-danger" onClick={() => confirmDeleteProfissional(rowData)} />
    */

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

    const onInputChange = (e, name) => {
        const val = e.target.value || '';
        let _profissional = { ...profissional };

        if (name === 'convenio') {
            _profissional.convenioId = val;
        } else if (name === 'profissao') {
            _profissional.profissaoId = val;
        } else if (name === 'telefone') {
            _profissional.telefone = Commom.formatPhone(val)
        } else if (name === 'cpf') {
            _profissional.cpf = Commom.formatCpf(val)
        } else if (name === "rg") {
            _profissional.rg = Commom.formatRg(val)
        } else {
            _profissional[name] = val;
        }

        setProfissional(_profissional);
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

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" className="border-round p-button-rounded p-button-success mr-2" onClick={() => editProfissional(rowData)} />
                
            </>
        );
    };

    const onProfissaoChange = (e) => {
        const selectedProfissaoId = e.value;
        const selectedProfissao = profissoes.find(prof => prof.id === selectedProfissaoId);
        let _profissional = { ...profissional, profissaoId: selectedProfissaoId };

        // Configura o conselho se existir na profissão selecionada
        if (selectedProfissao && selectedProfissao.conselhoProfissional) {
            _profissional.conselho = selectedProfissao.conselhoProfissional;
        } else {
            _profissional.conselho = '';
        }

        // Atualiza o nome da profissão no estado do profissional
        _profissional.profissao = selectedProfissao ? selectedProfissao.nome : '';

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
        <>
            <Button label="Cancelar" icon="pi pi-times" className="border-round p-button-text" onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" className="border-round p-button-text" onClick={saveProfissional} />
        </>
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
                        <Column field="nome" header="Nome" sortable></Column>
                        <Column field="cpf" header="CPF" sortable></Column>
                        <Column field="rg" header="RG" sortable></Column>
                        <Column field="telefone" header="Telefone" sortable></Column>
                        <Column field="email" header="E-mail" sortable></Column>
                        <Column header="Profissão" body={profissaoBodyTemplate}></Column>
                        <Column header="Convenio" body={convenioBodyTemplate}></Column>
                        <Column header="Conselho" body={conselhoBodyTemplate}></Column>
                        <Column field="ativo" header="Ativo" sortable></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>
                </div>

                <Dialog visible={profissionalDialog} style={{ width: '850px', margin: 'auto' }} header="Detalhes do Profissional" modal className="p-fluid" footer={profissionalDialogFooter} onHide={hideDialog}>
                    <div className="field mt-4">
                        <FloatLabel>
                        <label htmlFor="email">E-mail</label>
                        <InputText id="email" value={profissional.email} onChange={(e) => onInputChange(e, 'email')} />
                        </FloatLabel>
                    </div>
                    <div className="field mt-4">
                        <FloatLabel>
                        <label htmlFor="nome">Nome</label>
                        <InputText id="nome" value={profissional.nome} onChange={(e) => onInputChange(e, 'nome')} required autoFocus className={classNames({ 'p-invalid': submitted && !profissional.nome })} />
                        {submitted && !profissional.nome && <small className="p-error">Nome é obrigatório.</small>}
                        </FloatLabel>
                    </div>

                    <div className='grid'>
                        <div className="field col mt-3">
                            <FloatLabel>
                            <label htmlFor="cpf">CPF</label>
                                <InputText id="cpf" value={profissional.cpf} onChange={(e) => onInputChange(e, 'cpf')} required className={classNames({ 'p-invalid': submitted && !profissional.cpf })} maxLength={14} />
                            {submitted && !profissional.cpf && <small className="p-error">CPF é obrigatório.</small>}
                            </FloatLabel>
                        </div>

                        <div className="field col mt-3">
                            <FloatLabel>
                            <label htmlFor="rg">RG</label>
                                <InputText id="rg" value={profissional.rg} onChange={(e) => onInputChange(e, 'rg')} maxLength={9} />
                            </FloatLabel>
                        </div>

                        <div className="field col mt-3">
                            <FloatLabel>
                            <label htmlFor="telefone">Telefone</label>
                               <InputText className='w-full' id="telefone" value={profissional.telefone} onChange={(e) => onInputChange(e, 'telefone')} maxLength={14} />
                            </FloatLabel>
                        </div>
                    </div>

                    <div className="field mt-3">
                        <FloatLabel>
                        <label htmlFor="endereco">Endereço</label>
                        <InputText id="endereco" value={profissional.endereco} onChange={(e) => onInputChange(e, 'endereco')} />
                        </FloatLabel>
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
                                value={profissional.profissaoId}
                                options={dropdownProfissoes}
                                onChange={onProfissaoChange}
                                placeholder="Selecione uma profissão"
                            />
                        </div>
                    </div>

                    <div className='grid'>
                        <div className="field col">
                            <label htmlFor="conselho">{profissional.conselho ? `Conselho (${profissional.conselho})` : "Conselho"}</label>
                            <InputText
                                id="conselho"
                                disabled={!profissional.conselho}
                                value={conselho}
                                onChange={(e) => setConselho(e.target.value)}
                            />
                        </div>

                        <div className="field col">
                            <label htmlFor="convenio">Convênio</label>
                            <Dropdown
                                id="convenio"
                                value={profissional.convenioId}
                                options={dropdownConvenios}
                                onChange={(e) => onInputChange(e, 'convenio')}
                                placeholder="Selecione um convênio"
                            />
                        </div>

                        <div className="field col">
                            <label htmlFor="ativo">Ativo</label>
                            <Checkbox onChange={onCheckboxChange} checked={checked}></Checkbox>
                        </div>
                    </div>

                    <div className="field mt-3">
                        <FloatLabel>
                        <label htmlFor="observacoes">Observações</label>
                        <InputTextarea id="observacoes" value={profissional.observacoes} onChange={(e) => onInputChange(e, 'observacoes')} rows={4} cols={30} />
                        </FloatLabel>

                    </div>
                </Dialog>

            </Modal>
        </>
    );
} 