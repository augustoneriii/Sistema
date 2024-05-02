import React, { useState, useEffect, useRef, useContext } from 'react';
import { SidebarContext } from '../../../context/SideBarContext';
import Modal from '../../../components/Modal/index.js'
import { RelatorioService } from './service/RelatorioService'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast'; 

    
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { FilterMatchMode } from 'primereact/api';
import { FloatLabel } from 'primereact/floatlabel';
import { Chart } from 'primereact/chart'; 

function Relatorio() {
    const { relatorioVisible, setRelatorioVisible } = useContext(SidebarContext);
    const modalIdRef = useRef(Math.random().toString(36).substr(2, 9));
    const [consultas, setConsultas] = useState([]);
    const [tipoGrafico, setTipoGrafico] = useState('bar');
    const toast = useRef(null); 

    useEffect(() => {
        async function fetchConsultas() {
            const currentToken = localStorage.getItem('token') || '';
            try {
                const response = await RelatorioService.getRelatorio(currentToken);
                setConsultas(response.data); 
            } catch (error) {
                console.error("Erro ao buscar relatorios:", error);
            }
        }

        if (relatorioVisible && consultas.length === 0) {
            fetchConsultas();
        }
    }, [relatorioVisible, consultas]);


    const toggleTipoGrafico = () => {
        setTipoGrafico(tipoGrafico === 'bar' ? 'pie' : 'bar');
    };


    const barChartData = {
        labels: ['Consulta 1', 'Consulta 2', 'Consulta 3'],
        datasets: [
            {
                label: 'Quantidade',
                backgroundColor: '#42A5F5',
                data: [10, 20, 30],
            },
        ],
    };


    const pieChartData = {
        labels: ['Consulta 1', 'Consulta 2', 'Consulta 3'],
        datasets: [
            {
                data: [10, 20, 30],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            },
        ],
    };


    const chartOptions = {
        legend: {
            position: 'bottom',
        },
    };

    return (
        <>
            <Toast ref={toast} />
            <Modal modalKey={modalIdRef.current} header={<h1>Relatorios</h1>} modal={false} visible={relatorioVisible} style={{ width: '50vw' }} onHide={() => setRelatorioVisible(false)}>
                <div className="card">
                    <Toolbar className="mb-4" left={<Button label="Alternar Gráfico" onClick={toggleTipoGrafico} />} />
                    {tipoGrafico === 'bar' && (
                        //Gráficos de Barra
                        <Chart type="bar" data={barChartData} options={chartOptions} />
                    )}
                    {tipoGrafico === 'pie' && (
                        //Gráficos de Pizzas
                        <Chart type="pie" data={pieChartData} options={chartOptions} className="w-full md:w-30rem" />
                    )}
                </div>
            </Modal>
        </>
    );
}

export default Relatorio;
