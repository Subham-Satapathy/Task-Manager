import React, {useEffect} from 'react';
import { Container, Button, Typography, Paper, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { AccountCircle, VpnKey } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/authUtils';


const Homepage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated()) {
          navigate('/dashboard'); // Redirect to tasks if token is present
        }
      }, [navigate]);


    return (
        <Container component="main" maxWidth="xs" style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Paper elevation={6} style={{ padding: '85px', borderRadius: '15px', textAlign: 'center', background: 'white' }}>
                <Typography variant="h4" gutterBottom style={{ fontWeight: 600, color: '#333' }}>
                    Welcome
                </Typography>
                <Typography variant="body1" style={{ marginBottom: '20px', color: '#555' }}>
                    Manage your tasks efficiently.
                </Typography>
                <Box marginBottom={2}>
                    <Link to="/signup" style={{ textDecoration: 'none' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            style={{
                                marginBottom: '10px',
                                borderRadius: '25px',
                                backgroundColor: '#4caf50',
                                transition: '0.3s',
                                fontWeight: 600,
                            }}
                            startIcon={<AccountCircle />}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#45a049'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#4caf50'; }}
                        >
                            Sign Up
                        </Button>
                    </Link>
                </Box>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        style={{
                            borderRadius: '25px',
                            backgroundColor: '#2196f3',
                            transition: '0.3s',
                            fontWeight: 600,
                        }}
                        startIcon={<VpnKey />}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1e88e5'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#2196f3'; }}
                    >
                        Login
                    </Button>
                </Link>
            </Paper>
        </Container>
    );
};

export default Homepage;
