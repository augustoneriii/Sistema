import React, { useRef } from 'react'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { FloatLabel } from 'primereact/floatlabel'
import { Toast } from 'primereact/toast';
import Modal from '../../../components/Modal'
import ChangePassWordService from './service/ChangePasswordService'

function ChangePassword({ changePassword, setChangePassword, changePasswordDialog, setChangePasswordDialog, token }) {
    const toast = useRef(null);

    const savePassword = () => {
        const currentToken = localStorage.getItem('token') || '';

        let objInsert = {
            email: changePassword.email,
            currentPassword: changePassword.password,
            newPassword: changePassword.confirmPassword
        }

        ChangePassWordService.changePassword(objInsert, currentToken).then(() => {
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Password Changed Successfully', life: 3000 });
        }).catch((error) => {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error Changing Password', life: 3000 });
        })
    }

    return (
        <Modal header="Change Password" modal={false} visible={changePasswordDialog} style={{ width: '37vw', height: '55vh' }} onHide={() => setChangePasswordDialog(false)}>
            <Toast ref={toast} />
            <div className="card">
                <div className="grid">
                    <div className="field col-12">
                        <FloatLabel>
                            <label htmlFor="email">Email</label>
                            <InputText className='w-full' id="email" value={changePassword.email} onChange={(e) => setChangePassword({ ...changePassword, email: e.target.value })} disabled />
                        </FloatLabel>
                    </div>
                    <div className="field col-12">
                        <FloatLabel>
                            <label htmlFor="password">password</label>
                            <InputText className='w-full' id="password" value={changePassword.password} onChange={(e) => setChangePassword({ ...changePassword, password: e.target.value })} type="password" />
                        </FloatLabel>
                    </div>
                    <div className="field col-12">
                        <FloatLabel>
                            <label htmlFor="confirmPassword">confirmPassword</label>
                            <InputText className='w-full' id="confirmPassword" value={changePassword.confirmPassword} onChange={(e) => setChangePassword({ ...changePassword, confirmPassword: e.target.value })} type="password" />
                        </FloatLabel>
                    </div>
                    <div className="field col">
                        <Button label="Alterar" icon="pi pi-check" className="border-round p-button-text" onClick={savePassword} />
                    </div>
                </div>
            </div>
        </Modal>)
}

export default ChangePassword
