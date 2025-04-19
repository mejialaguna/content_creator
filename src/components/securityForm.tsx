'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeClosed } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { passwordReset } from '@/actions/user/passwordReset';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { securitySchema, type TAuthSecurity } from '@/lib/content-types';

export default function Securityform() {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] =
    useState<boolean>(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>('');
  const {
    register,
    trigger,
    getValues,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<TAuthSecurity>({
    // ** this resolver is handling the validation of the form using zod, and no longer need to add the validation in the input components e.g. {...register('imageUrl', {required: true})} now we only need to add {...register('imageUrl')}

    resolver: zodResolver(securitySchema),
  });
  const Icon = useMemo(
    () => ({
      password: isPasswordVisible ? Eye : EyeClosed,
      newPassword: isNewPasswordVisible ? Eye : EyeClosed,
      confirmPassword: isConfirmPasswordVisible ? Eye : EyeClosed,
    }),
    [isPasswordVisible, isNewPasswordVisible, isConfirmPasswordVisible]
  );

  const handleAction = useCallback(async () => {
    const result = await trigger();
    if (!result) return;

    const { email, password, newPassword, confirmPassword }: TAuthSecurity =
      getValues();
    try {
      const response = await passwordReset({
        email,
        password,
        newPassword,
        confirmPassword,
      });

      if (!response?.ok) {
        setErrorMessage(response?.message || 'Signup failed');
        return;
      }
      toast(response.message);
      reset();
    } catch (error) {
      toast('Error during password reset.');
      setErrorMessage('Error during password reset. Please try again later.');
    }
  }, [getValues, reset, trigger]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, dispatch] = useFormState(handleAction, undefined);

  return (
    <form action={dispatch}>
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>
            Manage your password and security preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              placeholder='m@example.com'
              {...register('email', {
                onChange: () => {
                  clearErrors('email');
                  setErrorMessage('');
                },
              })}
            />
            {errors.email && (
              <p className='text-red-500 text-xs'>{errors.email.message}</p>
            )}
          </div>
          <div className='space-y-2'>
            <Label htmlFor='password'>Current Password</Label>
            <div className='flex relative'>
              <Icon.password
                className='absolute right-5 top-2 cursor-pointer h-5'
                onClick={() => setIsPasswordVisible((prev) => !prev)}
              />
              <Input
                id='password'
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
              <p className='text-red-500 text-xs'>{errors.password.message}</p>
            )}
          </div>
          <div className='space-y-2'>
            <Label htmlFor='newPassword'>New Password</Label>
            <div className='flex relative'>
              <Icon.newPassword
                className='absolute right-5 top-2 cursor-pointer h-5'
                onClick={() => setIsNewPasswordVisible((prev) => !prev)}
              />
              <Input
                id='newPassword'
                type={isNewPasswordVisible ? 'text' : 'password'}
                {...register('newPassword', {
                  onChange: () => {
                    clearErrors('newPassword');
                    setErrorMessage('');
                  },
                })}
              />
            </div>
            {errors.newPassword && (
              <p className='text-red-500 text-xs'>
                {errors.newPassword.message}
              </p>
            )}
          </div>
          <div className='space-y-2'>
            <Label htmlFor='confirmPassword'>Confirm New Password</Label>
            <div className='flex relative'>
              <Icon.newPassword
                className='absolute right-5 top-2 cursor-pointer h-5'
                onClick={() => setIsConfirmPasswordVisible((prev) => !prev)}
              />
              <Input
                id='confirmPassword'
                type={isConfirmPasswordVisible ? 'text' : 'password'}
                {...register('confirmPassword', {
                  onChange: () => {
                    clearErrors('confirmPassword');
                    setErrorMessage('');
                  },
                })}
              />
            </div>
            {errors.confirmPassword && (
              <p className='text-red-500 text-xs'>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          {errorMessage && (
            <div>
              <small className='text-red-600'>{errorMessage}</small>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <SignUpButton />
        </CardFooter>
      </Card>
    </form>
  );
}

const SignUpButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      type='submit'
      variant={'secondary'}
      className='text-sm text-white font-extrabold hover:text-stone-100
        w-full bg-gradient-to-br from-orange-200 to-orange-500 transition-all flex justify-self-center'
      disabled={pending}
    >
      Change Password
    </Button>
  );
};
