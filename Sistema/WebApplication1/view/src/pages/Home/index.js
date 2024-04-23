import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
//import '@fullcalendar/core/main.css';  // Corrigido para a nova forma de importar
//import '@fullcalendar/daygrid/main.css';
import ptLocale from '@fullcalendar/core/locales/pt';

function Home() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        }
    }, [navigate]); // Adicione dependências aqui para evitar efeitos em excesso

    const events = [
        { title: 'Reunião', date: '2024-04-10' },
        { title: 'Consulta médica', date: '2024-04-20' }
    ];

    return (
        <div className="text-center h-screen w-50 m-auto">
            <h1>Home</h1>
            <h2>Seja bem-vindo {user.userName}</h2>
            <h3>{user.idUserRole}</h3>
            <hr />
            {user.idUserRole !== "f8abf4" ?
                null
                :
                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    locale={ptLocale}
                />
            }
        </div>
    );
}

export default Home;
