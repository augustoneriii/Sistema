import React, { useState, useEffect, useRef, useContext } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ConsultaService } from './service/ConsultaService.js';
import { SidebarContext } from '../../../context/SideBarContext.js';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from "primereact/checkbox";
import { InputTextarea } from 'primereact/inputtextarea';
import { FilterMatchMode } from 'primereact/api';
import Modal from '../../../components/Modal/index.js';
import { FloatLabel } from 'primereact/floatlabel';

export default function Consulta() {
    const { setPacienteVisible } = useContext(SidebarContext);
    const { consultaVisible, setConsultaVisible } = useContext(SidebarContext);
    const modalIdRef = useRef(Math.random().toString(36).substr(2, 9));
    const modalIdRef2 = useRef(Math.random().toString(36).substr(2, 9));

    let emptyConsulta = {
        id: null,
        atendida: false,
        data: '',
        hora: '',
        observacoes: '',
        pacienteId: null,
        profissionalId: null,
        status: '',
        tipo: '',


    };


    const [consultas, setConsultas] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    const [profissionais, setProfissionais] = useState([]);
    const [consultaDialog, setConsultaDialog] = useState(false);
    const [deleteConsultaDialog, setDeleteConsultaDialog] = useState(false);
    const [consulta, setConsulta] = useState(emptyConsulta);
    const [selectedConsultas, setSelectedConsultas] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [expandedRows, setExpandedRows] = useState([]);
    const toast = useRef(null);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [checked, setChecked] = useState(true);
    const dt = useRef(null);
    const [activeConsulta, setActiveConsultas] = useState([]);

    useEffect(() => {
        async function fetchConsultas() {
            const currentToken = localStorage.getItem('token') || '';
            try {
                const response = await ConsultaService.getConsultas(currentToken);
                setConsultas(response.data); // Assuming response.data contains the array of convenios
                setDataLoaded(true); // Marca que os dados foram carregados
            } catch (error) {
                console.error("Erro ao buscar consultas:", error);
            }
        }

        if (consultaVisible && !dataLoaded) {
            fetchConsultas();
        }
        if (consulta.atendida === true) {
            setChecked(true);
        } else {
            setChecked(false);
        }
        if (consultas.length > 0) {
            const filteredConsultas = consultas.filter(consulta => consulta.atendida === true); // Filtra os convenios ativos
            setActiveConsultas(filteredConsultas); // Atualiza o estado com os consultas ativos
        }

    }, [consultaVisible, dataLoaded, consulta.atendida, consultas]);

    useEffect(() => {
        const currentToken = localStorage.getItem('token') || '';
        ConsultaService.getPacientes(currentToken)
            .then(response => {
                setPacientes(response.data); // Acesso à array de pacientes
            })
            .catch(error => {
                console.error("Erro ao buscar pacientes:", error);
            });
    }, []);

    useEffect(() => {
        const currentToken = localStorage.getItem('token') || '';
        ConsultaService.getProfissionais(currentToken)
            .then(response => {
                setProfissionais(response.data); // Acesso à array de profissionais
            })
            .catch(error => {
                console.error("Erro ao buscar profissionais:", error);
            });
    }, []);

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date instanceof Date && !isNaN(date) ? date.toLocaleDateString() : '';
    };


    const headerTemplate = (data) => {
        return (
            <>
                <span className="vertical-align-middle ml-2 font-bold line-height-3">{data?.profissionais?.nome || 'Profissional Não Definido'}</span>
            </>
        );
    };


    const openNew = () => {
        setConsulta(emptyConsulta);
        setSubmitted(false);
        setConsultaDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setConsultaDialog(false);
    };

    const hideDeleteConsultaDialog = () => {
        setDeleteConsultaDialog(false);
    };


    const saveConsulta = async () => {
        setSubmitted(true);

        if (!consulta.profissional || !consulta.paciente) {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Por favor, selecione um Profissional e(ou) Paciente.' });
            return; // Retorna para impedir o salvamento
        }

        if (consulta.tipo.trim()) {
            let _consultas = [...consultas];
            let _consulta = { ...consulta };

            let postConsulta = {
                id: _consulta.id,
                pacienteId: _consulta.paciente.id,
                profissionalId: _consulta.profissional.id,
                data: _consulta.data,
                hora: _consulta.hora,
                status: _consulta.status,
                tipo: _consulta.tipo,
                observacoes: _consulta.observacoes,
                atendida: _consulta.atendida
            };

            const currentToken = localStorage.getItem('token') || '';
            if (consulta.id) {
                const index = findIndexById(consulta.id);
                _consultas[index] = _consulta;
                toast.current.show({ severity: 'secondary', summary: 'Sucesso', detail: 'Consulta Atualizada', life: 3000 });
                await ConsultaService.updateConsulta(postConsulta, currentToken);
            } else {
                _consultas.push(postConsulta);
                toast.current.show({ severity: 'secondary', summary: 'Sucesso', detail: 'Consulta Criada', life: 3000 });
                await ConsultaService.createConsulta(postConsulta, currentToken);
            }

            setConsultas(_consultas);
            setConsultaDialog(false);
            setConsulta(emptyConsulta);
        }
    };



    //const saveConsulta = () => {
    //    setSubmitted(true);

    //   

    //        let postConsulta = {
    //            ConsultaId:  _consulta.id,
    //            PacienteId: _consulta.paciente.id,
    //            ProfissionalId: _consulta.profissional.id,
    //            Data: _consulta.data,
    //            Hora: _consulta.hora,
    //            Status: _consulta.status,
    //            Tipo: _consulta.tipo,
    //            Observacoes: _consulta.observacoes,
    //            Atendida: false
    //        };

    //        console.log("consulta", postConsulta);

    //        const currentToken = localStorage.getItem('token') || '';
    //        if (consulta.id) {
    //            console.log(consulta)
    //            const index = findIndexById(consulta.id);
    //            _consultas[index] = _consulta;
    //            toast.current.show({ severity: 'secondary', summary: 'Sucesso', detail: 'Consulta Atualizado', life: 3000 });
    //            ConsultaService.updateConsulta(postConsulta, currentToken);
    //        } else {
    //            console.log("create consulta", _consulta);
    //            _consultas.push(postConsulta);
    //            toast.current.show({ severity: 'secondary', summary: 'Sucesso', detail: 'Consulta Criado', life: 3000 });
    //            ConsultaService.createConsulta(postConsulta, currentToken);
    //        }

    //        setConsultas(_consultas);
    //        setConsultaDialog(false);
    //        setConsulta(emptyConsulta);
    //    }
    //};

    const editConsulta = (consultaData) => {
        setConsulta({
            ...consultaData,
            paciente: pacientes.find(p => p.id === consultaData.IdPaciente),
            profissional: profissionais.find(p => p.id === consultaData.IdProfissional),
        });
        setConsultaDialog(true);
    };


    const exportCSV = (selectionOnly) => {
        dt.current.exportCSV({ selectionOnly });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < consultas.length; i++) {
            if (consultas[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    };



    const onInputChange = (name, value) => {
        setConsulta(prevConsulta => ({
            ...prevConsulta,
            [name]: value,
        }));
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        const time = new Date(timeStr);
        return time instanceof Date && !isNaN(time) ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
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
                <Button icon="pi pi-pencil" className="border-round p-button-rounded p-button-secondary mr-2" onClick={() => editConsulta(rowData)} />

            </React.Fragment>
        );
    };

    const expandAll = () => {
        let _expandedRows = [];
        consultas.forEach((consulta) => {
            _expandedRows.push(consulta.id);
        });
        console.log(_expandedRows);
        setExpandedRows(_expandedRows);
    };

    const collapseAll = () => {
        setExpandedRows([]);
    };

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const onGlobalFilterChange = (event) => {
        const value = event.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
    };

    const renderHeader = () => {
        const value = filters['global'] ? filters['global'].value : '';

        return (
            <div className="table-header flex justify-between align-items-center">
                <h5 className="mx-0 my-1">Gerenciar Consultas</h5>
                <Button type="button" className='ml-5 border-round' icon="pi pi-file-excel" severity="success" onClick={() => exportCSV(false)} data-pr-tooltip="CSV" />
            </div>
        )
    }

    const header = (
        <h1>Gerenciar Consultas</h1>
    );
    // const header = renderHeader();

    const consultaDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="border-round p-button-text" onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" className="border-round p-button-text" onClick={saveConsulta} />
        </React.Fragment>
    );

    return (
        <>
            <Toast ref={toast} />
            <Modal modalKey={modalIdRef.current} header={header} modal={false} visible={consultaVisible} style={{ width: '50vw' }} onHide={() => setConsultaVisible(false)}>
                <div className="card">
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={consultas} selection={selectedConsultas} onSelectionChange={e => setSelectedConsultas(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} rowGroupMode="subheader" groupRowsBy="profissionais.nome" sortOrder={1}
                        sortField="profissionais.nome" paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        expandableRowGroups expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} sortMode="single" rowGroupHeaderTemplate={headerTemplate}
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} consultas" globalFilter={globalFilter} header={header}>
                        <Column style={{ width: '14.28%' }} field="profissionais.nome" header="Profissional" sortable></Column>
                        <Column style={{ width: '14.28%' }} field="pacientes.nome" header="Paciente" sortable></Column>
                        <Column style={{ width: '14.28%' }} field="data" header="Data" body={(rowData) => formatDate(rowData.data)} sortable></Column>
                        <Column style={{ width: '14.28%' }} field="hora" header="Hora" body={(rowData) => formatDate(rowData.hora)} sortable></Column>
                        <Column style={{ width: '14.28%' }} field="status" header="Status" sortable></Column>
                        <Column style={{ width: '14.28%' }} field="tipo" header="Tipo" sortable></Column>
                        <Column style={{ width: '14.28%' }} header="Ações" body={actionBodyTemplate}></Column>
                    </DataTable>
                </div>
                <Modal
                    modalKey={modalIdRef2.current}
                    header="Detalhes da Consulta"
                    modal={false}
                    visible={consultaDialog}
                    style={{ width: '850px', margin: 'auto' }}
                    onHide={hideDialog}
                    footer={consultaDialogFooter}
                >

                    <div className='grid'>
                        <div className="field col-6">
                            <label htmlFor="profissional">Profissional</label>
                            <Dropdown editable id='profissional' value={consulta.profissional} onChange={(e) => onInputChange('profissional', e.value)} options={profissionais} optionLabel="nome"
                                placeholder="Selecione o Profissional" className="w-full" />
                        </div>
                        <div className="field col-6">
                            <label htmlFor="email">Paciente</label>
                            <div className="p-inputgroup flex-1">
                                <Dropdown editable id='paciente' value={consulta.paciente} onChange={(e) => onInputChange('paciente', e.value)} options={pacientes} optionLabel="nome"
                                    placeholder="Selecione o Paciente" className="w-full" />
                                <Button icon="pi pi-plus" onClick={() => setPacienteVisible(true)} className="p-button-secondary border-round-right" />
                            </div>
                        </div>

                        <div className="field col-6">
                            <label htmlFor="status">Status</label>
                            <Dropdown editable value={consulta.status} onChange={(e) => onInputChange('status', e.value)} options={["Agendada", "Cancelada", "Realizada"]}
                                placeholder="Selecione o Status" className="w-full" />
                        </div>
                        <div className="field col-6">
                            <label htmlFor="tipo">Tipo</label>
                            <Dropdown editable value={consulta.tipo} onChange={(e) => onInputChange('tipo', e.value)} options={["Consulta", "Retorno"]}
                                placeholder="Selecione o Tipo" className="w-full" />
                        </div>
                    </div>
                    <div className='grid'>
                        <div className="field col">
                            <label htmlFor="data">Data</label>
                            <Calendar id="data" value={consulta.data} onChange={(e) => onInputChange('data', e.value)} showIcon />
                        </div>

                        <div className="field col">
                            <label htmlFor="hora">Hora</label>
                            <Calendar id="hora" value={consulta.hora} onChange={(e) => onInputChange('hora', e.value)} timeOnly />
                        </div>
                    </div>
                    <div className='grid'>
                        <div className="field col">
                            <FloatLabel>
                                <label htmlFor="observacoes">Observações</label>
                                <InputTextarea id="observacoes" value={consulta.observacoes} onChange={(e) => onInputChange('observacoes', e.target.value)} />
                            </FloatLabel>
                        </div>
                    </div>
                    <div className="flex align-items-center">
                        <Checkbox inputId="atendida" checked={consulta.atendida} onChange={(e) => onInputChange('atendida', e.checked)} />
                        <label className="ml-2" htmlFor="atendida">Atendida</label>
                    </div>
                </Modal>
            </Modal>
        </>
    );
}