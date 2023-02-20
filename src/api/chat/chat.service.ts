import { SocketGateWayService } from '@api/socket-io/socket-io.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@services';
import { Pagination, ResponseSuccess } from '@types';
import { cleanup, MESS_CODE, t } from '@utils';
import { FilterChatDto, PostMessageDto } from './dto';

@Injectable()
export class ChatService {
  constructor(private prismaService: PrismaService, private socketsService: SocketGateWayService) {}

  async getMessage(id: string, dto: FilterChatDto, pagination: Pagination) {
    try {
      const { skip, take } = pagination;
      // const exist = await this.checkFeatureExist({ id });
      // if (!exist) throw new BadRequestException(t(MESS_CODE['FEATURE_NOT_FOUND'], language));

      const [total, data] = await this.prismaService.$transaction([
        this.prismaService.message.count({ where: { conversationId: id } }),
        this.prismaService.message.findMany({
          where: {
            conversationId: id,
          },
          select: {
            id: true,
            // typeMessage: true,
            content: true,
            attachments: true,
            createdAt: true,
            createdBy: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          skip: !dto?.isAll ? skip : undefined,
          take: !dto?.isAll ? take : undefined,
        }),
      ]);

      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {
        pagination: !dto?.isAll ? pagination : undefined,
        total,
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async postMessage(memberId: string, id: string, dto: PostMessageDto) {
    try {
      const conversation = await this.prismaService.conversation.findFirst({
        where: {
          id,
        },
        select: {
          id: true,
          leaderId: true,
          member: true,
          // message: true,
          createdAt: true,
        },
      });

      if (!conversation) {
        throw new BadRequestException(t(MESS_CODE['CONVERSATION_NOT_FOUND']));
      }
      const attachmentsData = dto?.attachment ?? [];

      const messageData: any = {
        conversationId: id,
        content: dto.content,
        attachments: attachmentsData || [],
        createdAt: memberId,
      };

      await this.prismaService.message.create({
        data: messageData,
      });

      await this.socketsService.newMessage({
        conversationId: id,
        data: messageData,
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
