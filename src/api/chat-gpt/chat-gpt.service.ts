import { Injectable, Logger } from '@nestjs/common';
import { Configuration, CreateCompletionRequest, OpenAIApi } from 'openai';
import { GetAiModelAnswer } from './dto';

@Injectable()
export class ChatGptService {
  private readonly openAiApi: OpenAIApi;
  private readonly logger: Logger = new Logger(ChatGptService.name);

  constructor() {
    const configuration = new Configuration({
      organization: process.env.ORGANIZATION_ID,
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.openAiApi = new OpenAIApi(configuration);
  }

  async listModels() {
    const models = await this.openAiApi.listModels();
    return models.data;
  }

  async getModelAnswer(input: GetAiModelAnswer) {
    try {
      const params: CreateCompletionRequest = {
        prompt: input.question,
        model: input.getModelId(),
        temperature: input.getTemperature(),
        max_tokens: input.getMaxTokens(),
      };

      console.log('params >> ', params);
      const response = await this.openAiApi.createCompletion(params);

      const { data } = response;
      if (data.choices.length) {
        return data.choices[0];
      }
      return response.data;
    } catch (error) {
      this.logger.error('Error processing user request >> ', error);
    }
  }
}
