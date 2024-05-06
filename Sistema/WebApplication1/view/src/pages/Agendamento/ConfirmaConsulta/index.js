//react component function
import React from 'react';
import { ConfirmaConsultaService } from './Service/ConfirmaConsultaService';
import Modal from '../../../components/Modal/';
import { useContext, useRef, useState, useEffect } from 'react';
import { SidebarContext } from '../../../context/SideBarContext';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';


function ConfirmaConsulta() {
    const { confirmaConsultaVisible, setConfirmaConsultaVisible } = useContext(SidebarContext);
    const modalIdRef = useRef(Math.random().toString(36).substr(2, 9));
    const [consultas, setConsultas] = React.useState([]);
    const [pacientes, setPacientes] = React.useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        const currentToken = localStorage.getItem('token') || '';
        getAllConsultas(currentToken);
    }, []);

    const header = (
        <h1>Confirmar Consulta</h1>
    );

    const onHideModal = () => {
        setConfirmaConsultaVisible(false);
        setDataLoaded(false);
    };

    async function getAllConsultas(token) {
        try {
            const response = await ConfirmaConsultaService.getAll(token);
            setConsultas(response.data);
            setDataLoaded(true);
        }
        catch (error) {
            console.log(error);
            Toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar as consultas' });
        }
    }


    return (
        <Modal modalKey={modalIdRef.current} header={header} visible={confirmaConsultaVisible} footer={false} style={{ width: '80vw', height: '80vh' }} onHide={onHideModal}>
            <div className='card'>
                <DataTable value={consultas} paginator rows={10} rowsPerPageOptions={[5, 10, 20]}>
                    <Column field="id" header="ID" />
                    <Column field='nome' header='Nome' />
                    <Column field='profissional' header='Profissional' />
                    <Column field='convenioMedico' header='Convênio Médico' />
                    <Column header='Chamado' body={(rowData) => { return rowData.chamado === 0 ? 'Não' : 'Sim' }} />
                </DataTable>
            </div>

        </Modal>
    );
}

export default ConfirmaConsulta;