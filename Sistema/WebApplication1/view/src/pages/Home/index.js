import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
function Home() {

    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')

        if (!token || token === null || token === undefined) {
            navigate('/')
        }
    })


    return (
        <div>
            HOME
        </div>
    );
}

export default Home;
