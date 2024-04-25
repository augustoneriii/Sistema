import React, { useState, useEffect, useRef, useContext } from 'react';
import Modal from '../../../components/Modal'
import { Toast } from 'primereact/toast';
import { SidebarContext } from '../../../context/SideBarContext'
import { DataTable } from 'primereact/datatable';
//import { ConsultaService } from '../../Consulta/service/ConsultaService.js';
import { AtendimentoService } from './service/AtendimentoService.js'
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
    const user = JSON.parse(localStorage.getItem('user'));

 
  const [globalFilter, setGlobalFilter] = useState(null);
  const { atendimentoVisible, setAtendimentoVisible, profissionalId } = useContext(SidebarContext)
  const [dataLoaded, setDataLoaded] = useState(false);
  const toast = useRef(null);
  const [profissionais, setProfissionais] = useState([]);
  const [selectedConsultas, setSelectedConsultas] = useState(null);
  const dt = useRef(null);
  const [consulta, setConsulta] = useState(emptyConsulta);
  const [consultas, setConsultas] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);

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
        console.log(profissionais);
    }, [profissionais]);

        //async function fetchConsulta() {
        //    const currentToken = localStorage.getItem('token') || '';
        //    try {
        //        const response = await AtendimentoService.getConsultas(currentToken, `Consultas.profissionais.id=${6}`);
        //        setConsulta(response.data);
        //        setDataLoaded(true);
        //    } catch (error) {
        //        console.error("Erro ao buscar consulta", error);
        //    }
        //}

    async function fetchConsulta() {
        const currentToken = localStorage.getItem('token') || '';
        try {
            const response = await AtendimentoService.getConsultas(currentToken, `Profissionais.Cpf=${user.cpf}`);
            // Acessa o array de consultas
            const consultasComIdProfissional = response.data.map(consulta => {
                // Verifica se o CPF do profissional na consulta corresponde ao CPF do usuário logado
                if (consulta.profissionais.cpf === user.cpf) {
                    // Retorna a consulta com o id do profissional
                    return { ...consulta, profissionalId: consulta.profissionais.id };
                } else {
                    // Se o CPF não corresponder, retorna null (ou qualquer outro valor que você queira)
                    return null;
                }
            }).filter(consulta => consulta !== null); // Filtra para remover as consultas que não correspondem ao CPF do usuário logado
            setConsultas(consultasComIdProfissional);
            setDataLoaded(true);
        } catch (error) {
            console.error("Erro ao buscar consulta", error);
        }
    }


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
        if (data && data.profissionais && data.profissionais.nome) {
            return (
                <>
                    <span className="vertical-align-middle ml-2 font-bold line-height-3">{data.profissionais.nome}</span>
                </>
            );
        } else {
            return (
                <>
                    <span className="vertical-align-middle ml-2 font-bold line-height-3">Profissional Não Definido</span>
                </>
            );
        }
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