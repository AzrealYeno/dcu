import React, { useState } from 'react';
import './Navbar.css';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`navbar ${isMenuOpen ? 'open' : ''}`}>
      <div className="burger-icon" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      
      <div className={`nav-links ${isMenuOpen ? 'show' : ''}`}>
        <NavLink to="/" onClick={() => setIsMenuOpen(false)}>Home</NavLink>
        <NavLink to="/livegames" onClick={() => setIsMenuOpen(false)}>LiveGames</NavLink>
        <NavLink to="/admin" onClick={() => setIsMenuOpen(false)}>Admin</NavLink>
      </div>
    </nav>
  );
};

export default Navbar;

/*blabaasd*/