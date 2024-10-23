import React, { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import AppRouter from './routes/AppRouter';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust the delay as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? <LoadingScreen /> : <AppRouter />}
    </>
  );
};

export default App;