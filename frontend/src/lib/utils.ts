import { toast } from '@/components/ui/use-toast';
import { EntityError } from '@/lib/http';
import { type ClassValue, clsx } from 'clsx';
import { UseFormSetError } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { set } from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field as 'email' | 'password', {
        type: 'server',
        message: item.message,
      });
    });
  } else {
    toast({
      title: 'Error',
      description: error.payload.message ?? 'Lỗi không xác định',
      variant: 'destructive',
      duration: duration ?? 2000,
    });
  }
};

/**
 * xoá kí tự đầu tiên của path
 * @param path /
 * @returns
 */

export const nomalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path;
};



