//Login/index.js
import React from 'react'
// import { Link } from 'react-router-dom'
//components
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Button } from 'primereact/button'
//hooks
import { useContext, useState } from 'react'
//context
import { Context } from '../../context/UserContext'
import { useNavigate } from 'react-router-dom'
import  style from './style.module.css'
import Logo from '../../assets/img/logoSysclin.png'
import { FloatLabel } from 'primereact/floatlabel';
function Login() {

    const [user, setUser] = useState({})
    const { login } = useContext(Context)
    const [token] = useState(localStorage.getItem('token') || '')
    const navigate = useNavigate()

    if (token) {
        navigate('/home')
    }

    function handleChange(e) {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    function handleSubmit(e) {
        e.preventDefault()
        login(user)
    }

    return (
        <div style={{ height: '100vh' }} className="login-container flex align-items-center justify-content-center">
            <div className="surface-card p-4 shadow-2 border-round  lg:w-6">
                <div className="text-center ">
                    <img src={Logo} alt="hyper" height={200} className="mb-5" />
                </div>
                <div>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-column gap-5">
                            <FloatLabel>
                                <label htmlFor="email">Email</label>
                                <InputText id="email" name='email' onChange={handleChange} type="text" className="w-full" />
                            </FloatLabel>
                            <FloatLabel>
                                <Password inputId="password" name='password' type="password" toggleMask onChange={handleChange} style={style} className="w-full" />
                                <label htmlFor="password">Password</label>
                            </FloatLabel>
                        </div>
                        <div className="flex align-items-center justify-content-between mb-6">
                            <div className="flex align-items-center">
                            </div>
                        </div>
                        <Button type="submit" label="Sign In" icon="pi pi-user" className="w-full" />
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login