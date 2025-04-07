import 'server-only';

import { redirect } from 'next/navigation';

import { auth } from './auth-no-edge';
import prisma from './prisma';

import type { User } from '@prisma/client';

export async function checkAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  return session;
}

export async function getUserByEmail(email: User['email']) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return user;
}
