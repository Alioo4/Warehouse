import { Module } from '@nestjs/common';
import { SkladService } from './sklad.service';
import { SkladController } from './sklad.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SkladController],
  providers: [SkladService],
})
export class SkladModule {}
