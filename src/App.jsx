import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import RoomPage from './pages/RoomPage'
import SchedulePage from './pages/SchedulePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/trip/:roomId" element=
        {<RoomPage />} />
      <Route path="/trip/:roomId/schedule" element={<SchedulePage />} />
    </Routes>
  )
}

export default App