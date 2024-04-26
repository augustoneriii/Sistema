import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import ptLocale from '@fullcalendar/core/locales/pt';
import { HomeService } from './service/HomeService'
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';

function Home() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const [consultas, setConsultas] = useState([]);
    const [consultaSelecionada, setConsultaSelecionada] = useState(null);
    const [consultaDialogVisible, setConsultaDialogVisible] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [profissionais, setProfissionais] = useState([]);

    useEffect(() => {
        fetchConsulta();
    }, []);

    async function fetchConsulta() {
        const currentToken = localStorage.getItem('token') || '';
        try {
            const response = await HomeService.getConsultas(currentToken, `Profissionais.Cpf=${ user.cpf }`);
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


    useEffect(() => {
        const currentToken = localStorage.getItem('token') || '';
        HomeService.getProfissionais(currentToken, `Cpf=${ user.cpf }`)
            .then(response => {
                setProfissionais(response.data);
            })
            .catch(error => {
                console.error("Erro ao buscar profissionais:", error);
            });
    }, []);

    const handleConsultaClick = (info) => {
        const consulta = consultas.find(consulta => new Date(consulta.data).toISOString() === info.event.start.toISOString());
        setConsultaSelecionada(consulta);
        setConsultaDialogVisible(true);
    };

    const formatConsultasForCalendar = () => {
        // Filtrando apenas as consultas desse profissional
        const consultasDoProfissional = consultas.filter(consulta => {
            // Verifica se consulta.profissionais é um array
            if (Array.isArray(consulta.profissionais)) {
                // Verifica se o CPF do profissional logado está presente nas consultas
                return consulta.profissionais.some(profissional => profissional.cpf === user.cpf);
            } else {
                // Se consulta.profissionais não for um array, verifica diretamente o CPF
                return consulta.profissionais.cpf === user.cpf;
            }
        });

        // Mapeando e formatando as consultas filtradas para o formato esperado pelo calendário
        return consultasDoProfissional.map(consulta => ({
            title: 'Consulta',
            start: new Date(consulta.data).toISOString(),
            backgroundColor: getEventColor(consulta.status)
        }));
    };


    const getEventColor = (status) => {
        switch (status) {
            case 'Agendada':
                return 'green';
            case 'Cancelada':
                return 'red';
            case 'Realizada':
                return 'blue';
            default:
                return 'gray';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
        return formattedDate;
    };

    const formatTime = (timeString) => {
        const time = new Date(timeString);
        const formattedTime = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
        return formattedTime;
    };

    return (
        <div className="text-center h-screen w-50 m-auto">
            <h1>Home</h1>
            <h2>Seja bem-vindo {user.userName}</h2>
            <h3>{user.idUserRole}</h3>
            <hr />

            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={formatConsultasForCalendar()}
                eventClick={handleConsultaClick}
                locale={ptLocale}
            />

            <Dialog header="Detalhes da Consulta" visible={consultaDialogVisible} onHide={() => setConsultaDialogVisible(false)}>
                {consultaSelecionada && (
                    <div>
                        <h3>Detalhes da Consulta:</h3>
                        <p>Profissional:</p>
                        <p> {consultaSelecionada.profissionais.nome}</p>
                        <hr />
                        <p>Paciente:</p>
                        <p>{consultaSelecionada.pacientes.nome}</p>
                        <hr />
                        <p>Data:</p>
                        <p> {formatDate(consultaSelecionada.data)}</p>
                        <hr />
                        <p>Hora:</p>
                        <p> {formatTime(consultaSelecionada.hora)}</p>
                        <hr />
                        <p>Observações:</p>
                        <p>{consultaSelecionada.observacoes}</p>
                    </div>
                )}
            </Dialog>
        </div>
    );
}

export default Home;
