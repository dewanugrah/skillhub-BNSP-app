// src/App.tsx
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  ThemeProvider,
  createTheme,
  Container,
  Divider,
} from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ParticipantListPage from './pages/ParticipantListPage';
import ClassListPage from './pages/ClassListPage';
import EnrollmentListPage from './pages/EnrollmentListPage';
import ParticipantDetailPage from './pages/ParticipantDetailPage';
import ClassDetailPage from './pages/ClassDetailPage';

const theme = createTheme({
  palette: {
    primary: { main: '#0f766e' },
    secondary: { main: '#f59e0b' },
    background: {
      default: '#f5f7fb',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: `'Space Grotesk', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif`,
    h4: { fontWeight: 600, letterSpacing: -0.4 },
    h5: { fontWeight: 600, letterSpacing: -0.2 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiTableHead: {
      styleOverrides: {
        root: { backgroundColor: '#f0f4f8' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 14, boxShadow: '0 18px 36px rgba(16, 36, 55, 0.08)' },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <CssBaseline />
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: 'transparent',
            color: 'primary.main',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(15,118,110,0.12)',
          }}
        >
          <Toolbar sx={{ py: 2 }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
              SkillHub
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button color="primary" component={Link} to="/participants" variant="text">
                Peserta
              </Button>
              <Button color="primary" component={Link} to="/classes" variant="text">
                Kelas
              </Button>
              <Button color="primary" component={Link} to="/enrollments" variant="text">
                Pendaftaran
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ mb: 3 }}>
            <Divider />
          </Box>
          <Routes>
            <Route path="/" element={<ParticipantListPage />} />
            <Route path="/participants" element={<ParticipantListPage />} />
            <Route path="/participants/:id" element={<ParticipantDetailPage />} />
            <Route path="/classes" element={<ClassListPage />} />
            <Route path="/classes/:id" element={<ClassDetailPage />} />
            <Route path="/enrollments" element={<EnrollmentListPage />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
