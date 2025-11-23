// src/components/ClassForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, TextField, Button } from '@mui/material';
import type { ClassCreationData } from '../services/classService';

// Define the validation schema using Zod
const classSchema = z.object({
  className: z.string().min(1, { message: 'Nama kelas tidak boleh kosong' }),
  description: z.string().optional(),
  instructor: z.string().min(1, { message: 'Nama instruktur tidak boleh kosong' }),
});

interface ClassFormProps {
  onSubmit: (data: ClassCreationData) => void;
  onCancel: () => void;
  defaultValues?: Partial<ClassCreationData>;
}

const ClassForm = ({ onSubmit, onCancel, defaultValues }: ClassFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClassCreationData>({
    resolver: zodResolver(classSchema),
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
        id="className"
        label="Nama Kelas"
        autoFocus
        {...register('className')}
        error={!!errors.className}
        helperText={errors.className?.message}
      />
      <TextField
        margin="normal"
        fullWidth
        id="description"
        label="Deskripsi"
        {...register('description')}
        error={!!errors.description}
        helperText={errors.description?.message}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="instructor"
        label="Nama Instruktur"
        {...register('instructor')}
        error={!!errors.instructor}
        helperText={errors.instructor?.message}
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

export default ClassForm;
