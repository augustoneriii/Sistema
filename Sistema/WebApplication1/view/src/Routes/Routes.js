import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../pages/Login';
import Home from '../pages/Home';
import Consulta from '../pages/Consulta';
import Profissional from '../pages/Profissional';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/consulta" element={<Consulta />} />
      <Route path="/profissional" element={<Profissional />} />
    </Routes>
  );
}

export default AppRoutes;
