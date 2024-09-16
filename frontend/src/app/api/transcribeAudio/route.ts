import { NextRequest, NextResponse } from 'next/server';
import { OpenAIClient, AzureKeyCredential } from '@azure/openai';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('audio') as File;

  if (
    process.env.AZUE_API_KEY === undefined ||
    process.env.AZUE_ENDPOINT === undefined ||
    process.env.AZUE_DEVELOPMENT_NAME === undefined
  ) {
    console.error('Azue credentials not set');
    return {
      sender: '',
      esponse: 'Azue credentials not set',
    };
  }

  if (file.size === 0) {
    return {
      sender: '',
      esponse: 'no audio file provider',
    };
  }

  const arrayBuffer = await file.arrayBuffer();
  const audioBuffer = new Uint8Array(arrayBuffer);

  const client = new OpenAIClient(
    process.env.AZUE_ENDPOINT,
    new AzureKeyCredential(process.env.AZUE_API_KEY)
  );

  const result = await client.getAudioTranscription(
    process.env.AZUE_DEVELOPMENT_NAME,
    audioBuffer
  );

  return NextResponse.json({ text: result.text });
}
