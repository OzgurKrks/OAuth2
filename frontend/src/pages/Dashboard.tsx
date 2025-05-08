import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  AppBar,
  Toolbar,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Welcome, {user?.name}!
          </Typography>
          <Typography variant="body1" paragraph>
            Email: {user?.email}
          </Typography>
          <Typography variant="body1">
            You are now logged in to your account.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Dashboard;
