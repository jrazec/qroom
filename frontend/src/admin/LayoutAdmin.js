import { Outlet, Link } from "react-router-dom";
import "./AdminDashboard"

const Layout = () => {
  return (
    <div className="app">
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="profile-picture">
          <span>Admin</span>
        </div>
      </div>
      <nav>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#accounts">Accounts</a></li>
          <li><a href="#scheduling">Scheduling</a></li>
          <li><a href="#feedback">Feedback</a></li>
        </ul>
      </nav>
      <div className="logout">
        <a href="#logout">logout</a>
      </div>
    </aside>
    <main className="main-content">
      <header className="dashboard-header">
        <h1>Dashboard <span>Home</span></h1>
      </header>
      <section className="dashboard-grid">
        <div className="grid-item large"></div>
        <div className="grid-item small"></div>
        <div className="grid-item medium"></div>
        <div className="grid-item large"></div>
        <div className="grid-item medium"></div>
      </section>
    </main>
  </div>
  )
};

export default Layout;


    <>
    
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/blogs">Blogs</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>