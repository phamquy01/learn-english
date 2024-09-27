'use client';
import apiTranslateRequest from '@/apiRequests/translate';
import DeleteTranslationButton from '@/components/DeleteTranslationButton';
import TimeAgo from '@/components/TimeAgo';
import { TranslationListResType } from '@/schemaValidations/translate.schema';
import React, { useEffect, useState } from 'react';

export default function TranslateHistory() {
  const [dataHistory, setDataHistory] = useState<
    TranslationListResType | undefined
  >(undefined);

  const getLanguage = (languageCode: string) => {
    const lang = new Intl.DisplayNames(['en'], { type: 'language' });
    return lang.of(languageCode);
  };

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const result = await apiTranslateRequest.getTranslation();
        setDataHistory(result.payload); // Cập nhật dữ liệu sau khi fetch thành công
      } catch (error) {
        console.error('Error fetching translations:', error);
      }
    };

    fetchTranslations(); // Gọi API khi component mount
  }, []); // Chạy một lần sau khi component mount

  return (
    <div>
      <h1 className="text-3xl my-5">History</h1>
      {dataHistory?.data.translations.length === 0 && (
        <p className="mb-5 text-gray-400">No translation history</p>
      )}

      <ul className="divide-y border rounded-md">
        {dataHistory &&
          dataHistory.data.translations.map((dataTranslation) => (
            <li
              key={dataTranslation.id}
              className="flex justify-between items-center p-5 hover:bg-gray-50 relative"
            >
              <div>
                <p className="text-sm mb-5 text-gray-500">
                  {getLanguage(dataTranslation.from)} {'->'}{' '}
                  {getLanguage(dataTranslation.to)}
                </p>
                <div className="space-y-2 pr-5">
                  <p>{dataTranslation.fromText}</p>
                  <p className="text-gray-400">{dataTranslation.toText}</p>
                </div>
              </div>
              <p className="absolute top-2 right-2 text-gray-300 text-xs">
                <TimeAgo
                  date={new Date(
                    new Date(dataTranslation.timestamp).getTime() +
                      7 * 60 * 60 * 1000
                  ).toISOString()}
                />
              </p>

              <DeleteTranslationButton
                userId={dataHistory.data.userId}
                translationId={dataTranslation.id}
              />
            </li>
          ))}
      </ul>
    </div>
  );
}
