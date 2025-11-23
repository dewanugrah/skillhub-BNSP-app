// src/pages/EnrollmentListPage.tsx
import { useState, useEffect } from 'react';
import {
  getEnrollments,
  createEnrollment,
  deleteEnrollment,
} from '../services/enrollmentService';
import type { EnrollmentCreationData } from '../services/enrollmentService';
import type { Enrollment } from '../types/enrollment';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Chip,
  Link,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EnrollmentForm from '../components/EnrollmentForm';
import ErrorDisplay from '../components/ErrorDisplay';

const EnrollmentListPage = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const data = await getEnrollments();
      setEnrollments(data);
    } catch (err) {
      setError('Gagal mengambil data pendaftaran. Pastikan backend berjalan.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pendaftaran ini?')) {
      try {
        await deleteEnrollment(id);
        setEnrollments(enrollments.filter((e) => e.id !== id));
      } catch (err) {
        setError('Gagal menghapus pendaftaran.');
        console.error(err);
      }
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async (data: EnrollmentCreationData) => {
    try {
      await createEnrollment(data);
      // To get full participant and class details, re-fetch or enrich data
      // For simplicity, re-fetch all enrollments after adding
      fetchEnrollments();
      handleCloseModal();
    } catch (err) {
      setError('Gagal menyimpan pendaftaran baru. Mungkin sudah terdaftar atau data tidak valid.');
      console.error(err);
    }
  };

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
        <ErrorDisplay message={error} onRetry={fetchEnrollments} />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 2, mb: 6 }}>
      <Paper
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, rgba(15,118,110,0.12), rgba(245,158,11,0.12))',
          border: '1px solid rgba(15,118,110,0.14)',
        }}
        elevation={0}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start">
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Pendaftaran Kelas
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Lihat siapa mengikuti kelas apa, kelola pendaftaran, dan batalkan jika perlu.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Chip label={`${enrollments.length || 0} pendaftaran`} color="primary" variant="outlined" />
            </Stack>
          </Box>
          <Button variant="contained" color="primary" onClick={handleOpenModal} size="large">
            Tambah Pendaftaran
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 700 }} aria-label="simple enrollment table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Peserta</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Nama Kelas</TableCell>
                <TableCell>Instruktur</TableCell>
                <TableCell>Tanggal Pendaftaran</TableCell>
                <TableCell align="right">Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {enrollments.map((enrollment) => (
                <TableRow
                  key={enrollment.id}
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{enrollment.id}</TableCell>
                  <TableCell>
                    <Link
                      component={RouterLink}
                      to={`/participants/${enrollment.participant.id}`}
                      underline="hover"
                    >
                      {enrollment.participant.name}
                    </Link>
                  </TableCell>
                  <TableCell>{enrollment.participant.email}</TableCell>
                  <TableCell>
                    <Link
                      component={RouterLink}
                      to={`/classes/${enrollment.class.id}`}
                      underline="hover"
                    >
                      {enrollment.class.className}
                    </Link>
                  </TableCell>
                  <TableCell>{enrollment.class.instructor}</TableCell>
                  <TableCell>{new Date(enrollment.enrollmentDate).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <IconButton aria-label="delete" onClick={() => handleDelete(enrollment.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {enrollments.length === 0 && !loading && (
          <Alert severity="info" sx={{ m: 2 }}>
            Tidak ada data pendaftaran.
          </Alert>
        )}
      </Paper>

      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>Tambah Pendaftaran Baru</DialogTitle>
        <DialogContent>
          <EnrollmentForm onSubmit={handleSave} onCancel={handleCloseModal} />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default EnrollmentListPage;
