import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { CategoriaPlato } from './plato.entity';

export class PlatoDto {
  @IsNotEmpty()
  @IsString()
  readonly nombre: string;

  @IsNotEmpty()
  @IsString()
  readonly descripcion: string;

  @IsNotEmpty()
  @IsNumber()
  readonly precio: number;

  @IsEnum(CategoriaPlato)
  readonly categoriaPlato: CategoriaPlato;

  @IsOptional()
  @IsArray()
  readonly restaurantes: any[];
}