import React from 'react';
import { Link } from 'react-router-dom';

import {FiLogIn} from 'react-icons/fi';

import './styles.css';

import logo from '../../assets/logo.png';

const Home = () => {
  return (
    <div id="page-home">
      <div className="content">
        <header>
          <img src={logo} alt="Ecollection"/>
        </header>

        <main>
          <h1>Your marketplace for residue collection</h1>
          <p>We help people find collection points all around Canada efficiently.</p>

          <Link to="/create-point">
            <span>
              <FiLogIn />
            </span>
            <strong>Register a Collection Point</strong>
          </Link>
        </main>
      </div>
    </div>
  )
}

export default Home;