// src/participant/dto/update-participant.dto.ts
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateParticipantDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  address?: string;
}