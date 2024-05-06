import React, { useState, useEffect, useRef, useContext } from 'react';
import { Dialog } from 'primereact/dialog';
import { ChamarPacienteService } from '../ChamarPaciente/service/ChamarPacienteService';
import styles from './ChamarPaciente.module.css';
import { usePacienteChamado } from '../../context/PacienteChamadoContext ';


function ChamarPaciente() {
    const [horarioAtual, setHorarioAtual] = useState(new Date());
    const { pacienteChamado } = usePacienteChamado();
    //const { modalData } = usePacienteChamado();

    // Atualiza o hor�rio atual a cada segundo
    useEffect(() => {
        const interval = setInterval(() => {
            setHorarioAtual(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const header = (
        <h1>Gerenciar Consultas</h1>
    );

     //const { pacientes, profissionais, hora, convenios, numeroSala } = modalData;
    return (
        <div className={styles.chamarPacienteContainer}>
            <div className={styles.header}>
                <div className={styles.clinicaNome}>SysClin</div>
                <div className={styles.relogio}>{horarioAtual.toLocaleTimeString()}</div>
            </div>
            <div className={styles.mainContent}>
                <div className={styles.pacienteAtual}>
                    <div className={styles.titulo}>Paciente:</div>
                    <div className={styles.nomePaciente}>{pacienteChamado ? pacienteChamado.pacientes.nome : "Aguardando chamada..."}</div>
                    <div className={styles.titulo}>Medico(a):</div>
                    <div className={styles.nomeMedico}>{pacienteChamado ? pacienteChamado.profissionais.nome : "Aguardando chamada..."}</div>
                </div>
                <div className={styles.sala}>
                    <div className={styles.titulo}>Sala:</div>
                    <div className={styles.numeroSala}>{pacienteChamado ? pacienteChamado.numeroSala : "-"}</div>
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