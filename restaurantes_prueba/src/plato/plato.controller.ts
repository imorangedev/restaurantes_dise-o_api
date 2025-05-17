import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';

import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { PlatoService } from './plato.service';
import { PlatoDto } from './plato.dto';
import { PlatoEntity, CategoriaPlato } from './plato.entity';
import { plainToInstance } from 'class-transformer';

@Controller('plato')
@UseInterceptors(BusinessErrorsInterceptor)
export class PlatoController {

    constructor(private readonly platoService: PlatoService) { }

    @Get()
    async findAll() {
        return await this.platoService.findAll();
    }

    @Get(':platoId')
    async findOne(@Param('platoId') platoId: number) {
        return await this.platoService.findOne(platoId);
    }

    @Post()
    async create(@Body() platoDto: PlatoDto) {
        const plato: PlatoEntity = plainToInstance(PlatoEntity, platoDto);
        return await this.platoService.create(plato);
    }

    @Put(':platoId')
    async update(@Param('platoId') platoId: number, @Body() platoDto: PlatoDto) {
        const plato: PlatoEntity = plainToInstance(PlatoEntity, platoDto);
        return await this.platoService.update(platoId, plato);
    }

    @Delete(':platoId')
    @HttpCode(204)
    async delete(@Param('platoId') platoId: number) {
        return await this.platoService.delete(platoId);
    }
}