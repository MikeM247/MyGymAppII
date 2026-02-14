import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const exercises = [
  { slug: "barbell-back-squat", name: "Barbell Back Squat", muscleGroup: "Legs", equipment: "Barbell", youtubeUrl: "https://www.youtube.com/watch?v=ultWZbUMPL8" },
  { slug: "barbell-bench-press", name: "Barbell Bench Press", muscleGroup: "Chest", equipment: "Barbell", youtubeUrl: "https://www.youtube.com/watch?v=rT7DgCr-3pg" },
  { slug: "conventional-deadlift", name: "Conventional Deadlift", muscleGroup: "Posterior Chain", equipment: "Barbell", youtubeUrl: "https://www.youtube.com/watch?v=ytGaGIn3SjE" },
  { slug: "overhead-press", name: "Overhead Press", muscleGroup: "Shoulders", equipment: "Barbell", youtubeUrl: "https://www.youtube.com/watch?v=2yjwXTZQDDI" },
  { slug: "pull-up", name: "Pull-Up", muscleGroup: "Back", equipment: "Bodyweight", youtubeUrl: "https://www.youtube.com/watch?v=eGo4IYlbE5g" },
  { slug: "romanian-deadlift", name: "Romanian Deadlift", muscleGroup: "Hamstrings", equipment: "Barbell", youtubeUrl: "https://www.youtube.com/watch?v=JCXUYuzwNrM" },
  { slug: "dumbbell-row", name: "Dumbbell Row", muscleGroup: "Back", equipment: "Dumbbell", youtubeUrl: "https://www.youtube.com/watch?v=roCP6wCXPqo" },
  { slug: "incline-dumbbell-press", name: "Incline Dumbbell Press", muscleGroup: "Chest", equipment: "Dumbbell", youtubeUrl: "https://www.youtube.com/watch?v=8iPEnn-ltC8" },
  { slug: "lat-pulldown", name: "Lat Pulldown", muscleGroup: "Back", equipment: "Cable", youtubeUrl: "https://www.youtube.com/watch?v=CAwf7n6Luuc" },
  { slug: "leg-press", name: "Leg Press", muscleGroup: "Legs", equipment: "Machine", youtubeUrl: "https://www.youtube.com/watch?v=IZxyjW7MPJQ" }
];

async function main() {
  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: { slug: exercise.slug },
      update: exercise,
      create: exercise
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
