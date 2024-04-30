import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../pages/Login';
import Home from '../pages/Home';
import ChamarPaciente from '../pages/ChamarPaciente/index';

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/chamarPaciente" element={<ChamarPaciente />} />
        </Routes>
    );
}

export default AppRoutes;
