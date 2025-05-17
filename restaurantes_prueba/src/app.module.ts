import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestauranteModule } from './restaurante/restaurante.module';
import { TypeOrmDevConfig } from './shared/testing-utils/typeorm-dev-config';
import { PlatoModule } from './plato/plato.module';


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
    //   entities: [RestauranteEntity, ProductoEntity, RecetaEntity, PaisEntity, CulturaGastronomicaEntity, ],
    //   synchronize: true,
    // }),
    ...TypeOrmDevConfig(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
