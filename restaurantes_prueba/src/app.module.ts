import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestauranteModule } from './restaurante/restaurante.module';
import { PlatoModule } from './plato/plato.module';
import { TypeOrmDevConfig } from './shared/testing-utils/typeorm-dev-config';
import { RestauranteEntity } from './restaurante/restaurante.entity';
import { PlatoEntity } from './plato/plato.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    RestauranteModule,
    PlatoModule,
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 5432,
    //   username: 'postgres',
    //   password: 'postgres',
    //   database: 'restaurantes',
    //   entities: [RestauranteEntity, PlatoEntity],
    //   dropSchema: true,
    //   synchronize: true,
    //   // keepConnectionAlive: true,
    // }),
    TypeOrmModule.forRoot({
        type: 'sqlite',
        database: 'dev-db.sqlite',
        dropSchema: true,
        entities: [RestauranteEntity, PlatoEntity],
        synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
