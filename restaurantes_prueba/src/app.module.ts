import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestauranteModule } from './restaurante/restaurante.module';
import { TypeOrmDevConfig } from './shared/testing-utils/typeorm-dev-config';
import { PlatoModule } from './plato/plato.module';
import { RestaurantePlatoModule } from './restaurante-plato/restaurante-plato.module';
import { RestauranteEntity } from './restaurante/restaurante.entity';
import { PlatoEntity } from './plato/plato.entity';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [
    RestauranteModule,
    PlatoModule,
    RestaurantePlatoModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'restaurantes',
      entities: [RestauranteEntity, PlatoEntity ],
      synchronize: true,
    }),
    // ...TypeOrmDevConfig(),
  ],
  controllers: [
    AppController,
    // PlatoController,
    // RestauranteController,
    // RestaurantePlatoController],
  ],
  providers: [AppService],
})
export class AppModule { }
