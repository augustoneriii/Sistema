const sidebarItems = [
    {
        text: 'Cadastros Básicos',
        icon: 'pi pi-fw pi-plus',
        items: [
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
            }
        ],
        roles: ['c8fffd', 'f3f629', 'f8abf4']
    },
    {
        text: 'Agendamento',
        icon: 'pi pi-fw pi-calendar',
        items: [
            {
                text: 'Consultas',
                icon: 'pi pi-calendar',
                link: '',
                action: 'setConsultaVisible',
                roles: ["f3f629", "f8abf4"],
                actionValue: true
            }
        ],
        roles: ['c8fffd', 'f3f629', 'f8abf4']
    }
];

export default sidebarItems;