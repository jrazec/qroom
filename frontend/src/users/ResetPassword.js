import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ResetPassword.css"; // Custom styles

function ResetPassword() {
  const { token } = useParams();  // Get the reset token from the URL
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_LOCALHOST}/api/user/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await response.json();
      if (data.status) {
        setSuccess(true);
        setError("");
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="reset-password-container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 w-50 shadow-sm">
        <h2 className="text-center mb-4">Reset Your Password</h2>
        {success ? (
          <div className="text-center">
            <h3>Password reset successfully!</h3>
            <p>You can now <a href="/user/login">login</a> with your new password.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label>New Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter new password"
              />
            </div>
            <div className="form-group mb-3">
              <label>Confirm Password</label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm new password"
              />
            </div>

            {error && <p className="text-danger">{error}</p>}

            <button type="submit" className="btn btn-primary w-100">Reset Password</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
