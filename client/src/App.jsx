import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import { AuthProvider } from './context/AuthContext';
import { EventProvider } from './context/EventContext';
import AuthPage from './pages/AuthPage';
import BudgetPage from './pages/BudgetPage';
import DashboardPage from './pages/DashboardPage';
import EventsPage from './pages/EventsPage';
import GuestsPage from './pages/GuestsPage';
import LandingPage from './pages/LandingPage';
import MoodboardPage from './pages/MoodboardPage';
import PlannerPage from './pages/PlannerPage';
import SettingsPage from './pages/SettingsPage';
import TimelinePage from './pages/TimelinePage';
import VendorsPage from './pages/VendorsPage';

function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Brand Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/planner" element={<PlannerPage />} />
            <Route path="/moodboard" element={<MoodboardPage isEmbeddedInDashboard={false} />} />
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/register" element={<AuthPage mode="register" />} />

            {/* Dashboard Workspace Routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="budget" element={<BudgetPage />} />
              <Route path="timeline" element={<TimelinePage />} />
              <Route path="guests" element={<GuestsPage />} />
              <Route path="vendors" element={<VendorsPage />} />
              <Route path="moodboards" element={<MoodboardPage isEmbeddedInDashboard={true} />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </EventProvider>
    </AuthProvider>
  );
}

export default App;
