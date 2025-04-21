'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
import {
  VerifyCodeBodyType,
  VerifyCodeBody,
} from '@/schemaValidations/auth.schema';
import { useToast } from '@/components/ui/use-toast';
import apiAuthRequest from '@/apiRequests/auth';
import { useRouter } from 'next/navigation';
import { handleErrorApi } from '@/lib/utils';
import { useState } from 'react';
import Link from 'next/link';

export function VerifyForm({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<VerifyCodeBodyType>({
    resolver: zodResolver(VerifyCodeBody),
    defaultValues: {
      id: id,
      code: '',
    },
  });

  async function onSubmit(values: VerifyCodeBodyType) {

    if (loading) return;
    setLoading(true);
    try {
      const result = await apiAuthRequest.checkCode(values);
      toast({
        description: result.payload.message,
      });
      router.push(`/login`);
    } catch (error: any) {
      handleErrorApi({ error, setError: form.setError });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        noValidate
      >
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormControl className="mt-1">
                <Input
                  className=" w-full appearance-none rounded-md border border-neutral-300 px-3 py-2 placeholder-neutral-400 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm hidden"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormControl className="mt-1">
                <Input
                  className="block w-full appearance-none rounded-md border border-neutral-300 px-3 py-2 placeholder-neutral-400 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="group relative flex w-full justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-primary-foreground hover:bg-primary-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          type="submit"
        >
          Verify
        </Button>
      </form>
    </Form>
  );
}
