import React, { useRef, useState, useEffect } from 'react';
import { Toast } from 'primereact/toast';
import Modal from '../../../components/Modal';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { ConfirmaConsultaService } from './Service/ConfirmaConsultaService.js';
import { ButtonGroup } from 'primereact/buttongroup';
import { Calendar } from 'primereact/calendar';



function ConfirmaConsulta({ data, openModal, closeModal }) {
    data = data || {};
    const [confirmaConsulta, setConfirmaConsulta] = useState({
        idConsulta: '',
        nome: '',
        cpf: '',
        convenioMedico: '',
        profissional: '',
        consultorio: '',
        chamado: 0
    });
    const [dtConsulta, setDtConsulta] = useState(false);
    const [hrConsulta, setHrConsulta] = useState(false);


    useEffect(() => {
        if (data && openModal === true) {
            setConfirmaConsulta({
                idConsulta: data?.id,
                nome: data?.pacientes?.nome,
                cpf: data?.pacientes?.cpf,
                convenioMedico: data?.pacientes?.convenioMedico,
                profissional: data?.profissionais?.nome,
                "consultorio": '',
                "chamado": 0
            });
        }
    }, [data]);

    const toast = useRef(null);

    const onInputChange = (name, value) => {
        setConfirmaConsulta(prevConsulta => ({
            ...prevConsulta,
            [name]: value,
        }));
    };

    function insertConfirmaConsulta() {

        ConfirmaConsultaService.insert(confirmaConsulta, localStorage.getItem('token'))
            .then(() => {
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Consulta confirmada com sucesso' });
                closeModal();
            })
            .catch((error) => {
                toast.current.show({ severity: 'error', summary: 'Erro', detail: error.message });
            });
    }

    function remarcar() {
        setDtConsulta(true);
        setHrConsulta(true);
    }

    async function updateConsulta() {
        data.pacienteId = data?.pacientes?.id;
        data.profissionalId = data?.profissionais?.id;
        if (dtConsulta === true) {
            data.data = confirmaConsulta.data;
            data.hora = confirmaConsulta.hora;
        }
        if (dtConsulta === false) {
            data.status = 'Cancelada';
        }
        await ConfirmaConsultaService.updateConsulta(data, localStorage.getItem('token'))
            .then(() => {
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Consulta cancelada com sucesso' });
                closeModal();
            })
            .catch((error) => {
                toast.current.show({ severity: 'error', summary: 'Erro', detail: error.message });
            });
    }

    function cpfMask(value) {
        if (!value) return '';

        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    }

    const removeCaracteres = (cpf) => {
        return cpf.replace(/[.-]/g, '');
    }
    function dataMask(dataStr) {
        if (!dataStr) return '';
        const data = new Date(dataStr);
        return data.toLocaleDateString('pt-BR');
    }

    function horaMask(horaStr) {
        if (!horaStr) return '';
        const hora = new Date(horaStr);
        return hora.toLocaleTimeString('pt-BR', { timeStyle: 'short' });
    }


    return (
        <>
            <Toast ref={toast} />
            <Dialog
                header={<h3>Confirmar {data?.tipo}</h3>}
                visible={openModal}
                onHide={closeModal}
                modal={false}
                style={{ width: '50vw' }}
            >
                <div className='card'>
                    <div className='grid mb-3'>
                        <div className='col-12 mb-3'>
                            <FloatLabel>
                                <InputText className='w-full' id='pacienteNome' value={data?.pacientes?.nome} disabled />
                                <label htmlFor='pacientesNome'>Nome Paciente</label>
                            </FloatLabel>
                        </div>
                        <div className='col-3'>
                            <FloatLabel>
                                <InputText className='w-full' id='pacientes.cpf' value={cpfMask(data?.pacientes?.cpf)} maxLength={14} disabled />
                                <label htmlFor='pacientes.cpf'>CPF</label>
                            </FloatLabel>
                        </div>
                        <div className='col-3'>
                            <FloatLabel>
                                <InputText className='w-full' id='pacientes.telefone' value={data?.pacientes?.telefone} disabled />
                                <label htmlFor='pacientes.telefone'>Telefone</label>
                            </FloatLabel>
                        </div>
                        <div className='col-3'>
                            <FloatLabel>
                                <InputText className='w-full' id='pacientes.convenioMedico' value={data?.pacientes?.convenio?.nome} disabled />
                                <label htmlFor='pacientes.convenioMedico'>Convenio Medico</label>
                            </FloatLabel>
                        </div>
                        <div className='col-3'>
                            <FloatLabel>
                                <InputText className='w-full' id='profissionais.nome' value={data?.profissionais?.nome} disabled />
                                <label htmlFor='profissionais.nome'>Profissional</label>
                            </FloatLabel>
                        </div>
                    </div>
                    <div className='grid'>
                        <div className='col'>
                            <FloatLabel>
                                <InputText className='w-full' id='statusConsulta' value={data?.status} disabled />
                                <label htmlFor='statusConsulta'>Status Consulta</label>
                            </FloatLabel>
                        </div>
                        <div className='col'>
                            <FloatLabel>
                                {
                                    dtConsulta === true
                                        ?
                                        <Calendar id="data" className='w-full' value={data?.data} onChange={(e) => onInputChange('data', e.value)} showIcon />
                                        :
                                        <InputText className='w-full' id='dataConsulta' value={dataMask(data?.data)} disabled />
                                }
                                <label htmlFor='dataConsulta'>Data Consulta</label>
                            </FloatLabel>
                        </div>
                        <div className='col'>
                            <FloatLabel>
                                {
                                    hrConsulta === true
                                        ?
                                        <Calendar className='w-full' id='hora' value={data?.hora} onChange={(e) => onInputChange('hora', e.target.value)} timeOnly />
                                        :
                                        <InputText className='w-full' id='horaConsulta' value={horaMask(data?.hora)} disabled />
                                }

                                <label htmlFor='horaConsulta'>Hora Consulta</label>
                            </FloatLabel>
                        </div>
                        <Divider />
                        <div className='col'>
                            <FloatLabel>
                                <InputText className='w-full' id='consultorio' onChange={(e) => onInputChange('consultorio', e.target.value)} />
                                <label htmlFor='consultorio'>Escolha o Consultorio</label>
                            </FloatLabel>
                        </div>
                        <Divider />
                        <div className=" col-12 flex justify-content-end">
                            <ButtonGroup className=''>
                                {
                                    dtConsulta === true
                                        ?
                                        <Button style={{ backgroundColor: '#70CEBE', border: 'none' }} className='border-round-left' label="Salvar" icon="pi pi-pencil" onClick={updateConsulta} />
                                        :
                                        <Button style={{ backgroundColor: '#70CEBE', border: 'none' }} className='border-round-left' label={`Confirmar ${data?.tipo}`} icon="pi pi-check" onClick={insertConfirmaConsulta} />
                                }
                                <Button style={{ backgroundColor: '#70CEBE', border: 'none' }} label={`Remarcar ${data?.tipo}`} icon="pi pi-pencil" onClick={remarcar} />
                                <Button style={{ backgroundColor: '#70CEBE', border: 'none' }} className={`Cancelar ${data?.tipo}`} label="Cancelar" icon="pi pi-trash" onClick={updateConsulta} />
                            </ButtonGroup>
                        </div>
                    </div>
                </div>
            </Dialog>

        </>
    );
}

export default ConfirmaConsulta;
