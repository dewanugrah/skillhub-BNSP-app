// src/components/EnrollmentForm.tsx
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Button, MenuItem, Select, InputLabel, FormControl, CircularProgress, Alert } from '@mui/material';
import type { EnrollmentCreationData } from '../services/enrollmentService';
import { getParticipants } from '../services/participantService';
import { getClasses } from '../services/classService';
import type { Participant } from '../types/participant';
import type { Class } from '../types/class';

// Define the validation schema using Zod
const enrollmentSchema = z.object({
  participantId: z.number({ invalid_type_error: 'Pilih Peserta' }).int().positive({ message: 'Pilih Peserta' }),
  classId: z.number({ invalid_type_error: 'Pilih Kelas' }).int().positive({ message: 'Pilih Kelas' }),
});

interface EnrollmentFormProps {
  onSubmit: (data: EnrollmentCreationData) => void;
  onCancel: () => void;
}

const EnrollmentForm = ({ onSubmit, onCancel }: EnrollmentFormProps) => {
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm<EnrollmentCreationData>({
    resolver: zodResolver(enrollmentSchema),
  });

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [fetchedParticipants, fetchedClasses] = await Promise.all([
          getParticipants(),
          getClasses(),
        ]);
        setParticipants(fetchedParticipants);
        setClasses(fetchedClasses);
      } catch (err) {
        setError('Gagal memuat daftar peserta atau kelas.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ mt: 1 }}
    >
      <FormControl fullWidth margin="normal" error={!!errors.participantId}>
        <InputLabel id="participant-label">Peserta</InputLabel>
        <Select
          labelId="participant-label"
          id="participantId"
          label="Peserta"
          {...register('participantId', { valueAsNumber: true })}
          defaultValue="" // Important for uncontrolled component and select
        >
          {participants.map((participant) => (
            <MenuItem key={participant.id} value={participant.id}>
              {participant.name} ({participant.email})
            </MenuItem>
          ))}
        </Select>
        {errors.participantId && <p style={{ color: 'red' }}>{errors.participantId?.message}</p>}
      </FormControl>

      <FormControl fullWidth margin="normal" error={!!errors.classId}>
        <InputLabel id="class-label">Kelas</InputLabel>
        <Select
          labelId="class-label"
          id="classId"
          label="Kelas"
          {...register('classId', { valueAsNumber: true })}
          defaultValue="" // Important for uncontrolled component and select
        >
          {classes.map((singleClass) => (
            <MenuItem key={singleClass.id} value={singleClass.id}>
              {singleClass.className} (Oleh: {singleClass.instructor})
            </MenuItem>
          ))}
        </Select>
        {errors.classId && <p style={{ color: 'red' }}>{errors.classId?.message}</p>}
      </FormControl>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button onClick={onCancel} sx={{ mr: 1 }}>
          Batal
        </Button>
        <Button type="submit" variant="contained">
          Simpan Pendaftaran
        </Button>
      </Box>
    </Box>
  );
};

export default EnrollmentForm;
