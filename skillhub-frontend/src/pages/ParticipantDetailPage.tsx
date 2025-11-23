// src/pages/ParticipantDetailPage.tsx
import { useState, useEffect, useCallback } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Link,
  Paper,
  Button,
  Stack,
  Grid,
  Chip,
  Avatar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getParticipantById } from '../services/participantService';
import { findEnrollmentsByParticipant } from '../services/enrollmentService';
import type { Participant } from '../types/participant';
import type { Enrollment } from '../types/enrollment';
import ErrorDisplay from '../components/ErrorDisplay';

const ParticipantDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null); // Reset error before refetch
      const participantId = parseInt(id, 10);
      const [fetchedParticipant, fetchedEnrollments] = await Promise.all([
        getParticipantById(participantId),
        findEnrollmentsByParticipant(participantId),
      ]);
      setParticipant(fetchedParticipant);
      setEnrollments(fetchedEnrollments);
    } catch (err) {
      setError('Gagal memuat data detail peserta.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorDisplay message={error} onRetry={fetchData} />
      </Container>
    );
  }

  if (!participant) {
    return (
      <Container>
        <Alert severity="warning" sx={{ mt: 4 }}>
          Peserta tidak ditemukan.
        </Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 2, mb: 6 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ alignSelf: 'flex-start' }}
        >
          Kembali
        </Button>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Detail Peserta
          </Typography>
          <Typography color="text.secondary">
            Profil singkat, kontak, dan kelas yang diikuti.
          </Typography>
        </Box>
      </Stack>

      <Card
        sx={{
          p: 3,
          border: '1px solid rgba(15,118,110,0.14)',
          background: 'linear-gradient(135deg, rgba(15,118,110,0.08), rgba(245,158,11,0.06))',
        }}
        elevation={0}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
          <Avatar sx={{ bgcolor: 'primary.main', width: 72, height: 72, fontSize: 28 }}>
            {participant.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {participant.name}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip label={participant.email} color="primary" variant="outlined" />
              <Chip label={participant.phoneNumber || 'Telepon: N/A'} variant="outlined" />
              <Chip label={`${enrollments.length} kelas diikuti`} color="secondary" variant="filled" />
            </Stack>
          </Box>
          <Box sx={{ minWidth: 140, textAlign: { xs: 'left', sm: 'right' } }}>
            <Typography variant="body2" color="text.secondary">
              Bergabung
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(participant.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Stack>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              Alamat
            </Typography>
            <Typography variant="body1">{participant.address || 'Belum diisi'}</Typography>
          </Grid>
        </Grid>
      </Card>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Kelas yang Diikuti
        </Typography>
        {enrollments.length > 0 ? (
          <List component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            {enrollments.map((enrollment, index) => (
              <Box key={enrollment.id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Link component={RouterLink} to={`/classes/${enrollment.class.id}`} underline="hover">
                        {enrollment.class.className}
                      </Link>
                    }
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.secondary">
                          Instruktur: {enrollment.class.instructor}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="text.secondary">
                          Terdaftar: {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {index < enrollments.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        ) : (
          <Typography>Peserta ini belum terdaftar di kelas manapun.</Typography>
        )}
      </Box>
    </Container>
  );
};

export default ParticipantDetailPage;
