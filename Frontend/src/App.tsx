import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from './Components/CommonComponents/NavBar'

export default function App() {
  return (
    <div >
      <NavBar />
      <Outlet />
    </div>
  )
}
