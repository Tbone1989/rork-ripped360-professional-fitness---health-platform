import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import nutritionSearchRoute from "./routes/nutrition/search/route";
import nutritionBarcodeRoute from "./routes/nutrition/barcode/route";
import nutritionMealPlanRoute from "./routes/nutrition/meal-plan/route";
import fitnessExercisesRoute from "./routes/fitness/exercises/route";
import fitnessGenerateRoute from "./routes/fitness/generate/route";
import healthBloodworkRoute from "./routes/health/bloodwork/route";
import healthSupplementsSearchRoute from "./routes/health/supplements/search/route";
import healthSupplementsBarcodeRoute from "./routes/health/supplements/barcode/route";
import healthDigestiveRoute from "./routes/health/digestive/route";
import healthDetoxRoute from "./routes/health/detox/route";
import healthIssuesRoute from "./routes/health/issues/route";
import coachingListRoute from "./routes/coaching/list/route";
import coachingSessionsRoute from "./routes/coaching/sessions/route";
import coachingMessagesRoute from "./routes/coaching/messages/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  nutrition: createTRPCRouter({
    search: nutritionSearchRoute,
    barcode: nutritionBarcodeRoute,
    mealPlan: nutritionMealPlanRoute,
  }),
  fitness: createTRPCRouter({
    exercises: fitnessExercisesRoute,
    generate: fitnessGenerateRoute,
  }),
  health: createTRPCRouter({
    bloodwork: healthBloodworkRoute,
    digestive: healthDigestiveRoute,
    detox: healthDetoxRoute,
    issues: healthIssuesRoute,
    supplements: createTRPCRouter({
      search: healthSupplementsSearchRoute,
      barcode: healthSupplementsBarcodeRoute,
    }),
  }),
  coaching: createTRPCRouter({
    list: coachingListRoute,
    sessions: createTRPCRouter({
      list: coachingSessionsRoute.listSessionsRoute,
      book: coachingSessionsRoute.bookSessionRoute,
    }),
    messages: createTRPCRouter({
      conversations: coachingMessagesRoute.listConversationsRoute,
      list: coachingMessagesRoute.getMessagesRoute,
      send: coachingMessagesRoute.sendMessageRoute,
    }),
  }),
});

export type AppRouter = typeof appRouter;