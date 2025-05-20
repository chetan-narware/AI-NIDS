import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import GoLive from './components/GoLive';
import LogsPage from './components/LogsPage';
import Test from './components/Test';
import About from './components/About'; // Assuming you have an About page
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/golive" element={<GoLive />} />
        <Route path="/logs" element={<LogsPage/>} />
        <Route path="/test" element={<Test/>} />
      </Routes>
    </Router>
  );
};

export default App;
