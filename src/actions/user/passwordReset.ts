'use server';

import bcrypt from 'bcryptjs';

import { securitySchema, type TAuthSecurity  } from '@/lib/content-types';
import prisma from '@/lib/prisma';
import { getUserByEmail } from '@/lib/server-utils';

interface AuthenticationResult {
  ok: boolean;
  message?: string;
}

export async function passwordReset(
  formData: TAuthSecurity
): Promise<AuthenticationResult> {

  const { success, data } = securitySchema.safeParse({ ...formData });

  if (!success) return { ok: false, message: 'Invalid user data' };

  try {
    const user = await getUserByEmail(data.email.toLowerCase());

    if(!user) {
      return { ok: false, message: 'User not found' };
    }

    const passwordsMatch = await bcrypt.compare(
      data.password,
      user.password
    );
    if (!passwordsMatch) {
      // eslint-disable-next-line no-console
      console.log('Current password is incorrect');
      return {ok: false, message: 'Current password is incorrect'};
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    await prisma.user.update({
      where: {
        email: data.email.toLowerCase(),
      },
      data: {
        password: hashedPassword,
      },
    });

    return { ok: true, message: 'Password reset successful' };

  } catch (error) {
    return {
      ok: false,
      message: 'Something went wrong. Please try again.',
    };
  }
}
