// src/pages/ClassListPage.tsx
import { useState, useEffect } from 'react';
import {
  getClasses,
  deleteClass,
  createClass,
  updateClass,
} from '../services/classService';
import type { ClassCreationData } from '../services/classService';
import { Link as RouterLink } from 'react-router-dom';
import type { Class } from '../types/class';
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
  Link,
  Stack,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ClassForm from '../components/ClassForm';
import ErrorDisplay from '../components/ErrorDisplay';

const ClassListPage = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const data = await getClasses();
      setClasses(data);
    } catch (err) {
      setError('Gagal mengambil data kelas. Pastikan backend berjalan.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kelas ini?')) {
      try {
        await deleteClass(id);
        setClasses(classes.filter((c) => c.id !== id));
      } catch (err) {
        setError('Gagal menghapus kelas.');
        console.error(err);
      }
    }
  };

  const handleOpenModal = (classToEdit: Class | null = null) => {
    setEditingClass(classToEdit);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClass(null);
  };

  const handleSave = async (data: ClassCreationData) => {
    try {
      if (editingClass) {
        // Update existing class
        const updated = await updateClass(editingClass.id, data);
        setClasses(classes.map((c) => (c.id === updated.id ? updated : c)));
      } else {
        // Create new class
        const newClass = await createClass(data);
        setClasses([...classes, newClass]);
      }
      handleCloseModal();
    } catch (err) {
      setError('Gagal menyimpan kelas.');
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
        <ErrorDisplay message={error} onRetry={fetchClasses} />
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
              Kelas Pelatihan
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Pantau sesi pelatihan dan kelola detail instruktur serta deskripsinya.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Chip label={`${classes.length || 0} kelas aktif`} color="primary" variant="outlined" />
            </Stack>
          </Box>
          <Button variant="contained" color="primary" onClick={() => handleOpenModal()} size="large">
            Tambah Kelas
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 700 }} aria-label="daftar kelas">
            <TableHead>
              <TableRow>
                <TableCell>Nama Kelas</TableCell>
                <TableCell>Instruktur</TableCell>
                <TableCell>Deskripsi</TableCell>
                <TableCell align="right">Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {classes.map((singleClass) => (
                <TableRow
                  key={singleClass.id}
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>
                    <Link component={RouterLink} to={`/classes/${singleClass.id}`} underline="hover">
                      {singleClass.className}
                    </Link>
                  </TableCell>
                  <TableCell>{singleClass.instructor}</TableCell>
                  <TableCell>{singleClass.description || '-'}</TableCell>
                  <TableCell align="right">
                    <IconButton aria-label="edit" onClick={() => handleOpenModal(singleClass)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={() => handleDelete(singleClass.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {classes.length === 0 && !loading && (
          <Alert severity="info" sx={{ m: 2 }}>
            Tidak ada data kelas. Mulai dengan menambah kelas baru.
          </Alert>
        )}
      </Paper>

      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>{editingClass ? 'Edit Kelas' : 'Tambah Kelas Baru'}</DialogTitle>
        <DialogContent>
          <ClassForm
            onSubmit={handleSave}
            onCancel={handleCloseModal}
            defaultValues={editingClass || {}}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ClassListPage;
