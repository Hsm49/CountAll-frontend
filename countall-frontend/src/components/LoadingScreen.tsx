import React from 'react';
import './css/LoadingScreen.css';

const LoadingScreen: React.FC = () => {
  return (
    <div className="loading-screen">
      <div className="logo-container">
        <img src="/src/assets/img/logos/CA3.png" alt="Loading" className="loading-image" />
        <div className="progress-bar"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;