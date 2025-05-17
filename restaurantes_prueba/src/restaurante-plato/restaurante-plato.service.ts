import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { PlatoEntity } from '../plato/plato.entity';

@Injectable()
export class RestaurantePlatoService {
  constructor(
    @InjectRepository(RestauranteEntity)
    private readonly restauranteRepository: Repository<RestauranteEntity>,
    @InjectRepository(PlatoEntity)
    private readonly platoRepository: Repository<PlatoEntity>,
  ) {}

    async addDishToRestaurante(restauranteId: number, platoId: number): Promise<RestauranteEntity> {
      const plato = await this.platoRepository.findOne({ where: { id: platoId } });
      if (!plato) {
        throw new BusinessLogicException('El plato con el ID proporcionado no existe', BusinessError.NOT_FOUND);
      }
  
      const restaurante = await this.restauranteRepository.findOne({ where: { id: restauranteId }, relations: ['platos'] });
      if (!restaurante) {
        throw new BusinessLogicException('El restaurante con el ID proporcionado no existe', BusinessError.NOT_FOUND);
      }
  
      restaurante.platos.push(plato);
      return await this.restauranteRepository.save(restaurante);
    }

    async findDishesFromRestaurante(restauranteId: number): Promise<PlatoEntity[]> {
        const restaurante = await this.restauranteRepository.findOne({ where: { id: restauranteId }, relations: ['platos'] });
        if (!restaurante) {
        throw new BusinessLogicException('El restaurante con el ID proporcionado no existe', BusinessError.NOT_FOUND);
        }
    
        return restaurante.platos;
    }

    async findDishFromRestaurante(restauranteId: number, platoId: number): Promise<PlatoEntity> {
        const plato = await this.platoRepository.findOne({ where: { id: platoId } });
        if (!plato) {
            throw new BusinessLogicException('El plato con el ID proporcionado no existe', BusinessError.NOT_FOUND);
        }

        const restaurante = await this.restauranteRepository.findOne({ where: { id: restauranteId }, relations: ['platos'] });
        if (!restaurante) {
            throw new BusinessLogicException('El restaurante con el ID proporcionado no existe', BusinessError.NOT_FOUND);
        }

        const restaurantePlato = restaurante.platos.find((e) => e.id === plato.id);

        if (!restaurantePlato) {
            throw new BusinessLogicException('El plato con el ID proporcionado no está asociado al restaurante', BusinessError.PRECONDITION_FAILED);
        }

        return restaurantePlato;
    }
    async updateDishFromRestaurante(restauranteId: number, platoId: number, plato: PlatoEntity): Promise<RestauranteEntity> {
        const platoEntity = await this.platoRepository.findOne({ where: { id: platoId } });
        if (!platoEntity) {
            throw new BusinessLogicException('El plato con el ID proporcionado no existe', BusinessError.NOT_FOUND);
        }

        const restaurante = await this.restauranteRepository.findOne({ where: { id: restauranteId }, relations: ['platos'] });
        if (!restaurante) {
            throw new BusinessLogicException('El restaurante con el ID proporcionado no existe', BusinessError.NOT_FOUND);
        }

        const restaurantePlato = restaurante.platos.find((e) => e.id === platoEntity.id);

        if (!restaurantePlato) {
            throw new BusinessLogicException('El plato con el ID proporcionado no está asociado al restaurante', BusinessError.PRECONDITION_FAILED);
        }

        // restaurante.platos = restaurante.platos.filter((e) => e.id !== platoId);
        // plato.id = platoId;
        // restaurante.platos.push(plato);
        // return await this.restauranteRepository.save(restaurante);
        // Actualiza los campos del plato asociado
        const restaurantePlatoIndex = restaurante.platos.findIndex((e) => e.id === platoEntity.id);

        if (restaurantePlatoIndex === -1) {
            throw new BusinessLogicException('El plato con el ID proporcionado no está asociado al restaurante', BusinessError.PRECONDITION_FAILED);
        }

        restaurante.platos[restaurantePlatoIndex] = { ...platoEntity, ...plato, id: platoId };

        return await this.restauranteRepository.save(restaurante);
    }

    async updateDishesFromRestaurante(restauranteId: number, platos: PlatoEntity[]): Promise<RestauranteEntity> {
        const restaurante = await this.restauranteRepository.findOne({ where: { id: restauranteId }, relations: ['platos'] });
        if (!restaurante) {
            throw new BusinessLogicException('El restaurante con el ID proporcionado no existe', BusinessError.NOT_FOUND);
        }
        const platosIds = platos.map((plato) => plato.id);
        const platosEntities = await this.platoRepository.findByIds(platosIds);
        if (platosEntities.length !== platosIds.length) {
            throw new BusinessLogicException('Uno o más platos no existen', BusinessError.NOT_FOUND);
        }
        const platosRestaurante = restaurante.platos.filter((plato) => platosIds.includes(plato.id));
        if (platosRestaurante.length !== platosIds.length) {
            throw new BusinessLogicException('Uno o más platos no están asociados al restaurante', BusinessError.PRECONDITION_FAILED);
        }
        restaurante.platos = platos;
        return await this.restauranteRepository.save(restaurante);
    }

    async deleteDishFromRestaurante(restauranteId: number, platoId: number): Promise<RestauranteEntity> {
        const plato = await this.platoRepository.findOne({ where: { id: platoId } });
        if (!plato) {
            throw new BusinessLogicException('El plato con el ID proporcionado no existe', BusinessError.NOT_FOUND);
        }

        const restaurante = await this.restauranteRepository.findOne({ where: { id: restauranteId }, relations: ['platos'] });
        if (!restaurante) {
            throw new BusinessLogicException('El restaurante con el ID proporcionado no existe', BusinessError.NOT_FOUND);
        }

        const restaurantePlato = restaurante.platos.find((e) => e.id === plato.id);

        if (!restaurantePlato) {
            throw new BusinessLogicException('El plato con el ID proporcionado no está asociado al restaurante', BusinessError.PRECONDITION_FAILED);
        }

        restaurante.platos = restaurante.platos.filter((e) => e.id !== platoId);
        return await this.restauranteRepository.save(restaurante);
    }
}