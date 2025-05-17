import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';

import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { RestauranteService } from './restaurante.service';
import { RestauranteDto } from './restaurante.dto';
import { RestauranteEntity, TipoCocina } from './restaurante.entity';
import { plainToInstance } from 'class-transformer';

@Controller('restaurante')
@UseInterceptors(BusinessErrorsInterceptor)
export class RestauranteController {

    constructor(private readonly restauranteService: RestauranteService) { }

    @Get()
    async findAll() {
        return await this.restauranteService.findAll();
    }

    @Get(':restauranteId')
    async findOne(@Param('restauranteId') restauranteId: number) {
        return await this.restauranteService.findOne(restauranteId);
    }

    @Post()
    async create(@Body() restauranteDto: RestauranteDto) {
        const restaurante: RestauranteEntity = plainToInstance(RestauranteEntity, restauranteDto);
        return await this.restauranteService.create(restaurante);
    }

    @Put(':restauranteId')
    async update(@Param('restauranteId') restauranteId: number, @Body() restauranteDto: RestauranteDto) {
        const restaurante: RestauranteEntity = plainToInstance(RestauranteEntity, restauranteDto);
        return await this.restauranteService.update(restauranteId, restaurante);
    }

    @Delete(':restauranteId')
    @HttpCode(204)
    async delete(@Param('restauranteId') restauranteId: number) {
        return await this.restauranteService.delete(restauranteId);
    }

}