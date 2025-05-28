import { IsString, IsOptional, IsArray, IsObject } from 'class-validator';

export class CreateUserDto {
  @IsString()
  uid: string;

  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsString()
  carrera?: string;

  @IsOptional()
  @IsObject()
  preferenciasEstudio?: {
    horario?: string;           // ejemplo: "noche"
    metodo?: string;            // ejemplo: "visual"
    temasInteres?: string[];    // ejemplo: ["algoritmos", "bases de datos"]
  };
}
