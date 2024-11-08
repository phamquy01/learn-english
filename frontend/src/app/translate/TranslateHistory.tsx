import DeleteTranslationButton from '@/components/DeleteTranslationButton';
import TimeAgo from '@/components/TimeAgo';
import { TranslationListResType } from '@/schemaValidations/translate.schema';
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function TranslateHistory({
  title,
  dataTranslations,
}: {
  title: string;
  dataTranslations: TranslationListResType | undefined;
}) {
  const data = dataTranslations?.data;
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
        <SheetContent className="min-w-[500px]">
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
            <div className="space-y-4">
              {data?.translations.length === 0 && (
                <p className="mb-5 text-gray-400">No translation</p>
              )}

              <ul>
                {data?.translations.map((dataTranslation) => (
                  <li
                    key={dataTranslation.id}
                    className="flex justify-between items-center p-5 hover:bg-gray-50 relative border"
                  >
                    <div>
                      <p className="text-xs mb-5 text-gray-500">
                        {getLanguage(dataTranslation.from)} {'->'}{' '}
                        {getLanguage(dataTranslation.to)}
                      </p>
                      <div className="space-y-2 pr-5 text-xs">
                        <p>{dataTranslation.fromText}</p>
                        <p className="text-gray-400">
                          {dataTranslation.toText}
                        </p>
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
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
