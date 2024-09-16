'use client';
import React, { forwardRef, useEffect, useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { CardBody, CardBodyType } from '@/schemaValidations/card.schema';

const InputCard = forwardRef<
  HTMLInputElement,
  {
    answer: string;
    indexCard: number | undefined;
    setIsFlipped: (index: number) => void;
  }
>(({ answer, indexCard, setIsFlipped }, ref) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<CardBodyType>({
    resolver: zodResolver(CardBody),
    defaultValues: {
      answer: answer,
      translation: '',
    },
  });

  useEffect(() => {
    if (answer) {
      form.reset({ answer, translation: '' });
    }
  }, [answer, form]);

  async function onSubmit(values: CardBodyType) {
    if (loading || indexCard === undefined) return;
    setLoading(true);
    setIsFlipped(indexCard);
    setLoading(false);
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
          name="answer"
          render={({ field }) => (
            <FormItem>
              <FormControl className="mt-1">
                <Input
                  className=" w-full appearance-none rounded-md border border-neutral-300 px-3 py-2 placeholder-neutral-400 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                  placeholder={answer}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="translation"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-sm font-medium text-muted-foreground">
                Answer
              </FormLabel>
              <FormControl className="mt-1">
                <Input
                  className="block w-full appearance-none rounded-md border border-neutral-300 px-3 py-2 placeholder-neutral-400 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                  placeholder="translation"
                  {...field}
                  ref={ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Loading...' : 'Submit'}
        </button>
      </form>
    </Form>
  );
});

export default InputCard;
