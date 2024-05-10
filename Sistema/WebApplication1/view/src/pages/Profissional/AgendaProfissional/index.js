import React, { useState, useEffect, useRef, useContext } from 'react';
import { SidebarContext } from '../../../context/SideBarContext';
import { AgendaProfissionalService } from './service/AgendaProfissionalService.js';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import Modal from '../../../components/Modal/index.js'
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';

function AgendaProfissional() {
    const { agendaProfissionalVisible, setAgendaProfissionalVisible } = useContext(SidebarContext);
    const modalIdRef = useRef(Math.random().toString(36).substr(2, 9));

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
    const toast = useRef(null);
    const [selectedDay, setSelectedDay] = useState('Segunda'); // Estado para o dia selecionado

    useEffect(() => {
        getAgendas();
        getProfissionais();
    }, []);

    async function getAgendas() {
        const currentToken = localStorage.getItem('token') || '';
        try {
            const response = await AgendaProfissionalService.getAgendas(currentToken, `Profissionais.Cpf=${user.cpf}`);
            setAgendas(response.data);
        } catch (error) {
            console.error("Erro ao buscar agendas:", error);
        }
    }

    async function getProfissionais() {
        const currentToken = localStorage.getItem('token') || '';
        try {
            const response = await AgendaProfissionalService.getProfissionais(currentToken, `Cpf=${user.cpf}`);
            setProfissionais(response.data);
        } catch (error) {
            console.error("Erro ao buscar profissionais:", error);
        }
    }

    const isScheduled = (time) => {
        const found = agendas.find(agenda =>
            agenda.diaSemana.toLowerCase() === selectedDay.toLowerCase() &&
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

            AgendaProfissionalService.createAgenda(_agenda, currentToken)
                .then(() => {
                    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Agenda salva com sucesso.', life: 3000 });
                    getAgendas();
                })
                .catch(error => {
                    console.error("Erro ao salvar agenda:", error);
                    toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao salvar agenda.', life: 3000 });
                });
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
            return;
        }
        let newAgenda = {
            ...agenda,
            diaSemana: dia, // Usando o dia selecionado pelo usuário
            hora: new Date().toISOString().split('T')[0] + 'T' + horario + ':00Z',
            profissionalId: profissionais[0].id,
            ativo: 1
        };

        saveAgenda(newAgenda);
        getAgendas();
    };


    const onDayChange = (day) => {
        setSelectedDay(day.value);
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
        '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
    ];

    const headerTela = (
        <h1>
            Cadastro de Agenda
        </h1>
    );

    return (
        <Modal modalKey={modalIdRef.current} modal={false} header={headerTela} visible={agendaProfissionalVisible} style={{ width: '80vw' }} onHide={() => setAgendaProfissionalVisible(false)}>
            <Toast ref={toast} />

            <div className="mb-3 mt-4">
                <FloatLabel>
                    <Dropdown id="day" value={selectedDay} options={dropDownDiasDaSemana} onChange={onDayChange} optionLabel="label" placeholder="Selecione o dia" style={{ width: '40%' }} />
                    <label htmlFor="day">Dia da Semana</label>
                </FloatLabel>
            </div>

            <Splitter className='p-3'>
                <SplitterPanel size={200} minSize={200} maxSize={300} className="flex align-items-center justify-content-center">
                    <div className='p-3 mr-3'>
                        <h4 className='text-center'>{selectedDay}</h4>
                        <hr />
                        <div className='grid'>
                            {horariosAtendimento.map((horario, index) => {
                                const { booked, id } = isScheduled(horario);
                                return (
                                    <div className='col-6' key={index}>
                                        {booked ? (
                                            <Card
                                                className={`bg-info text-center text-light cursor-pointer ${booked ? 'selected' : ''}`}
                                                onClick={() => deleteAgenda(id)}
                                            >
                                                {horario}
                                            </Card>
                                        ) : (
                                            <Card className="bg-light text-center  cursor-pointer"
                                                onClick={() => onButtonClick(selectedDay, horario)}>
                                                {horario}
                                            </Card>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SplitterPanel>
            </Splitter>
        </Modal>
    );
}

export default AgendaProfissional;
