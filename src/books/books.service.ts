
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateBookDto) {
    return this.prisma.book.create({
      data,
    });
  }

  async findAll(genreId?: number, search?: string, page: number = 1, limit: number = 10) {
    const where: Prisma.BookWhereInput = {};

    if (genreId) {
      where.genreId = Number(genreId);
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * limit;

    return this.prisma.book.findMany({
      where,
      skip,
      take: Number(limit),
      include: { genre: true },
    });
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: { genre: true },
    });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  // THIS IS THE MISSING METHOD
  async update(id: number, data: Prisma.BookUpdateInput) {
    await this.findOne(id); // Throws error if not found
    return this.prisma.book.update({
      where: { id },
      data,
    });
  }

  // THIS IS THE MISSING METHOD
  async remove(id: number) {
    await this.findOne(id); // Throws error if not found
    return this.prisma.book.delete({
      where: { id },
    });
  }
}
