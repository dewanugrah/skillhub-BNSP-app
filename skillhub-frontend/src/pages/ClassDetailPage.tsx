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
  Paper,
  Link,
  Button,
  Stack,
  Grid,
  Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getClassById } from '../services/classService';
import { findEnrollmentsByClass } from '../services/enrollmentService';
import type { Class } from '../types/class';
import type { Enrollment } from '../types/enrollment';
import ErrorDisplay from '../components/ErrorDisplay';

const ClassDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [classData, setClassData] = useState<Class | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const classId = parseInt(id, 10);
      const [fetchedClass, fetchedEnrollments] = await Promise.all([
        getClassById(classId),
        findEnrollmentsByClass(classId),
      ]);
      setClassData(fetchedClass);
      setEnrollments(fetchedEnrollments);
    } catch (err) {
      setError('Gagal memuat data detail kelas.');
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
        <ErrorDisplay message="Gagal memuat data detail kelas." onRetry={fetchData} />
      </Container>
    );
  }

  if (!classData) {
    return (
      <Container>
        <Alert severity="warning" sx={{ mt: 4 }}>
          Kelas tidak ditemukan.
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
            Detail Kelas
          </Typography>
          <Typography color="text.secondary">
            Informasi lengkap kelas dan peserta yang terdaftar.
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
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="flex-start">
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {classData.className}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip label={`Instruktur: ${classData.instructor}`} color="primary" variant="outlined" />
              <Chip label={`${enrollments.length} peserta terdaftar`} color="secondary" variant="filled" />
            </Stack>
          </Box>
          <Box sx={{ minWidth: 140, textAlign: { xs: 'left', sm: 'right' } }}>
            <Typography variant="body2" color="text.secondary">
              Dibuat
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(classData.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Stack>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              Deskripsi
            </Typography>
            <Typography variant="body1">{classData.description || 'Belum ada deskripsi'}</Typography>
          </Grid>
        </Grid>
      </Card>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Peserta yang Terdaftar
        </Typography>
        {enrollments.length > 0 ? (
          <List component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            {enrollments.map((enrollment, index) => (
              <Box key={enrollment.id}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Link component={RouterLink} to={`/participants/${enrollment.participant.id}`} underline="hover">
                        {enrollment.participant.name}
                      </Link>
                    }
                    secondary={enrollment.participant.email}
                  />
                </ListItem>
                {index < enrollments.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        ) : (
          <Typography>Belum ada peserta yang terdaftar di kelas ini.</Typography>
        )}
      </Box>
    </Container>
  );
};

export default ClassDetailPage;
