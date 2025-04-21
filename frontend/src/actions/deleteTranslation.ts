'use server';
import apiTranslateRequest from '@/apiRequests/translate';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

async function DeleteTranslation(userId: string, translationId: string) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  const response = await apiTranslateRequest.deleteTranslation(
    accessToken as string,
    userId,
    translationId
  );

  revalidateTag('translationHistory');

  return {
    translations: response.payload.data.translations,
  };
}

export default DeleteTranslation;
