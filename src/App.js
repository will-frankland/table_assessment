import React, { useState } from 'react';
import Form from './components/Form';
import Table from './components/Table';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  return (
    <div className="App">
      <Table users={users} setUsers={setUsers}/>
      <Form setUsers={setUsers}/>
      Hello World
    </div>
  );
}

export default App;
