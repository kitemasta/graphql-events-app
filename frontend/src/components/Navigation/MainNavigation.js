import React, { Fragment, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../../context/auth-context';
import './MainNavigation.css';

const MainNavigation = () => {
  const { token, logout } = useContext(AuthContext);

  return (
    <header className="main-navigation">
      <div className="main-navigation__logo">
        <h1>EasyEvent</h1>
      </div>
      <nav className="main-navigation__items">
        <ul>
          {!token && <li><NavLink to="/auth">Authenticate</NavLink></li>}
          <li><NavLink to="/events">Events</NavLink></li>
          {token && (
            <Fragment>
              <li><NavLink to="/bookings">Bookings</NavLink></li>
              <li><button onClick={logout}>Logout</button></li>
            </Fragment>
          )}
        </ul>
      </nav>
    </header>
  )
};

export default MainNavigation;
