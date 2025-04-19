'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeClosed } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';

import { authenticate } from '@/actions/user/login';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authSchema, type TAuthSignIn } from '@/lib/content-types';

export default function Form() {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>('');
  const Icon = useMemo(
    () => (isPasswordVisible ? Eye : EyeClosed),
    [isPasswordVisible]
  );

  const {
    register,
    trigger,
    getValues,
    clearErrors,
    formState: { errors },
  } = useForm<TAuthSignIn>({
    // ** this resolver is handling the validation of the form using zod, and no longer need to add the validation in the input components e.g. {...register('imageUrl', {required: true})} now we only need to add {...register('imageUrl')}

    resolver: zodResolver(authSchema),
  });

  const handleAction = useCallback(async () => {
    const result = await trigger();
    if (!result) return;

    const { email, password }: TAuthSignIn = getValues();
    try {
      const response = await authenticate({
        email,
        password,
      });

      if (!response?.ok) {
        setErrorMessage(response?.message || 'Signup failed');
        return;
      }

      // Redirect to dashboard after successful signup and sign in
      window.location.replace('/dashboard');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setErrorMessage('Error during signup. Please try again later.');
    }
  }, [getValues, trigger]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, dispatch] = useFormState(handleAction, undefined);

  return (
    <form action={dispatch}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            {...register('email', {
              onChange: () => {
                clearErrors('email');
                setErrorMessage('');
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="flex relative">
            <Icon
              className="absolute right-5 top-2 cursor-pointer h-5"
              onClick={() => setIsPasswordVisible((prev) => !prev)}
            />

            <Input
              id="password"
              type={isPasswordVisible ? 'text' : 'password'}
              {...register('password', {
                onChange: () => {
                  clearErrors('password');
                  setErrorMessage('');
                },
              })}
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}
        </div>
        {/* <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='remember'
                className='h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary'
              />
              <label htmlFor='remember' className='text-sm text-gray-500 dark:text-gray-400'>
                Remember me
              </label>
            </div>
            <Link href='/forgot-password' className='text-sm font-medium text-primary hover:underline'>
              Forgot password?
            </Link>
          </div> */}
        {errorMessage && (
          <div>
            <small className="text-red-600">{errorMessage}</small>
          </div>
        )}
      </CardContent>
      <SignUpButton />
    </form>
  );
}

const SignUpButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={'secondary'}
      className="text-sm text-white font-extrabold hover:text-stone-100
        w-[85%] bg-gradient-to-br from-orange-200 to-orange-500 hover:scale-105 transition-all flex justify-self-center"
      disabled={pending}
    >
      Sign in
      {pending && (
        <div className="thinking-dots mb-6">
          Writting
          <span className="ml-1" />
          <span />
          <span />
        </div>
      )}
    </Button>
  );
};
