
import React, { useState, useEffect, useRef, useContext } from 'react';
import { SidebarContext } from '../../context/SideBarContext.js';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { PacienteService } from './service/PacienteService.js';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';


export default function Paciente() {
    const { pacienteVisible, setPacienteVisible } = useContext(SidebarContext);

    let emptyPaciente = {
        Id: null,
        nome: '',
        cpf: '',
        rg: '',
        telefone: '',
        endereco: '',
        email: '',
        nascimento: '',
        sexo: '',
        IdConvenio: null,
        NomeConvenio: '',
        tipoSanguineo: '',
        alergias: '',
        medicamentos: '',
        cirurgias: '',
        historico: ''
    };

    const [pacientes, setPacientes] = useState([]);
    const [pacienteDialog, setPacienteDialog] = useState(false);
    const [convenios, setConvenios] = useState([]);
    const [deletePacienteDialog, setDeletePacienteDialog] = useState(false);
    const [paciente, setPaciente] = useState(emptyPaciente);
    const [selectedPacientes, setSelectedPacientes] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const currentToken = localStorage.getItem('token') || '';
        PacienteService.getPacientes(currentToken)
            .then(response => {
                setPacientes(response.data);
            })
            .catch(error => {
                console.error("Erro ao buscar pacientes:", error);
            });
    }, []);

    useEffect(() => {
        const currentToken = localStorage.getItem('token') || '';
        PacienteService.getConvenios(currentToken)
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

    const sexoOptions = [
        { label: 'Masculino', value: 'Masculino' },
        { label: 'Feminino', value: 'Feminino' },
    ]

    const tipoSanguineoOptions = [
        { label: 'A+', value: 'A+' },
        { label: 'A-', value: 'A-' },
        { label: 'B+', value: 'B+' },
        { label: 'B-', value: 'B-' },
        { label: 'AB+', value: 'AB+' },
        { label: 'AB-', value: 'AB-' },
        { label: 'O+', value: 'O+' },
        { label: 'O-', value: 'O-' },
    ]

    const openNew = () => {
        setPaciente(emptyPaciente);
        setSubmitted(false);
        setPacienteDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPacienteDialog(false);
    };

    const hideDeletePacienteDialog = () => {
        setDeletePacienteDialog(false);
    };

    const savePaciente = () => {
        setSubmitted(true);

        if (paciente.nome && paciente.nome.trim()) {
            let _pacientes = [...pacientes];
            let _paciente = { ...paciente };

            let postPaciente = {
                IdPaciente: _paciente.IdPaciente,
                Nome: _paciente.nome,
                Cpf: _paciente.cpf,
                Rg: _paciente.rg,
                Telefone: _paciente.telefone,
                Endereco: _paciente.endereco,
                Email: _paciente.email,
                Nascimento: _paciente.nascimento, // Certifique-se de que a data de nascimento está sendo incluída
                Sexo: _paciente.sexo,
                IdConvenio: _paciente.IdConvenio,
                TipoSanguineo: _paciente.tipoSanguineo,
                Alergias: _paciente.alergias,
                Medicamentos: _paciente.medicamentos,
                Cirurgias: _paciente.cirurgias,
                Historico: _paciente.historico
            };

            console.log("object", postPaciente)

            const currentToken = localStorage.getItem('token') || '';
            if (paciente.IdPaciente) {
                const index = findIndexById(paciente.IdPaciente);
                _pacientes[index] = _paciente;
                toast.current.show({ severity: 'secondary', summary: 'Sucesso', detail: 'Paciente Atualizado', life: 3000 });
                PacienteService.updatePaciente(_paciente, currentToken);
            } else {
                _paciente.IdPaciente = createId();
                _pacientes.push(_paciente);
                toast.current.show({ severity: 'secondary', summary: 'Sucesso', detail: 'Paciente Criado', life: 3000 });
                PacienteService.createPaciente(postPaciente, currentToken);
            }

            setPacientes(_pacientes);
            setPacienteDialog(false);
            setPaciente(emptyPaciente);
        }
    };

    const editPaciente = (paciente) => {
        setPaciente({ ...paciente });
        setPacienteDialog(true);
    };

    const confirmDeletePaciente = (paciente) => {
        setPaciente(paciente);
        setDeletePacienteDialog(true);
    };

    const deletePaciente = () => {
        const currentToken = localStorage.getItem('token') || '';

        if (paciente && paciente.IdPaciente) {

            PacienteService.deletePaciente(paciente.IdPaciente, currentToken)
                .then(() => {
                    toast.current.show({ severity: 'secondary', summary: 'Sucesso', detail: 'Paciente Deletado', life: 3000 });
                    setPacientes(pacientes.filter(val => val.id !== paciente.IdPaciente));
                    setDeletePacienteDialog(false);
                    setPaciente(emptyPaciente);
                })
                .catch(error => {
                    console.error("Erro ao deletar paciente:", error);
                });
        } else {
            console.error("Erro: id do paciente é undefined");
        }
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < pacientes.length; i++) {
            if (pacientes[i].id === id) {
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
        let val = (e.target && e.target.value) || '';
        let _paciente = { ...paciente };

        // Se o campo for 'nascimento', faça uma verificação mais robusta no formato da data
        if (name === 'nascimento') {
            // Certifique-se de que val seja uma string
            val = val.toString().trim();

            // Verifique se a string segue o formato dd/mm/aaaa
            const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
            if (val.match(datePattern)) {
                // Se o valor estiver no formato correto, crie um objeto Date
                const [day, month, year] = val.split('/');
                _paciente[name] = new Date(year, month - 1, day); // Mês começa do zero
            } else {
                // Se o formato não estiver correto, defina como null
                _paciente[name] = null;
            }
        } else {
            _paciente[name] = val;
        }

        setPaciente(_paciente);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return date.toLocaleDateString('pt-BR', options);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Novo" icon="pi pi-plus" className="border-round p-button-secondary mr-2" onClick={openNew} />
            </React.Fragment>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="border-round p-button-rounded p-button-secondary mr-2" onClick={() => editPaciente(rowData)} />
                <Button icon="pi pi-trash" className="border-round p-button-rounded p-button-danger" onClick={() => confirmDeletePaciente(rowData)} />
            </React.Fragment>
        );
    };

    const header = (
        <div className="table-header">
            <h5 className="mx-0 my-1">Gerenciar Pacientes</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const pacienteDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="border-round p-button-text" onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" className="border-round p-button-text" onClick={savePaciente} />
        </React.Fragment>
    );

    const deletePacienteDialogFooter = (
        <React.Fragment>
            <Button label="Não" icon="pi pi-times" className="border-round p-button-text" onClick={hideDeletePacienteDialog} />
            <Button label="Sim" icon="pi pi-check" className="border-round p-button-text" onClick={deletePaciente} />
        </React.Fragment>
    );

    const headerTela = (
        <h1>
            Cadastro de Paciente
        </h1>
    );

    return (
        <Dialog modal={false} header={headerTela} visible={pacienteVisible} style={{ width: '70vw' }} onHide={() => setPacienteVisible(false)}>
            <Toast ref={toast} />

            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
                <DataTable ref={dt} value={pacientes} selection={selectedPacientes} onSelectionChange={e => setSelectedPacientes(e.value)}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} scrollable scrollHeight="200px"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} pacientes" globalFilter={globalFilter} header={header}>
                    <Column selectionMode="multiple" style={{ width: '3rem' }}></Column>
                    <Column field="id" header="Id" sortable></Column>
                    <Column field="nome" header="Nome" sortable></Column>
                    <Column field="cpf" header="CPF" sortable></Column>
                    <Column field="telefone" header="Telefone" sortable></Column>
                    <Column field="endereco" header="Endereço" sortable></Column>
                    <Column field="nascimento" header="Nascimento" sortable></Column>
                    <Column field="sexo" header="Sexo" sortable></Column>
                    <Column field="email" header="E-mail" sortable></Column>
                    <Column field="tipoSanguineo" header="Tipo Sanguíneo" sortable></Column>
                    <Column field="alergias" header="Alergias" sortable></Column>
                    <Column field="medicamentos" header="Medicamentos" sortable></Column>
                    <Column field="cirurgias" header="Cirurgias" sortable></Column>
                    <Column field="historico" header="Histórico" sortable></Column>
                    <Column body={actionBodyTemplate}></Column>
                </DataTable>
            </div>

            <Dialog visible={pacienteDialog} style={{ width: '850px', margin: 'auto' }} header="Detalhes do Paciente" modal className="p-fluid" footer={pacienteDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="email">E-Mail</label>
                    <InputText id="email" value={paciente.email} onChange={(e) => onInputChange(e, 'email')} />
                </div>
                <div className="field ">
                    <label htmlFor="nome">Nome</label>
                    <InputText id="nome" value={paciente.nome} onChange={(e) => onInputChange(e, 'nome')} />
                    {submitted && !paciente.nome && <small className="p-error">Nome é obrigatório.</small>}
                </div>

                <div className='grid'>
                    <div className="field col">
                        <label htmlFor="cpf">CPF</label>
                        <InputText id="cpf" value={paciente.cpf} onChange={(e) => onInputChange(e, 'cpf')} required className={classNames({ 'p-invalid': submitted && !paciente.cpf })} />
                        {submitted && !paciente.cpf && <small className="p-error">CPF é obrigatório.</small>}
                    </div>

                    <div className="field col">
                        <label htmlFor="telefone">Telefone</label>
                        <InputText id="telefone" value={paciente.telefone} onChange={(e) => onInputChange(e, 'telefone')} />
                    </div>

                    <div className="field col">
                        <label htmlFor="rg">RG</label>
                        <InputText id="rg" value={paciente.rg} onChange={(e) => onInputChange(e, 'rg')} />
                    </div>

                </div>

                <div className="field">
                    <label htmlFor="endereco">Endereço</label>
                    <InputText id="endereco" value={paciente.endereco} onChange={(e) => onInputChange(e, 'endereco')} />
                </div>

                <div className='grid'>

                    <div className="field col">
                        <label htmlFor="nascimento">Nascimento</label>
                        <Calendar
                            id="nascimento"
                            value={formatDate(paciente.nascimento)}
                            onChange={(e) => onInputChange(e, 'nascimento')}
                            showIcon
                            dateFormat="dd/mm/yy"
                        />
                    </div>

                    <div className="field col">
                        <label htmlFor="sexo">Sexo</label>
                        <Dropdown id="sexo" value={paciente.sexo} options={sexoOptions} onChange={(e) => onInputChange(e, 'sexo')} placeholder="Selecione" />
                    </div>
                </div>

                <div className='grid'>
                    <div className="field col">
                        <label htmlFor="tipoSanguineo">Tipo Sanguíneo</label>
                        <Dropdown id="tipoSanguineo" value={paciente.tipoSanguineo} options={tipoSanguineoOptions} onChange={(e) => onInputChange(e, 'tipoSanguineo')} placeholder="Selecione" />
                    </div>

                    <div className="field col">
                        <label htmlFor="convenio">Convenio</label>
                        <Dropdown id="convenio" value={paciente.IdConvenio} options={dropdownConvenios} onChange={(e) => onInputChange(e, 'IdConvenio')} placeholder="Selecione um convenio" />
                    </div>
                </div>

                <div className="field">
                    <label htmlFor="alergias">Alergias</label>
                    <InputTextarea id="alergias" value={paciente.alergias} onChange={(e) => onInputChange(e, 'alergias')} rows={2} cols={30} />
                </div>

                <div className="field">
                    <label htmlFor="medicamentos">Medicamentos</label>
                    <InputTextarea id="medicamentos" value={paciente.medicamentos} onChange={(e) => onInputChange(e, 'medicamentos')} rows={2} cols={30} />
                </div>

                <div className="field">
                    <label htmlFor="cirurgias">Cigurgias</label>
                    <InputTextarea id="cirurgias" value={paciente.cirurgias} onChange={(e) => onInputChange(e, 'cirurgias')} rows={2} cols={30} />
                </div>

                <div className="field">
                    <label htmlFor="historico">Histórico</label>
                    <InputTextarea id="historico" value={paciente.historico} onChange={(e) => onInputChange(e, 'historico')} rows={2} cols={30} />
                </div>

            </Dialog>

            <Dialog visible={deletePacienteDialog} style={{ width: '450px' }} header="Confirmação" modal footer={deletePacienteDialogFooter} onHide={hideDeletePacienteDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-2" style={{ fontSize: '2rem' }} />
                    {paciente && <span>Tem certeza que deseja excluir o paciente <b>{paciente.nome}</b>?</span>}
                </div>
            </Dialog>
        </Dialog>
    );
}
