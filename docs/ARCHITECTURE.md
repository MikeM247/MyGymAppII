# Architecture

## Folder Structure

```text
My Gym App II/
  apps/
    api/
      api/
        auth/{register.ts,login.ts}
        exercises/index.ts
        templates/index.ts
        workouts/index.ts
        stats/index.ts
      prisma/
        schema.prisma
        migrations/202602140001_init/migration.sql
        seed.ts
      src/
        lib/{env.ts,prisma.ts,jwt.ts,password.ts,http.ts,rateLimit.ts}
        middleware/withHandler.ts
        repositories/
          userRepository.ts
          exerciseRepository.ts
          templateRepository.ts
          workoutRepository.ts
          personalRecordRepository.ts
          statsRepository.ts
        services/workoutService.ts
    mobile/
      app/
        _layout.tsx
        (auth)/{_layout.tsx,login.tsx,register.tsx}
        (tabs)/{_layout.tsx,index.tsx,exercises.tsx,templates.tsx,log.tsx,history.tsx,analytics.tsx}
      src/
        components/{Screen.tsx,PrimaryButton.tsx,TextField.tsx}
        features/
          auth/useAuthActions.ts
          exercises/useExercises.ts
          templates/useTemplates.ts
          workouts/useWorkoutLogger.ts
          history/useHistory.ts
          analytics/useAnalytics.ts
        lib/
          api/client.ts
          storage/{asyncStorage.ts,secureStore.ts}
        offline/syncService.ts
        store/{authStore.ts,offlineQueueStore.ts}
        theme/colors.ts
  packages/
    shared/
      src/index.ts
  docs/{SETUP.md,ARCHITECTURE.md}
```

## Design Principles

- Feature modules in mobile isolate fetching/business logic from route-level UI.
- Serverless route layer remains thin; repository + service layers hold domain logic.
- Shared Zod schemas/types (`packages/shared`) prevent contract drift.
- Prisma models are ready for future AI progression modules via additional `services/` without endpoint refactor.

## AI Progression Extension Path

Add a new service slice without restructuring:

- `apps/api/src/services/progressionService.ts`
- `apps/api/src/repositories/progressionRepository.ts`
- `apps/api/api/stats/progression.ts`

This keeps current workout logging/stats stable while introducing recommendation pipelines later.
