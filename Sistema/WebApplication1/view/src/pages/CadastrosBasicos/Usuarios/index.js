import Modal from "../../../components/Modal/index";
import { SidebarContext } from "../../../context/SideBarContext";
import React, { useContext, useState, useRef, useEffect } from 'react';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import UsuarioService from './Service/UsuarioService';
import { Password } from 'primereact/password';
import { FloatLabel } from 'primereact/floatlabel';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';



function Usuarios() {
    const { usuarioVisible, setUsuarioVisible } = useContext(SidebarContext);
    const [dataLoaded, setDataLoaded] = useState(false);
    const toast = useRef(null);
    const [usuario, setUsuario] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioDialog, setUsuarioDialog] = useState(false);
    const currentToken = localStorage.getItem('token') || '';
    const dt = useRef(null);
    const [changePasswordDialog, setChangePasswordDialog] = useState(false);
    const [changePassword, setChangePassword] = useState();



    const emptyUsuario = {
        id: null,
        userName: "",
        email: "",
        password: "",
        phoneNumber: "",
    };

    const emptyChangePassword = {
        email: "",
        password: "",
        confirmPassword: "",
    }


    useEffect(() => {
        async function fetchUsuarios() {
            const currentToken = localStorage.getItem('token') || '';
            try {
                const response = await UsuarioService.getUsuarios(currentToken);
                setUsuarios(response.data);
                setDataLoaded(true);
            } catch (error) {
                console.error("Erro ao buscar Usuarios:", error);
            }
        }

        if (usuarioVisible && !dataLoaded) {
            fetchUsuarios();
        }
    }, [usuarioVisible, dataLoaded]);

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
                        <Button icon="pi pi-pencil" severity="info" className="border-round" onClick={() => editUsuario(changePassword)} />
                        <Button icon="pi pi-key" severity="warning" className="border-round" onClick={() => changeUsuarioPassword(changePassword)} />
                    </div>
                </div>
            </div>
        );
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _usuario = { ...usuario };
        _usuario[`${name}`] = val;
        setUsuario(_usuario);
    };

    const editUsuario = (usuario) => {
        setUsuario({ ...usuario });
        setUsuarioDialog(true);
    };

    const changeUsuarioPassword = (changePassword) => {
        setChangePassword({ ...changePassword })
        setChangePasswordDialog(true)
    }

    const confirmDeleteUsuario = (usuario) => {
        setUsuario(usuario);
        setUsuarioDialog(true);
    };

    const header = (
        <h1>Usuario</h1>
    );

    const onHideModal = () => {
        setUsuarioVisible(false);
        setDataLoaded(false); // Reseta o carregamento de dados para false quando o modal é fechado
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < usuarios.length; i++) {
            if (usuarios[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    };

    const saveUsuario = () => {
        setSubmitted(true);

        if (usuario.userName.trim()) {
            let _usuarios = [...usuarios];
            let _usuario = { ...usuario };

            const currentToken = localStorage.getItem('token') || '';
            if (usuario.id) {
                const index = findIndexById(usuario.id);
                _usuarios[index] = _usuario;
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Usuario Atualizado', life: 3000 });
                UsuarioService.updateUsuario(_usuario, currentToken);
            } else {
                _usuarios.push(_usuario);
                console.log("usuario", _usuario);
                UsuarioService.createUsuario(_usuario, currentToken);
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Usuario Criado', life: 3000 });
            }

            setUsuarios(_usuarios);
            setUsuarioDialog(false);
            setUsuario(emptyUsuario);
        }
    };

    const saveNewPassword = () => {
        setSubmitted(true);

        if (usuario.password.trim()) {
            let _changePassword = { ...changePassword };

            const currentToken = localStorage.getItem('token') || '';
            if (usuario.email) {
                UsuarioService.changePassword(_changePassword, currentToken);
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Senha Atualizada', life: 3000 });
            } else {

            }

            setChangePasswordDialog(false);
            setChangePassword(emptyChangePassword);
        }
    }

    return (
        <>
            <Toast ref={toast} />
            <Modal header={header} modal={false} visible={usuarioVisible} style={{ width: '50vw', height: '80vh' }} onHide={() => onHideModal()}>
                <div className="card">
                    <div className="grid">
                        <div className="field col-6">
                            <FloatLabel>
                                <label htmlFor="userName">userName</label>
                                <InputText className='w-full' id="userName" value={usuario.userName} onChange={(e) => onInputChange(e, 'userName')} />
                            </FloatLabel>
                        </div>
                        <div className="field col-6">
                            <FloatLabel>
                                <label htmlFor="email">email</label>
                                <InputText className='w-full' id="email" value={usuario.email} onChange={(e) => onInputChange(e, 'email')} />
                            </FloatLabel>
                        </div>
                        <div className="field col-6">
                            <FloatLabel>
                                <InputText id="password" type="password" className='w-full' value={usuario.password} onChange={(e) => onInputChange(e, 'password')} />
                                <label htmlFor="password">password</label>
                            </FloatLabel>

                        </div>
                        <div className="field col-6">
                            <FloatLabel>
                                <label htmlFor="phoneNumber">phoneNumber</label>
                                <InputText className='w-full' id="phoneNumber" value={usuario.phoneNumber} onChange={(e) => onInputChange(e, 'phoneNumber')} />
                            </FloatLabel>
                        </div>
                        <div className="field col">
                            <Button label="Salvar" icon="pi pi-check" className="border-round p-button-text" onClick={saveUsuario} />
                        </div>
                    </div>
                </div>
                <DataView value={usuarios} itemTemplate={itemTemplate} />


                <Modal header="Change Password" modal={false} visible={changePasswordDialog} style={{ width: '37vw', height: '55vh' }} onHide={() => setChangePasswordDialog(false)}>
                    <div className="card">
                        <div className="grid">
                            <div className="field col-12">
                                <FloatLabel>
                                    <label htmlFor="password">Email</label>
                                    <InputText className='w-full' id="password" disabled value={usuario.email} onChange={(e) => onInputChange(e, 'password')} />
                                </FloatLabel>
                            </div>
                            <div className="field col-12">
                                <FloatLabel>
                                    <label htmlFor="password">password</label>
                                    <InputText className='w-full' id="password" value={usuario.password} onChange={(e) => onInputChange(e, 'password')} />
                                </FloatLabel>
                            </div>
                            <div className="field col-12">
                                <FloatLabel>
                                    <label htmlFor="confirmPassword">confirmPassword</label>
                                    <InputText className='w-full' id="confirmPassword" value={usuario.confirmPassword} onChange={(e) => onInputChange(e, 'confirmPassword')} />
                                </FloatLabel>
                            </div>
                            <div className="field col">
                                <Button label="Alterar" icon="pi pi-check" className="border-round p-button-text" onClick={saveNewPassword} />
                            </div>
                        </div>
                    </div>

                </Modal>
            </Modal>
        </>
    );
}

export default Usuarios;