import React, { useState, useEffect, useRef, useContext } from 'react';
import { Dialog } from 'primereact/dialog';
import { ChamarPacienteService } from '../ChamarPaciente/service/ChamarPacienteService';
import styles from './ChamarPaciente.module.css'; // Certifique-se de criar este arquivo CSS

function ChamarPaciente() {
    const [consultas, setConsultas] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [profissionais, setProfissionais] = useState([]);
    const [horarioAtual, setHorarioAtual] = useState(new Date());

    useEffect(() => {
        async function fetchConsultas() {
            const currentToken = localStorage.getItem('token') || '';
            try {
                const response = await ChamarPacienteService.getConsultas(currentToken);
                setConsultas(response.data); // Assuming response.data contains the array of convenios
                setDataLoaded(true); // Marca que os dados foram carregados
            } catch (error) {
                console.error("Erro ao buscar consultas:", error);
            }
        }

    }, [dataLoaded, consultas]);

    useEffect(() => {
        const currentToken = localStorage.getItem('token') || '';
        ChamarPacienteService.getProfissionais(currentToken)
            .then(response => {
                setProfissionais(response.data); // Acesso à array de profissionais
            })
            .catch(error => {
                console.error("Erro ao buscar profissionais:", error);
            });
    }, []);

    // Atualiza o horário atual a cada segundo
    useEffect(() => {
        const interval = setInterval(() => {
            setHorarioAtual(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const header = (
        <h1>Gerenciar Consultas</h1>
    );

    return (
            <div className={styles.chamarPacienteContainer}>
                <div className={styles.header}>
                    <div className={styles.clinicaNome}>SysClin</div>
                    <div className={styles.relogio}>{horarioAtual.toLocaleTimeString()}</div>
                </div>
                <div className={styles.mainContent}>
                    <div className={styles.pacienteAtual}>
                        <div className={styles.titulo}>Paciente:</div>
                        <div className={styles.nomePaciente}>Nome a ser chamado</div>
                        <div className={styles.titulo}>Medico(a):</div>
                        <div className={styles.nomeMedico}>Nome do profissional</div>
                    </div>
                    <div className={styles.sala}>
                        <div className={styles.titulo}>Sala:</div>
                        <div className={styles.numeroSala}>5</div>
                    </div>
                </div>
                <div className={styles.chamadosAnteriormente}>
                    <div className={styles.tituloTabela}>Chamados Anteriormente</div>
                    possivel tabela de pacientes chamados anteriormente

                </div>
            </div>
    );
}

export default ChamarPaciente;