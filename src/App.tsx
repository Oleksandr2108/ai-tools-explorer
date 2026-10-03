import { Route, Routes } from 'react-router-dom'
import { ExplorePage } from './pages/ExplorePage'

export default function App() {
  return <Routes><Route path="/" element={<ExplorePage />} /></Routes>
}
