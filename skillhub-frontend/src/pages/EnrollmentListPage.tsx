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
} from '@mui/material';
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
      const newEnrollment = await createEnrollment(data);
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
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">
          Daftar Pendaftaran
        </Typography>
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          Tambah Pendaftaran
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple enrollment table">
          <TableHead>
            <TableRow>
              <TableCell>ID Pendaftaran</TableCell>
              <TableCell>Nama Peserta</TableCell>
              <TableCell>Email Peserta</TableCell>
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
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{enrollment.id}</TableCell>
                <TableCell>{enrollment.participant.name}</TableCell>
                <TableCell>{enrollment.participant.email}</TableCell>
                <TableCell>{enrollment.class.className}</TableCell>
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
        <Alert severity="info" sx={{ mt: 2 }}>
          Tidak ada data pendaftaran.
        </Alert>
      )}

      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>Tambah Pendaftaran Baru</DialogTitle>
        <DialogContent>
          <EnrollmentForm onSubmit={handleSave} onCancel={handleCloseModal} />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default EnrollmentListPage;