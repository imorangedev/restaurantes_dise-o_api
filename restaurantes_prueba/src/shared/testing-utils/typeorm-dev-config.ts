import {TypeOrmModule } from '@nestjs/typeorm';
import { RestauranteEntity } from '../../restaurante/restaurante.entity';
import { PlatoEntity } from '../../plato/plato.entity';


export const TypeOrmDevConfig = () => [
    TypeOrmModule.forRoot({
        type: 'sqlite',
        database: 'dev-db.sqlite',
        entities: [RestauranteEntity, PlatoEntity],
        synchronize: true,
    }),
    TypeOrmModule.forFeature([RestauranteEntity, PlatoEntity])
];