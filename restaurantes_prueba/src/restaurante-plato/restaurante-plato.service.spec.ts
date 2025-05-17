import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker/.';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { RestaurantePlatoService } from './restaurante-plato.service';
import { CategoriaPlato, PlatoEntity } from '../plato/plato.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';

describe('RestaurantePlatoService', () => {
    let service: RestaurantePlatoService;
    let platoRepository: Repository<PlatoEntity>;
    let restauranteRepository: Repository<RestauranteEntity>;
    let restaurantList: RestauranteEntity[] = [];
    let platoList: PlatoEntity[] = [];
    
    const seedDatabase = async () => {
        restauranteRepository.clear();
        platoRepository.clear();
        restaurantList = [];
        platoList = [];
        for (let i = 0; i < 5; i++) {
        const restaurante: RestauranteEntity = await restauranteRepository.save({
            nombre: faker.company.name(),
            descripcion: faker.lorem.paragraph(),
            direccion: faker.location.streetAddress(),
            paginaWeb: faker.internet.url(),
        });
        restaurantList.push(restaurante);
        }
        for (let i = 0; i < 5; i++) {
        const plato: PlatoEntity = await platoRepository.save({
            nombre: faker.commerce.productName(),
            descripcion: faker.lorem.paragraph(),
            precio: parseInt(faker.commerce.price()),
            categoriaPlato: CategoriaPlato.ENTRADA,
        });
        platoList.push(plato);
        }
    };
    
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
        imports: [...TypeOrmTestingConfig()],
        providers: [RestaurantePlatoService],
        }).compile();
    
        service = module.get<RestaurantePlatoService>(RestaurantePlatoService);
        restauranteRepository = module.get<Repository<RestauranteEntity>>(getRepositoryToken(RestauranteEntity));
        platoRepository = module.get<Repository<PlatoEntity>>(getRepositoryToken(PlatoEntity));
        await seedDatabase();
    });
    
    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('addDishToRestaurante should add a dish to a restaurant', async () => {
        const plato: PlatoEntity = platoList[0];
        const restaurante: RestauranteEntity = restaurantList[0];
        const result: RestauranteEntity = await service.addDishToRestaurante(restaurante.id, plato.id);
        expect(result).not.toBeNull();
        expect(result.platos.length).toBe(1);
        expect(result.platos[0].id).toBe(plato.id);
    });

    it('addDishToRestaurante should throw an exception for an invalid restaurant', async () => {
        const plato: PlatoEntity = platoList[0];
        await expect(() => service.addDishToRestaurante(0, plato.id)).rejects.toHaveProperty('message', 'El restaurante con el ID proporcionado no existe');
    });

    it('addDishToRestaurante should throw an exception for an invalid dish', async () => {
        const restaurante: RestauranteEntity = restaurantList[0];
        await expect(() => service.addDishToRestaurante(restaurante.id, 0)).rejects.toHaveProperty('message', 'El plato con el ID proporcionado no existe');
    });

    it('findDishesFromRestaurante should return dishes from a restaurant', async () => {
        const plato: PlatoEntity = platoList[0];
        const restaurante: RestauranteEntity = restaurantList[0];
        await service.addDishToRestaurante(restaurante.id, plato.id);
        const result: PlatoEntity[] = await service.findDishesFromRestaurante(restaurante.id);
        expect(result).not.toBeNull();
        expect(result.length).toBe(1);
        expect(result[0].id).toBe(plato.id);
    });

    it('findDishesFromRestaurante should throw an exception for an invalid restaurant', async () => {
        await expect(() => service.findDishesFromRestaurante(0)).rejects.toHaveProperty('message', 'El restaurante con el ID proporcionado no existe');
    });

    it('findDishFromRestaurante should return a dish from a restaurant', async () => {
        const plato: PlatoEntity = platoList[0];
        const restaurante: RestauranteEntity = restaurantList[0];
        await service.addDishToRestaurante(restaurante.id, plato.id);
        const result: PlatoEntity = await service.findDishFromRestaurante(restaurante.id, plato.id);
        expect(result).not.toBeNull();
        expect(result.id).toBe(plato.id);
    });

    it('findDishFromRestaurante should throw an exception for an invalid restaurant', async () => {
        const plato: PlatoEntity = platoList[0];
        await expect(() => service.findDishFromRestaurante(0, plato.id)).rejects.toHaveProperty('message', 'El restaurante con el ID proporcionado no existe');
    });

    it('findDishFromRestaurante should throw an exception for an invalid dish', async () => {
        const restaurante: RestauranteEntity = restaurantList[0];
        await expect(() => service.findDishFromRestaurante(restaurante.id, 0)).rejects.toHaveProperty('message', 'El plato con el ID proporcionado no existe');
    });

    it('findDishFromRestaurante should throw an exception for a non-associated dish', async () => {
        const plato: PlatoEntity = platoList[0];
        const restaurante: RestauranteEntity = restaurantList[0];
        await expect(() => service.findDishFromRestaurante(restaurante.id, plato.id)).rejects.toHaveProperty('message', 'El plato con el ID proporcionado no está asociado al restaurante');
    });

    // it('updateDishFromRestaurante should update a dish from a restaurant', async () => {
    //     const plato: PlatoEntity = platoList[0];
    //     const restaurante: RestauranteEntity = restaurantList[0];
    //     await service.addDishToRestaurante(restaurante.id, plato.id);
    //     plato.nombre = 'New name';
        
    //     const result: RestauranteEntity = await service.updateDishFromRestaurante(restaurante.id, plato.id, plato);
    //     expect(result).not.toBeNull();
        
    //     const storedPlato: PlatoEntity = await service.findDishFromRestaurante(restaurante.id, plato.id);
    //     expect(storedPlato).not.toBeNull();
    //     expect(storedPlato.nombre).toBe(plato.nombre);
    // });

    it('updateDishFromRestaurante should throw an exception for an invalid restaurant', async () => {
        const plato: PlatoEntity = platoList[0];
        await expect(() => service.updateDishFromRestaurante(0, plato.id, plato)).rejects.toHaveProperty('message', 'El restaurante con el ID proporcionado no existe');
    });

    it('updateDishFromRestaurante should throw an exception for an invalid dish', async () => {
        const restaurante: RestauranteEntity = restaurantList[0];
        await expect(() => service.updateDishFromRestaurante(restaurante.id, 0, platoList[0])).rejects.toHaveProperty('message', 'El plato con el ID proporcionado no existe');
    });

    it('updateDishFromRestaurante should throw an exception for a non-associated dish', async () => {
        const plato: PlatoEntity = platoList[0];
        const restaurante: RestauranteEntity = restaurantList[0];
        await expect(() => service.updateDishFromRestaurante(restaurante.id, plato.id, plato)).rejects.toHaveProperty('message', 'El plato con el ID proporcionado no está asociado al restaurante');
    });

    // it('updateDishesFromRestaurante should update a dish from a list of dishes', async () => {
    //     const plato: PlatoEntity = platoList[0];
    //     const restaurante: RestauranteEntity = restaurantList[0];
    //     await service.addDishToRestaurante(restaurante.id, plato.id);
    //     plato.nombre = 'New name';
        
    //     const result: RestauranteEntity = await service.updateDishFromRestaurante(restaurante.id, plato.id, plato);
    //     expect(result).not.toBeNull();
        
    //     const storedPlato: PlatoEntity = await service.findDishFromRestaurante(restaurante.id, plato.id);
    //     expect(storedPlato).not.toBeNull();
    //     expect(storedPlato.nombre).toBe(plato.nombre);
    // });

    it('updateDishesFromRestaurante should throw an exception for an invalid dish', async () => {
        const restaurante: RestauranteEntity = restaurantList[0];
        await expect(() => service.updateDishFromRestaurante(restaurante.id, 0, platoList[0])).rejects.toHaveProperty('message', 'El plato con el ID proporcionado no existe');
    });

    it('updateDishesFromRestaurante should throw an exception for a non-associated dish', async () => {
        const plato: PlatoEntity = platoList[0];
        const restaurante: RestauranteEntity = restaurantList[0];
        await expect(() => service.updateDishFromRestaurante(restaurante.id, plato.id, plato)).rejects.toHaveProperty('message', 'El plato con el ID proporcionado no está asociado al restaurante');
    });
})