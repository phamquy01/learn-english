/* eslint-disable react/display-name */
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
import { toast } from 'sonner';
import { motion } from 'framer-motion';

import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { RefreshCcw } from 'lucide-react';

const InputCard = forwardRef<
  HTMLInputElement,
  {
    answer: string;
    indexCard: number | undefined;
    setIsFlipped: (index: number) => void;
    isDisabledInput: boolean;
    handleResfresh: () => void;
  }
>(
  (
    { answer, indexCard, setIsFlipped, isDisabledInput, handleResfresh },
    ref
  ) => {
    const [loading, setLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = () => {
      setIsRefreshing(true);
      handleResfresh();
      form.reset({ answer, translation: '' });
      setTimeout(() => {
        setIsRefreshing(false);
      }, 2000);
    };

    const form = useForm<CardBodyType>({
      resolver: zodResolver(CardBody),
      defaultValues: {
        answer: answer,
        translation: '',
      },
    });

    const findMissingAndIncorrectChars = (
      answer: string,
      translation: string
    ) => {
      const answerChars = answer.split('');
      const translationChars = translation.split('');

      const missingChars: string[] = [];
      const incorrectChars: string[] = [];

      const translationCharCount: { [key: string]: number } = {};
      const translationCharText: { [key: string]: number }[] = [];

      translationChars.forEach((char) => {
        translationCharCount[char] = (translationCharCount[char] || 0) + 1;
      });

      answerChars.forEach((char) => {
        if (translationCharCount[char]) {
          translationCharCount[char] -= 1;
          translationCharText.push({ [char]: 0 });
        } else {
          missingChars.push(char);
          translationCharText.push({ [char]: 1 });
        }
      });

      for (const [char, count] of Object.entries(translationCharCount)) {
        if (count > 0) {
          for (let i = 0; i < count; i++) {
            incorrectChars.push(char);
          }
        }
      }

      const wrongchars = translationCharText.map((char) => {
        return Object.entries(char).map(([key, value]) => {
          return (
            <span
              key={key}
              className={`${value === 1 ? 'text-[#ca262d] underline' : ''}`}
            >
              {key}
            </span>
          );
        });
      });

      return wrongchars;
    };

    async function onSubmit(values: CardBodyType) {
      if (loading || indexCard === undefined) return;

      if (values.translation !== answer) {
        const wrongchars = findMissingAndIncorrectChars(
          answer,
          values.translation
        );

        toast.error('', {
          description: (
            <div className="text-sm text-gray-600 ml-4 font-bold">
              Câu trả lời của bạn nên là : {wrongchars}
            </div>
          ),
          icon: <span className="text-2xl">🔥</span>,
          position: 'top-right',
        });
      } else {
        setLoading(true);
        setIsFlipped(indexCard);
        setLoading(false);
      }
    }

    useEffect(() => {
      if (answer) {
        form.reset({ answer, translation: '' });
        setIsAnimating(true);
      }
    }, [answer, form]);

    const [isAnimating, setIsAnimating] = useState(false); // State for animation

    useEffect(() => {
      if (isAnimating) {
        const timer = setTimeout(() => setIsAnimating(false), 1000);
        return () => clearTimeout(timer);
      }
    }, [isAnimating]);

    return (
      <>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-[300px] mx-auto my-10"
            noValidate
          >
            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-xl font-medium text-foreground text-center">
                    Answer
                  </FormLabel>
                  <FormControl className="mt-1">
                    <Input
                      className={`block w-full appearance-none rounded-md border border-neutral-300 px-3 py-2 placeholder-neutral-400 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm ${
                        isAnimating ? 'animate-bounce-fast' : ''
                      }
                        `}
                      placeholder="translation"
                      {...field}
                      ref={ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between items-center mt-2 gap-4">
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 w-full  mx-auto"
                disabled={loading || isDisabledInput}
              >
                {loading ? 'Loading...' : 'Check'}
              </Button>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                      className="flex items-center space-x-2 bg-white hover:bg-gray-100 text-black"
                    >
                      <motion.div
                        animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
                        transition={{ duration: 1, ease: 'linear' }}
                      >
                        <RefreshCcw className="h-5 w-5 text-black" />
                      </motion.div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Làm mới từ vựng</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </form>
        </Form>
      </>
    );
  }
);

export default InputCard;
