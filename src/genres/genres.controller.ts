import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { GenresService } from './genres.service';
import { Prisma } from '@prisma/client';

@Controller('genres')
export class GenresController {
  // This connects the controller to the service
  constructor(private readonly genresService: GenresService) {}

  @Post()
  create(@Body() createGenreDto: Prisma.GenreCreateInput) {
    return this.genresService.create(createGenreDto);
  }

  @Get()
  findAll() {
    return this.genresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.genresService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateGenreDto: Prisma.GenreUpdateInput
  ) {
    return this.genresService.update(id, updateGenreDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.genresService.remove(id);
  }
}
