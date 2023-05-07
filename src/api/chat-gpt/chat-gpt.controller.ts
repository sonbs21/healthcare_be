import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChatGptService } from './chat-gpt.service';
import { GetAiModelAnswer } from './dto';

@Controller('v1')
@ApiTags('Chat-gpt')
// @UseGuards(JwtAuthGuard)
// @ApiBearerAuth()
export class ChatGptController {
  constructor(private readonly chatGptService: ChatGptService) {}
  @Post('/message')
  @UsePipes(ValidationPipe)
  getModelAnswer(@Body(new ValidationPipe({ transform: true })) data: GetAiModelAnswer) {
    console.log('getModelAnswer >>', data);
    return this.chatGptService.getModelAnswer(data);
  }

  @Get('/model')
  listModels() {
    return this.chatGptService.listModels();
  }
}
