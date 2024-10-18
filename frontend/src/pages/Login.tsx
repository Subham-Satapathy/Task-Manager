import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Typography,
  Paper,
  Box,
  TextField,
  Snackbar,
} from "@mui/material";
import { VpnKey } from "@mui/icons-material";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { SnackbarCloseReason } from "@mui/material"; // Import SnackbarCloseReason
import { isAuthenticated } from '../utils/authUtils';


const Login: React.FC = () => {
  const [email, setEmail] = useState(""); // State for email
  const [password, setPassword] = useState(""); // State for password
  const [error, setError] = useState(""); // State for error messages
  const [openSnackbar, setOpenSnackbar] = useState(false); // State for Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(""); // State for Snackbar message
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard'); // Redirect to tasks if token is present
    }
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Basic validation
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      // Send the login data to your backend API
      const response = await fetch("http://localhost:5001/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 401) {
        // Unauthorized - wrong credentials
        throw new Error("Invalid email or password");
      } else if (!response.ok) {
        // General error for other statuses
        throw new Error("Login failed");
      }

      // Handle successful login
      const data = await response.json(); // Assuming your API returns user data
      // Store the token in local storage
      localStorage.setItem("token", data.token);
      console.log("Login successful:"); // Debugging log

      // Set the snackbar message
      setSnackbarMessage(`Login successful! Welcome back!`);
      setOpenSnackbar(true); // Open Snackbar

      // Delay navigation to allow snackbar to display
      setTimeout(() => {
        navigate("/dashboard"); // Change this to the route you want to navigate to
      }, 2000); // Wait for 2 seconds (2000 ms) before navigating

      // Reset form fields
      setEmail("");
      setPassword("");
      setError(""); // Clear error if login is successful
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message); // Safely access the error message
      } else {
        setError("An unexpected error occurred");
      }
      console.error(error); // Log the error for debugging
    }
  };

  // Function to handle Snackbar close
  const handleSnackbarClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false); // Close Snackbar
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={6}
        style={{
          padding: "40px",
          borderRadius: "15px",
          textAlign: "center",
          background: "white",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          style={{ fontWeight: 600, color: "#333" }}
        >
          Login
        </Typography>
        <Typography
          variant="body1"
          style={{ marginBottom: "20px", color: "#555" }}
        >
          Access your account.
        </Typography>
        {error && (
          <Typography
            variant="body2"
            color="error"
            style={{ marginBottom: "20px" }}
          >
            {error}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            fullWidth
            type="email"
            label="Email"
            margin="normal"
            required
            value={email} // Controlled input
            onChange={(e) => setEmail(e.target.value)} // Update email state
          />
          <TextField
            variant="outlined"
            fullWidth
            type="password"
            label="Password"
            margin="normal"
            required
            value={password} // Controlled input
            onChange={(e) => setPassword(e.target.value)} // Update password state
          />
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            style={{
              borderRadius: "25px",
              backgroundColor: "#2196f3",
              transition: "0.3s",
              fontWeight: 600,
            }}
            startIcon={<VpnKey />}
            type="submit" // Ensure this is set to 'submit'
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#1e88e5";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#2196f3";
            }}
          >
            Login
          </Button>
        </Box>

        {/* New Section for Login Link */}
        <Typography
          variant="body2"
          sx={{
            marginTop: "20px",
            color: "#555",
            textAlign: "center",
            cursor: "pointer",
          }}
          onClick={() => navigate("/signup")} // Navigate to login page on click
        >
          Don't have an account?{" "}
          <strong style={{ color: "#4caf50" }}>Sign Up here</strong>
        </Typography>

        {/* Snackbar for success message */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
        />
      </Paper>
    </Container>
  );
};

export default Login;
