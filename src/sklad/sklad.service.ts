import { BadRequestException, Injectable, Req } from '@nestjs/common';
import { CreateSkladDto } from './dto/create-sklad.dto';
import { UpdateSkladDto } from './dto/update-sklad.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SkladService {
  constructor(private readonly prisma: PrismaService){}
  async create(payload: CreateSkladDto) {
    const { balon, soni, onePrice } = payload;

    if (typeof soni !== 'number' || soni < 0) {
        throw new BadRequestException('Invalid quantity value!');
    }

    const find = await this.prisma.sklad.findFirst({
        where: { balon }
    });

    let data;

    if (find) {
        const now = new Date().toISOString(); 
        data = await this.prisma.sklad.update({
            where: { id: find.id },
            data: {
                skladCount: find.skladCount + soni,
                allPrice: find.allPrice + onePrice * soni,
                updatedAt: now
            }
        });
    } else {
        data = await this.prisma.sklad.create({
            data: { balon, skladCount: soni, onePrice, allPrice: onePrice * soni }
        });
    }
    return { message: 'Success', data };
}


  async findAll() {
    const all = await this.prisma.sklad.findMany()
    return {message: 'Success', data: all};
  }

  async filterData(balon?: string, balonSize?: string) {
    const filter: any = {};
  
    if (balon) {
      filter.balon = {
        contains: balon,
        mode: 'insensitive', 
      };
    }
  
    return this.prisma.sklad.findMany({
      where: filter,
    });
  }
  
  async findOne(id: string) {
    const findOne = await this.prisma.sklad.findUnique({where: {id}})
    return {message: 'Success', data: findOne};
  }

  async update(id: string, payload: UpdateSkladDto) {
    const { balon, soni, onePrice } = payload;

    const find = await this.prisma.sklad.findUnique({ where: { id } });

    if (!find) {
        throw new BadRequestException('Id not found!!!');
    }

    if (typeof soni !== 'number' || soni < 0) {
        throw new BadRequestException('Invalid quantity value!');
    }

    const now = new Date().toISOString();

    const updatedSklad = await this.prisma.sklad.update({
        where: { id },
        data: { 
            balon, 
            skladCount: soni,
            onePrice,
            allPrice: onePrice * soni,
            updatedAt: now 
        }
    });

    return { message: 'Successfully updated!!!', data: updatedSklad };
}


  async remove(id: string) {
    const find = await this.prisma.sklad.findUnique({where: {id}})

    if(!find)
      throw new BadRequestException('Id not found!!!')

    await this.prisma.sklad.delete({where: {id}})
    return {message: 'Successfully deleted'};
  }
}

