import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { RestauranteEntity } from '../restaurante/restaurante.entity';

export enum CategoriaPlato {
    ENTRADA = 'ENTRADA',
    PLATO_PRINCIPAL = 'PLATO_PRINCIPAL',
    POSTRE = 'POSTRE',
    BEBIDA = 'BEBIDA',
}

@Entity('plato')
export class PlatoEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;

    @Column()
    precio: number;

    @Column({
        type: 'simple-enum',
        enum: CategoriaPlato,
        default: CategoriaPlato.ENTRADA
    })
    categoriaPlato: CategoriaPlato;

    // relacion con restaurante
    @ManyToMany(() => RestauranteEntity, (restaurante) => restaurante.platos)
    restaurantes: RestauranteEntity[];

}