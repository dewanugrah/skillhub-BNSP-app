// src/pages/ParticipantDetailPage.tsx
import { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
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
} from '@mui/material';
import { getParticipantById } from '../services/participantService';
import { findEnrollmentsByParticipant } from '../services/enrollmentService';
import type { Participant } from '../types/participant';
import type { Enrollment } from '../types/enrollment';
import ErrorDisplay from '../components/ErrorDisplay';

const ParticipantDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
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
  };

  useEffect(() => {
    fetchData();
  }, [id]);

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
    <Container sx={{ mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            {participant.name}
          </Typography>
          <Typography variant="body1">
            <strong>Email:</strong> {participant.email}
          </Typography>
          <Typography variant="body1">
            <strong>Telepon:</strong> {participant.phoneNumber || 'N/A'}
          </Typography>
          <Typography variant="body1">
            <strong>Alamat:</strong> {participant.address || 'N/A'}
          </Typography>
          <Typography variant="body1">
            <strong>Bergabung pada:</strong> {new Date(participant.createdAt).toLocaleDateString()}
          </Typography>
        </CardContent>
      </Card>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Kelas yang Diikuti
        </Typography>
        {enrollments.length > 0 ? (
          <List component={Paper}>
            {enrollments.map((enrollment, index) => (
              <Box key={enrollment.id}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Link component={RouterLink} to={`/classes/${enrollment.class.id}`} underline="hover">
                        {enrollment.class.className}
                      </Link>
                    }
                    secondary={`Instruktur: ${enrollment.class.instructor}`}
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