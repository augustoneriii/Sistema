
import React, { useState, useEffect, useRef, useContext } from 'react';
import { SidebarContext } from '../../../context/SideBarContext';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { AgendaProfissionalService } from './service/AgendaProfissionalService.js';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import Modal from '../../../components/Modal/index.js'
function AgendaProfissional() {
    const { agendaProfissionalVisible, setAgendaProfissionalVisible } = useContext(SidebarContext);

    let emptyAgenda = {
        id: null,
        dia: '',
        hora: '',
        diaSemana: 'Segunda', 
        profissionalId: null,
    };


    const [agendas, setAgendas] = useState([]);
    const [agendaDialog, setAgendaDialog] = useState(false);
    
    const [profissionais, setProfissionais] = useState([]);
    //const [deletePacienteDialog, setDeletePacienteDialog] = useState(false);
    const [agenda, setAgenda] = useState(emptyAgenda);
    const [selectedAgendas, setSelectedAgendas] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [checked, setChecked] = useState(false); // Estado para controlar o valor do checkbox

    useEffect(() => {
        async function fetchAgendaProfissional() {
            const currentToken = localStorage.getItem('token') || '';
            try {
                const response = await AgendaProfissionalService.getAgendas(currentToken);
                setAgenda(response.data); // Assuming response.data contains the array of consultas
            } catch (error) {
                console.error("Erro ao buscar Consultas:", error);
            }
        }
        fetchAgendaProfissional();
    }, []);

    useEffect(() => {
        const currentToken = localStorage.getItem('token') || '';
        AgendaProfissionalService.getProfissionais(currentToken)
            .then(response => {
                setProfissionais(response.data); // Acesso à array de profissionais
            })
            .catch(error => {
                console.error("Erro ao buscar profissionais:", error);
            });
    }, []);

    const dropdownProfissionais = profissionais.map(profissional => {
        return {
            label: profissional.nome,
            value: profissional.id
        };
    });



    

    const openNew = () => {
        setAgenda(emptyAgenda);
        setSubmitted(false);
        setAgendaDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setAgendaDialog(false);
    };

    /*const hideDeletePacienteDialog = () => {
        setDeletePacienteDialog(false);
    };*/

    const saveAgenda = () => {
        setSubmitted(true);
        console.log(agenda);

        if (agenda.dia && agenda.hora && agenda.diaSemana && agenda.profissionalId != null) {
            const _agendas = [...agendas];
            const _agenda = { ...agenda };

            let postAgenda = {
                dia: agenda.Dia,
                hora: agenda.Hora,
                profissionalId: agenda.profissionalId,
                diaSemana: agenda.DiaSemana,
                ativo: checked ? 1 : 0
            };

            const currentToken = localStorage.getItem('token') || '';
            if (agenda.Id) {
                const index = findIndexById(agenda.Id);
                _agendas[index] = _agenda;
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Agenda Atualizada', life: 3000 });
                AgendaProfissionalService.updateAgenda(postAgenda, currentToken);
            } else {
                console.log("create consulta", _agenda);
                _agendas.push(postAgenda);
                toast.current.show({ severity: 'secondary', summary: 'Sucesso', detail: 'Consulta Criado', life: 3000 });
                AgendaProfissionalService.createAgenda(postAgenda, currentToken);
            }

            setAgendas(_agendas);
            setAgendaDialog(false);
            setAgenda(emptyAgenda);
        } else {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Todos os campos são obrigatórios.', life: 3000 });
        }
    };

    const editAgenda = (agenda) => {
        setAgenda({ ...agenda });
        setAgendaDialog(true);
    };

    const onProfissionalChange = (e) => {
        const selectedProfissionalId = e.value; // Obtém o ID do profissional selecionado
        const selectedProfissional = profissionais.find(profissional => profissional.id === selectedProfissionalId); // Encontra o objeto do profissional pelo ID

        setAgenda(prevAgenda => ({
            ...prevAgenda,
            profissional: selectedProfissional, // Define o objeto do profissional selecionado
            profissionalId: selectedProfissionalId // Define o ID do profissional selecionado
        }));
    };
    /*const confirmDeletePaciente = (paciente) => {
        setPaciente(paciente);
        setDeletePacienteDialog(true);
    };

    const deletePaciente = () => {
        const currentToken = localStorage.getItem('token') || '';

        if (paciente && paciente.Id) {
            PacienteService.deletePaciente(paciente.Id, currentToken)
                .then(() => {
                    toast.current.show({ severity: 'secondary', summary: 'Sucesso', detail: 'Paciente Deletado', life: 3000 });
                    setPacientes(pacientes.filter(val => val.Id !== paciente.Id)); // Corrigido para usar 'Id'
                    setDeletePacienteDialog(false);
                    setPaciente(emptyPaciente);
                })
                .catch(error => {
                    toast.current.show({ severity: 'warning', summary: 'Erro', detail: 'Pacientes que possuem consulta marcada não podem ser deletados', life: 3000 });
                });
        } else {
            toast.current.show({ severity: 'warning', summary: 'Erro', detail: 'O Id do Paciente não foi definido', life: 3000 });
        }
    };
    <Button icon="pi pi-trash" className="border-round p-button-rounded p-button-danger" onClick={() => confirmDeletePaciente(rowData)} />

    <Dialog visible={deletePacienteDialog} style={{ width: '450px' }} header="Confirmação" modal footer={deletePacienteDialogFooter} onHide={hideDeletePacienteDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-2" style={{ fontSize: '2rem' }} />
                    {paciente && <span>Tem certeza que deseja excluir o paciente <b>{paciente.nome}</b>?</span>}
                </div>
            </Dialog>
    */

    const findIndexById = (Id) => {
        let index = -1;
        for (let i = 0; i < agendas.length; i++) {
            if (agendas[i].Id === Id) {
                index = i;
                break;
            }
        }
        return index;
    };

    const createId = () => {
        return Math.random().toString(36).substr(2, 9);
    };

    const onInputChange = (e, campo) => {
        let valor = e.value;

        if (campo === 'dia' || campo === 'hora') {
            valor = e.target.value ? new Date(e.target.value) : null;
        }

        setAgenda(prevAgenda => ({
            ...prevAgenda,
            [campo]: valor
        }));
    };


    const onCheckboxChange = (e) => {
        setChecked(e.checked); // Atualiza o estado do checkbox
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) { // Check if the date is valid
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            return date.toLocaleDateString('pt-BR', options);
        } else {
            return ''; // Return an empty string if the date is invalid
        }
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
                <Button icon="pi pi-pencil" className="border-round p-button-rounded p-button-secondary mr-2" onClick={() => editAgenda(rowData)} />
            </React.Fragment>
        );
    };

    const header = (
        <div className="table-header">
            <h5 className="mx-0 my-1">Gerenciar Agendas</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const agendaDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="border-round p-button-text" onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" className="border-round p-button-text" onClick={saveAgenda} />
        </React.Fragment>
    );

    const dropDownDiasDaSemana = [
        { label: 'Segunda', value: 'Segunda' },
        { label: 'Terça', value: 'Terça' },
        { label: 'Quarta', value: 'Quarta' },
        { label: 'Quinta', value: 'Quinta' },
        { label: 'Sexta', value: 'Sexta' },
        { label: 'Sábado', value: 'Sábado' },
        { label: 'Domingo', value: 'Domingo' }
    ];
    /*const deletePacienteDialogFooter = (
        <React.Fragment>
            <Button label="Não" icon="pi pi-times" className="border-round p-button-text" onClick={hideDeletePacienteDialog} />
            <Button label="Sim" icon="pi pi-check" className="border-round p-button-text" onClick={deletePaciente} />
        </React.Fragment>
    );*/

    const headerTela = (
        <h1>
            Cadastro de Agenda
        </h1>
    );


   

    return (
        <Modal modal={false} header={headerTela} visible={agendaProfissionalVisible} style={{ width: '70vw' }} onHide={() => setAgendaProfissionalVisible(false)}>
            <Toast ref={toast} />

            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
                <DataTable ref={dt} value={agendas} selection={selectedAgendas} onSelectionChange={e => setSelectedAgendas(e.value)}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} scrollable scrollHeight="200px"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} agendas" globalFilter={globalFilter} header={header}>
                    <Column selectionMode="multiple" style={{ width: '3rem' }}></Column>
                    <Column field="profissionais.nome" header="Profissional" sortable></Column>
                    <Column field="id" header="Id" sortable></Column>
                    <Column field="dia" header="dia" sortable></Column>
                    <Column field="hora" header="hora" sortable></Column>
                    <Column field="diasemana" header="diasemana" sortable></Column>
                    <Column field="ativo" header="Ativo" sortable></Column>

                    <Column body={actionBodyTemplate}></Column>
                </DataTable>
            </div>

            <Dialog visible={agendaDialog} style={{ width: '850px', margin: 'auto' }} header="Detalhes da Agenda" modal className="p-fluid" footer={agendaDialogFooter} onHide={hideDialog}>


                <div className='grid'>
                    <div className="field col-6">
                        <label htmlFor="profissional">Profissional</label>
                        <Dropdown
                            id='profissional'
                            value={agenda.profissional ? agenda.profissional.nome : null}
                            onChange={(e) => onProfissionalChange(e)}
                            options={profissionais}
                            optionLabel="nome"
                            placeholder="Selecione o Profissional"
                            className="w-full"
                        />
                    </div>
                    </div>

                <div className="field ">
                    <label htmlFor="dia">Dia</label>
                    <Calendar id="nascimento" value={agenda.Dia} onChange={(e) => onInputChange(e, 'dia')} showIcon />
                    {submitted && !agenda.dia && <small className="p-error">Dia é obrigatório.</small>}
                </div>

                <div className="field col">
                    <label htmlFor="hora">Hora</label>
                    <Calendar id="hora" value={agenda.hora} onChange={(e) => onInputChange(e, 'hora')} timeOnly />
                </div>


                <div className="field">
                    <label htmlFor="diaSemana">Dia da Semana</label>
                    <Dropdown id="diasDaSemana" value={agenda.diasDaSemana} options={dropDownDiasDaSemana} onChange={(e) => onInputChange(e, 'diasDaSemana')} placeholder="Selecione os dias da semana" />
                </div>

               



                <div className="field col-6">
                    <label htmlFor="ativo">Ativo</label>
                    <Checkbox onChange={onCheckboxChange} checked={checked}></Checkbox>
                </div>

            </Dialog>
        </Modal>
    );
}

export default AgendaProfissional;
