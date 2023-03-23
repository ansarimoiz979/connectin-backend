import { ApiProperty } from '@nestjs/swagger';
import {
  isEmail,
  IsNotEmpty,
  IsString,
  IsEmail,
  MaxLength,
} from 'class-validator';

export class CreateUserDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(24)
  username: string;
  
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
  
  @ApiProperty()
  @IsNotEmpty()
  password: string;
}


export class LoginUserDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;
    
    @ApiProperty()
    @IsNotEmpty()
    password: string;
  }
  