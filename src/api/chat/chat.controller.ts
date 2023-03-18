import { JwtAuthGuard } from '@auth/guards';
import { CurrentUser, Paginate } from '@decorators';
import { Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { Body, Query } from '@nestjs/common/decorators/http/route-params.decorator';
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

  @Get('conversation')
  @HttpCode(HttpStatus.OK)
  getConversation(@CurrentUser() user) {
    return this.chatService.getConversation(user['memberId']);
  }

  @Get('chat/:id')
  @HttpCode(HttpStatus.OK)
  getMessage(@Param('id') id: string, @Query() dto: FilterChatDto, @Paginate() pagination: Pagination) {
    return this.chatService.getMessage(id, dto, pagination);
  }

  @Post('chat/:id')
  @HttpCode(HttpStatus.CREATED)
  postMessage(@CurrentUser() user, @Param('id') id: string, @Body() dto: PostMessageDto) {
    return this.chatService.postMessage(user['memberId'], id, dto);
  }
}
