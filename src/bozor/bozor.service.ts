import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBozorDto } from './dto/create-bozor.dto';
import { UpdateBozorDto } from './dto/update-bozor.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BozorService {
  constructor(private readonly prisma: PrismaService){}
  async create(payload: CreateBozorDto) {
    const {balon, oluvchi, soni} = payload
    const find = await this.prisma.sklad.findFirst({where: {balon}})
    if(!find)
      throw new BadRequestException('This balon not found in Sklad!!!')
    if(!(find.skladCount >= soni))
      throw new BadRequestException('This balon count not enough in Sklad!!!')

      await this.prisma.sklad.update({where: {id: find.id}, data: {skladCount: find.skladCount - soni, allPrice: find.allPrice - soni * find.onePrice}})

      await this.prisma.bozor.create({data: {balon, oluvchi, soni, narxi: soni * find.onePrice}})
    return  {message: 'Ok'};
  }

  async findAll() {
    const data = await this.prisma.bozor.findMany() 
    return {message: 'Success!!!', data: data};
  }

  async filterData(oluvchi?: string ,balon?: string) {
    const filter: any = {};
    
    if (oluvchi) {
      filter.oluvchi = {
        contains: oluvchi,
        mode: 'insensitive', 
      };
    }

    if (balon) {
      filter.balon = {
        contains: balon,
        mode: 'insensitive', 
      };
    }
  
    return this.prisma.bozor.findMany({
      where: filter,
    });
  }

  async statics(startDate?: Date, endDate?: Date) {
    const filter: any = {};

    if (startDate) {
      filter.createdAt = {
        gte: startDate, 
      };
    }

    if (endDate) {
      filter.createdAt = {
        ...(filter.createdAt || {}), 
        lte: endDate, 
      };
    }
       
    return this.prisma.bozor.findMany({
      where: filter,
      select: { 
        balon: true,
        soni: true,
      },
    });
  }
  
  async findOne(id: string) {
    const find = await this.prisma.bozor.findUnique({where: {id}})

    if(!find)
      throw new BadRequestException('Bu id li malumot yoq')
    return find;
  }

  async update(id: string, payload: UpdateBozorDto) {
    const { oluvchi, balon, soni } = payload;

    const findOld = await this.prisma.bozor.findUnique({ where: { id } });
    if (!findOld) {
        throw new BadRequestException('Bu id li malumot yoq');
    }

    const [findS, findNewS ] = await Promise.all([
        this.prisma.sklad.findFirst({ where: { balon: findOld.balon} }),
        this.prisma.sklad.findFirst({ where: { balon } }),
    ]);

    if (!findS) {
        throw new BadRequestException('Bu malumot sklad dan uchib ketgan, ozgartirishni iloji yoq');
    }

    if (!findNewS) {
        throw new BadRequestException('Bu malumot sklad da yoq');
    }

    if (findNewS.skladCount < soni) {
        throw new BadRequestException('This balon count not enough in Sklad!!!');
    }

    await this.prisma.$transaction(async (prisma) => {
        await prisma.sklad.update({
            where: { id: findNewS.id },
            data: { skladCount: findS.skladCount + findOld.soni - soni, allPrice: findNewS.allPrice + findOld.narxi - soni * findNewS.onePrice }
        });

        await prisma.bozor.update({
            where: { id },
            data: { oluvchi, balon, soni, narxi: soni * findNewS.onePrice }
        });
    });

    return { message: 'Ok' };
}


async remove(id: string) {
  const findOld = await this.prisma.bozor.findUnique({ where: { id } });
  
  if (!findOld) {
      throw new BadRequestException('Bu id li malumot yoq');
  }

  const { balon, soni, narxi } = findOld;

  const [findS ] = await Promise.all([
      this.prisma.sklad.findFirst({ where: { balon } }),

  ]);

  if (!findS) {
      throw new BadRequestException('Bu malumot sklad dan uchib ketgan, ochirishni iloji yoq');
  }

  await this.prisma.$transaction(async (prisma) => {
      await prisma.sklad.update({
          where: { id: findS.id },
          data: { skladCount: findS.skladCount + soni, allPrice: findS.allPrice + narxi }
      });
      await prisma.bozor.delete({ where: { id } });
  });
  return { message: 'Ok' };
 }
}
