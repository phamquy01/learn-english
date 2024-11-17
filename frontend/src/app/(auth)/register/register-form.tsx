'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { useToast } from '@/components/ui/use-toast';
import {
  RegisterBodyType,
  RegisterBody,
} from '@/schemaValidations/auth.schema';
import apiAuthRequest from '@/apiRequests/auth';
import { useRouter } from 'next/navigation';
import { handleErrorApi } from '@/lib/utils';
import { useState } from 'react';
import Link from 'next/link';

export function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<RegisterBodyType>({
    resolver: zodResolver(RegisterBody),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: RegisterBodyType) {
    if (loading) return;
    setLoading(true);
    try {
      const result = await apiAuthRequest.register(values);
      toast({
        description: result.payload.message,
      });
      router.push(`/verify/${result.payload.user.id}`);
    } catch (error: any) {
      console.log(error);

      handleErrorApi({ error, setError: form.setError });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        className="space-y-6"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-sm font-medium text-muted-foreground">
                Name
              </FormLabel>
              <FormControl className="mt-1">
                <Input
                  className="relative block w-full appearance-none rounded-t-md border border-gray-300 px-3 py-2 placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                  placeholder="username"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                  className="relative block w-full appearance-none rounded-t-md border border-gray-300 px-3 py-2 placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
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
                  className="relative block w-full appearance-none rounded-t-md border border-gray-300 px-3 py-2 placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                  placeholder="Password"
                  {...field}
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-sm font-medium text-muted-foreground">
                Confirm password
              </FormLabel>
              <FormControl className="mt-1">
                <Input
                  className="relative block w-full appearance-none rounded-t-md border border-gray-300 px-3 py-2 placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                  placeholder="Confirm password"
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
            'Register'
          )}
        </Button>
      </form>
      <div className="flex items-center justify-center">
        <div className="text-sm">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-primary hover:text-primary-foreground"
          >
            Sign In
          </Link>
        </div>
      </div>
    </Form>
  );
}
