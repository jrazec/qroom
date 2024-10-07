import React,{useState, useRef} from "react";
import "./Accounts.css";
import AddAccount from "./modals/AddAccount";
import { cur } from "../App";

function Accounts() {
    const [dept, setDept] = useState('');
    const selectRef = useRef(null);

    const selectChange = (e) => {
      cur.dept = e.target.value;
      console.log(cur.dept)
      setDept(e.target.value);
    }; // 

    return (

        <>
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
          <h1 class="h2 text-danger font-weight-bold">Dashboard <small class="text-muted">Manage Accounts</small></h1>
        </div>
  
        <div class="d-flex align-items-center mb-3 justify-content-between">
          <div>
            <label for="role" class="font-weight-bold mr-2" >{(dept==='') ? "Choose Role" : dept}</label>
            <select id="role" class="form-control d-inline-block w-auto mr-3" name="roleelection" 
              ref={selectRef}
              onChange={selectChange}>
              <option value="">Choose here.</option>
              <option value="cics">CICS</option>
              <option value="cte">CTE</option>
              <option value="cas">CAS</option>
              <option value="cabe">CABE</option>
            </select>
          </div>
          
          <div>
            <input type="search" name="searchAccount" id="searchAccount" placeholder="Enter name here"/>
            <button class="btn btn-danger" type="button" data-toggle="modal" data-target=".bd-example-modal-lg">+ add</button>
          </div>
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
        <AddAccount />
        </>

    )
}



export default Accounts;