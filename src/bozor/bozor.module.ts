import { Module } from '@nestjs/common';
import { BozorService } from './bozor.service';
import { BozorController } from './bozor.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BozorController],
  providers: [BozorService],
})
export class BozorModule {}
