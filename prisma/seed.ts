import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, Role } from '@prisma/client'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Start seeding ...')

  // 1. Create Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@library.com' },
    update: {},
    create: { email: 'admin@library.com', name: 'Admin User', role: Role.ADMIN },
  })
  
  const member = await prisma.user.upsert({
    where: { email: 'member@library.com' },
    update: {},
    create: { email: 'member@library.com', name: 'John Doe', role: Role.MEMBER },
  })

  // 2. Create Genres
  const genresData = [
    { name: 'Fiction' },
    { name: 'Science Fiction' },
    { name: 'Mystery' },
    { name: 'Biography' },
  ]
  
  const genres = []
  for (const g of genresData) {
    const genre = await prisma.genre.upsert({
      where: { name: g.name },
      update: {},
      create: { name: g.name },
    })
    genres.push(genre)
  }

  // 3. Create Books (16 books)
  const booksData = [
    { title: 'The Great Gatsby', isbn: '9780743273565', genreIndex: 0 },
    { title: 'To Kill a Mockingbird', isbn: '9780061120084', genreIndex: 0 },
    { title: '1984', isbn: '9780451524935', genreIndex: 1 },
    { title: 'Dune', isbn: '9780441172719', genreIndex: 1 },
    { title: 'Neuromancer', isbn: '9780441569595', genreIndex: 1 },
    { title: 'The Hobbit', isbn: '9780547928227', genreIndex: 1 },
    { title: 'The Girl with the Dragon Tattoo', isbn: '9780307454546', genreIndex: 2 },
    { title: 'Gone Girl', isbn: '9780307588371', genreIndex: 2 },
    { title: 'The Da Vinci Code', isbn: '9780307474278', genreIndex: 2 },
    { title: 'Sherlock Holmes', isbn: '9780553328257', genreIndex: 2 },
    { title: 'Steve Jobs', isbn: '9781451648539', genreIndex: 3 },
    { title: 'The Diary of a Young Girl', isbn: '9780553296983', genreIndex: 3 },
    { title: 'Becoming', isbn: '9781524763138', genreIndex: 3 },
    { title: 'Educated', isbn: '9780399590504', genreIndex: 3 },
    { title: 'The Midnight Library', isbn: '9780525559474', genreIndex: 0 },
    { title: 'Project Hail Mary', isbn: '9780593135204', genreIndex: 1 },
  ]

  for (const b of booksData) {
    await prisma.book.create({
      data: {
        title: b.title,
        isbn: b.isbn,
        genres: { connect: [{ id: genres[b.genreIndex].id }] },
      },
    })
  }

  // 4. Create a Review
  const firstBook = await prisma.book.findFirst()
  if (firstBook) {
    await prisma.review.create({
      data: {
        rating: 5,
        comment: 'An absolute classic!',
        bookId: firstBook.id,
        userId: member.id,
      },
    })
  }

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })