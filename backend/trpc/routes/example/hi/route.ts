import { z } from "zod";
import { publicProcedure } from "../../../create-context";

export default publicProcedure
  .input(z.object({ name: z.string() }))
  .mutation(({ input }) => {
    console.log('✅ Backend health check - tRPC is working!');
    return {
      hello: input.name,
      date: new Date(),
      status: "healthy",
      backend: "running"
    };
  });