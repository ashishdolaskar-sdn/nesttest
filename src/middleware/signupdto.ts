import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
export class AddStateDto {
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @IsString()
    @MinLength(6)
    password: string;
  }
  
  export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @IsString()
    @MinLength(6)
    password: string;
  }