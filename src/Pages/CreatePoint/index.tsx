import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import api from '../../services/api';

import './styles.css'

import logo from '../../assets/logo.svg'
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import axios from 'axios';

// Whenever you need to create state for an array or an object we need to manually inform
// the type of the variables that are being stored.

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface ProvincesResponse {
  initials: string;
  name: string;
}

interface CitiesResponse {
  province_name: string;
  city: string;
}

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([]);

  const [provinces, SetProvinces] = useState<string[]>([]);
  const [cities, SetCities] = useState<string[]>([]);

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: ''
  });
  
  const [selectedProvince, setSelectedProvince] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);

  const history = useHistory();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;

      setInitialPosition([latitude, longitude]);
    });
  }, []);

  useEffect(() => {
    api.get('items').then(response => {
      setItems(response.data);
    })
  }, []);

  useEffect(() => {
    axios.get<ProvincesResponse[]>('https://caotavio.github.io/provinces.json').then(response => {
      const provinceNames = response.data.map(province => province.name);
      
      SetProvinces(provinceNames);
    })
  }, []);

  useEffect(() => {
    if(selectedProvince === '0') {
      return;
    }

    axios.get<CitiesResponse[]>('https://caotavio.github.io/geolocation.json').then(response => {
      const clickedProvince = response.data.filter(province => selectedProvince === province.province_name)
      const cityNames = clickedProvince.map(city => city.city)
      
      SetCities(cityNames.sort())
    })
  }, [selectedProvince]);

  function handleSelectProvince(event: ChangeEvent<HTMLSelectElement>) {
    const province = event.target.value;

    setSelectedProvince(province);
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;

    setSelectedCity(city);
  }

  function handleMapClick(event:LeafletMouseEvent) {
    setSelectedPosition([
      event.latlng.lat,
      event.latlng.lng
    ]);
  }

  function handleInputEvent(event: ChangeEvent<HTMLInputElement>) {
    const {name, value} = event.target;

    setFormData({ ...formData, [name]: value });
  }

  function handleSelectedItem(id: number) {
    const alreadySelected = selectedItems.findIndex(item => item === id);

    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter(item => item !== id);

      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([ ...selectedItems, id ]);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const {name, email, mobile} = formData;
    const province = selectedProvince;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems;

    const data = {
      name,
      email,
      mobile,
      province,
      city,
      latitude,
      longitude,
      items
    }
    
    await api.post('points', data);

    alert('Collection point created!');

    history.push('/');
  }
  
  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="eccolection"/>
        <Link to="/" >
          <FiArrowLeft />
          Go back home
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
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
              onChange={handleInputEvent}
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleInputEvent}
              />
            </div>
            <div className="field">
              <label htmlFor="mobile">Mobile number</label>
              <input
                type="text"
                name="mobile"
                id="mobile"
                onChange={handleInputEvent}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Address</h2>
            <span>Select an addess on the map</span>
          </legend>

          <Map center={initialPosition} zoom={15} onClick={handleMapClick} >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={selectedPosition} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="province">Province</label>
              <select 
                name="province"
                id="province"
                value={selectedProvince}
                onChange={handleSelectProvince}
              >
                <option value="0">Select a province</option>
                {provinces.map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">City</label>
              <select 
                name="city"
                id="city"
                value={selectedCity}
                onChange={handleSelectCity}
              >
                {selectedProvince === "0"
                    ?
                  <option value={selectedCity}>Select a province first</option>
                    :
                  <option value={selectedCity}>{selectedCity === "0" ? "Select a city" : selectedCity}</option>
                }
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
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
                <li key={item.id} onClick={() => handleSelectedItem(item.id)} className={selectedItems.includes(item.id) ? "selected" : ""}>
                  <img src={item.image_url} alt={item.title}/>
                  <span>{item.title}</span>
                </li>
              );
            })}
          </ul>
        </fieldset>

        <button type="submit">
            Register collection point
        </button>
      </form>
    </div>
  )
}

export default CreatePoint;