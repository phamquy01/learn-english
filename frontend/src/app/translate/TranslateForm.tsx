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
import { useEffect, useRef, useState } from 'react';
import { useFormState } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Volume2Icon, X, XIcon } from 'lucide-react';
import RecordAudio from '@/components/RecordAudio';
import apiTranslateRequest from '@/apiRequests/translate';
import { log } from 'console';

const initialState = {
  inputLanguage: 'auto',
  outputLanguage: 'en',
  input: '',
  output: '',
};

export type State = typeof initialState;

export default function TranslateForm({
  languages,
}: {
  languages: TranslationLanguages;
}) {
  const [state, formAction] = useFormState(translate, initialState);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const sunbmitBtnRef = useRef<HTMLButtonElement>(null);
  const [aiText, setAIText] = useState('');
  const [loading, setLoading] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const contentEditableRef = useRef<HTMLTextAreaElement>(null);
  let enterPressed = false;

  const playAudio = async () => {
    const synth = window.speechSynthesis;
    if (!output || !synth) return;
    const wordsToSay = new SpeechSynthesisUtterance(output);
    synth.speak(wordsToSay);
  };

  const uploadAudio = async (audio: Blob) => {
    const mimeType = 'audio/webm';

    const file = new File([audio], 'audio.webm', { type: mimeType });

    const formData = new FormData();
    formData.append('audio', file);

    const response = await fetch('api/transcribeAudio', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.text) {
      setInput(data.text);
    }
  };

  useEffect(() => {
    if (!input.trim()) return;

    const delayDebounceFn = setTimeout(() => {
      sunbmitBtnRef.current?.click();
    }, 100);

    return () => clearTimeout(delayDebounceFn);
  }, [input]);

  useEffect(() => {
    if (state.output) {
      setOutput(state.output);
    }
  }, [state]);

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
      await apiTranslateRequest
        .getTranslationSuggesstion(text)
        .then((res) => {
          setAIText(
            res.payload.suggestions && res.payload.suggestions.length > 0
              ? res.payload.suggestions[0].slice(text.length)
              : ''
          );
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching AI text:', error);
          setLoading(false);
        });
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
      if (debounceTimeoutRef.current !== null) {
        clearTimeout(debounceTimeoutRef.current);
      }
      debounceTimeoutRef.current = setTimeout(() => {
        fetchSuggestions(newText);
      }, 1500);
    }
  };

  const setCursorToEnd = (element: HTMLElement) => {
    const range = document.createRange();
    const selection = window.getSelection();
    if (selection !== null) {
      range.selectNodeContents(element as Node);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  const acceptSuggestion = () => {
    const contentEditableElement = contentEditableRef.current;
    if (contentEditableElement) {
      setInput(input + aiText);
      contentEditableElement.innerText = input + aiText;
      setAIText('');
      setCursorToEnd(contentEditableElement);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      acceptSuggestion();
    }
    if (e.key === 'Enter') {
      // Set the flag to true when Enter is pressed
      enterPressed = true;

      // Allow the default Enter key behavior to occur
      setTimeout(() => {
        const contentEditableElement = contentEditableRef.current;
        if (contentEditableElement) {
          const childNodes = Array.from(contentEditableElement.childNodes);

          // Find the last <br> element
          for (let i = childNodes.length - 1; i >= 0; i--) {
            if (childNodes[i].nodeName === 'BR') {
              // Remove the last <br> element
              contentEditableElement.removeChild(childNodes[i]);
              break; // Exit the loop after removing the <br>
            }
          }

          // Insert an empty text node with a zero-width space
          const emptyTextNode = document.createTextNode('\u200B');
          contentEditableElement.appendChild(emptyTextNode);

          // Set cursor after the empty text node
          setCursorToEnd(contentEditableElement);
        }
      }, 0);
    }
  };

  const handleRemoveAllInput = () => {
    const contentEditableElement = contentEditableRef.current;
    if (contentEditableElement) {
      setInput('');
      setOutput('');
      contentEditableElement.innerText = '';
      setAIText('');
      setCursorToEnd(contentEditableElement);
    }
  };

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
        <div className="flex flex-col space-y-2 lg:flex-row lg:space-y-0 lg:space-x-2">
          <div className="flex-1 space-y-2">
            <Select name="inputLanguage" defaultValue="auto">
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

            <div className="min-h-[164px] text-2xl flex flex-1 border-solid border-[1px] border-[#0000001f] rounded-md">
              <div className="flex w-full relative pr-[56px] pt-[12px] pl-[16px]">
                <div className="relative w-full">
                  <Textarea
                    ref={contentEditableRef}
                    className="absolute top-0 resize-none left-0 p-0 text-2xl font-light bg-transparent text-[#3c4043] border-none flex-1 w-full whitespace-pre-wrap z-20 shadow-none focus-visible:ring-0"
                    name="input"
                    value={input}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                  />
                  <span
                    id="suggesstion"
                    className={`top-0 left-0 absolute z-10 align-center text-2xl font-light text-[#868686] transition-opacity duration-500 ${
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
              <Select name="outputLanguage" defaultValue="vi">
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
              <Button
                variant="ghost"
                type="button"
                onClick={playAudio}
                disabled={!output}
                className="rounded-full"
              >
                <Volume2Icon
                  size={18}
                  className="text-gray-500 font-medium cursor-pointer disabled:cursor-not-allowed"
                />
              </Button>
            </div>
            <div className="min-h-[164px] relative leading-[27px] text-sm flex flex-1 rounded-md">
              <div className="flex pt-[12px] pl-[16px] w-full pr-[52px] relative">
                <Textarea
                  readOnly
                  placeholder="Translate"
                  className="pt-[12px] pl-[16px] absolute resize-none top-0 left-0 text-2xl bg-[#f5f5f5]  text-[#3c4043] outline-none border-none flex-1 w-full whitespace-pre-wrap z-20 shadow-none focus-visible:ring-0 ring-0 h-full"
                  name="output"
                  value={output}
                  onChange={(e) => setOutput(e.target.value)}
                />
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
