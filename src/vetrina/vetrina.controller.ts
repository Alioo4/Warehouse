import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { VetrinaService } from './vetrina.service';
import { CreateVetrinaDto } from './dto/create-vetrina.dto';
import { UpdateVetrinaDto } from './dto/update-vetrina.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Vetrina')
@Controller('vetrina')
export class VetrinaController {
  constructor(private readonly vetrinaService: VetrinaService) {}

  @Post()
  create(@Body() createVetrinaDto: CreateVetrinaDto) {
    return this.vetrinaService.create(createVetrinaDto);
  }

  @Get()
  findAll() {
    return this.vetrinaService.findAll();
  }

  @ApiQuery({ name: 'oluvchi', required: false, description: 'Filter by vetrina oluvchisi uchun' })
  @ApiQuery({ name: 'balon', required: false, description: 'Filter by vetrina balon uchun' })
  @Get('filter')
  filterData(
    @Req()
    @Query('oluvchi') oluvchi?: string,
    @Query('balon') balon?: string,
  ) {
    return this.vetrinaService.filterData(oluvchi, balon);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vetrinaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVetrinaDto: UpdateVetrinaDto) {
    return this.vetrinaService.update(id, updateVetrinaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vetrinaService.remove(id);
  }
}
