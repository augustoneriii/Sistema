
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
import { MultiSelect } from 'primereact/multiselect';


export default function Profissional() {
    const modalIdRef = useRef(Math.random().toString(36).substr(2, 9));
    const modalIdRef2 = useRef(Math.random().toString(36).substr(2, 9));

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
        profissionalConveniosId: [],
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
    const [activeProfissionais, setActiveProfissionais] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [checked, setChecked] = useState(true);
    const [selectedConvenios, setSelectedConvenios] = useState([]); 

    useEffect(() => {
        async function fetchProfissionais() {
            const currentToken = localStorage.getItem('token') || '';
            try {
                const response = await ProfissionalService.getProfissionais(currentToken);
                setProfissionais(response.data);
                setDataLoaded(true);
            } catch (error) {
                console.error("Erro ao buscar profissionais:", error);
            }
        }

        if (profissionalVisible && !dataLoaded) {
            fetchProfissionais();
        }
        if (profissional.ativo === 1) {
            setChecked(true); // Marca o checkbox se o campo "ativo" for igual a 1
        } else {
            setChecked(false);
        }
        if (convenios.length > 0) {
            const filteredProfissionais = profissionais.filter(profissional => profissional.ativo === 1);
            setActiveProfissionais(filteredProfissionais);
        }

    }, [profissionalVisible, dataLoaded, profissional.ativo, profissionais]);

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

    //metodo para remover . e - do cpf
    const removeCaracteres = (cpf) => {
        return cpf.replace(/[.-]/g, '');
    }

    const saveProfissional = () => {
        setSubmitted(true);

        // Verifica se todos os campos obrigatórios estão preenchidos
        if (
            profissional.nome.trim() &&
            profissional.cpf.trim() &&
            profissional.email.trim() &&
            profissional.endereco.trim() &&
            profissional.nascimento &&
            profissional.sexo &&
            profissional.profissaoId
        ) {
            let _profissionais = [...profissionais];
            let _profissional = {
                id: profissional.id,
                nome: profissional.nome,
                cpf: removeCaracteres(profissional.cpf),
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
                profissionalConveniosId: selectedConvenios,
                ativo: checked ? 1 : 0
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
        } else {
            // Exibe mensagem de toast informando que todos os campos são obrigatórios
            toast.current.show({ severity: 'warn', summary: 'Atenção', detail: 'Todos os campos são obrigatórios' });
        }
    };

    const editProfissional = (profissional) => {

        setProfissional({
            ...profissional,
            nascimento: profissional.nascimento ? new Date(profissional.nascimento) : null,
            profissaoId: profissional.profissaoId ? profissional.profissaoId : null,
            conselho: profissional.conselho ? profissional.conselho : '',
            convenioId: profissional.convenioId ? profissional.convenioId : null
        });
        setConselho(profissional.conselho || '');
        setProfissionalDialog(true);
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
                <FloatLabel>
                    <label htmlFor="globalFilter">Filtro Global</label>
                    <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
                </FloatLabel>
            </>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <>
                <Button label="Novo" icon="pi pi-plus" className="border-round p-button-rounded p-button-success" onClick={openNew} />
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
            <Modal modalKey={modalIdRef.current} header={header} modal={false} visible={profissionalVisible} style={{ width: '50vw' }} onHide={() => setProfissionalVisible(false)}>
                <div className="card">
                    <Toolbar className="mb-4" right={rightToolbarTemplate} left={leftToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={activeProfissionais} selection={selectedProfissionais} onSelectionChange={e => setSelectedProfissionais(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} profissionais" globalFilter={globalFilter} header={header}>
                        <Column field="nome" header="Nome" sortable></Column>
                        <Column field="cpf" header="CPF" sortable></Column>
                        <Column field="rg" header="RG" sortable></Column>
                        <Column field="telefone" header="Telefone" sortable></Column>
                        <Column field="email" header="E-mail" sortable></Column>
                        <Column header="Profissão" body={profissaoBodyTemplate}></Column>
                        <Column field="ativo" header="Ativo" sortable></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>
                </div>

                <Modal
                    modalKey={modalIdRef2.current}
                    header="Detalhes do Profissional"
                    modal={false}
                    visible={profissionalDialog}
                    style={{ width: '850px', margin: 'auto' }}
                    onHide={hideDialog}
                    footer={profissionalDialogFooter}
                >
                    <div class="row">
                        <div className="field mt-4 col">
                            <FloatLabel className="w-full">
                                <label htmlFor="email">E-mail</label>
                                <InputText className="w-full" id="email" value={profissional.email} onChange={(e) => onInputChange(e, 'email')} />
                            </FloatLabel>
                        </div>
                        <div className="field mt-4 col">
                            <FloatLabel className="w-full">
                                <label htmlFor="nome">Nome</label>
                                <InputText id="nome" value={profissional.nome} onChange={(e) => onInputChange(e, 'nome')} required autoFocus className={`w-full ${classNames({ 'p-invalid': submitted && !profissional.nome })} `} />
                                {submitted && !profissional.nome && <small className="p-error">Nome é obrigatório.</small>}
                            </FloatLabel>
                        </div>
                    </div>

                    <div className='grid'>
                        <div className="field col mt-3">
                            <FloatLabel className="w-full">
                                <label htmlFor="cpf">CPF</label>
                                <InputText id="cpf" value={profissional.cpf} onChange={(e) => onInputChange(e, 'cpf')} required className={`w-full ${classNames({ 'p-invalid': submitted && !profissional.cpf })} `} maxLength={14} />
                                {submitted && !profissional.cpf && <small className="p-error">CPF é obrigatório.</small>}
                            </FloatLabel>
                        </div>

                        <div className="field col mt-3">
                            <FloatLabel className="w-full">
                                <label htmlFor="rg">RG</label>
                                <InputText className="w-full" id="rg" value={profissional.rg} onChange={(e) => onInputChange(e, 'rg')} maxLength={9} />
                            </FloatLabel>
                        </div>

                        <div className="field col mt-3">
                            <FloatLabel className="w-full">
                                <label htmlFor="telefone">Telefone</label>
                                <InputText className='w-full' id="telefone" value={profissional.telefone} onChange={(e) => onInputChange(e, 'telefone')} maxLength={15} />
                            </FloatLabel>
                        </div>
                    </div>

                    <div className="field mt-3">
                        <FloatLabel className="w-full">
                            <label htmlFor="endereco">Endereço</label>
                            <InputText className="w-full" id="endereco" value={profissional.endereco} onChange={(e) => onInputChange(e, 'endereco')} />
                        </FloatLabel>
                    </div>

                    <div className='grid'>

                        <div className="field col">
                            <label htmlFor="nascimento">Nascimento</label>
                            <Calendar className='w-full' id="nascimento" value={profissional.nascimento} onChange={(e) => onInputChange(e, 'nascimento')} showIcon />
                        </div>

                        <div className="field col">
                            <label htmlFor="sexo">Sexo</label>
                            <Dropdown className='w-full' id="sexo" value={profissional.sexo} options={dropdownSexo} onChange={(e) => onInputChange(e, 'sexo')} placeholder="Selecione um sexo" />
                        </div>

                        <div className="field col">
                            <label htmlFor="profissao">Especialidade</label>
                            <Dropdown
                                className='w-full'
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
                            <FloatLabel className="w-full">
                                <label htmlFor="conselho">{profissional.conselho ? `Conselho (${profissional.conselho})` : "Conselho"}</label>
                                <InputText
                                    className='w-full'
                                    id="conselho"
                                    disabled={!profissional.conselho}
                                    value={conselho}
                                    onChange={(e) => setConselho(e.target.value)}
                                />
                            </FloatLabel>
                        </div>

                        <div className="field col">
                            <FloatLabel className="w-full">
                                <MultiSelect value={selectedConvenios} onChange={(e) => setSelectedConvenios(e.value)} options={dropdownConvenios} optionLabel="label"
                                    placeholder="Convenios" maxSelectedLabels={10} className="w-full md:w-20rem" />
                                <label htmlFor="convenio">Convênio</label>
                            </FloatLabel>
                        </div>

                        <div className=" col-12 flex align-items-center">
                            <Checkbox onChange={onCheckboxChange} checked={checked}></Checkbox>
                            <label className="ml-2" htmlFor="ativo">Ativo</label>
                        </div>
                    </div>

                    <div className="field mt-3">
                        <FloatLabel className="w-full">
                            <label htmlFor="observacoes">Observações</label>
                            <InputTextarea className="w-full" id="observacoes" value={profissional.observacoes} onChange={(e) => onInputChange(e, 'observacoes')} rows={4} cols={30} />
                        </FloatLabel>

                    </div>
                </Modal>

            </Modal>
        </>
    );
} 