import { toast } from '@/components/ui/use-toast';
import { EntityError } from '@/lib/http';
import { type ClassValue, clsx } from 'clsx';
import { UseFormSetError } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { set } from 'zod';
import jwt from 'jsonwebtoken';

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
      description: error?.payload?.message ?? 'Lỗi không xác định',
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

export const decodeJwt = <Payload = any>(token: string) => {
  return jwt.decode(token) as Payload;
};

const base26Chars = 'abcdefghijklmnopqrstuvwxyz';

export const encodeToBase26 = (numbers: number[]): string => {
  const binaryString = numbers
    .map((num) => (1 << num).toString(2))
    .reduce((acc, curr) => (parseInt(acc, 2) | parseInt(curr, 2)).toString(2));

  let decimalValue = parseInt(binaryString, 2);
  let base26String = '';

  while (decimalValue > 0) {
    base26String = base26Chars[decimalValue % 26] + base26String;
    decimalValue = Math.floor(decimalValue / 26);
  }

  if (base26String.length < 2) {
    base26String =
      base26Chars[0].repeat(2 - base26String.length) + base26String;
  } else if (base26String.length > 2) {
    base26String = base26String.slice(-2);
  }

  return base26String;
};

export const decodeFromBase26 = (encodedString: string): number[] => {
  let decimalValue = 0;

  for (let i = 0; i < encodedString.length; i++) {
    const char = encodedString[i];
    const index = base26Chars.indexOf(char);
    decimalValue = decimalValue * 26 + index;
  }

  const binaryString = decimalValue.toString(2);

  const flippedCards: number[] = [];
  for (let i = 0; i < binaryString.length; i++) {
    if (binaryString[binaryString.length - 1 - i] === '1') {
      flippedCards.push(i);
    }
  }

  return flippedCards;
};
