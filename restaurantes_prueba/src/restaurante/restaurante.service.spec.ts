import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { RestauranteService } from './restaurante.service';
import { RestauranteEntity, TipoCocina} from './restaurante.entity';
import { faker } from '@faker-js/faker';

describe('RestauranteService', () => {
  let service: RestauranteService;
  let repository: Repository<RestauranteEntity>;
  let restaurantList: RestauranteEntity[] = [];

  const seedDatabase = async () => {
    repository.clear();
    restaurantList = [];
    for (let i = 0; i < 5; i++) {
      const restaurante: RestauranteEntity = await repository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.paragraph(),
        direccion: faker.location.streetAddress(),
        paginaWeb: faker.internet.url(),
      });
      restaurantList.push(restaurante);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RestauranteService],
    }).compile();

    service = module.get<RestauranteService>(RestauranteService);
    repository = module.get<Repository<RestauranteEntity>>(getRepositoryToken(RestauranteEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all restaurants', async () => {
    const result: RestauranteEntity[] = await service.findAll();
    expect(result).not.toBeNull();
    expect(result.length).toBe(restaurantList.length);
  });

  it('findOne should return a restaurant by id', async () => {
    const storedRestaurant: RestauranteEntity = restaurantList[0];
    const result: RestauranteEntity = await service.findOne(storedRestaurant.id);
    expect(result).not.toBeNull();
    expect(result.id).toBe(storedRestaurant.id);
    expect(result.nombre).toBe(storedRestaurant.nombre);
  });

  it('findOne should throw an exception for an invalid restaurant id', async () => {
    await expect(() => service.findOne(0)).rejects.toHaveProperty('message', 'No se ha encontrado el restaurante con ID: 0');
  });

  it('create should return a new restaurant', async () => {
    const restaurante: RestauranteEntity = {
        id: 0,
        nombre: faker.company.name(),
        direccion: faker.location.streetAddress(),
        tipoCocina: TipoCocina.NINGUNA,
        paginaWeb: faker.internet.url(),
    };

    const newRestaurant: RestauranteEntity = await service.create(restaurante);
    expect(newRestaurant).not.toBeNull();

    const storedRestaurant: RestauranteEntity = await repository.findOne({ where: { id: newRestaurant.id } });
    expect(storedRestaurant).not.toBeNull();
    expect(storedRestaurant.id).toBe(newRestaurant.id);
    expect(storedRestaurant.nombre).toBe(newRestaurant.nombre);
    expect(storedRestaurant.direccion).toBe(newRestaurant.direccion);
    expect(storedRestaurant.tipoCocina).toBe(newRestaurant.tipoCocina);
    expect(storedRestaurant.paginaWeb).toBe(newRestaurant.paginaWeb);
  });

  it('update should modify a restaurant', async () => {
    const restaurant: RestauranteEntity = restaurantList[0];
    restaurant.nombre = 'New Restaurant';
    restaurant.direccion = 'New Direction';
    restaurant.tipoCocina = TipoCocina.MEXICANA;
    restaurant.paginaWeb = faker.internet.url();

    const updatedRestaurant: RestauranteEntity = await service.update(restaurant.id, restaurant);
    expect(updatedRestaurant).not.toBeNull();

    const storedRestaurant: RestauranteEntity = await repository.findOne({ where: { id: restaurant.id } });
    expect(storedRestaurant).not.toBeNull();
    expect(storedRestaurant.id).toBe(restaurant.id);
    expect(storedRestaurant.nombre).toBe(restaurant.nombre);
    expect(storedRestaurant.direccion).toBe(restaurant.direccion);
    expect(storedRestaurant.tipoCocina).toBe(restaurant.tipoCocina);
    expect(storedRestaurant.paginaWeb).toBe(restaurant.paginaWeb);
  });

  it('update should throw an exception for an invalid restaurant id', async () => {
    await expect(() => service.update(0, restaurantList[0])).rejects.toHaveProperty('message', 'No se ha encontrado el restaurante con ID: 0');
  });

  it('delete should remove a restaurant', async () => {
    const restaurant: RestauranteEntity = restaurantList[0];
    await service.delete(restaurant.id);

    const deletedRestaurant: RestauranteEntity = await repository.findOne({ where: { id: restaurant.id } });
    expect(deletedRestaurant).toBeNull();
  });

  it('delete should throw an exception for an invalid restaurant id', async () => {
    await expect(() => service.delete(0)).rejects.toHaveProperty('message', 'No se ha encontrado el restaurante con ID: 0');
  });
});
