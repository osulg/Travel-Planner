import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import RoomPage from './pages/RoomPage'
import InvitePage from './pages/InvitePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/trip/:roomId" element=
        {<RoomPage />} />
      <Route path="/invite/:inviteToken" element={<InvitePage />} />
    </Routes>
  )
}

export default App