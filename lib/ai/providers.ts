import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
  localProvider,
  DynamicStructuredOutputParser,
} from 'ai';
import { xai } from '@ai-sdk/xai';
import { hf } from '@ai-sdk/hf';
import { isTestEnvironment } from '../constants';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';

// Check if XAI API key is available
const hasXaiApiKey = process.env.XAI_API_KEY && process.env.XAI_API_KEY.length > 0;

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : hasXaiApiKey
    ? customProvider({
        languageModels: {
          'chat-model': xai('grok-2-1212'),
          'chat-model-reasoning': wrapLanguageModel({
            model: xai('grok-3-mini-beta'),
            middleware: extractReasoningMiddleware({ tagName: 'think' }),
          }),
          'title-model': xai('grok-2-1212'),
          'artifact-model': xai('grok-2-1212'),
        },
        imageModels: {
          'small-model': xai.image('grok-2-image'),
        },
      })
    : customProvider({
        // Use Hugging Face free models as fallback
        languageModels: {
          'chat-model': hf('mistralai/Mistral-7B-Instruct-v0.2'),
          'chat-model-reasoning': hf('mistralai/Mistral-7B-Instruct-v0.2'),
          'title-model': hf('mistralai/Mistral-7B-Instruct-v0.2'),
          'artifact-model': hf('mistralai/Mistral-7B-Instruct-v0.2'),
        },
      });
