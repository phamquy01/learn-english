'use client';
import translate from '@/actions/translate';
import ButtonSubmit from '@/components/ButtonSubmit';
import { TranslationLanguages } from '@/app/translate/page';
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
import Image from 'next/image';
import { use, useEffect, useRef, useState } from 'react';
import { useFormState } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Star, Volume2Icon, X, XIcon } from 'lucide-react';
import RecordAudio from '@/components/RecordAudio';
import apiTranslateRequest from '@/apiRequests/translate';
import { MdOutlineStarPurple500 } from 'react-icons/md';
import { TranslationListResType } from '@/schemaValidations/translate.schema';
import PlayAudio from '@/components/playAudio';

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
  const sunbmitBtnRef = useRef<HTMLButtonElement>(null);
  const [aiText, setAIText] = useState('');
  const [loading, setLoading] = useState(false);
  const contentEditableRef = useRef<HTMLTextAreaElement>(null);
  const [startStatus, setStartStatus] = useState(false);
  let enterPressed = false;
  const [suggestions, setSuggestions] = useState<string[]>([]);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      acceptSuggestion();
    }
    if (e.key === 'Enter') {
      enterPressed = true;

      // setTimeout(() => {
      //   const contentEditableElement = contentEditableRef.current;

      //   if (contentEditableElement) {
      //     const childNodes = Array.from(contentEditableElement.childNodes);

      //     for (let i = childNodes.length - 1; i >= 0; i--) {
      //       if (childNodes[i].nodeName === 'BR') {
      //         contentEditableElement.removeChild(childNodes[i]);
      //         break;
      //       }
      //     }

      //     // const emptyTextNode = document.createTextNode('\u200B');
      //     // contentEditableElement.appendChild(emptyTextNode);

      //     setCursorToEnd(contentEditableElement);
      //   }
      // }, 0);
    }
  };

  const handleRemoveAllInput = () => {
    const contentEditableElement = contentEditableRef.current;
    if (contentEditableElement) {
      setInput('');
      setOutput('');
      setAIText('');
      contentEditableElement.innerText = '';
    }
  };

  const handleSaveTranslation = async () => {
    if (!output || loading) return;
    const newStatus = !startStatus;
    setStartStatus(newStatus);
    setLoading(true);
    try {
      const response = await apiTranslateRequest.saveTranslation({
        id: dataTranslations.data.translations[0].id,
        userId: dataTranslations.data.userId,
        saved: newStatus,
      });
      console.log(response);
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!input) return;
    const delayDebounceFn = setTimeout(() => {
      sunbmitBtnRef.current?.click();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [input]);

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

    setSuggestions(listFromTextDataTranslation);
  }, [dataTranslations]);

  return (
    <div>
      <div className="flex space-x-2">
        <div className="flex justify-center items-center group cursor-pointer rounded-md w-fit px-3 py-2 bg-[#E7F0FE] mb-5">
          <Image
            src="https://i.pinimg.com/564x/b2/ae/20/b2ae208948fb4736473362f6de772457.jpg"
            alt="text-logo"
            width={30}
            height={30}
          />
          <p className="text-sm font-medium text-blue-500 group-hover:underline ml-2 mt-1">
            Text
          </p>
        </div>
        <RecordAudio uploadAudio={uploadAudio} />
      </div>

      <form action={formAction}>
        <div className="flex flex-col space-y-2">
          <div className="flex-1 space-y-2">
            <Select name="inputLanguage" defaultValue="en">
              <SelectTrigger className="w-[280px] border-none text-blue-500 font-bold">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Want us to figure it out?</SelectLabel>
                  <SelectItem key="auto" value="auto">
                    Auto-Detection
                  </SelectItem>
                </SelectGroup>
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
            <div className="min-h-[164px] text-2xl flex flex-1">
              <div className="flex w-full relative pr-[56px] pt-[12px] pl-[16px]">
                <div className="relative w-full">
                  <Textarea
                    ref={contentEditableRef}
                    className="absolute top-0 resize-none left-0 p-0 text-5xl font-extralight bg-transparent text-[#3c4043] border-none flex-1 w-full whitespace-pre-wrap z-20 shadow-none focus-visible:ring-0 "
                    name="input"
                    placeholder="Typing here..."
                    value={input}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                  />
                  <span
                    id="suggesstion"
                    className={`top-0 left-0 absolute z-10 align-center text-5xl font-extralight text-[#868686] transition-opacity duration-500 ${
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
                  className={`rounded-full w-12 h-12 p-3 mx-1 my-1 absolute right-0 top-0 ${
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
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-center">
              <Select
                name="outputLanguage"
                defaultValue="vi"
                onValueChange={(value) => setOutputLanguage(value)}
              >
                <SelectTrigger className="w-[280px] border-none text-blue-500 font-bold">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Want us to figure it out?</SelectLabel>
                    <SelectItem key="auto" value="auto">
                      Auto-Detection
                    </SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Languages</SelectLabel>
                    {Object.entries(languages.translation).map(
                      ([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value.name}
                        </SelectItem>
                      )
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <PlayAudio language={outputLanguage} text={output} />
            </div>
            <div className="min-h-[164px] bg-[#f5f5f5] text-2xl flex flex-1  rounded-md">
              <div className="flex w-full relative pr-[56px] pt-[12px] pl-[16px]">
                <div className="relative w-full">
                  <Textarea
                    readOnly
                    placeholder="Translation"
                    className="pt-[12px] pl-[16px] absolute resize-none top-0 left-0 text-2xl text-[#3c4043] outline-none border-none flex-1 w-full whitespace-pre-wrap z-20 shadow-none focus-visible:ring-0 ring-0 h-full font-light"
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
                      startStatus === true ? 'text-[#d56e0c]' : 'text-gray-500 '
                    }`}
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <ButtonSubmit disable={!input} />
          <button type="submit" ref={sunbmitBtnRef} hidden>
            Translate
          </button>
        </div>
      </form>
    </div>
  );
}
