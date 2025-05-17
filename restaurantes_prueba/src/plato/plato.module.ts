import { Module } from '@nestjs/common';
import { PlatoService } from './plato.service';

@Module({
  providers: [PlatoService]
})
export class PlatoModule {}
