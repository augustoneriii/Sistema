import React, { useState, useEffect, useRef, useContext } from 'react';
import { Dialog } from 'primereact/dialog';
import { ChamarPacienteService } from '../ChamarPaciente/service/ChamarPacienteService';
import styles from './ChamarPaciente.module.css'; // Certifique-se de criar este arquivo CSS
import { useSharedState } from '../../context/SharedState'

function ChamarPaciente() {
    const [horarioAtual, setHorarioAtual] = useState(new Date());
    const { modalData } = useSharedState();

    // Atualiza o horário atual a cada segundo
    useEffect(() => {
        const interval = setInterval(() => {
            setHorarioAtual(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const header = (
        <h1>Gerenciar Consultas </h1>
    );

    // Verifica se há uma consulta selecionada
    if (!modalData) {
        return null; // Retorna null ou algum outro conteúdo de fallback caso não haja consulta selecionada
    }

    const { pacientes, profissionais, hora, convenios } = modalData;

    return (
        <div className={styles.chamarPacienteContainer}>
            <div className={styles.header}>
                <div className={styles.clinicaNome}>SysClin</div>
                <div className={styles.relogio}>{horarioAtual.toLocaleTimeString()}</div>
            </div>
            <div className={styles.mainContent}>
                <div className={styles.pacienteAtual}>
                    <div className={styles.titulo}>Paciente:</div>
                    <div className={styles.nomePaciente}>{pacientes.nome}</div>
                    <div className={styles.titulo}>Medico(a):</div>
                    <div className={styles.nomeMedico}>{profissionais.nome}</div>
                </div>
                <div className={styles.sala}>
                    <div className={styles.titulo}>Sala:</div>
                    <div className={styles.numeroSala}>5</div>
                </div>
            </div>
            <div className={styles.chamadosAnteriormente}>
                <div className={styles.tituloTabela}>Chamados Anteriormente</div>
                {/* Aqui você pode adicionar a lógica para exibir os pacientes chamados anteriormente */}
            </div>
        </div>
    );
}

export default ChamarPaciente;
