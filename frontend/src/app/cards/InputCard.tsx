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
import { Button } from '@/components/ui/button';

const InputCard = forwardRef<
  HTMLInputElement,
  {
    answer: string;
    indexCard: number | undefined;
    setIsFlipped: (index: number) => void;
    isDisabledInput: boolean;
  }
>(({ answer, indexCard, setIsFlipped, isDisabledInput }, ref) => {
  const [loading, setLoading] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

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
      setIsCorrect(false);
    }
  }, [answer, form]);

  async function onSubmit(values: CardBodyType) {
    if (loading || indexCard === undefined) return;
    if (values.translation !== answer) {
      setIsCorrect(false);
    }

    setLoading(true);
    setIsFlipped(indexCard);
    setLoading(false);
    setIsCorrect(true);
  }

  console.log(indexCard);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-[300px] mx-auto my-10"
        noValidate
      >
        <FormField
          control={form.control}
          name="answer"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl className="mt-1">
                <Input
                  className="w-full appearance-none rounded-md border border-neutral-300 px-3 py-2 placeholder-neutral-400 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm hidden"
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
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="block text-xl font-medium text-foreground text-center">
                Answer
              </FormLabel>
              <FormControl className="mt-1">
                <Input
                  className={`block w-full appearance-none rounded-md border border-neutral-300 px-3 py-2 placeholder-neutral-400 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm
                     ${
                       fieldState.error
                         ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                         : isCorrect === true
                         ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                         : 'border-neutral-300 focus:border-primary focus:ring-primary'
                     }`}
                  placeholder="translation"
                  {...field}
                  ref={ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 w-full mt-2 mx-auto"
          disabled={loading || isDisabledInput}
        >
          {loading ? 'Loading...' : 'Check'}
        </Button>
      </form>
    </Form>
  );
});

export default InputCard;
