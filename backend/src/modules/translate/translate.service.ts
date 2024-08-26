import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Translation } from 'src/modules/translate/entities/translate.entity';
import { Repository } from 'typeorm';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';

@Injectable()
export class TranslateService {
  constructor(
    @InjectRepository(Translation)
    private readonly translateRepository: Repository<Translation>,
    private readonly configService: ConfigService,
  ) {}

  async getSuggestions(text: string) {
    const OPENAI_API_KEY = this.configService.get<string>('OPENAI_API_KEY');
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
    const aiModel = 'gpt-3.5-turbo';

    const prompt = [];
    prompt.push('You are an autocomplete assistant.');
    prompt.push(
      'For the text content I provide as input, please give me a single text suggestion ranging from 2 to 8 words.',
    );
    prompt.push('Start with a white space if needed.');
    prompt.push('Start with a new line if needed.');
    prompt.push('All the words should be complete.');
    prompt.push('DO NOT give more than one suggestion.');
    prompt.push('Do not add any names. Do Not add full stops in the end.');

    if (!text && text.length === 0) {
      throw new BadRequestException('No input text provided.');
    }

    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: prompt.join(' '),
      },
      {
        role: 'user',
        content: text,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: aiModel,
      messages: messages,
    });

    console.log(completion);

    return completion.choices[0].message.content;
  }
}
