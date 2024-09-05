import { Module } from '@nestjs/common';
import { VetrinaService } from './vetrina.service';
import { VetrinaController } from './vetrina.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VetrinaController],
  providers: [VetrinaService],
})
export class VetrinaModule {}
