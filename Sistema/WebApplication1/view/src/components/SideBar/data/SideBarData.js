const sidebarItems = [
    {
        text: 'Profissional',
        icon: 'pi pi-fw pi-user',
        items: [
            {
                text: 'Lista de Atendimentos',
                icon: 'pi pi-user',
                link: '',
                action: 'setAtendimentoVisible',
                roles: ['c8fffd', 'f3f629', 'f8abf4'],
                actionValue: true
            },
            {
                text: 'Relatorios',
                icon: 'pi pi-user',
                link: '',
                action: 'setRelatorioVisible',
                roles: ['c8fffd', 'f3f629', 'f8abf4'],
                actionValue: true
            },
            {
                text: 'Agenda Profissional',
                icon: 'pi pi-calendar',
                link: '',
                action: 'setAgendaProfissionalVisible',
                roles: ["f3f629", "f8abf4"],
                actionValue: true
            },
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
            },
            {
                text: 'Confirmar Consulta',
                icon: 'pi pi-calendar',
                link: '',
                action: 'setConfirmaConsultaVisible',
                roles: ['c8fffd', 'f3f629', 'f8abf4'],
                actionValue: true
            }
            // {
                // text: 'Agenda Calendário',
                // icon: 'pi pi-calendar',
                // link: '',
                // action: 'setAgendaCalendarioVisible',
                // roles: ['c8fffd', 'f3f629', 'f8abf4'],
                // actionValue: true
            // }
        ],
        roles: ['c8fffd', 'f3f629', 'f8abf4']
    },
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
                icon: 'pi pi-users',
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
        ],
        roles: ['f3f629', 'f8abf4']
    },
    {
        text: 'Configurações',
        icon: 'pi pi-fw pi-cog',
        items: [
            {
                text: 'Usuários',
                icon: 'pi pi-user',
                link: '',
                action: 'setUsuarioVisible',
                roles: ["f3f629", "f8abf4"],
                actionValue: true
            }
        ],
        roles: ['f3f629', 'f8abf4']

    },
    {
        text: 'Perfil',
        icon: 'pi pi-id-card',
        items: [
            {
                text: 'Alterar Perfil',
                icon: 'pi pi-user-edit',
                link: '',
                action: 'setPerfilVisible',
                roles: ["f3f629", "f8abf4", "c8fffd"],
                actionValue: true
            },
        ],
        roles: ['f3f629', 'f8abf4', "c8fffd"]
    }
];

export default sidebarItems;