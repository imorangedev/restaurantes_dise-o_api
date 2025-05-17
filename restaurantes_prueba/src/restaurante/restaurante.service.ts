import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RestauranteEntity} from './restaurante.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class RestauranteService {
  constructor(
    @InjectRepository(RestauranteEntity)
    private restauranteRepository: Repository<RestauranteEntity>,
  ) { }

  async findAll(): Promise<RestauranteEntity[]> {
    return await this.restauranteRepository.find({});
  }

  async findOne(id: number): Promise<RestauranteEntity> {
    const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({ where: { id } });
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
    const persistedRestaurante: RestauranteEntity = await this.restauranteRepository.findOne({ where: { id } });
    if (!persistedRestaurante) {
      throw new BusinessLogicException('No se ha encontrado el restaurante con ID: ' + id, BusinessError.NOT_FOUND);
    }
    return this.restauranteRepository.save({ ...persistedRestaurante, ...restaurante });
  }

  async delete(id: number): Promise<void> {
    const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({ where: { id } });
    if (!restaurante) {
      throw new BusinessLogicException('No se ha encontrado el restaurante con ID: ' + id, BusinessError.NOT_FOUND);
    }
    await this.restauranteRepository.remove(restaurante);
  }
}
