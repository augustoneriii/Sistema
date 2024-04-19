//Login/index.js
import React from 'react'
// import { Link } from 'react-router-dom'
//components
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
//hooks
import { useContext, useState } from 'react'
//context
import { Context } from '../../context/UserContext'
import { useNavigate } from 'react-router-dom'

import Logo from '../../assets/img/logoSysclin.png'

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
                    <img src={Logo} alt="hyper" height={200} className="mb-3" />
                </div>
                <div>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="email" className="block text-900 font-medium mb-2">Email</label>
                        <InputText id="email" name='email' onChange={handleChange} type="text" placeholder="Email address" className="w-full mb-3" />

                        <label htmlFor="password" className="block text-900 font-medium mb-2">Password</label>
                        <InputText id="password" name='password' type="password" onChange={handleChange} placeholder="Password" className="w-full mb-3" />

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