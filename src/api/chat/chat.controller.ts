import { JwtAuthGuard } from '@auth/guards';
import { CurrentUser, Paginate } from '@decorators';
import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Pagination } from '@types';
import { ChatService } from './chat.service';
import { FilterChatDto, PostMessageDto } from './dto';

@Controller('v1')
@ApiTags('Chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('chat')
  @HttpCode(HttpStatus.OK)
  getMessage(@Param('id') id: string, dto: FilterChatDto, pagination: Pagination) {
    return this.chatService.getMessage(id, dto, pagination);
  }

  @Post('chat/:id')
  @HttpCode(HttpStatus.CREATED)
  postMessage(@CurrentUser() user, @Param('id') id: string, dto: PostMessageDto) {
    return this.chatService.postMessage(user['memberId'], id, dto);
  }
}
