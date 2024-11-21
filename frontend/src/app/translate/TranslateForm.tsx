'use client';
import translate from '@/actions/translate';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from '@/components/ui/select';

import { Textarea } from '@/components/ui/textarea';
import { useEffect, useRef, useState } from 'react';
import { useFormState } from 'react-dom';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft, X } from 'lucide-react';
import RecordAudio from '@/components/RecordAudio';
import apiTranslateRequest from '@/apiRequests/translate';
import { MdOutlineStarPurple500 } from 'react-icons/md';
import { TranslationListResType } from '@/schemaValidations/translate.schema';
import PlayAudio from '@/components/playAudio';
import { useRouter } from 'next/navigation';
import { TranslationLanguages } from '@/app/translate/page';
import TranslateHistory from '@/app/translate/TranslateHistory';

const initialState = {
  inputLanguage: 'auto',
  outputLanguage: 'vi',
  input: '',
  output: '',
};

export type State = typeof initialState;

export default function TranslateForm({
  languages,
  dataTranslations,
}: {
  languages: TranslationLanguages;
  dataTranslations: TranslationListResType;
}) {
  const [state, formAction] = useFormState(translate, initialState);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [outputLanguage, setOutputLanguage] = useState('vi');
  const [inputLanguage, setInputLanguage] = useState('en');
  const [aiText, setAIText] = useState('');
  const [loading, setLoading] = useState(false);
  const [starStatus, setStarStatus] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [autoResize, setAutoResize] = useState<number | undefined>(undefined);
  const [savedTranslations, setSavedTranslations] =
    useState<TranslationListResType>();
  const sunbmitBtnRef = useRef<HTMLButtonElement>(null);
  const contentEditableRef = useRef<HTMLTextAreaElement>(null);
  let enterPressed = false;
  const router = useRouter();

  const uploadAudio = async (text: string) => {
    if (text) {
      setInput(text);
    }
  };

  const isCursorAtEnd = () => {
    if (contentEditableRef.current) {
      const start = contentEditableRef.current.selectionStart;
      const end = contentEditableRef.current.selectionEnd;
      const length = contentEditableRef.current.value.length;
      return start === end && end === length;
    }
    return false;
  };

  const fetchSuggestions = async (text: string) => {
    if (text.trim().length) {
      setLoading(true);
      const response = suggestions.filter((item) =>
        item.toLowerCase().startsWith(text.toLowerCase())
      );

      if (response.length) {
        setAIText(response[0].slice(text.length));
      }

      setLoading(false);
    }
  };

  const handleInput = async (e: any) => {
    let newText = e.target.value;

    if (enterPressed && newText.endsWith('\n\n')) {
      newText = newText.slice(0, -1);
      enterPressed = false;
    }

    setInput(newText);
    setAIText('');

    if (isCursorAtEnd()) {
      fetchSuggestions(newText);
    }
  };

  const acceptSuggestion = () => {
    const contentEditableElement = contentEditableRef.current;
    if (contentEditableElement) {
      setInput(input + aiText);
      setAIText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    setStarStatus(false);
    const element = contentEditableRef.current;

    if (element) {
      element.style.height = 'auto';
      element.style.height = `${element.scrollHeight + 64}px`;
      element.scrollTop = element.scrollHeight;
      setAutoResize(element.scrollHeight);
    }

    if (e.key === 'Backspace') {
      setAIText('');
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      acceptSuggestion();
    }
    if (e.key === 'Enter') {
      enterPressed = true;
    }
  };

  const handleRemoveAllInput = () => {
    const contentEditableElement = contentEditableRef.current;
    if (contentEditableElement) {
      setStarStatus(false);
      setInput('');
      setOutput('');
      setAIText('');
      contentEditableElement.innerText = '';
    }
  };

  const handleSaveTranslation = async () => {
    if (!output || loading) return;
    const newStatus = !starStatus;
    setStarStatus(newStatus);
    setLoading(true);
    try {
      await apiTranslateRequest.saveTranslation({
        id: dataTranslations.data.translations[0].id,
        userId: dataTranslations.data.userId,
        saved: newStatus,
      });
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExChangeLanguage = () => {
    const temp = input;
    setInput(output);
    setOutput(temp);
    setInputLanguage(outputLanguage);
    setOutputLanguage(inputLanguage);
  };

  const navigateCard = () => {
    router.push('/cards');
  };

  useEffect(() => {
    if (!input) return;
    const delayDebounceFn = setTimeout(() => {
      sunbmitBtnRef.current?.click();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [input, inputLanguage, outputLanguage]);

  useEffect(() => {
    if (state.output) {
      setOutput(state.output);
    }
  }, [state]);

  useEffect(() => {
    if (dataTranslations.data.translations.length === 0) return;
    const listFromTextDataTranslation = dataTranslations.data.translations.map(
      (suggesstion) => suggesstion.fromText
    );

    const savedTranslations = dataTranslations.data.translations.filter(
      (savedTranslation) => savedTranslation.save === true
    );

    const dataSavedTranslations = {
      message: 'Saved translations',
      data: {
        userId: dataTranslations.data.userId,
        translations: savedTranslations,
      },
    };
    setSavedTranslations(dataSavedTranslations);
    setSuggestions(listFromTextDataTranslation);
  }, [dataTranslations]);

  return (
    <div>
      <form action={formAction}>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between whitespace-nowrap flex-1 space-y-2 ">
            <Select
              name="inputLanguage"
              value={inputLanguage}
              onValueChange={(e) => setInputLanguage(e)}
            >
              <SelectTrigger className="w-[280px] border-none text-blue-500 font-bold">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Languages</SelectLabel>
                  {Object.entries(languages.translation).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              className="w-fit rounded-full bg-transparent"
              onClick={handleExChangeLanguage}
            >
              <ArrowRightLeft size={16} strokeWidth={3} color="black" />
            </Button>

            <Select
              name="outputLanguage"
              value={outputLanguage}
              onValueChange={(e) => setOutputLanguage(e)}
            >
              <SelectTrigger className="w-[280px] border-none text-blue-500 font-bold">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Languages</SelectLabel>
                  {Object.entries(languages.translation).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="min-h-[164px]  border border-[#0000001f] text-2xl flex flex-col items-start flex-1 rounded-md">
              <div
                className="flex w-full relative pr-[56px] pt-[12px] pl-[16px]"
                style={{ height: autoResize ? autoResize : '100%' }}
              >
                <div className="relative w-full">
                  <Textarea
                    ref={contentEditableRef}
                    className="absolute top-0 resize-none left-0 p-0 text-2xl font-normal bg-transparent text-[#3c4043] border-none flex-1 w-full whitespace-pre-wrap z-20 shadow-none focus-visible:ring-0 overflow-hidden text-wrap"
                    name="input"
                    placeholder="Typing here..."
                    value={input}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                  />
                  <span
                    id="suggesstion"
                    className={`top-0 left-0 absolute z-10 align-center text-2xl font-normal text-[#868686] transition-opacity duration-500 text-wrap w-full truncate ${
                      aiText ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    {input + aiText}
                    <span
                      onClick={() => {
                        acceptSuggestion();
                      }}
                      className="border p-1.5 py-0.5 text-[10px] ml-1 inline-block w-fit rounded-md border-gray-300 cursor-pointer"
                    >
                      Tab
                    </span>
                  </span>
                </div>
                <Button
                  variant="ghost"
                  className={`rounded-full  w-12 h-12 p-3 mx-1 my-1 absolute right-0 top-0 ${
                    input ? 'opacity-100' : 'opacity-0'
                  }`}
                  onClick={handleRemoveAllInput}
                >
                  <X
                    size={24}
                    strokeWidth={2}
                    className="text-gray-500 font-medium"
                  />
                </Button>
              </div>
              <div className="flex">
                <RecordAudio uploadAudio={uploadAudio} text={input} />
                <PlayAudio language={inputLanguage} text={input} />
              </div>
            </div>

            <div className="min-h-[164px] bg-[#f5f5f5] text-2xl flex flex-col items-start flex-1 rounded-md">
              <div
                className="flex w-full relative pr-[56px] pt-[12px] pl-[16px]"
                style={{ height: autoResize ? autoResize : '100%' }}
              >
                <div className="relative w-full">
                  <Textarea
                    readOnly
                    placeholder="Translation"
                    className="absolute resize-none top-0 left-0 p-0 text-2xl text-[#3c4043] outline-none border-none flex-1 w-full whitespace-pre-wrap z-20 shadow-none focus-visible:ring-0 ring-0 h-full font-normal"
                    name="output"
                    value={output}
                    onChange={(e) => setOutput(e.target.value)}
                  />
                </div>
                <Button
                  variant="ghost"
                  className={`rounded-full w-12 h-12 p-3 mx-1 my-1 absolute right-0 top-0 hover:bg-[#ebebeb]  ${
                    output ? 'opacity-100' : 'opacity-0'
                  }`}
                  onClick={handleSaveTranslation}
                >
                  <MdOutlineStarPurple500
                    size={24}
                    className={`font-medium ${
                      starStatus === true ? 'text-[#d56e0c]' : 'text-gray-500 '
                    }`}
                  />
                </Button>
              </div>
              <PlayAudio language={outputLanguage} text={output} />
            </div>
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <button type="submit" ref={sunbmitBtnRef} hidden>
            Translate
          </button>
        </div>
      </form>

      <div className="flex items-center justify-between mt-5">
        <div className="flex items-center">
          <h2 className="text-xl font-bold text-[#3c4043]">History</h2>
          <span className="text-[#868686] text-sm ml-2">All days</span>
        </div>
        <TranslateHistory
          title="Translation History"
          dataTranslations={dataTranslations}
        />
      </div>

      <div className="flex items-center justify-between mt-5">
        <div className="flex items-center">
          <h2 className="text-xl font-bold text-[#3c4043]">History</h2>
          <span className="text-[#868686] text-sm ml-2">All days</span>
        </div>
        <TranslateHistory
          title="Translation History"
          dataTranslations={savedTranslations}
        />
      </div>

      <div className="flex items-center justify-between mt-5">
        <div className="flex items-center">
          <h2 className="text-xl font-bold text-[#3c4043]">Card</h2>
        </div>
        <Button
          variant="ghost"
          className="text-[#3c4043]"
          onClick={navigateCard}
        >
          Go {'->'}
        </Button>
      </div>
    </div>
  );
}
