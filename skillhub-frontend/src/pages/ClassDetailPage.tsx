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
  Paper,
  Link,
} from '@mui/material';
import { getClassById } from '../services/classService';
import { findEnrollmentsByClass } from '../services/enrollmentService';
import type { Class } from '../types/class';
import type { Enrollment } from '../types/enrollment';
import ErrorDisplay from '../components/ErrorDisplay';

const ClassDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [classData, setClassData] = useState<Class | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
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
    <Container sx={{ mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            {classData.className}
          </Typography>
          <Typography variant="body1">
            <strong>Instruktur:</strong> {classData.instructor}
          </Typography>
          <Typography variant="body1">
            <strong>Deskripsi:</strong> {classData.description || 'N/A'}
          </Typography>
          <Typography variant="body1">
            <strong>Dibuat pada:</strong> {new Date(classData.createdAt).toLocaleDateString()}
          </Typography>
        </CardContent>
      </Card>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Peserta yang Terdaftar
        </Typography>
        {enrollments.length > 0 ? (
          <List component={Paper}>
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
