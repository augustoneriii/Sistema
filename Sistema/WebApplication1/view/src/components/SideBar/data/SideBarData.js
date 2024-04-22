const sidebarItems = [
    {
        text: 'Home',
        icon: 'pi pi-home',
        link: '/home',
        roles: ['c8fffd', "f3f629", "f8abf4"],
    },
    {
        text: 'Dashboard',
        icon: 'pi pi-chart-bar',
        link: '#',
        roles: ['c8fffd', "f3f629"],
    },
    {
        text: 'Consultas',
        icon: 'pi pi-calendar',
        link: '',
        action: 'setConsultaVisible',
        roles: ["f3f629", "f8abf4"],
        actionValue: true
    },
    {
        text: 'Pacientes',
        icon: 'pi pi-users',
        link: '',
        action: 'setPacienteVisible',
        roles: ["f3f629", "f8abf4"],
        actionValue: true
    },
    {
        text: 'Profissionais',
        icon: 'pi pi-user-edit',
        link: '',
        action: 'setProfissionalVisible',
        roles: ["f3f629", "f8abf4"],
        actionValue: true
    },
    {
        text: 'Convênios Médicos',
        icon: 'pi pi-table',
        link: '',
        action: 'setConvenioVisible',
        roles: ["f3f629", "f8abf4"],
        actionValue: true
    },
    {
        text: 'Profissões',
        icon: 'pi pi-briefcase',
        link: '',
        action: 'setProfissaoVisible',
        roles: ["f3f629", "f8abf4"],
        actionValue: true
    },
];

export default sidebarItems;
