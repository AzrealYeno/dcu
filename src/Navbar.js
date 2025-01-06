import React from 'react';
import './Navbar.css';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
  
  <nav>
    <NavLink to="/">Home</NavLink>
    <NavLink to="/livegames">LiveGames</NavLink>
    <NavLink to="/admin">Admin</NavLink>
  </nav>


);
};

export default Navbar;