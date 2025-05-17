import { Injectable } from '@nestjs/common';
import { RestauranteEntity } from './restaurante.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class RestauranteService {
    constructor(
        @InjectRepository(RestauranteEntity)
        private restauranteRepository: Repository<RestauranteEntity>,
    ) { }

  async findAll(): Promise<RestauranteEntity[]> {
    return await this.restauranteRepository.find({ relations: ["platos"] });
  }

  async findOne(id: number): Promise<RestauranteEntity> {
    const restaurante: RestauranteEntity | null = await this.restauranteRepository.findOne({ where: { id }, relations : ["platos"] });
    if (!restaurante) {
      throw new BusinessLogicException('No se ha encontrado el restaurante con ID: ' + id, BusinessError.NOT_FOUND);
    }
    return restaurante;
  }

  async create(restaurante: RestauranteEntity): Promise<RestauranteEntity> {
    try {
      return await this.restauranteRepository.save(restaurante);
    } catch (error) {
      throw new Error('Error al crear el restaurante');
    }
  }

  async update(id: number, restaurante: RestauranteEntity): Promise<RestauranteEntity> {
    const persistedRestaurante: RestauranteEntity | null = await this.restauranteRepository.findOne({ where: { id }, relations: ["platos"] });
    if (!persistedRestaurante) {
      throw new BusinessLogicException('No se ha encontrado el restaurante con ID: ' + id, BusinessError.NOT_FOUND);
    }
    return this.restauranteRepository.save({ ...persistedRestaurante, ...restaurante });
  }

  async delete(id: number): Promise<void> {
    const restaurante: RestauranteEntity | null = await this.restauranteRepository.findOne({ where: { id }, relations: ["platos"] });
    if (!restaurante) {
      throw new BusinessLogicException('No se ha encontrado el restaurante con ID: ' + id, BusinessError.NOT_FOUND);
    }
    await this.restauranteRepository.remove(restaurante);
  }
}
