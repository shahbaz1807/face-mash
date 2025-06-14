import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CameraPage from './pages/Camra'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <CameraPage/>
    </>
  );
}

export default App
