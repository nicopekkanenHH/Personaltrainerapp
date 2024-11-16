import React from 'react'
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CustomerList from './pages/CustomerList';
import TrainingList from './pages/TrainingList';
import CalendarView from './pages/CalendarView';
import "./App.css";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/customers" element={<CustomerList />} />
        <Route path="/trainings" element={<TrainingList />} />
        <Route path="/calendar" element={<CalendarView />} />
      </Routes>
    </Router>
  );
};

export default App;
