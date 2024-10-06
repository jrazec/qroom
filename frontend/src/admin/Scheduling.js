import React from "react";
import "./Scheduling.css";


function Scheduling() {
    return (
        <div class="container-fluid">
        <div class="row">
          {/* <!-- Sidebar --> */}
          <nav class="col-md-2 d-none d-md-block bg-danger sidebar">
            <div class="sidebar-sticky text-center">
              <h2 class="brand-title text-white pt-3">QRoom</h2>
              <div class="user-circle bg-light my-3"></div>
              <span class="text-white mb-4 d-block">Admin</span>
    
              <ul class="nav flex-column">
                <li class="nav-item">
                  <a class="nav-link text-white active" href="#">Home</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link text-white" href="#">Accounts</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link text-white" href="#">Scheduling</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link text-white" href="#">Feedback</a>
                </li>
              </ul>
    
              <div class="logout mt-auto">
                <a href="#" class="text-white">logout</a>
              </div>
            </div>
          </nav>
    
          {/* <!-- Main content --> */}
          <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
            <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
              <h1 class="h2 text-danger font-weight-bold">Dashboard <small class="text-muted">Scheduling</small></h1>
            </div>
    
            <div class="d-flex align-items-center mb-3">
              <a href="#" class="back-arrow mr-3">&larr;</a> 
              <label for="departments" class="font-weight-bold mr-2">Departments</label>
              <select id="departments" class="form-control d-inline-block w-auto mr-3">
                <option>CICS</option>
                <option>CTE</option>
                <option>CAS</option>
                <option>CABE</option>
              </select>
              <button class="btn btn-danger">+ add</button>
            </div>
    
            {/* <!-- Table --> */}
            <div class="table-responsive">
              <table class="table table-bordered table-hover custom-table">
                <thead>
                  {/* <!-- Add table headers if needed --> */}
                </thead>
                <tbody>
                  {/* <!-- Sample table row --> */}
                  <tr>
                    <td colspan="6"></td>
                    <td class="text-center">
                      <button class="btn btn-light btn-sm edit-btn"><i class="fas fa-edit"></i></button>
                      <button class="btn btn-light btn-sm delete-btn"><i class="fas fa-trash"></i></button>
                    </td>
                  </tr>
                  {/* <!-- Repeat similar rows --> */}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    )
}


export default Scheduling;