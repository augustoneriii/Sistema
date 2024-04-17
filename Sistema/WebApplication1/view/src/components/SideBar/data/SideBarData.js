// sidebarData.js
const sidebarItems = [
    {
      text: 'Home',
      icon: 'pi pi-home',
      link: '/home',
    },
    {
      text: 'Dashboard',
      icon: 'pi pi-chart-bar',
      link: '#',
    },
    {
      text: 'Consultas',
      icon: 'pi pi-calendar',
      link: '',
      action: 'setConsultaVisible',
      actionValue: true
    },
    {
      text: 'Pacientes',
      icon: 'pi pi-users',
      link: '',
      action: 'setPacienteVisible', 
      actionValue: true
    },
    {
      text: 'Profissionais',
      icon: 'pi pi-user-edit',
      link: '',
      action: 'setProfissionalVisible',
      actionValue: true
    },
    {
      text: 'Convênios Médicos',
      icon: 'pi pi-table',
      link: '',
      action: 'setConvenioVisible',
      actionValue: true
    },
    {
      text: 'Profissões',
      icon: 'pi pi-briefcase',
      link: '',
      action: 'setProfissaoVisible',
      actionValue: true
    },
  ];
  
  export default sidebarItems;
  