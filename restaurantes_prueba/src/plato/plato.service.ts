import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlatoEntity } from './plato.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class PlatoService {
    constructor(
        @InjectRepository(PlatoEntity)
        private platoRepository: Repository<PlatoEntity>,
    ) {}

    async findAll(): Promise<PlatoEntity[]> {
        return await this.platoRepository.find({});
    }

    async findOne(id: number): Promise<PlatoEntity> {
        const plato: PlatoEntity = await this.platoRepository.findOne({ where: { id } });
        if (!plato) {
            throw new BusinessLogicException('No se ha encontrado el plato con ID: ' + id, BusinessError.NOT_FOUND);
        }
        return plato;
    }

    async create(plato: PlatoEntity): Promise<PlatoEntity> {
        try {
            return await this.platoRepository.save(plato);
        } catch (error) {
            throw new Error('Error al crear el plato');
        }
    }

    async update(id: number, plato: PlatoEntity): Promise<PlatoEntity> {
        const persistedPlato: PlatoEntity = await this.platoRepository.findOne({ where: { id } });
        if (!persistedPlato) {
            throw new BusinessLogicException('No se ha encontrado el plato con ID: ' + id, BusinessError.NOT_FOUND);
        }
        return this.platoRepository.save({ ...persistedPlato, ...plato });
    }

    async delete(id: number): Promise<void> {
        const plato: PlatoEntity = await this.platoRepository.findOne({ where: { id } });
        if (!plato) {
            throw new BusinessLogicException('No se ha encontrado el plato con ID: ' + id, BusinessError.NOT_FOUND);
        }
        await this.platoRepository.remove(plato);
    }


}