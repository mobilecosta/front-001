import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { contasRouter } from "./routers/contas";
import { categoriasRouter } from "./routers/categorias";
import { transacoesRouter } from "./routers/transacoes";
import { dashboardRouter } from "./routers/dashboard";
import { tenantsRouter } from "./routers/tenants";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Routers de negócio
  contas: contasRouter,
  categorias: categoriasRouter,
  transacoes: transacoesRouter,
  dashboard: dashboardRouter,
  tenants: tenantsRouter,
});

export type AppRouter = typeof appRouter;
