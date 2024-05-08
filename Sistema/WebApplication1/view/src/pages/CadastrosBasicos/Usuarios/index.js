import React, { useContext, useState, useRef, useEffect } from 'react';
import Modal from "../../../components/Modal/index";
import { SidebarContext } from "../../../context/SideBarContext";
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { FloatLabel } from 'primereact/floatlabel';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Dropdown } from 'primereact/dropdown';
import UsuarioService from './Service/UsuarioService';
import ChangePassword from '../../Configuracoes/ChangePassword';
import { Commom } from '../../../utils/Commom.js';

function Usuarios() {
    const { usuarioVisible, setUsuarioVisible } = useContext(SidebarContext);
    const [dataLoaded, setDataLoaded] = useState(false);
    const toast = useRef(null);
    const [usuario, setUsuario] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioDialog, setUsuarioDialog] = useState(false);
    const [changePasswordDialog, setChangePasswordDialog] = useState(false);
    const [changePassword, setChangePassword] = useState({ email: "", password: "", confirmPassword: "" });
    const modalIdRef = useRef(Math.random().toString(36).substr(2, 9));



    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchUsuarios = async () => {
            const currentToken = localStorage.getItem('token') || '';
            try {
                const response = await UsuarioService.getUsuarios(currentToken);
                setUsuarios(response.data);
                setDataLoaded(true);
            } catch (error) {
                console.error("Erro ao buscar Usuarios:", error);
            }
        };

        if (usuarioVisible && !dataLoaded) {
            fetchUsuarios();
        }
    }, [usuarioVisible, dataLoaded]);

    const editUsuario = (usuario) => {
        setUsuario(usuario);
        setUsuarioDialog(true);
    };

    const itemTemplate = (usuario) => {
        if (!usuario) {
            return;
        }

        return (
            <div className="col-12" style={{ borderBottom: '1px solid #d9d9d9', padding: '1rem' }}>
                <div className="flex justify-content-between items-center">
                    <div className="product-list-detail">
                        <div className="product-name"><strong>User Name:</strong> {usuario.userName}</div>
                        <div className="product-description"><strong>E-mail:</strong> {usuario.email}</div>
                    </div>
                    <div className="flex justify-content-between items-center w-7rem">
                        <Button icon="pi pi-pencil" severity="info" className="border-round" onClick={() => editUsuario(usuario)} />
                        <Button icon="pi pi-key" severity="warning" className="border-round" onClick={() => changeUsuarioPassword(usuario)} />
                    </div>
                </div>
            </div>
        );
    };

    const changeUsuarioPassword = (usuario) => {
        setChangePassword({ email: usuario.email, password: "", confirmPassword: "" });
        setChangePasswordDialog(true);
    };

    const dropDownRoleName = [
        { label: 'Administrador', value: 'ADMIN' },
        { label: 'Assistentes', value: 'ASSISTENTE' },
        { label: 'Profissional', value: 'PROFISSIONAL' },
    ];

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        const _usuario = { ...usuario };

        if (name === 'cpf') {
            _usuario.cpf = Commom.formatCpf(val)
        } else if (name === "phoneNumber") {
            _usuario.phoneNumber = Commom.formatPhone(val)
        } else {
            _usuario[name] = val;
        }
        setUsuario(_usuario);
    }

    const saveUsuario = async () => {
        setSubmitted(true);
        if (usuario.userName.trim()) {
            const _usuarios = [...usuarios];
            const _usuario = { ...usuario };
            const currentToken = localStorage.getItem('token') || '';
            try {
                if (usuario.id) {
                    const index = _usuarios.findIndex(u => u.id === usuario.id);
                    _usuarios[index] = _usuario;
                    await UsuarioService.updateUsuario(_usuario, currentToken);
                } else {
                    _usuarios.push(_usuario);
                    await UsuarioService.createUsuario(_usuario, currentToken);
                }
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Usuario Atualizado', life: 3000 });
                setUsuarios(_usuarios);
                setUsuarioDialog(false);
                setUsuario({});
            } catch (error) {
                console.error("Erro ao salvar usuário:", error);
                toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao salvar usuário', life: 3000 });
            }
        }
    };

    return (
        <>
            <Toast ref={toast} />
            <Modal  modalKey={modalIdRef.current}  header={<h1>Usuario</h1>} modal={false} visible={usuarioVisible} style={{ width: '50vw', height: '80vh' }} onHide={() => { setUsuarioVisible(false); setDataLoaded(false); }}>
                <div className="card">
                    <div className="grid">
                        <div className="col-6">
                            <FloatLabel>
                                <label htmlFor="userName">Nome</label>
                                <InputText className='w-full' id="userName" value={usuario.userName} onChange={(e) => onInputChange(e, 'userName')} />
                            </FloatLabel>
                        </div>
                        <div className="col-6">
                            <FloatLabel>
                                <label htmlFor="email">E-mail</label>
                                <InputText className='w-full' id="email" value={usuario.email} onChange={(e) => onInputChange(e, 'email')} />
                            </FloatLabel>
                        </div>
                        <div className="col-6">
                            <FloatLabel>
                                <label htmlFor="cpf">CPF</label>
                                <InputText className='w-full' id="cpf" value={usuario.cpf} onChange={(e) => onInputChange(e, 'cpf')} maxLength={14} />
                            </FloatLabel>
                        </div>
                        <div className="col-6">
                            <FloatLabel>
                                <InputText id="password" type="password" className='w-full' value={usuario.password} onChange={(e) => onInputChange(e, 'password')} />
                                <label htmlFor="password">Senha</label>
                            </FloatLabel>

                        </div>
                        <div className="col-6">
                            <FloatLabel>
                                <InputText id="confirmPassword" type="confirmPassword" className='w-full' value={usuario.confirmPassword} onChange={(e) => onInputChange(e, 'confirmPassword')} />
                                <label htmlFor="confirmPassword">Confirmar Senha</label>
                            </FloatLabel>
                        </div>
                        <div className="col-6">
                            <FloatLabel>
                                <label htmlFor="phoneNumber">Telefone</label>
                                <InputText className='w-full' id="phoneNumber" value={usuario.phoneNumber} onChange={(e) => onInputChange(e, 'phoneNumber')} maxLength={14} />
                            </FloatLabel>
                        </div>
                        <div className="col-6">
                            <label htmlFor="roleName">Função</label>
                            <Dropdown className='w-full'
                                id="roleName" value={usuario.roleName}
                                options={dropDownRoleName}
                                onChange={(e) => onInputChange(e, 'roleName')}
                                optionLabel="label"
                                placeholder="Selecione a Função" />
                        </div>
                        <div className="col-12">
                            <Button label="Salvar" icon="pi pi-check" className="border-round p-button-text" onClick={saveUsuario} />
                        </div>
                    </div>
                </div>
                <DataView value={usuarios} itemTemplate={itemTemplate} />
            </Modal>

            <ChangePassword changePassword={changePassword} setChangePassword={setChangePassword} changePasswordDialog={changePasswordDialog} setChangePasswordDialog={setChangePasswordDialog} />
        </>
    );
}

export default Usuarios;