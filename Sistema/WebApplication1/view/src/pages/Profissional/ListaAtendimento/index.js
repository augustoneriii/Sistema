import React, { useState, useEffect, useRef, useContext } from 'react';
import Modal from '../../../components/Modal'
import { Toast } from 'primereact/toast';
import { SidebarContext } from '../../../context/SideBarContext'
import { DataTable } from 'primereact/datatable';
//import { ConsultaService } from '../../Consulta/service/ConsultaService.js';
import { AtendimentoService } from './service/AtendimentoService.js'
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { OrderList } from 'primereact/orderlist';
function ListaAtendimentos() {
    let emptyConsulta = {
        id: null,
        atendida: false,
        data: '',
        hora: '',
        observacoes: '',
        pacienteId: null,
        profissionalId: null,
        status: '',
        tipo: ''

    };
    const user = JSON.parse(localStorage.getItem('user'));


    const [globalFilter, setGlobalFilter] = useState(null);
    const { atendimentoVisible, setAtendimentoVisible, profissionalId } = useContext(SidebarContext)
    const [dataLoaded, setDataLoaded] = useState(false);
    const toast = useRef(null);
    const [profissionais, setProfissionais] = useState([]);
    const [selectedConsultas, setSelectedConsultas] = useState(null);
    //const dt = useRef(null);
    const [consulta, setConsulta] = useState(emptyConsulta);
    const [consultas, setConsultas] = useState([]);
    const [convenios, setConvenios] = useState({});

    useEffect(() => {
        fetchConsulta();
    }, []);

    useEffect(() => {
        const currentToken = localStorage.getItem('token') || '';
        AtendimentoService.getProfissionais(currentToken, `Cpf=${user.cpf}`)
            .then(response => {
                setProfissionais(response.data);
            })
            .catch(error => {
                console.error("Erro ao buscar profissionais:", error);
            });
    }, []);

    useEffect(() => {

    }, [profissionais]);

    const fetchConsulta = async () => {
        const currentToken = localStorage.getItem('token') || '';
        try {
            const currentDate = new Date();

            const response = await AtendimentoService.getConsultas(currentToken, `Profissionais.Cpf=${user.cpf}`);

            //console.log("Consultas:", response.data); // Adiciona este console.log para verificar as consultas recebidas do servidor

            const consultasComIdProfissional = await Promise.all(response.data
                .filter(consulta => {
                    const consultaDate = new Date(consulta.data);
                    return consultaDate.getDate() === currentDate.getDate() &&
                        consultaDate.getMonth() === currentDate.getMonth() &&
                        consultaDate.getFullYear() === currentDate.getFullYear();
                })
                .sort((a, b) => {

                    const horaA = new Date(a.hora);
                    const horaB = new Date(b.hora);
                    return horaA.getTime() - horaB.getTime();
                })
                .map(async consulta => {
                    if (consulta.profissionais.cpf === user.cpf) {
                        // Busca os dados completos do paciente
                        const pacienteResponse = await AtendimentoService.getPacientes(currentToken, `Pacientes.Id=${consulta.pacientes.id}`);
                        const pacientes = pacienteResponse.data; // Obtenha todos os pacientes

                        // Filtra os pacientes que correspondem ao pacienteFiltrado
                        const pacientesFiltrados = pacientes.filter(paciente => paciente.id === consulta.pacientes.id);

                        // Mapeie cada paciente filtrado para extrair o nome do convênio
                        const convenios = pacientesFiltrados.map(pacienteFiltrado => pacienteFiltrado.convenio.nome);
                        //console.log("convenios: ", convenios);

                        return { ...consulta, profissionalId: consulta.profissionais.id, pacienteId: consulta.pacientes.id, convenios };
                    } else {
                        return null;
                    }
                }));

            // Filtra as consultas que n�o s�o nulas
            const consultasFiltradas = consultasComIdProfissional.filter(consulta => consulta !== null);
            setConsultas(consultasFiltradas);

            setDataLoaded(true);
        } catch (error) {
            console.error("Erro ao buscar consulta", error);
        }
    };


    const onHideModal = () => {
        setAtendimentoVisible(false);
        setDataLoaded(false);
    }


    const formatHora = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date instanceof Date && !isNaN(date) ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    };


    const headerTemplate = (data) => {
        if (data && data.profissionais && data.profissionais.nome) {
            return (
                <>
                    <span className="vertical-align-middle ml-2 font-bold line-height-3">{data.profissionais.nome}</span>
                </>
            );
        } else {
            return (
                <>
                    <span className="vertical-align-middle ml-2 font-bold line-height-3">Profissional N�o Definido</span>
                </>
            );
        }
    };
    const chamaPaciente = (dataRow) => {//teste de bot�o
        toast.current.show({ severity: 'success', summary: 'Sucesso', detail: `Bot�o de chamar paciente (em teste) `, life: 4000 });
    }
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-check" className="border-round  p-button-primary mr-2" onClick={() => chamaPaciente()} />{/*editConsulta(rowData)*/}
            </React.Fragment>
        );
    };

    const itemTemplate = (item) => {
        // Retorna o layout de cada item da lista
        return (
            <div className="flex flex-wrap p-2 align-items-center gap-3">
                <div className="flex-1 flex flex-column gap-2 xl:mr-8">
                    <span className="font-bold">Paciente: {item.pacientes.nome}</span>
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-user"></i>
                        Convênio do Paciente: 
                        {item.convenios.length > 0 ? (
                            <ul>
                                {item.convenios.map((convenio, index) => (
                                    <span><li key={index}>{convenio}</li></span>
                                ))}
                            </ul>
                        ) : (
                            <span>Nenhum convênio</span>
                        )}
                    </div>
                </div>
                <Button style={{ width: '14.28%' }} label="Chamar" header="Chamar Paciente" body={actionBodyTemplate}></Button>
                <span className="font-bold text-900">{formatHora(item.hora)}</span>
            </div>
        );
    };



    const header = (
        <h1>Lista de Atentimentos</h1>
    );


    return (
        <>
            <Toast ref={toast} />
            <Modal header='' modal={false} visible={atendimentoVisible} style={{ width: '80vw', height: '80vh' }} onHide={() => onHideModal()}>

                {/*<DataTable ref={dt} value={consultas} selection={selectedConsultas} onSelectionChange={e => setSelectedConsultas(e.value)}*/}
                {/*dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} rowGroupMode="subheader" groupRowsBy="profissionais.nome" sortOrder={1}*/}
                {/*sortField="profissionais.nome" paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"*/}
                {/*expandableRowGroups expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} sortMode="single" rowGroupHeaderTemplate={headerTemplate}*/}
                {/*currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} consultas" globalFilter={globalFilter}>*/}
                {/*<Column style={{ width: '14.28%' }} field="profissionais.nome" header="Profissional" sortable></Column>*/}
                {/*<Column style={{ width: '14.28%' }} field="pacientes.nome" header="Paciente" sortable></Column>*/}
                {/*<Column style={{ width: '14.28%' }} field="data" header="Data" body={(rowData) => formatDate(rowData.data)} sortable></Column>*/}
                {/*<Column style={{ width: '14.28%' }} field="hora" header="Hora" body={(rowData) => formatDate(rowData.hora)} sortable></Column>*/}
                {/*<Column style={{ width: '14.28%' }} field="status" header="Status" sortable></Column>*/}
                {/*<Column style={{ width: '14.28%' }} field="tipo" header="Tipo" sortable></Column>*/}
                {/*<Button style={{ width: '14.28%' }} label="Chamar" header="Chamar Paciente" body={actionBodyTemplate}></Button>*/}
                {/*</DataTable>*/}

                <OrderList value={consultas} dragdrop={false} itemTemplate={itemTemplate} header={header} onChange={(e) => setConsultas(e.value)}></OrderList>

            </Modal>
        </>
    )
}

export default ListaAtendimentos