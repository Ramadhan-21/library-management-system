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
    // 1. Build the WHERE clause for filtering and searching
    const where: Prisma.BookWhereInput = {};

    if (genreId) {
      where.genreId = Number(genreId); // Ensure it's a number
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ];
    }

    // 2. Calculate Pagination (skip and take)
    const skip = (page - 1) * limit;

    // 3. Execute the query
    return this.prisma.book.findMany({
      where,
      skip,
      take: Number(limit),
      include: { genre: true }, // Optionally include the genre details
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

  async update(id: number, data: Prisma.BookUpdateInput) {
    await this.findOne(id); // Check if exists
    return this.prisma.book.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Check if exists
    return this.prisma.book.delete({
      where: { id },
    });
  }
}