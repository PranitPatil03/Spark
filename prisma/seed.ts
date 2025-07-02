import { PrismaClient } from "../lib/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  // Seed a USER message with a fragment
  await prisma.message.create({
    data: {
      content: "Hello, world!",
      role: "USER",
      type: "RESULT",
      fragment: {
        create: {
          title: "Join the Prisma Discord",
          files: {
            "index.js": "console.log('Hello, world!');",
          },
          sandboxUrl: "https://sandbox.com",
        },
      },
    },
  });

  // Seed an ASSISTANT error message (no fragment)
  await prisma.message.create({
    data: {
      content:
        "Sorry, I encountered an error while generating the code. Please try again later.",
      role: "ASSISTANT",
      type: "ERROR",
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
