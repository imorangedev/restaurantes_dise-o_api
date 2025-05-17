import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { RestaurantePlatoService } from './restaurante-plato.service';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { RestauranteDto } from '../restaurante/restaurante.dto';
import { PlatoEntity } from '../plato/plato.entity';
import { PlatoDto } from '../plato/plato.dto';


@Controller('restaurants')
@UseInterceptors(BusinessErrorsInterceptor)
export class RestaurantePlatoController {
    constructor(private readonly restaurantePlatoService: RestaurantePlatoService) { }

    @Post(':restauranteId/dishes/:platoId')
    async addDishToRestaurante(
        @Param('restauranteId') restauranteId: number,
        @Param('platoId') platoId: number,
    ): Promise<RestauranteEntity> {
        return await this.restaurantePlatoService.addDishToRestaurante(restauranteId, platoId);
    }

    @Get(':restauranteId/dishes')
    async findDishesFromRestaurante(
        @Param('restauranteId') restauranteId: number,
    ): Promise<PlatoEntity[]> {
        return await this.restaurantePlatoService.findDishesFromRestaurante(restauranteId);
    }

    @Get(':restauranteId/dishes/:platoId')
    async findDishFromRestaurante(
        @Param('restauranteId') restauranteId: number,
        @Param('platoId') platoId: number,
    ): Promise<PlatoEntity> {
        return await this.restaurantePlatoService.findDishFromRestaurante(restauranteId, platoId);
    }

    @Put(':restauranteId/dishes/:platoId')
    async updateDishFromRestaurante(
        @Param('restauranteId') restauranteId: number,
        @Param('platoId') platoId: number,
        @Body() platoDto: PlatoDto,
    ): Promise<RestauranteEntity> {
        const plato: PlatoEntity = plainToInstance(PlatoEntity, platoDto);
        return await this.restaurantePlatoService.updateDishFromRestaurante(restauranteId, platoId, plato);
    }

    @Put(':restauranteId/dishes')
    async updateDishesFromRestaurante(
        @Param('restauranteId') restauranteId: number,
        @Body() platosDto: PlatoDto[],
    ): Promise<RestauranteEntity> {
        const platos: PlatoEntity[] = plainToInstance(PlatoEntity, platosDto);
        return await this.restaurantePlatoService.updateDishesFromRestaurante(restauranteId, platos);
    }

    @Delete(':restauranteId/dish/:platoId')
    @HttpCode(204)
    async deleteDishFromRestaurante(
        @Param('restauranteId') restauranteId: number,
        @Param('platoId') platoId: number,
    ): Promise<RestauranteEntity> {
        return await this.restaurantePlatoService.deleteDishFromRestaurante(restauranteId, platoId);
    }

}