import apiTranslateRequest from '@/apiRequests/translate';
import DeleteTranslationButton from '@/components/DeleteTranslationButton';
import TimeAgo from '@/components/TimeAgo';
import { TranslationListResType } from '@/schemaValidations/translate.schema';
import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TranslateHistory({
  dataTranslations,
}: {
  dataTranslations: TranslationListResType;
}) {
  const data = dataTranslations.data;
  const getLanguage = (languageCode: string) => {
    const lang = new Intl.DisplayNames(['en'], { type: 'language' });
    return lang.of(languageCode);
  };

  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="text-[#3c4043]">
            View all
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>History</SheetTitle>
          </SheetHeader>
          <div className="">
            {data.translations.length === 0 && (
              <p className="mb-5 text-gray-400">No translation history</p>
            )}

            <ul className="border rounded-md">
              {data.translations.map((dataTranslation) => (
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
                    userId={data.userId}
                    translationId={dataTranslation.id}
                  />
                </li>
              ))}
            </ul>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit">Save changes</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
