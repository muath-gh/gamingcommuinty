import { PrismaClient } from './generated/prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import slugify from 'slugify'

/* ================= DB ADAPTER ================= */
const adapter = new PrismaMariaDb({
  host: 'localhost',
  port: 3306,
  connectionLimit: 5,
  database: 'gaming_hub',
  user: 'root',
  password: '',
})

const prisma = new PrismaClient({ adapter })

/* ================= MAIN ================= */
async function main() {
  console.log('🌱 Seeding database...')

  /* ================= USERS ================= */
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gaming.hub' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@gaming.hub',
      password: 'hashed_password_here',
      name: 'Admin User',
      avatar: null,
    },
  })

  /* ================= PLATFORMS ================= */
  const pc = await prisma.platform.upsert({
    where: { slug: 'pc' },
    update: {},
    create: { name: 'PC', slug: 'pc' },
  })

  const playstation = await prisma.platform.upsert({
    where: { slug: 'playstation' },
    update: {},
    create: { name: 'PlayStation', slug: 'playstation' },
  })

  const xbox = await prisma.platform.upsert({
    where: { slug: 'xbox' },
    update: {},
    create: { name: 'Xbox', slug: 'xbox' },
  })

  /* ================= GAMES (10) ================= */
  const gamesData = [
    { name: 'Minecraft', developer: 'Mojang', publisher: 'Mojang' },
    { name: 'Fortnite', developer: 'Epic Games', publisher: 'Epic Games' },
    { name: 'League of Legends', developer: 'Riot Games', publisher: 'Riot Games' },
    { name: 'GTA V', developer: 'Rockstar North', publisher: 'Rockstar Games' },
    { name: 'Cyberpunk 2077', developer: 'CD Projekt Red', publisher: 'CD Projekt' },
    { name: 'The Witcher 3', developer: 'CD Projekt Red', publisher: 'CD Projekt' },
    { name: 'Red Dead Redemption 2', developer: 'Rockstar Games', publisher: 'Rockstar Games' },
    { name: 'Valorant', developer: 'Riot Games', publisher: 'Riot Games' },
    { name: 'Call of Duty: Modern Warfare', developer: 'Infinity Ward', publisher: 'Activision' },
    { name: 'Elden Ring', developer: 'FromSoftware', publisher: 'Bandai Namco' },
  ]

  const games = []

  for (const game of gamesData) {
    const slug = slugify(game.name, { lower: true, strict: true })

    const createdGame = await prisma.game.upsert({
      where: { slug },
      update: {},
      create: {
        name: game.name,
        slug,
        description: `${game.name} game`,
        developer: game.developer,
        publisher: game.publisher,
      },
    })

    games.push(createdGame)

    await prisma.gamePlatform.createMany({
      data: [
        { gameId: createdGame.id, platformId: pc.id },
        { gameId: createdGame.id, platformId: playstation.id },
        { gameId: createdGame.id, platformId: xbox.id },
      ],
      skipDuplicates: true,
    })
  }

  /* ================= TAGS ================= */
  const tagBreaking = await prisma.tag.upsert({
    where: { slug: 'breaking' },
    update: {},
    create: { name: 'Breaking', slug: 'breaking' },
  })

  const tagUpdate = await prisma.tag.upsert({
    where: { slug: 'update' },
    update: {},
    create: { name: 'Update', slug: 'update' },
  })

  /* ================= GENRE ================= */
  const genreAction = await prisma.genre.upsert({
    where: { slug: 'action' },
    update: {},
    create: { name: 'Action', slug: 'action' },
  })

  /* ================= NEWS ================= */
  const news = await prisma.news.upsert({
    where: { slug: 'gaming-hub-launch' },
    update: {},
    create: {
      title: 'إطلاق Gaming Hub رسميًا',
      slug: 'gaming-hub-launch',
      excerpt: 'تم إطلاق منصة Gaming Hub لتجميع أخبار وميديا الألعاب.',
      contentPath: '/content/news/launch.md',
      contentType: 'markdown',
      category: 'أخبار',
      isFeatured: true,
      published: true,
      authorId: admin.id,
      gameId: games[0].id,
    },
  })

  await prisma.newsTag.createMany({
    data: [
      { newsId: news.id, tagId: tagBreaking.id },
      { newsId: news.id, tagId: tagUpdate.id },
    ],
    skipDuplicates: true,
  })

  /* ================= REVIEW ================= */
  const review = await prisma.review.upsert({
    where: { slug: 'minecraft-review' },
    update: {},
    create: {
      title: 'Minecraft Review',
      slug: 'minecraft-review',
      excerpt: 'لعبة لا حدود للإبداع فيها.',
      contentPath: '/content/reviews/minecraft.md',
      contentType: 'markdown',
      rating: 9.5,
      published: true,
      authorId: admin.id,
      gameId: games[0].id,
    },
  })

  await prisma.reviewGenre.createMany({
    data: [{ reviewId: review.id, genreId: genreAction.id }],
    skipDuplicates: true,
  })

  await prisma.reviewPlatform.createMany({
    data: [
      { reviewId: review.id, platformId: pc.id },
      { reviewId: review.id, platformId: playstation.id },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Database seeded successfully')
}

/* ================= RUN ================= */
main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
