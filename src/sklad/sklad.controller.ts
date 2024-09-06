import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, UseGuards } from '@nestjs/common';
import { SkladService } from './sklad.service';
import { CreateSkladDto } from './dto/create-sklad.dto';
import { UpdateSkladDto } from './dto/update-sklad.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Sklad')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('sklad')
export class SkladController {
  constructor(private readonly skladService: SkladService) {}

  @Post()
  create(@Body() createSkladDto: CreateSkladDto) {
    return this.skladService.create(createSkladDto);
  }

  @ApiQuery({ name: 'balon', required: false, description: 'Filter by task priority' })
  @Get('filter')
  filterData(
    @Req()
    @Query('balon') balon?: string,
  ) {
    return this.skladService.filterData(balon);
  }

  @Get()
  findAll() {
    return this.skladService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.skladService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSkladDto: UpdateSkladDto) {
    return this.skladService.update(id, updateSkladDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.skladService.remove(id);
  }
}
