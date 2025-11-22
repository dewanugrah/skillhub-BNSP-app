import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ParticipantModule } from './participant/participant.module';
import { ClassModule } from './class/class.module';
import { EnrollmentModule } from './enrollment/enrollment.module';

@Module({
  imports: [PrismaModule, ParticipantModule, ClassModule, EnrollmentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
