import type { NextAuthConfig } from 'next-auth';

export const nextAuthEdgeConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized: ({ auth, request }) => {
      // runs on every request with middleware
      const isLoggedIn = Boolean(auth?.user);
      const isTryingToAccessApp =
        request.nextUrl.pathname.includes('/dashboard');
      const loginPage = request.nextUrl.pathname.includes('/login');
      const signupPage = request.nextUrl.pathname.includes('/signup');

      if (isLoggedIn && !isTryingToAccessApp) {
        return Response.redirect(new URL('/dashboard', request.nextUrl));
      }

      if (isLoggedIn && isTryingToAccessApp) {
        return true;
      }
      
      if (!isLoggedIn && isTryingToAccessApp) {
        return Response.redirect(new URL('/login', request.nextUrl));
      }

      // Otherwise (like public pages) allow
      return true;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        // on sign in
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        token.userId = user.id!;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        token.email = user.email!;
      }

      return token;
    },
    session: ({ session, token }) => {
      session.user.id = token.userId as string;

      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
