import { PrismaClient } from "./generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import seedData_2015_2018 from "./games-seed-2015-2018.json";
import seedData_2019_2022 from "./games-seed-2019-2022.json";
import seedData_2022_2026 from "./games-seed-2022-2024.json";

/* ================= DB ADAPTER ================= */
const adapter = new PrismaMariaDb({
  host: process.env.db_host || "127.0.0.1",
  port: 3306,
  database: process.env.db_name || "gaming_community",
  user: process.env.db_user || "root",
  password: process.env.db_password || "",
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

/* ================= INTERFACES ================= */
interface PlatformData {
  name: string;
  slug: string;
  icon: string;
}

interface GameData {
  name: string;
  slug: string;
  description: string;
  developer: string;
  publisher: string;
  releaseDate: string;
  coverImage: string;
  platforms: string[];
}

interface SeedData {
  platforms: PlatformData[];
  games: GameData[];
}

/* ================= MERGE SEED DATA ================= */
function mergeSeedData(
  seed1: SeedData,
  seed2: SeedData,
  seed3: SeedData,
): SeedData {
  // دمج المنصات وحذف التكرار
  const platformMap = new Map<string, PlatformData>();

  for (const data of [seed1, seed2, seed3]) {
    for (const platform of data.platforms) {
      platformMap.set(platform.slug, platform);
    }
  }

  // دمج الالعاب
  const games: GameData[] = [...seed1.games, ...seed2.games, ...seed3.games];

  return {
    platforms: Array.from(platformMap.values()),
    games,
  };
}

/* ================= MAIN ================= */
async function main() {
  try {
    console.log("\n🌱 Starting database seeding...\n");

    /* ================= MERGE ALL DATA ================= */
    console.log("📋 Merging seed data from all sources...");
    const seedData = mergeSeedData(
      seedData_2015_2018,
      seedData_2019_2022,
      seedData_2022_2026,
    );
    console.log(`   ✅ Merged data ready`);
    console.log(`   📦 Total platforms: ${seedData.platforms.length}`);
    console.log(`   🎮 Total games: ${seedData.games.length}\n`);
    await prisma.$executeRawUnsafe("SET FOREIGN_KEY_CHECKS=0");
    /* ================= CLEANUP ================= */
    console.log("🗑️  Cleaning old data...");
    await prisma.playRequestParticipant.deleteMany({});
    await prisma.playRequest.deleteMany({});
    await prisma.newsTag.deleteMany({});
    await prisma.news.deleteMany({});
    await prisma.reviewPlatform.deleteMany({});
    await prisma.reviewGenre.deleteMany({});
    await prisma.review.deleteMany({});
    await prisma.mediaComment.deleteMany({});
    await prisma.mediaLike.deleteMany({});
    await prisma.mediaTag.deleteMany({});
    await prisma.mediaItem.deleteMany({});
    await prisma.gamePlatform.deleteMany({});
    await prisma.game.deleteMany({});
    await prisma.platform.deleteMany({});
    await prisma.$executeRawUnsafe("SET FOREIGN_KEY_CHECKS=1");

    /* ================= SEED PLATFORMS ================= */
    console.log("📦 Seeding platforms...");
    const platformMap: Record<string, string> = {};
    let platformCount = 0;

    for (const platform of seedData.platforms) {
      try {
        const created = await prisma.platform.upsert({
          where: { slug: platform.slug },
          update: {
            name: platform.name,
            icon: platform.icon,
          },
          create: {
            name: platform.name,
            slug: platform.slug,
            icon: platform.icon,
          },
        });
        platformMap[platform.slug] = created.id;
        platformCount++;
        console.log(`   ✅ ${platform.icon} ${platform.name}`);
      } catch (error) {
        console.error(`   ❌ Failed to seed platform ${platform.name}:`, error);
      }
    }
    console.log(
      `   Summary: ${platformCount}/${seedData.platforms.length} platforms seeded\n`,
    );

    /* ================= SEED GAMES ================= */
    console.log("🎮 Seeding games...");
    let gameCount = 0;
    let relationCount = 0;

    for (const game of seedData.games) {
      try {
        // Create/Update game
        const createdGame = await prisma.game.upsert({
          where: { slug: game.slug },
          update: {
            name: game.name,
            description: game.description,
            developer: game.developer,
            publisher: game.publisher,
            coverImage: game.coverImage,
            releaseDate: new Date(game.releaseDate),
          },
          create: {
            name: game.name,
            slug: game.slug,
            description: game.description,
            developer: game.developer,
            publisher: game.publisher,
            coverImage: game.coverImage,
            releaseDate: new Date(game.releaseDate),
          },
        });

        // Link platforms
        let platformLinked = 0;
        for (const platformSlug of game.platforms) {
          const platformId = platformMap[platformSlug];
          if (!platformId) {
            console.warn(
              `   ⚠️  Platform '${platformSlug}' not found for game '${game.name}'`,
            );
            continue;
          }

          try {
            await prisma.gamePlatform.upsert({
              where: {
                gameId_platformId: {
                  gameId: createdGame.id,
                  platformId,
                },
              },
              update: {},
              create: {
                gameId: createdGame.id,
                platformId,
              },
            });
            platformLinked++;
            relationCount++;
          } catch (error) {
            console.error(
              `   ❌ Failed to link platform ${platformSlug} to ${game.name}:`,
              error,
            );
          }
        }

        gameCount++;
        console.log(
          `   ✅ ${game.name} (${platformLinked} platforms) [${game.developer}]`,
        );
      } catch (error) {
        console.error(`   ❌ Failed to seed game ${game.name}:`, error);
      }
    }
    console.log(
      `   Summary: ${gameCount}/${seedData.games.length} games seeded`,
    );
    console.log(
      `   Summary: ${relationCount} game-platform relations created\n`,
    );

    /* ================= SEED ADMIN USER ================= */
    console.log("👤 Seeding admin user...");
    try {
      const admin = await prisma.user.upsert({
        where: { email: "admin@gaming.hub" },
        update: {},
        create: {
          username: "admin",
          email: "admin@gaming.hub",
          password: "hashed_password_here", // Should be hashed in production
          name: "Admin User",
          avatar: null,
        },
      });
      console.log(`   ✅ Admin user ready (ID: ${admin.id})\n`);
    } catch (error) {
      console.error("   ❌ Failed to seed admin user:", error);
    }

    /* ================= FINAL SUMMARY ================= */
    console.log("═══════════════════════════════════════════════════");
    console.log("✅ Database seeding completed successfully!");
    console.log("═══════════════════════════════════════════════════");
    console.log(`📊 Statistics:`);
    console.log(`   • Platforms: ${platformCount}`);
    console.log(`   • Games: ${gameCount}`);
    console.log(`   • Relations: ${relationCount}`);
    console.log(`   • Date: ${new Date().toLocaleString()}`);
    console.log("═══════════════════════════════════════════════════\n");
  } catch (error) {
    console.error("\n❌ Critical error during seeding:", error);
    process.exit(1);
  }
}

/* ================= RUN ================= */
main()
  .catch((e) => {
    console.error("\n❌ Unexpected error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("🔌 Database connection closed\n");
  });
