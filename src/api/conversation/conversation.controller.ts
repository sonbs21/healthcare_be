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
import { ConversationService } from './conversation.service';

@Controller('v1')
@ApiTags('Conversation')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get('conversation-member')
  @HttpCode(HttpStatus.OK)
  findHealthRecordWithId(@CurrentUser() user) {
    return this.conversationService.getAllConversationWithId(user['memberId']);
  }

  @Get('conversations')
  @HttpCode(HttpStatus.OK)
  findAll(@Query() dto: any, @Paginate() pagination: Pagination, @Headers() header) {
    return this.conversationService.findAll(dto, pagination);
  }

  @Get('conversation/:id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string, @Headers() header) {
    return this.conversationService.findOne(id);
  }
}
