import { Outlet, Link } from "react-router-dom";
import "./AdminDashboard"

const Layout = () => {
  return (
    <div className="app">
    <aside className="sidebar">


    
      <nav>
        <div class="sidebar-sticky text-center">
          <h2 class="brand-title text-white pt-3">QRoom</h2>
          <div class="user-circle bg-light my-3"></div>
          <span class="text-white mb-4 d-block">Admin</span>

          <ul class="nav flex-column">
            <li class="nav-item">
             <Link to="/" class="nav-link text-white active">Home</Link>
            </li>
            <li class="nav-item">
              <Link to="/accounts" class="nav-link text-white">Accounts</Link>
            </li>
            <li class="nav-item">
              <Link to="/scheduling" class="nav-link text-white">Scheduling</Link>
            </li>
            <li class="nav-item">
              <Link to="/feedback" class="nav-link text-white">Feedback</Link>
            </li>
          </ul>

          <div class="logout mt-auto">
            <Link to="/" class="text-white">logout</Link>
          </div>
        </div>
      </nav>


    </aside>
    <main className="main-content">
      <Outlet />
    </main>
  </div>
  )
};

export default Layout;


