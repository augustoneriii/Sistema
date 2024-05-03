import React, { useState, useEffect, useRef, useContext } from 'react';
import Modal from '../../../components/Modal';
import { SidebarContext } from '../../../context/SideBarContext';
import { ProntuarioService } from './service/ProntuarioService'
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { FloatLabel } from 'primereact/floatlabel'//por enquanto 
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Menu } from 'primereact/menu';
function Prontuario() {

    let emptyProntuario = {
        id: null,
        PacienteId: null,
        ProfissionalId: null,
        PrescricaoMedicamentos: '',
        EvolucaoPaciente: ''
    };
    const { prontuarioVisible, setProntuarioVisible } = useContext(SidebarContext);
    const modalIdRef = useRef(Math.random().toString(36).substr(2, 9));
    const [prontuarios, setProntuarios] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    const [profissionais, setProfissionais] = useState([]);

    const dt = useRef(null);
    const toast = useRef(null);
    const [selectedProntuario, setSelectedProntuario] = useState(null);
    const [displayDialog, setDisplayDialog] = useState(false);
    const dialog = useRef(null);
    const [submitted, setSubmitted] = useState(false);
    const [prontuario, setProntuario] = useState(emptyProntuario);
    const [prontuarioDialog, setProntuarioDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [menuModel, setMenuModel] = useState([]);
    const menuRef = useRef(null);



    const fetchProntuario = async () => {
          const currentToken = localStorage.getItem('token') || '';
          try {
              const prontuarios = await ProntuarioService.getProntuarios(currentToken);
               
              setProntuarios(prontuarios.data)
             
              console.log(prontuarios.data)
          } catch (error) {
              console.error("Erro ao buscar ID do paciente", error);
          }
    }; 

    const saveProntuario = () => {
    setSubmitted(true);

    if (prontuario && prontuario.PacienteId != null && String(prontuario.PacienteId).trim() !== '') {
        let _prontuarios = [...prontuarios];
        let _prontuario = { ...prontuario };

        const currentToken = localStorage.getItem('token') || '';
        try {
            if (_prontuario.id) { // Modo de edição
                const index = findIndexById(_prontuario.id);
                _prontuarios[index] = _prontuario;
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Prontuário Atualizado', life: 3000 });
                ProntuarioService.updateProntuario(_prontuario, currentToken);
            } else { // Modo de criação
                _prontuarios.push(_prontuario);
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Prontuário Criado', life: 3000 });
                ProntuarioService.createProntuario(_prontuario, currentToken);
            }
            setProntuarios(_prontuarios);
            setProntuarioDialog(false);
            setProntuario(emptyProntuario);
        } catch (error) {
            console.error("Erro ao salvar prontuario:", error);
            if (error.response && error.response.status === 400) {
                toast.current.show({ severity: 'error', summary: 'Erro', detail: `Usuário não tem permissão para essa operação: ${error}`, life: 3000 });
            }
        }
    }
};

    const editProntuario = (prontuario) => {
        setProntuario({ ...prontuario });

        // Atualiza o estado dos dropdowns com os IDs corretos
        const selectedPaciente = pacientes.find(p => p.id === prontuario.PacienteId);
        const selectedProfissional = profissionais.find(p => p.id === prontuario.ProfissionalId);

        if (selectedPaciente) {
            onPacienteChange({ value: selectedPaciente.id });
        }
        if (selectedProfissional) {
            onProfissionalChange({ value: selectedProfissional.id });
        }

        setProntuarioDialog(true);
    };


    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < prontuarios.length; i++) {
            if (prontuarios[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    };

    useEffect(() => {
        const currentToken = localStorage.getItem('token') || '';
        ProntuarioService.getPacientes(currentToken)
            .then(response => {
                setPacientes(response.data);
            })
            .catch(error => {
                console.error("Erro ao buscar pacientes:", error);
            });

        ProntuarioService.getProfissionais(currentToken)
            .then(response => {
                setProfissionais(response.data);
            })
            .catch(error => {
                console.error("Erro ao buscar profissionais:", error);
            });
    }, []);

    useEffect(() => {
        if (editMode && pacientes.length > 0 && profissionais.length > 0) {
            const selectedPaciente = pacientes.find(p => p.id === prontuario.PacienteId);
            const selectedProfissional = profissionais.find(p => p.id === prontuario.ProfissionalId);

            if (selectedPaciente) {
                onPacienteChange({ value: selectedPaciente.id });
            }
            if (selectedProfissional) {
                onProfissionalChange({ value: selectedProfissional.id });
            }
        }
    }, [editMode, pacientes, profissionais]);

    const dropdownPacientes = pacientes.map(paciente => {
        return {
            label: paciente.nome,
            value: paciente.id
        };
    });

    const dropdownProfissionais = profissionais.map(profissional => {
        return {
            label: profissional.nome,
            value: profissional.id
        };
    });

    const onPacienteChange = (e) => {
        const selectedPacienteId = e.value;
        const selectedPaciente = pacientes.find(paciente => paciente.id === selectedPacienteId);
        let _prontuario = { ...prontuario, PacienteId: selectedPacienteId };


        // Configura o id do paciente
        if (selectedPaciente && selectedPaciente.id) {
            _prontuario.PacienteId = selectedPaciente.id;
        } else {
            _prontuario.PacienteId = null;
        }

        
        // Atualiza o id do paciente
        _prontuario.PacienteId = selectedPaciente ? selectedPaciente.id : null;

        setProntuario(_prontuario);
    };

    const onProfissionalChange = (e) => {
        const selectedProfissionalId = e.value;
        const selectedProfissional = profissionais.find(profissional => profissional.id === selectedProfissionalId);
        let _prontuario = { ...prontuario, ProfissionalId: selectedProfissionalId };


        // Configura o id do profissional
        if (selectedProfissional && selectedProfissional.id) {
            _prontuario.ProfissionalId = selectedProfissional.id;
        } else {
            _prontuario.ProfissionaId = null;
        }

        // Atualiza o id do profissional
        _prontuario.ProfissionalId = selectedProfissional ? selectedProfissional.id : '';

        setProntuario(_prontuario);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _prontuario = { ...prontuario };
        _prontuario[`${name}`] = val;
        setProntuario(_prontuario);
    };


    useEffect(() => {
        fetchProntuario();
    }, []);

    const showDialog = (prontuario) => {
        setSelectedProntuario(prontuario);
        setEditMode(true); // Definir o estado editMode como verdadeiro
        setDisplayDialog(true);
    };

    const actionButtonGroupTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-bars" className="border-round p-button-rounded p-button-text" onClick={(e) => toggleMenu(rowData, e)} />
                <Menu model={menuModel} ref={menuRef} popup={true} id="popup_menu" />
            </>
        );
    };
    const toggleMenu = (rowData, e) => {
        setMenuModel([])

        let arrayMenu = [
            { label: 'Editar', icon: 'pi pi-pencil', command: () => editProntuario(rowData) },
            { label: 'Ver Detalhes', icon: 'pi pi-book', command: () => showDialog(rowData) }
        ];

        arrayMenu.forEach((item) => {
            setMenuModel(prevState => [...prevState, item]);
        });

        if (menuRef.current) {
            menuRef.current.toggle(e);
        } else {
            console.error('Menu ref não está definido');
        }
    };

    const header = (
        <h1>Prontuarios</h1>
    );

    
    const onHideDialog = () => {
        setEditMode(false);
        setDisplayDialog(false);
    };

    

    return (
        <>
            <Toast ref={toast} />
            <Modal modalKey={modalIdRef.current} header={header} modal={false} visible={prontuarioVisible} style={{ width: '70vw' }} onHide={() => setProntuarioVisible(false)}>
                <div className='card'>
                    <div className='grid'>
                        <div className="field col-12 mt-5">
                            <FloatLabel>
                                <label htmlFor="PrescricaoMedicamentos">Prescrição de Medicamentos</label>
                                <InputText className='w-full' id="PrescricaoMedicamentos" value={prontuario.prescricaoMedicamentos} onChange={(e) => onInputChange(e, 'prescricaoMedicamentos')} />
                            </FloatLabel>
                        </div>
                        <div className="field col-12">
                            <FloatLabel>
                                <label htmlFor="EvolucaoPaciente">Evolução do paciente</label>
                                <InputText className='w-full' id="EvolucaoPaciente" value={prontuario.EvolucaoPaciente} onChange={(e) => onInputChange(e, 'EvolucaoPaciente')} />
                            </FloatLabel>
                        </div>
                        <div className="field col">
                            <label htmlFor="paciente" className='mr-2'>Paciente</label>
                            <Dropdown
                                id="paciente"
                                value={prontuario.PacienteId}
                                options={dropdownPacientes}
                                onChange={onPacienteChange}
                                placeholder="Selecione um Paciente"
                            />
                        </div>
                        <div className="field col">
                            <label htmlFor="profissional" className='mr-2'>Profissional</label>
                            <Dropdown
                                id="profissional"
                                value={prontuario.ProfissionalId}
                                options={dropdownProfissionais}
                                onChange={onProfissionalChange}
                                placeholder="Selecione um Profissional"
                            />
                        </div>
                        <div className="field col-12">
                            <Button label="Salvar" icon="pi pi-check" className="border-round p-button-text" onClick={saveProntuario} />
                        </div>
                    </div>
                </div>
                <DataTable value={prontuarios}>
                    <Column field="id" header="ID" style={{ width: '100px' }} />
                    <Column field="profissionais.nome" header="Nome do Profissional" style={{ width: '100px' }} />
                    <Column field="pacientes.nome" header="Nome do Paciente" style={{ width: '400px' }} />
                    <Column body={actionButtonGroupTemplate}></Column>   
                </DataTable>
            </Modal>

            <Dialog header="Detalhes do Prontuário" visible={displayDialog} style={{ width: '50vw' }} onHide={onHideDialog}>
                {selectedProntuario && (
                    <>
                        <h2>ID: {selectedProntuario.id}</h2>
                        <p>Nome do paciente: {selectedProntuario.pacientes.nome}</p>
                        <p>Cpf do paciente: {selectedProntuario.pacientes.cpf}</p>
                        <br></br>
                        <p>Endereço do paciente: {selectedProntuario.pacientes.endereco}</p>
                        <p>Telefone do paciente: {selectedProntuario.pacientes.telefone}</p>
                        <p>Sexo do paciente: {selectedProntuario.pacientes.sexo}</p>
                        <p>Tipo Sanguíneo do paciente: {selectedProntuario.pacientes.tipoSanguineo}</p>
                        <p>Alergias: {selectedProntuario.pacientes.alergias}</p>
                        <p>Medicamentos: {selectedProntuario.pacientes.medicamentos}</p>
                        <p>Convênio: {selectedProntuario.pacientes.convenio.nome}</p>
                        <br></br>
                        <p>Nome do Profissional: {selectedProntuario.profissionais.nome}</p>
                        <p>E-mail do Profissional: {selectedProntuario.profissionais.email}</p>
                        <p>Convênio Médico: {selectedProntuario.profissionais.convenioMedicos[0].nome}</p>
                        <br></br>
                        <p>Prescrição de Medicamentos: {selectedProntuario.prescricaoMedicamentos}</p>
                        <p>Evolução do Paciente: {selectedProntuario.EvolucaoPaciente}</p>
  

                    </>
                )}
            </Dialog>
        </>
    );
}

export default Prontuario