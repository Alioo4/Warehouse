import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, BadRequestException, UseGuards } from '@nestjs/common';
import { BozorService } from './bozor.service';
import { CreateBozorDto } from './dto/create-bozor.dto';
import { UpdateBozorDto } from './dto/update-bozor.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Bozor')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('bozor')
export class BozorController {
  constructor(private readonly bozorService: BozorService) {}

  @Post()
  create(@Body() createBozorDto: CreateBozorDto) {
    return this.bozorService.create(createBozorDto);
  }

  @Get()
  findAll() {
    return this.bozorService.findAll();
  }
  
  @ApiQuery({ name: 'oluvchi', required: false, description: 'Filter by bozor oluvchisi uchun' })
  @ApiQuery({ name: 'balon', required: false, description: 'Filter by bozor balon uchun' })
  @Get('filterDate')
  async filterData(
    @Query('oluvchi') oluvchi?: string,
    @Query('balon') balon?: string,
  ) {
    return this.bozorService.filterData(oluvchi, balon);
  }

  @ApiQuery({ name: 'startDate', required: false, description: 'Filter by start date in ISO format (e.g., 2024-08-29T00:00:00Z)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Filter by end date in ISO format (e.g., 2024-08-29T23:59:59Z)' })
  @Get('statics')
  async statics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    let startDateObj: Date | undefined;
    let endDateObj: Date | undefined;

    if (startDate) {
      startDateObj = new Date(startDate);
      if (isNaN(startDateObj.getTime())) {
        throw new BadRequestException('Invalid startDate format. Please use ISO date format.');
      }
    }

    if (endDate) {
      endDateObj = new Date(endDate);
      if (isNaN(endDateObj.getTime())) {
        throw new BadRequestException('Invalid endDate format. Please use ISO date format.');
      }
    }

    return this.bozorService.statics(startDateObj, endDateObj);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bozorService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBozorDto: UpdateBozorDto) {
    return this.bozorService.update(id, updateBozorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bozorService.remove(id);
  }
}
