import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
// import Features from './pages/Features';
// import Team from './pages/Team';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ChatbotInterface from './components/chatbotui';
import Medication from './components/Medication';
// import axios from 'axios';
// import React, { useEffect } from 'react';


function App() {

//   const [todos, setTodos] = useState([]); // ✅ Declare state

//   useEffect(() => {
//   axios.get('http://localhost:8000/todos/')
//     .then(res => {
//       console.log(res.data);
//       setTodos(res.data);
//     })
//     .catch(err => console.error(err));
// }, []);


  return (
    <Router>
      <div className="bg-[#000118] min-h-screen">
        <Navbar />
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/team" element={<Team />} /> */}
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/chatbot" element={<ChatbotInterface />} />
            <Route path="/medication" element={<Medication />} /> {/* ✅ Add this */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;