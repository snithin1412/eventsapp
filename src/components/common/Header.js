import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

function Header() {
  const user = localStorage.getItem('user')
  
  const handleLogout = () => {
    localStorage.clear();
    window.location.reload()
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{backgroundColor: "#3d3d3d"}}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {user && "Welcome"}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>{user && "Logout"}</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;