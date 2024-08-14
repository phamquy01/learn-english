import http from '@/lib/http';
import {
  TranslationBodyType,
  TranslationResType,
} from '@/schemaValidations/translate.schema';

const apiTranslateRequest = {
  addOrUpdateTranslate: (
    sessionToken: string,
    translate: TranslationBodyType
  ) =>
    http.post<TranslationResType>('/translation', translate, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
};

export default apiTranslateRequest;
