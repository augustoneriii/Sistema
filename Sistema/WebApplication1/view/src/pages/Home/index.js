import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
function Home() {

    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))

    useEffect(() => {
        const token = localStorage.getItem('token')


        if (!token || token === null || token === undefined) {
            navigate('/')
        }
    })

    return (
        <div className="text-center">
            <h1>Home</h1>
            <h2>Seja bem vindo {user.userName}</h2>
        </div>
    );
}

export default Home;
