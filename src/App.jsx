import React from 'react'
import { Routes, Route } from 'react-router-dom'
import SignUp from './components/SignUp'
import Login from './components/Login'
import Dashboard from './components/Dashboard'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}

export default App