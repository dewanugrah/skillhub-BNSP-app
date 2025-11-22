import { IsEmail, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateParticipantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  address?: string;
}
