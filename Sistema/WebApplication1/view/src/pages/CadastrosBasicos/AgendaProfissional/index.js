
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
        ativo: null
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
    const [dataLoaded, setDataLoaded] = useState(false);
    const [checked, setChecked] = useState(false); // Estado para controlar o valor do checkbox
    const [activeAgendas, setActiveAgendas] = useState([]);

    useEffect(() => {
        async function fetchAgendas() {
            const currentToken = localStorage.getItem('token') || '';
            try {
                const response = await AgendaProfissionalService.getAgendas(currentToken);
                setAgendas(response.data);
                setDataLoaded(true);
            } catch (error) {
                console.error("Erro ao buscar agendas:", error);
            }
        }

        if (agendaProfissionalVisible && !dataLoaded) {
            fetchAgendas();
        }
        if (agenda.ativo === 1) {
            setChecked(true); // Marca o checkbox se o campo "ativo" for igual a 1
        } else {
            setChecked(false);
        }
        if (agendas.length > 0) {
            const filteredAgendas = agendas.filter(agenda => agenda.ativo === 1); // Filtra os convenios ativos
            setActiveAgendas(filteredAgendas); // Atualiza o estado com os convenios ativos
        }

    }, [ agendaProfissionalVisible, dataLoaded ]);

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
        

        if (agenda.dia && agenda.hora && agenda.diaSemana && agenda.profissionalId != null) {
            const _agendas = [...agendas];
            const _agenda = { ...agenda };

            _agenda.ativo = checked ? 1 : 0;

            let postAgenda = {
                dia: agenda.dia, // Corrigido para letra minúscula
                hora: agenda.hora, // Corrigido para letra minúscula
                profissionalId: agenda.profissionalId,
                diaSemana: agenda.diaSemana, // Corrigido para letra minúscula
                
            };

            

            _agenda.ativo = checked ? 1 : 0; // Atualiza o campo "ativo" com base no estado do checkbox
            const currentToken = localStorage.getItem('token') || '';
            if (agenda.id) {
                const index = findIndexById(agenda.id);
                _agendas[index] = _agenda;
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Agenda Atualizada com sucesso', life: 3000 });
                AgendaProfissionalService.updateAgenda(_agenda, currentToken);
            } else {
                _agendas.push(_agenda);
                console.log("agenda", _agenda);
                AgendaProfissionalService.createAgenda(_agenda, currentToken);
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Agenda criado com sucesso Criado', life: 3000 });
            }

            //if (agenda.Id) {
            //    const index = findIndexById(agenda.Id);
            //    _agendas[index] = _agenda;
            //    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Agenda Atualizada', life: 3000 });
            //    AgendaProfissionalService.updateAgenda(postAgenda, currentToken);
            //} else {
            //    console.log("create consulta", _agenda);
            //    _agendas.push(postAgenda);
            //    toast.current.show({ severity: 'secondary', summary: 'Sucesso', detail: 'Consulta Criado', life: 3000 });
            //    AgendaProfissionalService.createAgenda(postAgenda, currentToken);
            //}

            setAgendas(_agendas);
            setAgendaDialog(false);
            setAgenda(emptyAgenda);
        } else {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Todos os campos são obrigatórios.', life: 3000 });
        }
    };

    const editAgenda = (agenda) => {
        setAgenda({ ...agenda }); // Define o estado da agenda com os valores da agenda selecionada
        setChecked(agenda.ativo === 1); // Define o estado do checkbox com base no campo 'ativo' da agenda selecionada
        setAgendaDialog(true); // Abre o diálogo de edição
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
            // Converta para string apenas se não for null
            valor = e.value ? formatDate(e.value) : null;
        }

        setAgenda(prevAgenda => ({
            ...prevAgenda,
            [campo]: valor
        }));
    };


    const onCheckboxChange = (e) => {
        setChecked(e.checked); // Atualiza o estado do checkbox
    };

    const formatDate = (date) => {
        if (!date) return ''; // Retorna uma string vazia se a data for nula

        // Formate a data para o formato desejado (por exemplo, 'yyyy-mm-dd')
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adiciona um zero à esquerda se necessário
        const day = date.getDate().toString().padStart(2, '0'); // Adiciona um zero à esquerda se necessário

        return `${year}-${month}-${day}`;
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
                    <Column style={{ width: '14.28%' }} field="profissionais.nome" header="Profissional" sortable></Column>
                    <Column field="id" header="Id" sortable></Column>
                    <Column field="dia" header="Dia" sortable></Column>
                    <Column field="hora" header="Hora" sortable></Column>
                    <Column field="diaSemana" header="Dia da Semana" sortable></Column>
                    <Column field="ativo" header="Ativo" sortable></Column>

                    <Column body={actionBodyTemplate}></Column>
                </DataTable>
            </div>

            <Dialog visible={agendaDialog} style={{ width: '850px', margin: 'auto' }} header="Detalhes da Agenda" modal className="p-fluid" footer={agendaDialogFooter} onHide={hideDialog}>


                <div className='grid'>
                    <div className="field col-6">
                        <label htmlFor="profissional"> Profissional</label>
                        <Dropdown
                            id='profissional'
                            value={agenda.profissionalId} // Use o ID do profissional como valor
                            onChange={(e) => onProfissionalChange(e)}
                            options={dropdownProfissionais} // Use o array formatado corretamente
                            optionLabel="label" // Indique que a propriedade 'label' do objeto deve ser usada como label no dropdown
                            placeholder="Selecione o Profissional"
                            className="w-full"
                        />

                    </div>
                    </div>

                <div className="field ">
                    <label htmlFor="dia">Dia</label>
                    <Calendar id="nascimento" value={agenda.dia} onChange={(e) => onInputChange(e, 'dia')} showIcon />
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
