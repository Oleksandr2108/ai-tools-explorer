import { Route, Routes } from 'react-router-dom'
import { ExplorePage } from './pages/ExplorePage'
import { ToolDetailsPage } from './pages/ToolDetailsPage'

export default function App() {
  return <Routes><Route path="/" element={<ExplorePage />} /><Route path="/tool/:domain" element={<ToolDetailsPage />} /></Routes>
}
