'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { set, z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LoginBody, LoginBodyType } from '@/schemaValidations/auth.schema';
import { useToast } from '@/components/ui/use-toast';
import apiAuthRequest from '@/apiRequests/auth';
import { useRouter } from 'next/navigation';
import { handleErrorApi } from '@/lib/utils';
import { useState } from 'react';
import Link from 'next/link';
import { ModalVerifyAccount } from '@/components/ModalVerifyAccount';

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: LoginBodyType) {
    if (loading) return;
    setLoading(true);
    const trimmedEmail = {
      email: values.email.trim(),
      password: values.password.trim(),
    };
    setUserEmail(trimmedEmail.email);
    try {
      const result = await apiAuthRequest.login(trimmedEmail);
      await apiAuthRequest.auth({
        accessToken: result.payload.data.accessToken,
      });
      toast({
        description: result.payload.message,
      });
      router.push(`/translate`);
      router.refresh();
    } catch (error: any) {
      console.log(error);

      setIsModalOpen(false);
      if (error?.status === 400) {
        setIsModalOpen(true);
      }
      handleErrorApi({ error, setError: form.setError });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-muted-foreground">
                  Email address
                </FormLabel>
                <FormControl className="mt-1">
                  <Input
                    className="block w-full appearance-none rounded-md border border-neutral-300 px-3 py-2 placeholder-neutral-400 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                    placeholder="Email address"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-muted-foreground">
                  Password
                </FormLabel>
                <FormControl className="mt-1">
                  <Input
                    className="block w-full appearance-none rounded-md border border-neutral-300 px-3 py-2 placeholder-neutral-400 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                    placeholder="Password"
                    {...field}
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-primary-foreground hover:bg-primary-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin h-5 w-5 mr-3 border" /> loading...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </form>
        <div className="flex items-center justify-center">
          <div className="text-sm">
            Don`t have an account?{' '}
            <Link
              href="/register"
              className="font-medium text-primary hover:text-primary-foreground"
            >
              Sign up
            </Link>
          </div>
        </div>
        {/* <div className="flex items-center justify-center">
          <div className="text-sm">
            <Link
              href="#"
              className="font-medium text-primary hover:text-primary-foreground"
            >
              Forgot password?
            </Link>
          </div>
        </div> */}
      </Form>
      {isModalOpen && (
        <ModalVerifyAccount
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          userEmail={userEmail}
        />
      )}
    </>
  );
}
