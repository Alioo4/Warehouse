import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateVetrinaDto } from './dto/create-vetrina.dto';
import { UpdateVetrinaDto } from './dto/update-vetrina.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VetrinaService {
  constructor(private readonly prisma: PrismaService){}
  async create(payload: CreateVetrinaDto) {
    const { balon, oluvchi, soni } = payload;

    const find = await this.prisma.vetrina.findFirst({
        where: { oluvchi, balon }
    });
    
    const findS = await this.prisma.sklad.findFirst({
        where: { balon }
    });

    if (!findS) {
        throw new BadRequestException('Bu turdagi balon skladda yoq!!!');
    }

    const currentStock = find ? find.soni : 0;
    const totalRequiredStock = currentStock + soni;

    if (findS.skladCount < totalRequiredStock) {
        throw new BadRequestException('Balon yetarli emas skladda!!!');
    }

    let data;

    if (find) {
        const now = new Date().toISOString();
        data = await this.prisma.vetrina.update({
            where: { id: find.id },
            data: { soni: totalRequiredStock, updatedAt: now }
        });
    } else {
        data = await this.prisma.vetrina.create({
            data: { oluvchi, balon, soni }
        });
    }
    return { message: 'Success', data };
}

  async findAll() {
    const find = await this.prisma.vetrina.findMany() 
    return find;
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
  
    return this.prisma.vetrina.findMany({
      where: filter,
    });
  }

  async findOne(id: string) {
    const find = await this.prisma.vetrina.findUnique({where: {id}})
    return find;  
  }

  async update(id: string, payload: UpdateVetrinaDto) {
    const {balon, oluvchi, soni} = payload

    const find = await this.prisma.vetrina.findUnique({where: {id}})
    
    if(!find)
      throw new BadRequestException('This id not found!!!')
    
    const findSklad = await this.prisma.sklad.findFirst({where: {balon}})
    if(!findSklad)
      throw new BadRequestException('This balon not found!!!')
    if(!(findSklad.skladCount >= soni))
      throw new BadRequestException('Not enough balloons!!!')

    const now = new Date().toISOString();

    await this.prisma.vetrina.update({where: {id}, data: {oluvchi, balon, soni, updatedAt: now}})
    return {message: 'Successfully updated'};
  }

  async remove(id: string) {
    const find = await this.prisma.vetrina.findUnique({where: {id}})
    
    if(!find)
      throw new BadRequestException('This id not found!!!')

    await this.prisma.vetrina.delete({where: {id}})
    return {message: 'Successfully deleted'};
  }
}
