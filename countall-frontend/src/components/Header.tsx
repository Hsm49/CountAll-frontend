import React from 'react';

const Header: React.FC = () => {
  return (
    <header style={headerStyle}>
      <h1>CountAll</h1>
    </header>
  );
};

const headerStyle: React.CSSProperties = {
  backgroundColor: '#282c34',
  padding: '1rem',
  color: 'white',
  textAlign: 'center',
};

export default Header;
