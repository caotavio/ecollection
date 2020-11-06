import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

import './styles.css'

import logo from '../../assets/logo.svg'
import { FiArrowLeft } from 'react-icons/fi';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

// Whenever you need to create state for an array or an object we need to manually inform
// the type of the variables that are being stored.

interface Item {
  id: number;
  title: string;
  image_url: string;
}

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    api.get('items').then(response => {
      setItems(response.data);
    })
  }, []);
  
  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="eccolection"/>
        <Link to="/" >
          <FiArrowLeft />
          Go back home
        </Link>
      </header>

      <form>
        <h1>Collection Point Registration</h1>

        <fieldset>
          <legend>
            <h2>Data</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Entity name</label>
            <input
              type="text"
              name="name"
              id="name"
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                name="email"
                id="email"
              />
            </div>
            <div className="field">
              <label htmlFor="mobile">Mobile number</label>
              <input
                type="text"
                name="mobile"
                id="mobile"
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Address</h2>
            <span>Select an addess on the map</span>
          </legend>

          <MapContainer center={[43.6425662, -79.3892455]} zoom={15}>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[43.6425662, -79.3892455]} />
          </MapContainer>

          <div className="field-group">
            <div className="field">
              <label htmlFor="province">Province</label>
              <select name="province" id="province">
                <option value="0">Select a province</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">City</label>
              <select name="city" id="city">
                <option value="0">Select a city</option>
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Residues</h2>
            <span>Select one or more items below</span>
          </legend>

          <ul className="items-grid">
            {items.map(item => {
              return (
                <li key={item.id}>
                  <img src={item.image_url} alt={item.title}/>
                  <span>{item.title}</span>
                </li>
              );
            })}
          </ul>
        </fieldset>
      </form>
    </div>
  )
}

export default CreatePoint;