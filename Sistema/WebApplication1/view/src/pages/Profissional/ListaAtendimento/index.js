import React, { useState, useEffect, useRef, useContext } from 'react';
import Modal from '../../../components/Modal';
import { Toast } from 'primereact/toast';
import { SidebarContext } from '../../../context/SideBarContext';
import { AtendimentoService } from './service/AtendimentoService.js';
import { Button } from 'primereact/button';
import { OrderList } from 'primereact/orderlist';
import { useSharedState } from '../../../context/SharedState';
import { InputText } from 'primereact/inputtext';
function ListaAtendimentos() {
    const modalIdRef = useRef(Math.random().toString(36).substr(2, 9));

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
    const { setModal, modalData } = useSharedState();
    const { atendimentoVisible, setAtendimentoVisible } = useContext(SidebarContext);
    const [dataLoaded, setDataLoaded] = useState(false);
    const toast = useRef(null);
    const [profissionais, setProfissionais] = useState([]);
    const [consultas, setConsultas] = useState([]);
    const [numeroSalas, setNumeroSalas] = useState({}); // Estado para armazenar número de sala de cada item

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

    const fetchConsulta = async () => {
        const currentToken = localStorage.getItem('token') || '';
        try {
            const currentDate = new Date();
            const response = await AtendimentoService.getConsultas(currentToken, `Profissionais.Cpf=${user.cpf}`);
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
                        const pacienteResponse = await AtendimentoService.getPacientes(currentToken, `Pacientes.Id=${consulta.pacientes.id}`);
                        const pacientes = pacienteResponse.data;
                        const pacientesFiltrados = pacientes.filter(paciente => paciente.id === consulta.pacientes.id);
                        const convenios = pacientesFiltrados.map(pacienteFiltrado => pacienteFiltrado.convenio.nome);
                        return { ...consulta, profissionalId: consulta.profissionais.id, pacienteId: consulta.pacientes.id, convenios };
                    } else {
                        return null;
                    }
                }));
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

    const chamaPaciente = (consultaSelecionada) => {
        setModal({ ...consultaSelecionada, numeroSala: numeroSalas[consultaSelecionada.id] });
    };

    const handleInputChange = (e, consultaId) => {
        const { value } = e.target;
        setNumeroSalas(prevState => ({
            ...prevState,
            [consultaId]: value
        }));
    };

    const itemTemplate = (item) => {
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
                                    <span key={index}><li>{convenio}</li></span>
                                ))}
                            </ul>
                        ) : (
                            <span>Nenhum convênio</span>
                        )}
                    </div>
                </div>
                <Button
                    style={{ width: '14.28%' }}
                    label="Chamar"
                    header="Chamar Paciente"
                    onClick={() => chamaPaciente(item)}
                />
                <span className="font-bold text-900">{formatHora(item.hora)}</span>
                <InputText
                    type="text"
                    value={numeroSalas[item.id] || ''}
                    onChange={(e) => handleInputChange(e, item.id)}
                    placeholder="Número da Sala"
                />
            </div>
        );
    };

    const header = (
        <h1>Lista de Atendimentos</h1>
    );

    return (
        <>
            <Toast ref={toast} />
            <Modal modalKey={modalIdRef.current} header='' modal={false} visible={atendimentoVisible} style={{ width: '80vw', height: '80vh' }} onHide={onHideModal}>
                <OrderList value={consultas} dragdrop={false} itemTemplate={itemTemplate} header={header}></OrderList>
            </Modal>
        </>
    );
}

export default ListaAtendimentos;
