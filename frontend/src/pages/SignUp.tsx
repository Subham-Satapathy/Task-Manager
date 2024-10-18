import React, { useState, useEffect } from 'react';
import { Container, Button, Typography, Paper, Box, TextField, Grid, Snackbar } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { SnackbarCloseReason } from '@mui/material'; // Import SnackbarCloseReason
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { isAuthenticated } from '../utils/authUtils';


const SignUp: React.FC = () => {
    const [name, setname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false); // State for Snackbar
    const [snackbarMessage, setSnackbarMessage] = useState(''); // State for Snackbar message

    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        if (isAuthenticated()) {
          navigate('/dashboard'); // Redirect to tasks if token is present
        }
      }, [navigate]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log('Form submitted'); // Debugging log

        // Basic validation
        if (!name || !email || !password) {
            setError('All fields are required');
            return;
        }

        try {
            // Send the sign-up data to your backend API
            const response = await fetch('http://localhost:5001/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            if (response.status === 409) {
                // User already exists
                throw new Error('User already exists');
            } else if (response.status === 400) {
                // Invalid data
                throw new Error('Invalid data provided');
            } else if (!response.ok) {
                // General error for other statuses
                throw new Error('Sign-up failed');
            }

            // Handle successful sign-up
            setSnackbarMessage(`Sign-up successful! Welcome ${name}!`); // Set success message
            setOpenSnackbar(true); // Open Snackbar

            // Reset form fields
            setname('');
            setEmail('');
            setPassword('');
            setError(''); // Clear error if sign-up is successful

            // Redirect to login page after a delay
            setTimeout(() => {
                navigate('/login'); // Redirect to login page
            }, 2000); // Adjust the timeout as needed (2000ms = 2 seconds)

        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message); // Safely access the error message
            } else {
                setError('An unexpected error occurred');
            }
            console.error(error); // Log the error for debugging
        }
    };

    const handleSnackbarClose = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false); // Close Snackbar
    };

    return (
        <Container component="main" maxWidth="xs" style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Paper elevation={6} style={{ padding: '40px', borderRadius: '15px', textAlign: 'center', background: 'white', width: '100%' }}>
                <Typography 
                    variant="h4" 
                    gutterBottom 
                    sx={{ 
                        fontWeight: 600, 
                        color: '#333', 
                        fontSize: { xs: '1.5rem', sm: '2rem' } // Responsive font size
                    }}
                >
                    Sign Up
                </Typography>
                <Typography 
                    variant="body1" 
                    sx={{ 
                        marginBottom: '20px', 
                        color: '#555', 
                        fontSize: { xs: '0.875rem', sm: '1rem' } // Responsive font size
                    }}
                >
                    Create your account.
                </Typography>
                {error && (
                    <Typography variant="body2" color="error" style={{ marginBottom: '20px' }}>
                        {error}
                    </Typography>
                )}
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={2} marginBottom={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                label="Name"
                                margin="normal"
                                required
                                value={name}
                                onChange={(e) => setname(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                type="email"
                                label="Email"
                                margin="normal"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                type="password"
                                label="Password"
                                margin="normal"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        style={{
                            borderRadius: '25px',
                            backgroundColor: '#4caf50',
                            transition: '0.3s',
                            fontWeight: 600,
                        }}
                        startIcon={<AccountCircle />}
                        type="submit" // Ensure this is set to 'submit'
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#45a049'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#4caf50'; }}
                    >
                        Sign Up
                    </Button>
                </Box>

                {/* New Section for Login Link */}
                <Typography 
                    variant="body2" 
                    sx={{ 
                        marginTop: '20px', 
                        color: '#555', 
                        textAlign: 'center',
                        cursor: 'pointer'
                    }}
                    onClick={() => navigate('/login')} // Navigate to login page on click
                >
                    Already have an account? <strong style={{ color: '#4caf50' }}>Login here</strong>
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

export default SignUp;
