import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ParticipantService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.participant.findMany({
      include: { enrollments: true },
    });
  }

  findOne(id: number) {
    return this.prisma.participant.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: { class: true },
        },
      },
    });
  }

  create(data: Prisma.ParticipantCreateInput) {
    return this.prisma.participant.create({ data });
  }

  update(id: number, data: Prisma.ParticipantUpdateInput) {
    return this.prisma.participant.update({
      where: { id },
      data,
    });
  }

  delete(id: number) {
    return this.prisma.participant.delete({ where: { id } });
  }
}
