import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <>
        <div className="container text-center d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', color: 'white', backgroundColor: 'maroon' }}>
        <div className="row w-100">
            <div className="col-12 mb-4">
            <h2 style={{ color: 'white' }}>Lost? Choose Where to Go:</h2>
            </div>
            <div className="col-12 col-md-6 mb-3">
            <Link to="/admin/login" className="btn btn-light" style={{ width: '100%', padding: '10px 0', fontSize: '1.2rem' }}>
                To Admin Login
            </Link>
            </div>
            <div className="col-12 col-md-6">
            <Link to="/user/login" className="btn btn-light" style={{ width: '100%', padding: '10px 0', fontSize: '1.2rem' }}>
                To User Login
            </Link>
            </div>
        </div>
        </div>


            
        </>
    );
}