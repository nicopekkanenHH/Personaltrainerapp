import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => (
  <nav className="navbar">
    <h1 className="navbar-title">Treeni Sovellus</h1>
    <ul className="navbar-links">
      <li><Link to="/customers">Asiakkaat</Link></li>
      <li><Link to="/trainings">Harjoitukset</Link></li>
      <li><Link to="/calendar">Kalenteri</Link></li>
    </ul>
  </nav>
);

export default Navbar;