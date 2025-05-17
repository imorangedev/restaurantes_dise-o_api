import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatoEntity } from 'src/plato/plato.entity';
import { RestauranteEntity } from 'src/restaurante/restaurante.entity';
import { RestaurantePlatoService } from './restaurante-plato.service';

@Module({
  imports: [TypeOrmModule.forFeature([RestauranteEntity, PlatoEntity])],
  providers: [RestaurantePlatoService],
  controllers: [],
  exports: [],
})
export class RestaurantePlatoModule {}