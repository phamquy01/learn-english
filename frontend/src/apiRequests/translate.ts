// import http from '@/lib/http';
// import { v4 } from 'uuid';

// const apiTranslateRequest = {
//   translate: (rawData: any) =>
//     http.post(
//       '/translate',
//       {
//         text: rawData.input,
//       },
//       {
//         baseUrl: process.env.AZURE_TEXT_TRANSLATION!,
//         headers: {
//           'Ocp-Apim-Subscription-Key': process.env.AZURE_TEXT_TRANSLATION_KEY!,
//           'Ocp-Apim-Subscription-Region': process.env.AZURE_TEXT_LOCATION!,
//           'Content-Type': 'application/json',
//           'X-Client-Name': v4().toString(),
//         },
//         params: {
//           'api-version': '3.0',
//           from: rawData.inputLanguage === 'auto' ? null : rawData.inputLanguage,
//           to: rawData.outputLanguage,
//         },
//       }
//     ),
// };

// export default apiTranslateRequest;
