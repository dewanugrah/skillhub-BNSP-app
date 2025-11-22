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
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">
          Daftar Peserta
        </Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpenModal()}>
          Tambah Peserta
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Link component={RouterLink} to={`/participants/${participant.id}`} underline="hover">
                    {participant.name}
                  </Link>
                </TableCell>
                <TableCell>{participant.email}</TableCell>
                <TableCell>{participant.phoneNumber}</TableCell>
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
        <Alert severity="info" sx={{ mt: 2 }}>
          Tidak ada data peserta.
        </Alert>
      )}

      <Dialog open={isModalOpen} onClose={handleCloseModal}>
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