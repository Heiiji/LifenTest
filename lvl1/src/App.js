import React, { Component } from 'react';
import './App.css';

import Drop from './components/drop';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Amazing App</h1>
        </header>
          <Drop/>
      </div>
    );
  }
}

export default App;
