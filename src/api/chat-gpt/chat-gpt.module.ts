import { Module } from '@nestjs/common';
import { ChatGptController } from './chat-gpt.controller';
import { ChatGptService } from './chat-gpt.service';

@Module({
  imports: [],
  controllers: [ChatGptController],
  providers: [ChatGptService],
  exports: [ChatGptService],
})
export class ChatGptModule {}
