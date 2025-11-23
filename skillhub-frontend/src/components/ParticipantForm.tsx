/**
 * Form component untuk membuat dan mengedit data peserta
 * Menggunakan React Hook Form dengan Zod validation
 */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, TextField, Button } from '@mui/material';
import type { ParticipantCreationData } from '../services/participantService';

/**
 * Zod schema untuk validasi form peserta
 * Validasi dilakukan di client-side sebelum submit ke backend
 */
const participantSchema = z.object({
  name: z.string().min(1, { message: 'Nama tidak boleh kosong' }),
  email: z.string().email({ message: 'Format email tidak valid' }),
  phoneNumber: z.union([
    z.string().regex(/^\d+$/, { message: 'Nomor telepon hanya boleh berisi angka' }),
    z.literal('')
  ]).optional(),
  address: z.string().optional(),
});

/**
 * Props untuk ParticipantForm component
 */
interface ParticipantFormProps {
  /** Callback function yang dipanggil saat form di-submit */
  onSubmit: (data: ParticipantCreationData) => void;
  /** Callback function yang dipanggil saat user cancel */
  onCancel: () => void;
  /** Default values untuk edit mode (opsional) */
  defaultValues?: Partial<ParticipantCreationData>;
}

const ParticipantForm = ({ onSubmit, onCancel, defaultValues }: ParticipantFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ParticipantCreationData>({
    resolver: zodResolver(participantSchema),
    defaultValues: defaultValues,
  });

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}
    >
      <TextField
        margin="normal"
        required
        fullWidth
        id="name"
        label="Nama Lengkap"
        autoFocus
        {...register('name')}
        error={!!errors.name}
        helperText={errors.name?.message}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Alamat Email"
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <TextField
        margin="normal"
        fullWidth
        id="phoneNumber"
        label="Nomor Telepon"
        {...register('phoneNumber')}
        error={!!errors.phoneNumber}
        helperText={errors.phoneNumber?.message}
      />
      <TextField
        margin="normal"
        fullWidth
        id="address"
        label="Alamat"
        {...register('address')}
        error={!!errors.address}
        helperText={errors.address?.message}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button onClick={onCancel} sx={{ mr: 1 }}>
          Batal
        </Button>
        <Button type="submit" variant="contained">
          Simpan
        </Button>
      </Box>
    </Box>
  );
};

export default ParticipantForm;
