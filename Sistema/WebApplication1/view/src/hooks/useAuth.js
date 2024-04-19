import api from '../utils/api.js'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext';

function useAuth() {
    const [authenticated, setAuthenticated] = useState(false)
    const navigate = useNavigate()
    const toast = useToast();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;
            setAuthenticated(true);
        }
    }, []);

    async function authUser(data) {
        setAuthenticated(true)
        localStorage.setItem('token', JSON.stringify(data.token))
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/')
    }

    async function register(user) {
        try {
            const data = await api.post('/register', user)
                .then((response) => {
                    return response.data
                })
            toast.current.show({ severity: 'info', summary: 'Registro', detail: data.message, life: 3000 });
            await authUser(data)
        } catch (error) {
            console.log('Erro ao cadastrar ', error)
            toast.current.show({ severity: 'error', summary: 'Erro de Registro', detail: error.response.data.message, life: 3000 });
        }
    }

    async function login(user) {
        try {
            const data = await api.post('/Authenticate', user)
                .then((response) => {
                    return response.data
                })
            toast.current.show({ severity: 'info', summary: 'Login', detail: data.message, life: 3000 });
            await authUser(data)
            navigate('home')
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Erro de Login', detail: error.response.data.message, life: 3000 });
        }
    }

    

    function logout() {
        setAuthenticated(false)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        api.defaults.headers.Authorization = undefined
        navigate('/')
        toast.current.show({ severity: 'success', summary: 'Logout', detail: 'Logout realizado com sucesso', life: 3000 });
    }

    return { authenticated, register, login, logout, toast }
}

export default useAuth
