import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ParticipantService } from './participant.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';

/**
 * Controller untuk endpoint API manajemen peserta
 * Base URL: /participants
 */
@Controller('participants')
export class ParticipantController {
  constructor(private readonly participantService: ParticipantService) {}

  /**
   * Endpoint untuk membuat peserta baru
   * @route POST /participants
   * @param createParticipantDto - Data peserta yang akan dibuat
   * @returns Data peserta yang berhasil dibuat
   */
  @Post()
  create(@Body() createParticipantDto: CreateParticipantDto) {
    // ValidationPipe akan otomatis memvalidasi DTO sesuai decorators
    return this.participantService.create(createParticipantDto);
  }

  /**
   * Endpoint untuk mengambil semua data peserta
   * @route GET /participants
   * @returns Array berisi semua peserta dengan enrollments
   */
  @Get()
  findAll() {
    return this.participantService.findAll();
  }

  /**
   * Endpoint untuk mengambil detail satu peserta berdasarkan ID
   * @route GET /participants/:id
   * @param id - ID peserta (akan di-parse menjadi integer)
   * @returns Data peserta dengan enrollments dan informasi kelas
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.participantService.findOne(id);
  }

  /**
   * Endpoint untuk mengupdate data peserta
   * @route PATCH /participants/:id
   * @param id - ID peserta yang akan diupdate
   * @param updateParticipantDto - Data yang akan diupdate (partial update)
   * @returns Data peserta yang telah diupdate
   */
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateParticipantDto: UpdateParticipantDto) {
    // ValidationPipe akan otomatis memvalidasi DTO sesuai decorators
    return this.participantService.update(id, updateParticipantDto);
  }

  /**
   * Endpoint untuk menghapus peserta
   * @route DELETE /participants/:id
   * @param id - ID peserta yang akan dihapus
   * @returns Data peserta yang telah dihapus
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.participantService.delete(id);
  }
}
