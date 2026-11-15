import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class GenresService {
  // This line is where the import is used!
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.GenreCreateInput) {
    return this.prisma.genre.create({ data });
  }

  async findAll() {
    return this.prisma.genre.findMany();
  }

  async findOne(id: number) {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
    });
    if (!genre) {
      throw new NotFoundException(`Genre with ID ${id} not found`);
    }
    return genre;
  }

  async update(id: number, data: Prisma.GenreUpdateInput) {
    await this.findOne(id); // Check if it exists first
    return this.prisma.genre.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Check if it exists first
    return this.prisma.genre.delete({
      where: { id },
    });
  }
}

