import React, { useState, useEffect, useRef, useContext } from 'react';
import Modal from '../../../components/Modal'
import { Toast } from 'primereact/toast';
import { SidebarContext } from '../../../context/SideBarContext'
import { DataTable } from 'primereact/datatable';
import { ConsultaService } from '../../Consulta/service/ConsultaService.js';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
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

  const [globalFilter, setGlobalFilter] = useState(null);
  const { atendimentoVisible, setAtendimentoVisible, profissionalId } = useContext(SidebarContext)
  const [dataLoaded, setDataLoaded] = useState(false);
  const toast = useRef(null);
  const [selectedConsultas, setSelectedConsultas] = useState(null);
  const dt = useRef(null);
  const [consulta, setConsulta] = useState(emptyConsulta);
  const [consultas, setConsultas] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);

    useEffect(() => {
        async function fetchConsulta() {
            const currentToken = localStorage.getItem('token') || '';
            try {
                const response = await ConsultaService.getConsultas(currentToken);
                const consultasFiltradas = response.data.filter(consulta => consulta.profissionalId === profissionalId);
                setConsultas(consultasFiltradas); // Definindo consultas após filtrar
            } catch (error) {
                console.error("Erro ao buscar Consultas:", error);
            }
        }
        fetchConsulta();
    }, [profissionalId]);

  const onHideModal = () => {
    setAtendimentoVisible(false);
    setDataLoaded(false);
    }

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
    const chamaPaciente = (dataRow) =>{//teste de botão
        toast.current.show({ severity: 'success', summary: 'Sucesso', detail: `Botão de chamar paciente (em teste) `, life: 4000 });
    }
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-check" className="border-round  p-button-primary mr-2" onClick={() => chamaPaciente()} />{/*editConsulta(rowData)*/ }

            </React.Fragment>
        );
    };

  const header = (
    <h1>Lista de Atentimentos</h1>
  );


  return (
    <>
      <Toast ref={toast} />
      <Modal header={header} modal={false} visible={atendimentoVisible} style={{ width: '80vw', height: '80vh' }} onHide={() => onHideModal()}>

              <DataTable ref={dt} value={consultas} selection={selectedConsultas} onSelectionChange={e => setSelectedConsultas(e.value)}
                  dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} rowGroupMode="subheader" groupRowsBy="profissionais.nome" sortOrder={1}
                  sortField="profissionais.nome" paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                  expandableRowGroups expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} sortMode="single" rowGroupHeaderTemplate={headerTemplate}
                  currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} consultas" globalFilter={globalFilter}>
                  <Column style={{ width: '14.28%' }} field="profissionais.nome" header="Profissional" sortable></Column>
                  <Column style={{ width: '14.28%' }} field="pacientes.nome" header="Paciente" sortable></Column>
                  <Column style={{ width: '14.28%' }} field="data" header="Data" body={(rowData) => formatDate(rowData.data)} sortable></Column>
                  <Column style={{ width: '14.28%' }} field="hora" header="Hora" body={(rowData) => formatDate(rowData.hora)} sortable></Column>
                  <Column style={{ width: '14.28%' }} field="status" header="Status" sortable></Column>
                  <Column style={{ width: '14.28%' }} field="tipo" header="Tipo" sortable></Column>
                  <Button style={{ width: '14.28%' }} label="Chamar" header="Chamar Paciente" body={actionBodyTemplate}></Button>
              </DataTable>
      </Modal>
    </>
  )
}

export default ListaAtendimentos