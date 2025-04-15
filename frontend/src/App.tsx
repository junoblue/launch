import React from 'react';

const App: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5'
    }}>
      <h1 style={{
        color: '#333',
        fontSize: '2.5rem',
        marginBottom: '1rem'
      }}>
        Hello World!
      </h1>
      <p style={{
        color: '#666',
        fontSize: '1.2rem'
      }}>
        Welcome to login.tokyoflo.com
      </p>
    </div>
  );
};

export default App; 