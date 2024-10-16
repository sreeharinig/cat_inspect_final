import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const images = [
  'https://s7d2.scene7.com/is/image/Caterpillar/CM20210915-a9d7b-860aa',
  'https://s7d2.scene7.com/is/image/Caterpillar/CM20210915-a9d7b-860aa',
  'https://s7d2.scene7.com/is/image/Caterpillar/CM20210915-a9d7b-860aa',
];

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/inspectors/login', {
        email,
        password,
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        navigate('/customers');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    const flyingImages = document.querySelectorAll('.flying-image');
    flyingImages.forEach((img, index) => {
      img.style.animationDelay = `${index * 1.5}s`; // Stagger animations
    });
  }, []);

  return (
    <div className="box-form">
      <div className="left">
        <div className="overlay">
          <h1>Welcome to CATINSPECT</h1>
          <p>Your trusted vehicle inspection partner</p>
        </div>
      </div>
      <div className="right">
        <h2>INSPECTOR LOGIN</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-container">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
      <div className="flying-images-background">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Flying ${index}`}
            className="flying-image"
          />
        ))}
      </div>
    </div>
  );
}

export default Login;
