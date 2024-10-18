import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

// Custom Button styling for a modern look
const ModernButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  textTransform: 'none',  // Disable uppercase
  margin: '0 10px',  // Margin for spacing between buttons
  padding: '8px 16px',  // Add padding for a sleek look
  '&:hover': {
    backgroundColor: theme.palette.secondary.main,  // Add a hover effect
  },
}));

const NavBar: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [categories, setCategories] = useState<string[]>(['Home', 'Services', 'Contact', 'About']);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Handle logout logic
    console.log('Logging out...');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#333', boxShadow: '0px 4px 6px rgba(0,0,0,0.1)' }}>
      <Toolbar sx={{ justifyContent: 'space-between', padding: '0 24px' }}>
        {/* Menu icon for small screens */}
        <IconButton 
          edge="start" 
          color="inherit" 
          aria-label="menu" 
          onClick={handleMenuClick}
          sx={{ display: { xs: 'block', md: 'none' }, padding: '8px' }}
        >
          <MenuIcon />
        </IconButton>

        {/* App title (hidden on small screens) */}
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ flexGrow: 1, display: { xs: 'none', md: 'block' }, fontWeight: 'bold' }}
        >
          My Microservice App
        </Typography>

        {/* Navigation links for larger screens */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1, justifyContent: 'flex-start' }}>
          {categories.map((category, index) => (
            <ModernButton key={index} color="inherit">
              {category}
            </ModernButton>
          ))}
        </Box>

        {/* Authentication button */}
        {isAuthenticated ? (
          <ModernButton color="inherit" onClick={handleLogout}>
            Logout
          </ModernButton>
        ) : (
          <ModernButton color="inherit">
            Login
          </ModernButton>
        )}

        {/* Responsive Menu for smaller screens */}
        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
          MenuListProps={{ 'aria-labelledby': 'menu-button' }}
        >
          {categories.map((category, index) => (
            <MenuItem key={index} onClick={handleMenuClose}>
              {category}
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
