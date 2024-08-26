import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { UserOutlined } from '@ant-design/icons';
import "../styles/Header.css";

const Header = () => {
  const [loginUser, setLoginUser] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Parse user from localStorage and set it in state
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setLoginUser(user);
    }
  }, []); // Add an empty dependency array to run the effect only once

  const logoutHandler = () => {
    localStorage.removeItem('user');
    navigate('/login');
  }; // Close the function with a curly brace

  return (
    <>
  <nav className="navbar navbar-expand-lg shadow-sm" style={{ backgroundColor: '#f8f9fa' }}>
    <div className="container-fluid">
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarTogglerDemo01"
        aria-controls="navbarTogglerDemo01"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
        <Link className="navbar-brand" to="/" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
          Expense Management System
        </Link>
        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <h6 className="nav-link d-flex align-items-center">
              <UserOutlined style={{ marginRight: '0.5rem', fontSize: '1.2rem' }} />
              {loginUser && loginUser.name}
            </h6>
          </li>
          <li className="nav-item">
            <Button className="btn btn-outline-primary ms-3" onClick={logoutHandler}>
              Logout
            </Button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</>

  );
};

export default Header;