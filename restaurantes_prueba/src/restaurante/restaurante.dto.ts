import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { TipoCocina } from './restaurante.entity';


export class RestauranteDto {
  @IsNotEmpty()
  @IsString()
  readonly nombre: string;

  @IsNotEmpty()
  @IsString()
  readonly direccion: string;

  @IsEnum(TipoCocina)
  readonly tipoCocina: TipoCocina;

  @IsNotEmpty()
  @IsUrl()
  readonly paginaWeb: string;

  @IsOptional()
  @IsArray()
  readonly platos: any[];
}