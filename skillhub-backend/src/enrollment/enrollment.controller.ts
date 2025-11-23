import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
  create(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    return this.enrollmentService.create(createEnrollmentDto);
  }

  @Get()
  findAll() {
    return this.enrollmentService.findAll();
  }

  @Get('participant/:participantId')
  findEnrollmentsByParticipant(@Param('participantId', ParseIntPipe) participantId: number) {
    return this.enrollmentService.findEnrollmentsByParticipant(participantId);
  }

  @Get('class/:classId')
  findEnrollmentsByClass(@Param('classId', ParseIntPipe) classId: number) {
    return this.enrollmentService.findEnrollmentsByClass(classId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.enrollmentService.remove(id);
  }
}

