
import React, { useState, useEffect, useRef, useContext } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ConsultaService } from './service/ConsultaService.js';
import { SidebarContext } from '../../context/SideBarContext';
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


export default function Consulta() {
    const { setPacienteVisible } = useContext(SidebarContext);

    let emptyConsulta = {
        id: null,
        data: '',
        hora: '',
        paciente: '',
        profissional: '',
        user: '',
        atendida: false,
        status: '',
        tipo: '',
        observacoes: ''
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
    const dt = useRef(null);

    useEffect(() => {
        const currentToken = localStorage.getItem('token') || '';
        ConsultaService.getConsultas(currentToken)
            .then(response => {
                setConsultas(response.data); // Acesso à array de consultas
            })
            .catch(error => {
                console.error("Erro ao buscar consultas:", error);
            });
    }, []);

    useEffect(() => {
        const currentToken = localStorage.getItem('token') || '';
        ConsultaService.getPacientes(currentToken)
            .then(response => {
                setPacientes(response.data.pacientes); // Acesso à array de pacientes
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
            <React.Fragment>
                <span className="vertical-align-middle ml-2 font-bold line-height-3">{data?.NomeProfissional || 'Profissional Não Definido'}</span>
            </React.Fragment>
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

    const saveConsulta = () => {
        setSubmitted(true);

        if (consulta.tipo.trim()) {
            let _consultas = [...consultas];
            let _consulta = { ...consulta };

            const currentToken = localStorage.getItem('token') || '';
            if (consulta.id) {
                const index = findIndexById(consulta.id);
                _consultas[index] = _consulta;
                toast.current.show({ severity: 'secondary', summary: 'Sucesso', detail: 'Consulta Atualizado', life: 3000 });
                ConsultaService.updateConsulta(_consulta, currentToken);
            } else {
                console.log("create consulta", _consulta);
                _consulta.id = createId();
                _consultas.push(_consulta);
                toast.current.show({ severity: 'secondary', summary: 'Sucesso', detail: 'Consulta Criado', life: 3000 });
                ConsultaService.createConsulta(_consulta, currentToken);
            }

            setConsultas(_consultas);
            setConsultaDialog(false);
            setConsulta(emptyConsulta);
        }
    };

    const editConsulta = (consultaData) => {
        setConsulta({
            ...consultaData,
            paciente: pacientes.find(p => p.id === consultaData.IdPaciente),
            profissional: profissionais.find(p => p.id === consultaData.IdProfissional),
        });
        setConsultaDialog(true);
    };


    const confirmDeleteConsulta = (consulta) => {
        setConsulta(consulta);
        setDeleteConsultaDialog(true);
    };

    const deleteConsulta = () => {
        const currentToken = localStorage.getItem('token') || '';

        if (consulta && consulta.id) {

            ConsultaService.deleteConsulta(consulta.id, currentToken)
                .then(() => {
                    toast.current.show({ severity: 'secondary', summary: 'Sucesso', detail: 'Consulta Deletado', life: 3000 });
                    setConsultas(consultas.filter(val => val.id !== consulta.id));
                    setDeleteConsultaDialog(false);
                    setConsulta(emptyConsulta);
                })
                .catch(error => {
                    console.error("Erro ao deletar consulta:", error);
                });
        } else {
            console.error("Erro: id do consulta é undefined");
        }
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

    const createId = () => {
        return Math.random().toString(36).substr(2, 9);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _consulta = { ...consulta };
        _consulta[`${name}`] = val;
        setConsulta(_consulta);
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
                <Button icon="pi pi-trash" className="border-round p-button-rounded p-button-danger" onClick={() => confirmDeleteConsulta(rowData)} />
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

    const header = renderHeader();

    const consultaDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="border-round p-button-text" onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" className="border-round p-button-text" onClick={saveConsulta} />
        </React.Fragment>
    );

    const deleteConsultaDialogFooter = (
        <React.Fragment>
            <Button label="Não" icon="pi pi-times" className="border-round p-button-text" onClick={hideDeleteConsultaDialog} />
            <Button label="Sim" icon="pi pi-check" className="border-round p-button-text" onClick={deleteConsulta} />
        </React.Fragment>
    );

    return (
        <div>
            <Toast ref={toast} />

            <Card>
                <span className="p-text-center p-mb-4" style={{ fontSize: '24px', color: '#333', borderBottom: 'solid 1px #6c757d' }}>
                    Cadastro de Consulta
                </span>
            </Card>

            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={consultas} selection={selectedConsultas} onSelectionChange={e => setSelectedConsultas(e.value)}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} rowGroupMode="subheader" groupRowsBy="NomeProfissional" sortOrder={1}
                    sortField="NomeProfissional" paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    expandableRowGroups expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} sortMode="single" rowGroupHeaderTemplate={headerTemplate}
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} consultas" globalFilter={globalFilter} header={header}>
                    <Column style={{ width: '14.28%' }} field="NomeProfissional" header="Profissional" sortable></Column>
                    <Column style={{ width: '14.28%' }} field="NomePaciente" header="Paciente" sortable></Column>
                    <Column style={{ width: '14.28%' }} field="DataConsulta" header="Data" body={(rowData) => formatDate(rowData.DataConsulta)} sortable></Column>
                    <Column style={{ width: '14.28%' }} field="HoraConsulta" header="Hora" sortable></Column>
                    <Column style={{ width: '14.28%' }} field="status" header="Status" sortable></Column>
                    <Column style={{ width: '14.28%' }} field="tipo" header="Tipo" sortable></Column>
                    <Column style={{ width: '14.28%' }} header="Ações" body={actionBodyTemplate}></Column>
                </DataTable>
            </div>

            <Dialog visible={consultaDialog} style={{ width: '850px', margin: 'auto' }} header="Detalhes do Consulta" modal className="p-fluid" footer={consultaDialogFooter} onHide={hideDialog}>

                <div className='grid'>
                    <div className="field col-6">
                        <label htmlFor="profissional">Profissional</label>
                        <Dropdown editable id='profissional' value={consulta.profissional} onChange={(e) => onInputChange(e, 'profissional')} options={profissionais} optionLabel="nome"
                            placeholder="Selecione o Profissional" className="w-full" />
                    </div>
                    <div className="field col-6">
                        <label htmlFor="email">Paciente</label>
                        <div className="p-inputgroup flex-1">
                            <Dropdown editable id='paciente' value={consulta.paciente} onChange={(e) => onInputChange(e, 'paciente')} options={pacientes} optionLabel="nome"
                                placeholder="Selecione o Paciente" className="w-full" />
                            <Button icon="pi pi-plus" onClick={() => setPacienteVisible(true)} className="p-button-secondary border-round-right" />
                        </div>
                    </div>

                    <div className="field col-6">
                        <label htmlFor="status">Status</label>
                        <Dropdown editable value={consulta.status} onChange={(e) => onInputChange(e, 'status')} options={["Agendada", "Cancelada", "Realizada"]}
                            placeholder="Selecione o Status" className="w-full" />
                    </div>
                    <div className="field col-6">
                        <label htmlFor="tipo">Tipo</label>
                        <Dropdown editable value={consulta.tipo} onChange={(e) => onInputChange(e, 'tipo')} options={["Consulta", "Retorno"]}
                            placeholder="Selecione o Tipo" className="w-full" />
                    </div>
                </div>
                <div className='grid'>
                    <div className="field col">
                        <label htmlFor="data">Data</label>
                        <Calendar id="data" value={consulta.data} onChange={(e) => onInputChange(e, 'data')} showIcon />
                    </div>

                    <div className="field col">
                        <label htmlFor="hora">Hora</label>
                        <Calendar id="hora" value={consulta.hora} onChange={(e) => onInputChange(e, 'hora')} timeOnly />
                    </div>
                </div>
                <div className='grid'>
                    <div className="field col">
                        <label htmlFor="observacoes">Observações</label>
                        <InputTextarea id="observacoes" value={consulta.observacoes} onChange={(e) => onInputChange(e, 'observacoes')} />
                    </div>
                </div>
                <div className="flex align-items-center">
                    <Checkbox inputId="atendida" value={consulta.atendida} onChange={(e) => onInputChange(e, 'atendida')} />
                    <label className="ml-2" htmlFor="atendida">Atendida</label>
                </div>
            </Dialog>

            <Dialog visible={deleteConsultaDialog} style={{ width: '450px' }} header="Confirmação" modal footer={deleteConsultaDialogFooter} onHide={hideDeleteConsultaDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-2" style={{ fontSize: '2rem' }} />
                    {consulta && <span>Tem certeza que deseja excluir a consulta de <b>{consulta.NomePaciente}</b> com o profissional <b>{consulta.NomeProfissional}</b>?</span>}
                </div>
            </Dialog>

        </div>
    );
}
