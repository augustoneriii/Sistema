
import React, { useState, useEffect, useRef, useContext } from 'react';
import { SidebarContext } from '../../../context/SideBarContext';
import { AgendaProfissionalService } from './service/AgendaProfissionalService.js';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import Modal from '../../../components/Modal/index.js'
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { Card } from 'primereact/card';


function AgendaProfissional() {
    const { agendaProfissionalVisible, setAgendaProfissionalVisible } = useContext(SidebarContext);

    let emptyAgenda = {
        id: null,
        hora: '',
        diaSemana: 'Segunda',
        profissionalId: null,
        ativo: null
    };

    const user = JSON.parse(localStorage.getItem('user'));

    const [agendas, setAgendas] = useState([]);

    const [profissionais, setProfissionais] = useState([]);
    const [agenda, setAgenda] = useState(emptyAgenda);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [checked, setChecked] = useState(false);
    const [activeAgendas, setActiveAgendas] = useState([]);


    //useEffect para quando a página carregar, buscar as agendas
    useEffect(() => {
        getAgendas();
    }, []);

    async function getAgendas() {
        const currentToken = localStorage.getItem('token') || '';
        try {
            const response = await AgendaProfissionalService.getAgendas(currentToken, `Profissionais.Cpf=${user.cpf}`);
            setAgendas(response.data);
            setDataLoaded(true);
        } catch (error) {
            console.error("Erro ao buscar agendas:", error);
        }
    }

    useEffect(() => {
        const currentToken = localStorage.getItem('token') || '';
        AgendaProfissionalService.getProfissionais(currentToken, `Cpf=${user.cpf}`)
            .then(response => {
                setProfissionais(response.data);
            })
            .catch(error => {
                console.error("Erro ao buscar profissionais:", error);
            });
    }, []);

    const isScheduled = (day, time) => {
        const found = agendas.find(agenda =>
            agenda.diaSemana.toLowerCase() === day.toLowerCase() &&
            new Date(agenda.hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) === time
        );
        return found ? { booked: true, id: found.id } : { booked: false, id: null };
    };



    const saveAgenda = (newAgenda) => {

        if (!newAgenda.profissionalId) {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Profissional não encontrado ou não cadastrado.', life: 3000 });
        }

        if (newAgenda.hora && newAgenda.diaSemana && newAgenda.profissionalId != null) {
            const _agenda = { ...newAgenda };

            const currentToken = localStorage.getItem('token') || '';

            AgendaProfissionalService.createAgenda(_agenda, currentToken);

        } else {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Todos os campos são obrigatórios.', life: 3000 });
        }
    };

    const deleteAgenda = (agendaId) => {
        const currentToken = localStorage.getItem('token') || '';
        AgendaProfissionalService.deleteAgenda(agendaId, currentToken)
            .then(() => {
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Agenda deletada com sucesso.', life: 3000 });
                setAgendas(agendas.filter(val => val.id !== agendaId));
                getAgendas();
            })
            .catch(error => {
                console.error("Erro ao deletar agenda:", error);
                toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao deletar agenda.', life: 3000 });
            });
    };

    const onButtonClick = (dia, horario) => {

        if (profissionais.length === 0) {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Profissional não encontrado ou não cadastrado.', life: 3000 });
            return
        }
        let newAgenda = {
            ...agenda,
            diaSemana: new Date().toLocaleDateString('pt-BR', { weekday: 'long' }), // Obtém o dia da semana atual
            hora: new Date().toISOString().split('T')[0] + 'T' + horario + ':00Z',
            profissionalId: profissionais[0].id,
            ativo: 1
        };

        saveAgenda(newAgenda);
        getAgendas();
    };

    const dropDownDiasDaSemana = [
        { label: 'Segunda', value: 'Segunda' },
        { label: 'Terça', value: 'Terça' },
        { label: 'Quarta', value: 'Quarta' },
        { label: 'Quinta', value: 'Quinta' },
        { label: 'Sexta', value: 'Sexta' },
        { label: 'Sábado', value: 'Sábado' },
    ];

    const horariosAtendimento = [
        { label: '08:00', value: '08:00' },
        { label: '09:00', value: '09:00' },
        { label: '10:00', value: '10:00' },
        { label: '11:00', value: '11:00' },
        { label: '12:00', value: '12:00' },
        { label: '13:00', value: '13:00' },
        { label: '14:00', value: '14:00' },
        { label: '15:00', value: '15:00' },
        { label: '16:00', value: '16:00' },
        { label: '17:00', value: '17:00' },
        { label: '18:00', value: '18:00' },
        { label: '19:00', value: '19:00' }
    ];

    const headerTela = (
        <h1>
            Cadastro de Agenda
        </h1>
    );

    return (
        <Modal modal={false} header={headerTela} visible={agendaProfissionalVisible} style={{ width: '80vw' }} onHide={() => setAgendaProfissionalVisible(false)}>
            <Toast ref={toast} />

            <Splitter className='p-3	'>
                {dropDownDiasDaSemana.map((dia, index) => {
                    return (
                        <SplitterPanel key={index} size={200} minSize={200} maxSize={300} className="flex align-items-center justify-content-center">
                            <div className='p-3 mr-3'>
                                <h4 className='text-center'>{dia.label}</h4>
                                <hr />
                                <div className='grid'>
                                    {horariosAtendimento.map((horario, index) => {
                                        const { booked, id } = isScheduled(dia.label, horario.label);
                                        return (
                                            <div className='col-6' key={index}>
                                                {booked ? (
                                                    <Card
                                                        className="bg-info text-center text-light cursor-pointer"
                                                        onClick={() => deleteAgenda(id)}
                                                    >
                                                        {horario.label}
                                                    </Card>
                                                ) : (
                                                    <Card className="bg-light text-center  cursor-pointer"
                                                        onClick={() => onButtonClick(dia.label, horario.value)}>
                                                        {horario.label}
                                                    </Card>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </SplitterPanel>
                    );
                })}
            </Splitter>
        </Modal>
    );
}

export default AgendaProfissional;
