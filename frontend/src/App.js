import { Routes, Route } from 'react-router-dom';
import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';
import DashboardPage from './pages/DashboardPage';
import MenuPage from './pages/MenuPage';
import InventoryPage from './pages/InventoryPage';
import ProcurementPage from './pages/ProcurementPage';
import CommunicatePage from './pages/CommunicatePage';
import SettingsPage from './pages/SettingsPage';
import './App.css';

function App() {
  return (
    <div className="app">
      <TopBar />
      <div className="app__content">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/procurement" element={<ProcurementPage />} />
          <Route path="/communicate" element={<CommunicatePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
      <BottomNav />
    </div>
  );
}

export default App;
