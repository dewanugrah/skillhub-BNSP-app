// src/pages/ParticipantListPage.tsx
import { useState, useEffect } from 'react';
import {
  getParticipants,
  deleteParticipant,
  createParticipant,
  updateParticipant,
} from '../services/participantService';
import type { ParticipantCreationData } from '../services/participantService';
import type { Participant } from '../types/participant';
import { Link as RouterLink } from 'react-router-dom';
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
import ParticipantForm from '../components/ParticipantForm';

const ParticipantListPage = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const data = await getParticipants();
      setParticipants(data);
    } catch (err) {
      setError('Gagal mengambil data peserta. Pastikan backend berjalan.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus peserta ini?')) {
      try {
        await deleteParticipant(id);
        setParticipants(participants.filter((p) => p.id !== id));
      } catch (err) {
        setError('Gagal menghapus peserta.');
        console.error(err);
      }
    }
  };

  const handleOpenModal = (participant: Participant | null = null) => {
    setEditingParticipant(participant);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingParticipant(null);
  };

  const handleSave = async (data: ParticipantCreationData) => {
    try {
      if (editingParticipant) {
        // Update existing participant
        const updated = await updateParticipant(editingParticipant.id, data);
        setParticipants(participants.map((p) => (p.id === updated.id ? updated : p)));
      } else {
        // Create new participant
        const newParticipant = await createParticipant(data);
        setParticipants([...participants, newParticipant]);
      }
      handleCloseModal();
    } catch (err) {
      setError('Gagal menyimpan peserta.');
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
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
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
              Peserta SkillHub
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Pantau seluruh peserta, buka detail mereka, dan kelola data dengan cepat.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Chip label={`${participants.length || 0} peserta terdaftar`} color="primary" variant="outlined" />
            </Stack>
          </Box>
          <Button variant="contained" color="primary" onClick={() => handleOpenModal()} size="large">
            Tambah Peserta
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 700 }} aria-label="daftar peserta">
            <TableHead>
              <TableRow>
                <TableCell>Nama</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Nomor Telepon</TableCell>
                <TableCell align="right">Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {participants.map((participant) => (
                <TableRow
                  key={participant.id}
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>
                    <Link component={RouterLink} to={`/participants/${participant.id}`} underline="hover">
                      {participant.name}
                    </Link>
                  </TableCell>
                  <TableCell>{participant.email}</TableCell>
                  <TableCell>{participant.phoneNumber || '-'}</TableCell>
                  <TableCell align="right">
                    <IconButton aria-label="edit" onClick={() => handleOpenModal(participant)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={() => handleDelete(participant.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {participants.length === 0 && !loading && (
          <Alert severity="info" sx={{ m: 2 }}>
            Tidak ada data peserta. Mulai dengan menambah peserta baru.
          </Alert>
        )}
      </Paper>

      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>{editingParticipant ? 'Edit Peserta' : 'Tambah Peserta Baru'}</DialogTitle>
        <DialogContent>
          <ParticipantForm
            onSubmit={handleSave}
            onCancel={handleCloseModal}
            defaultValues={editingParticipant || {}}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ParticipantListPage;
