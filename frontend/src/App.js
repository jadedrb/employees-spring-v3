import './App.css';
import React, { useEffect } from 'react';
import axios from 'axios';

function App() {

  useEffect(() => {
    axios.get('/api/employees')
      .then(res => {
        console.log('Data: ')
        console.log(res.data)
      })
      .catch((err) => console.log(err))
  }, [])

  return (
    <div className="App">
      Test (1.01)
    </div>
  );
}

export default App;
