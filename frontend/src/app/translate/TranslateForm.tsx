'use client';
import translate from '@/actions/translate';
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

  console.log(state);

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
            <Textarea
              placeholder="type your message here"
              className="min-h-32 text-xl"
              name="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div className="flex-1 space-y-2">
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
                  {Object.entries(languages.translation).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Textarea
              readOnly
              placeholder="type your message here"
              className="min-h-32 text-xl"
              name="output"
              value={output}
              onChange={(e) => setOutput(e.target.value)}
            />
          </div>
        </div>
        <div>
          <button type="submit" ref={sunbmitBtnRef}>
            Translate
          </button>
        </div>
      </form>
    </div>
  );
}
