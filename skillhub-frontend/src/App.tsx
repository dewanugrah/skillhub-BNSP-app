// src/App.tsx
import { CssBaseline, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ParticipantListPage from './pages/ParticipantListPage';
import ClassListPage from './pages/ClassListPage';
import EnrollmentListPage from './pages/EnrollmentListPage';
import ParticipantDetailPage from './pages/ParticipantDetailPage';
import ClassDetailPage from './pages/ClassDetailPage';

function App() {
  return (
    <Router>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SkillHub
          </Typography>
          <Box>
            <Button color="inherit" component={Link} to="/participants">
              Peserta
            </Button>
            <Button color="inherit" component={Link} to="/classes">
              Kelas
            </Button>
            <Button color="inherit" component={Link} to="/enrollments">
              Pendaftaran
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<ParticipantListPage />} />
        <Route path="/participants" element={<ParticipantListPage />} />
        <Route path="/participants/:id" element={<ParticipantDetailPage />} /> {/* New route */}
        <Route path="/classes" element={<ClassListPage />} />
        <Route path="/classes/:id" element={<ClassDetailPage />} />
        <Route path="/enrollments" element={<EnrollmentListPage />} />
      </Routes>
    </Router>
  );
}

export default App;