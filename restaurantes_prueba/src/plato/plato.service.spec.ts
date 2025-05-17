import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PlatoService } from './plato.service';
import { PlatoEntity, CategoriaPlato } from './plato.entity';
import { faker } from '@faker-js/faker';


describe('PlatoService', () => {
    let service: PlatoService;
    let repository: Repository<PlatoEntity>;
    let platoList: PlatoEntity[] = [];

    const seedDatabase = async () => {
      repository.clear();
      platoList = [];
      for (let i = 0; i < 5; i++) {
        const plato: PlatoEntity = await repository.save({
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
        providers: [PlatoService],
      }).compile();

      service = module.get<PlatoService>(PlatoService);
      repository = module.get<Repository<PlatoEntity>>(getRepositoryToken(PlatoEntity));
      await seedDatabase();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('findAll should return all platos', async () => {
        const result: PlatoEntity[] = await service.findAll();
        expect(result).not.toBeNull();
        expect(result.length).toBe(platoList.length);
    });

    it('findOne should return a plato by id', async () => {
        const storedPlato: PlatoEntity = platoList[0];
        const result: PlatoEntity = await service.findOne(storedPlato.id);
        expect(result).not.toBeNull();
        expect(result.id).toBe(storedPlato.id);
        expect(result.nombre).toBe(storedPlato.nombre);
    });

    it('findOne should throw an exception for an invalid plato id', async () => {
        await expect(() => service.findOne(0)).rejects.toHaveProperty('message', 'No se ha encontrado el plato con ID: 0');
    });

    it('create should return a new plato', async () => {
        const plato: PlatoEntity = {
            id: 0,
            nombre: faker.commerce.productName(),
            descripcion: faker.lorem.paragraph(),
            precio: parseInt(faker.commerce.price()),
            categoriaPlato: CategoriaPlato.ENTRADA,
            restaurantes: [],
        };

        const result: PlatoEntity = await service.create(plato);
        expect(result).not.toBeNull();

        const storedPlato: PlatoEntity = await repository.findOne({ where: { id: result.id } });
        expect(storedPlato).not.toBeNull();
        expect(storedPlato.nombre).toBe(result.nombre);
    });

    it('update should modify a plato', async () => {
        const plato: PlatoEntity = platoList[0];
        plato.nombre = 'New name';

        const result: PlatoEntity = await service.update(plato.id, plato);
        expect(result).not.toBeNull();

        const storedPlato: PlatoEntity = await repository.findOne({ where: { id: result.id } });
        expect(storedPlato).not.toBeNull();
        expect(storedPlato.nombre).toBe(plato.nombre);
    });

    it('update should throw an exception for an invalid plato', async () => {
        let plato: PlatoEntity = platoList[0];
        plato = {
            ...plato,
            nombre: 'New name',
        };
        await expect(() => service.update(0, plato)).rejects.toHaveProperty('message', 'No se ha encontrado el plato con ID: 0');
    });

    it('delete should remove a plato', async () => {
        const plato: PlatoEntity = platoList[0];
        await service.delete(plato.id);

        const deletedPlatos: PlatoEntity[] = await repository.find({ where: { id: plato.id } });
        expect(deletedPlatos.length).toBe(0);
    });

    it('delete should throw an exception for an invalid plato', async () => {
        const plato: PlatoEntity = platoList[0];
        await service.delete(plato.id);
        await expect(() => service.delete(0)).rejects.toHaveProperty('message', 'No se ha encontrado el plato con ID: 0');
    });
});