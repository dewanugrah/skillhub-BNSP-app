# SkillHub Frontend

Frontend web application untuk sistem manajemen studio kursus keterampilan SkillHub menggunakan React, TypeScript, dan Material-UI.

## Deskripsi Proyek

SkillHub Frontend adalah aplikasi web yang menyediakan user interface untuk:
- **Manajemen Peserta**: Menambah, melihat, edit, dan hapus data peserta
- **Manajemen Kelas**: Menambah, melihat, edit, dan hapus data kelas pelatihan
- **Manajemen Enrollment**: Mendaftarkan peserta ke kelas dan melihat daftar pendaftaran

## Teknologi yang Digunakan

- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Language**: TypeScript 5.9.3
- **UI Library**: Material-UI (MUI) 7.3.5
- **Routing**: React Router v7.9.6
- **Form Management**: React Hook Form 7.66.1
- **Validation**: Zod 3.23.8
- **HTTP Client**: Axios 1.13.2
- **Styling**: Emotion 11.14.0 (CSS-in-JS)

## Struktur Folder

```
src/
├── pages/                    # Halaman-halaman aplikasi
│   ├── ParticipantListPage.tsx
│   ├── ParticipantDetailPage.tsx
│   ├── ClassListPage.tsx
│   ├── ClassDetailPage.tsx
│   └── EnrollmentListPage.tsx
├── components/               # Komponen reusable
│   ├── ParticipantForm.tsx
│   ├── ClassForm.tsx
│   ├── EnrollmentForm.tsx
│   └── ErrorDisplay.tsx
├── services/                 # API service layer
│   ├── participantService.ts
│   ├── classService.ts
│   └── enrollmentService.ts
├── types/                    # TypeScript type definitions
│   ├── participant.ts
│   ├── class.ts
│   └── enrollment.ts
├── App.tsx                   # Root component dengan routing
└── main.tsx                  # Application entry point
```

## Instalasi

### Prerequisites

- Node.js (v18 atau lebih baru)
- npm atau yarn
- SkillHub Backend harus sudah running di `http://localhost:3000`

### Langkah Instalasi

1. **Masuk ke direktori frontend**
   ```bash
   cd skillhub-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Pastikan backend sudah running**

   Backend harus berjalan di `http://localhost:3000`. Lihat README backend untuk cara menjalankan.

## Menjalankan Aplikasi

### Development Mode
```bash
npm run dev
```
Aplikasi akan berjalan di `http://localhost:5173`

### Build untuk Production
```bash
npm run build
```
Output akan ada di folder `dist/`

### Preview Production Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## Fitur Aplikasi

### 1. Manajemen Peserta

**Halaman Daftar Peserta** (`/participants`)
- Tabel dengan semua peserta
- Tombol tambah peserta baru
- Tombol edit dan hapus untuk setiap peserta
- Link ke halaman detail peserta

**Halaman Detail Peserta** (`/participants/:id`)
- Informasi lengkap peserta
- Daftar kelas yang diikuti
- Tombol kembali ke daftar

**Form Peserta**
- Field: Nama, Email, Nomor Telepon, Alamat
- Validasi real-time dengan Zod:
  - Nama: wajib diisi
  - Email: wajib diisi, format email valid
  - Nomor Telepon: opsional, hanya angka
  - Alamat: opsional

### 2. Manajemen Kelas

**Halaman Daftar Kelas** (`/classes`)
- Tabel dengan semua kelas
- Tombol tambah kelas baru
- Tombol edit dan hapus untuk setiap kelas
- Link ke halaman detail kelas

**Halaman Detail Kelas** (`/classes/:id`)
- Informasi lengkap kelas
- Daftar peserta yang terdaftar
- Tombol kembali ke daftar

**Form Kelas**
- Field: Nama Kelas, Deskripsi, Instruktur
- Validasi:
  - Nama Kelas: wajib diisi
  - Deskripsi: opsional
  - Instruktur: wajib diisi

### 3. Manajemen Enrollment

**Halaman Daftar Enrollment** (`/enrollments`)
- Tabel dengan semua pendaftaran
- Menampilkan nama peserta dan nama kelas
- Tombol tambah enrollment baru
- Tombol hapus untuk membatalkan pendaftaran

**Form Enrollment**
- Dropdown untuk memilih peserta
- Dropdown untuk memilih kelas
- Validasi duplikasi (backend akan reject jika sudah terdaftar)

## Routing

| Path | Component | Deskripsi |
|------|-----------|-----------|
| `/` | ParticipantListPage | Default page - daftar peserta |
| `/participants` | ParticipantListPage | Daftar semua peserta |
| `/participants/:id` | ParticipantDetailPage | Detail peserta |
| `/classes` | ClassListPage | Daftar semua kelas |
| `/classes/:id` | ClassDetailPage | Detail kelas |
| `/enrollments` | EnrollmentListPage | Daftar enrollment |

## Komponen Reusable

### ParticipantForm
Form untuk create/edit peserta dengan validasi Zod.

**Props:**
- `onSubmit`: Callback saat form di-submit
- `onCancel`: Callback saat user cancel
- `defaultValues`: Data awal untuk edit mode (optional)

### ClassForm
Form untuk create/edit kelas dengan validasi Zod.

**Props:**
- `onSubmit`: Callback saat form di-submit
- `onCancel`: Callback saat user cancel
- `defaultValues`: Data awal untuk edit mode (optional)

### EnrollmentForm
Form untuk mendaftarkan peserta ke kelas.

**Props:**
- `onSubmit`: Callback saat form di-submit
- `onCancel`: Callback saat user cancel
- `participants`: Daftar peserta untuk dropdown
- `classes`: Daftar kelas untuk dropdown

### ErrorDisplay
Komponen untuk menampilkan error dengan UI yang user-friendly.

**Props:**
- `error`: Error object atau message string
- `onRetry`: Callback untuk retry action (optional)
- `onBack`: Callback untuk kembali (optional)

## Services (API Integration)

### participantService.ts

Menyediakan functions untuk komunikasi dengan backend API peserta:

- `getParticipants()`: Ambil semua peserta
- `getParticipantById(id)`: Ambil detail peserta
- `createParticipant(data)`: Buat peserta baru
- `updateParticipant(id, data)`: Update data peserta
- `deleteParticipant(id)`: Hapus peserta

### classService.ts

Menyediakan functions untuk komunikasi dengan backend API kelas:

- `getClasses()`: Ambil semua kelas
- `getClassById(id)`: Ambil detail kelas
- `createClass(data)`: Buat kelas baru
- `updateClass(id, data)`: Update data kelas
- `deleteClass(id)`: Hapus kelas

### enrollmentService.ts

Menyediakan functions untuk komunikasi dengan backend API enrollment:

- `getEnrollments()`: Ambil semua enrollment
- `createEnrollment(data)`: Buat enrollment baru
- `deleteEnrollment(id)`: Hapus enrollment
- `findEnrollmentsByClass(classId)`: Ambil peserta di kelas tertentu
- `findEnrollmentsByParticipant(participantId)`: Ambil kelas yang diikuti peserta

## Type Definitions

### Participant
```typescript
interface Participant {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
  enrollments?: Enrollment[];
}
```

### Class
```typescript
interface Class {
  id: number;
  className: string;
  description?: string;
  instructor: string;
  createdAt: string;
  enrollments?: Enrollment[];
}
```

### Enrollment
```typescript
interface Enrollment {
  id: number;
  participantId: number;
  classId: number;
  enrollmentDate: string;
  participant: Participant;
  class: Class;
}
```

## Error Handling

Aplikasi menggunakan try-catch blocks untuk semua async operations:

```typescript
try {
  const data = await getParticipants();
  // handle success
} catch (err) {
  setError(err);
  // display error with ErrorDisplay component
}
```

Error akan ditampilkan menggunakan komponen `ErrorDisplay` yang menyediakan:
- Pesan error yang user-friendly
- Tombol retry untuk mencoba lagi
- Tombol back untuk kembali

## Styling

Aplikasi menggunakan Material-UI (MUI) untuk komponen UI dengan theme default. Styling tambahan menggunakan:
- MUI `sx` prop untuk inline styling
- Emotion CSS-in-JS
- Responsive design dengan MUI Grid system

## Best Practices yang Diimplementasikan

1. **Component-Based Architecture**: Komponen reusable dan modular
2. **Type Safety**: Full TypeScript dengan strict mode
3. **Form Validation**: Client-side validation dengan Zod
4. **Service Layer**: API calls terpisah dari components
5. **Error Handling**: Comprehensive error handling dengan user feedback
6. **React Hooks**: useState, useEffect, useCallback, useNavigate
7. **Code Documentation**: JSDoc comments pada semua functions
8. **Separation of Concerns**: Pages, Components, Services terpisah

## Configuration

### API Base URL

Semua services menggunakan `http://localhost:3000` sebagai base URL. Untuk mengubah:

Edit file di `src/services/`:
```typescript
const API_URL = 'http://your-api-url/participants';
```

Atau buat environment variable dengan Vite:
```
VITE_API_URL=http://your-api-url
```

## Troubleshooting

### CORS Error
- Pastikan backend sudah enable CORS
- Cek backend running di port yang benar (3000)

### API Connection Error
- Pastikan backend sudah running
- Cek API URL di services
- Buka browser console untuk melihat error detail

### Build Error
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Type Errors
```bash
npm run build
```
TypeScript akan menampilkan error yang harus diperbaiki

## Development Tips

### Hot Module Replacement (HMR)
Vite menyediakan HMR yang sangat cepat. Perubahan akan langsung terlihat tanpa full reload.

### React Developer Tools
Install React DevTools extension untuk debugging:
- Chrome: React Developer Tools
- Firefox: React Developer Tools

### TypeScript Strict Mode
Project menggunakan strict mode. Pastikan semua types terdefinisi dengan benar.

## License

MIT
