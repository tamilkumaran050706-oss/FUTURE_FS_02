import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import AddLead from './pages/AddLead';
import EditLead from './pages/EditLead';
import LeadDetails from './pages/LeadDetails';
import NotFound from './pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="leads" element={<Leads />} />
        <Route path="leads/add" element={<AddLead />} />
        <Route path="leads/edit/:id" element={<EditLead />} />
        <Route path="leads/:id" element={<LeadDetails />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
