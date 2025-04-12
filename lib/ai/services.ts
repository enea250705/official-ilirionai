import { DataStreamWriter } from 'ai';
import { Session } from 'next-auth';
import { createDocument } from './tools/create-document';
import { updateDocument } from './tools/update-document';
import { getWeather } from './tools/get-weather';
import { requestSuggestions } from './tools/request-suggestions';
import { myProvider } from './providers';
import { DEFAULT_CHAT_MODEL } from './models';

/**
 * AIService - Provides access to all AI functionality
 */
export class AIService {
  private session: Session;
  private dataStream: DataStreamWriter;

  constructor(session: Session, dataStream: DataStreamWriter) {
    this.session = session;
    this.dataStream = dataStream;
  }

  /**
   * Get tools that can be used with the AI
   */
  getTools() {
    return {
      createDocument: createDocument({ 
        session: this.session, 
        dataStream: this.dataStream 
      }),
      updateDocument: updateDocument({ 
        session: this.session, 
        dataStream: this.dataStream 
      }),
      getWeather,
      requestSuggestions: requestSuggestions({ 
        session: this.session,
        dataStream: this.dataStream 
      }),
    };
  }

  /**
   * Get the provider for AI models
   */
  getProvider() {
    return myProvider;
  }

  /**
   * Get the default chat model ID
   */
  getDefaultModel() {
    return DEFAULT_CHAT_MODEL;
  }
}

/**
 * Create a new AI service instance
 */
export function createAIService(
  session: Session,
  dataStream: DataStreamWriter
) {
  return new AIService(session, dataStream);
} 