import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/Layout.css';

export default function Layout() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function handleLogout() {
    localStorage.removeItem('authToken');
    navigate('/login');
  }

  return (
    <div className="app-layout">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className="sidebar">
          <h2 className="logo">Expense Tracker</h2>
          <nav>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
              Dashboard
            </NavLink>
            <NavLink to="/transactions" className={({ isActive }) => isActive ? 'active' : ''}>
              Transactions
            </NavLink>
            <NavLink to="/budgets" className={({ isActive }) => isActive ? 'active' : ''}>
              Budgets
            </NavLink>
            <NavLink to="/reports" className={({ isActive }) => isActive ? 'active' : ''}>
              Reports
            </NavLink>
          </nav>
          
          <button className="danger logout-button" onClick={handleLogout}>
            Logout
          </button>
        </aside>
      )}

      {/* Main Content */}
      <main className="content">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      {isMobile && (
        <nav className="mobile-nav">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
            <span>📊</span>
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/transactions" className={({ isActive }) => isActive ? 'active' : ''}>
            <span>💰</span>
            <span>Transactions</span>
          </NavLink>
          <NavLink to="/budgets" className={({ isActive }) => isActive ? 'active' : ''}>
            <span>📅</span>
            <span>Budgets</span>
          </NavLink>
          <NavLink to="/reports" className={({ isActive }) => isActive ? 'active' : ''}>
            <span>📈</span>
            <span>Reports</span>
          </NavLink>
          <button onClick={handleLogout} className="danger">
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </nav>
      )}
    </div>
  );
}
