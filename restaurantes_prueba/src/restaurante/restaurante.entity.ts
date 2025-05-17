import { PlatoEntity } from 'src/plato/plato.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';

export enum TipoCocina {
    NINGUNA = 'NINGUNA',
    MEXICANA = 'MEXICANA',
    ITALIANA = 'ITALIANA',
    JAPONESA = 'JAPONESA',
    AMERICANA = 'AMERICANA',
    CHINA = 'CHINA',
}

@Entity('restaurante')
export class RestauranteEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    direccion: string;

    @Column({
        type: 'simple-enum',
        enum: TipoCocina,
        default: TipoCocina.NINGUNA
    })
    tipoCocina: TipoCocina;

    @Column()
    paginaWeb: string;

    // relacion con plato
    @ManyToMany(() => PlatoEntity, (plato) => plato.restaurantes)
    @JoinTable()
    platos: PlatoEntity[];

}
