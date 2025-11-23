# SkillHub Backend

Backend API untuk sistem manajemen studio kursus keterampilan SkillHub menggunakan NestJS, TypeScript, dan Prisma ORM.

## Deskripsi Proyek

SkillHub Backend adalah REST API yang menyediakan endpoint untuk mengelola:
- **Peserta (Participants)**: Data peserta yang mendaftar kursus
- **Kelas (Classes)**: Data kelas pelatihan yang tersedia
- **Enrollment**: Pendaftaran peserta ke kelas (relasi many-to-many)

## Teknologi yang Digunakan

- **Framework**: NestJS 11.0.1
- **Language**: TypeScript 5.7.3
- **Database**: MySQL
- **ORM**: Prisma 5.22.0
- **Validation**: class-validator 0.14.2
- **Testing**: Jest 30.0.0

## Arsitektur

Project menggunakan arsitektur modular NestJS dengan struktur:

```
src/
├── participant/          # Module untuk manajemen peserta
│   ├── dto/             # Data Transfer Objects
│   ├── participant.controller.ts
│   ├── participant.service.ts
│   └── participant.module.ts
├── class/               # Module untuk manajemen kelas
│   ├── dto/
│   ├── class.controller.ts
│   ├── class.service.ts
│   └── class.module.ts
├── enrollment/          # Module untuk manajemen enrollment
│   ├── dto/
│   ├── enrollment.controller.ts
│   ├── enrollment.service.ts
│   └── enrollment.module.ts
├── prisma/              # Prisma service dan configuration
│   ├── prisma.service.ts
│   └── prisma.module.ts
├── app.module.ts        # Root module
└── main.ts              # Application entry point
```

## Instalasi

### Prerequisites

- Node.js (v18 atau lebih baru)
- MySQL Server
- npm atau yarn

### Langkah Instalasi

1. **Clone repository dan masuk ke direktori backend**
   ```bash
   cd skillhub-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup database**

   Buat file `.env` di root folder backend:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/skillhub"
   PORT=3000
   ```

   Sesuaikan `username`, `password`, dan nama database.

4. **Jalankan Prisma migrations**
   ```bash
   npx prisma migrate dev
   ```

5. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

## Menjalankan Aplikasi

### Development Mode
```bash
npm run start:dev
```
Server akan berjalan di `http://localhost:3000`

### Production Mode
```bash
npm run build
npm run start:prod
```

### Watch Mode (Auto-reload)
```bash
npm run start:dev
```

## API Endpoints

### Participants (Peserta)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/participants` | Mengambil semua peserta |
| GET | `/participants/:id` | Mengambil detail peserta by ID |
| POST | `/participants` | Membuat peserta baru |
| PATCH | `/participants/:id` | Update data peserta |
| DELETE | `/participants/:id` | Hapus peserta |

**Request Body (POST/PATCH)**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "08123456789",
  "address": "Jl. Example No. 123"
}
```

### Classes (Kelas)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/classes` | Mengambil semua kelas |
| GET | `/classes/:id` | Mengambil detail kelas by ID |
| POST | `/classes` | Membuat kelas baru |
| PATCH | `/classes/:id` | Update data kelas |
| DELETE | `/classes/:id` | Hapus kelas |

**Request Body (POST/PATCH)**:
```json
{
  "className": "Desain Grafis",
  "description": "Belajar desain grafis dari dasar",
  "instructor": "Jane Smith"
}
```

### Enrollments (Pendaftaran)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/enrollments` | Mengambil semua enrollment |
| GET | `/enrollments/participant/:id` | Kelas yang diikuti peserta |
| GET | `/enrollments/class/:id` | Peserta yang terdaftar di kelas |
| POST | `/enrollments` | Daftarkan peserta ke kelas |
| DELETE | `/enrollments/:id` | Batalkan pendaftaran |

**Request Body (POST)**:
```json
{
  "participantId": 1,
  "classId": 2
}
```

## Database Schema

### Participant Model
```prisma
model Participant {
  id          Int      @id @default(autoincrement())
  name        String
  email       String   @unique
  phoneNumber String?
  address     String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  enrollments Enrollment[]
}
```

### Class Model
```prisma
model Class {
  id          Int      @id @default(autoincrement())
  className   String
  description String?
  instructor  String
  createdAt   DateTime @default(now())
  enrollments Enrollment[]
}
```

### Enrollment Model
```prisma
model Enrollment {
  id             Int      @id @default(autoincrement())
  participantId  Int
  classId        Int
  enrollmentDate DateTime @default(now())
  participant    Participant @relation(fields: [participantId], references: [id], onDelete: Cascade)
  class          Class @relation(fields: [classId], references: [id], onDelete: Cascade)
}
```

## Fitur Validasi

### Participant DTO
- `name`: Required, string
- `email`: Required, valid email format
- `phoneNumber`: Optional, string
- `address`: Optional, string

### Class DTO
- `className`: Required, string
- `description`: Optional, string
- `instructor`: Required, string

### Enrollment DTO
- `participantId`: Required, integer
- `classId`: Required, integer
- **Duplicate Prevention**: Sistem otomatis mencegah pendaftaran ganda

## Testing

Proyek ini memiliki comprehensive unit tests dengan **58 test cases** dan **66% code coverage**.

### Unit Tests

Semua services memiliki unit tests lengkap:

**ParticipantService Tests** (15 test cases)
```bash
npm test -- participant.service.spec
```
- ✅ CRUD operations (create, read, update, delete)
- ✅ findAll with enrollments
- ✅ findOne with nested relations
- ✅ Error handling (database errors, not found)
- ✅ Optional fields validation
- ✅ Cascade delete behavior

**ClassService Tests** (18 test cases)
```bash
npm test -- class.service.spec
```
- ✅ CRUD operations complete
- ✅ Optional description field
- ✅ Multiple class types
- ✅ Partial updates
- ✅ Error handling
- ✅ Constraint violations

**EnrollmentService Tests** (20 test cases)
```bash
npm test -- enrollment.service.spec
```
- ✅ Create with duplicate prevention
- ✅ ConflictException on duplicates
- ✅ findAll with relations
- ✅ findEnrollmentsByParticipant
- ✅ findEnrollmentsByClass
- ✅ Delete and re-enrollment
- ✅ Business logic validation

### Run All Tests
```bash
npm test
```

Output:
```
Test Suites: 8 passed, 8 total
Tests:       58 passed, 58 total
Snapshots:   0 total
```

### Test Coverage
```bash
npm test -- --coverage
```

Coverage Summary:
```
----------------------------|---------|----------|---------|---------|
File                        | % Stmts | % Branch | % Funcs | % Lines |
----------------------------|---------|----------|---------|---------|
All files                   |   65.9  |   73.07  |  58.53  |  66.21  |
 Services                   |    100  |   75-83  |   100   |   100   |
 Controllers                |   70-72 |    75    |  16.66  |  66-68  |
 DTOs                       |    100  |    100   |   100   |   100   |
----------------------------|---------|----------|---------|---------|
```

### Test Structure

```
src/
├── participant/
│   ├── participant.service.spec.ts    # 15 tests ✅
│   └── participant.controller.spec.ts
├── class/
│   ├── class.service.spec.ts         # 18 tests ✅
│   └── class.controller.spec.ts
├── enrollment/
│   ├── enrollment.service.spec.ts    # 20 tests ✅
│   └── enrollment.controller.spec.ts
└── prisma/
    └── prisma.service.spec.ts
```

### Testing Approach

- **Mocking**: PrismaService di-mock untuk menghindari database dependencies
- **Isolation**: Setiap test independent dan tidak bergantung satu sama lain
- **Coverage**: Mencakup happy path, edge cases, dan error scenarios
- **Business Logic**: Duplicate prevention, cascade deletes, relational queries

### E2E Tests
```bash
npm run test:e2e
```

### Watch Mode (Development)
```bash
npm test -- --watch
```

### Specific Test File
```bash
npm test -- <filename>
# Example:
npm test -- participant.service.spec
```

## Prisma Commands

### Membuka Prisma Studio (Database GUI)
```bash
npx prisma studio
```

### Membuat Migration Baru
```bash
npx prisma migrate dev --name migration_name
```

### Reset Database
```bash
npx prisma migrate reset
```

## CORS Configuration

CORS sudah di-enable untuk frontend development. Konfigurasi ada di `main.ts`:
```typescript
app.enableCors();
```

## Environment Variables

Buat file `.env` dengan variabel berikut:
```env
DATABASE_URL="mysql://username:password@localhost:3306/skillhub"
PORT=3000
```

## Best Practices yang Diimplementasikan

1. **Modular Architecture**: Setiap entity punya module terpisah
2. **Dependency Injection**: Menggunakan NestJS DI container
3. **DTO Validation**: Validasi otomatis dengan class-validator
4. **Service Layer**: Business logic terpisah dari controller
5. **Prisma ORM**: Type-safe database access
6. **Error Handling**: Proper exception handling (ConflictException, dll)
7. **TypeScript**: Full type safety
8. **Documentation**: JSDoc comments pada semua functions

## Troubleshooting

### Database Connection Error
- Pastikan MySQL server running
- Cek kredensial di `.env`
- Verifikasi database sudah dibuat

### Prisma Client Error
```bash
npx prisma generate
```

### Port Already in Use
Ubah PORT di `.env` atau kill process yang menggunakan port 3000

## License

MIT
