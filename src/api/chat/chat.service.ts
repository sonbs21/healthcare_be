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
      // const exist = await this.checkFeatureExist({ id });
      // if (!exist) throw new BadRequestException(t(MESS_CODE['FEATURE_NOT_FOUND'], language));
      const { skip, take } = pagination;

      const data = await this.prismaService.message.findMany({
        where: {
          conversationId: id,
          isDeleted: false,
        },
        select: {
          content: true,
          createdAt: true,
          createdBy: true,
        },
        skip: !dto?.isAll ? skip : undefined,
        take: !dto?.isAll ? take : undefined,
      });

      const newData = await Promise.all(
        data.map(async (item) => {
          const user = await this.prismaService.user.findFirst({
            where: {
              memberId: item.createdBy,
            },
            include: {
              doctor: true,
              patient: true,
            },
          });
          if (user.doctor) {
            item['user'] = user.doctor;
          }

          if (user.patient) {
            item['user'] = user.patient;
          }
        }),
      );

      return ResponseSuccess(newData, MESS_CODE['SUCCESS']);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getConversation(memberId: string) {
    try {
      let where: Prisma.ConversationWhereInput = {
        isDeleted: false,
      };

      where.AND = { member: { some: { memberId: memberId } } };

      where = cleanup(where);

      const [total, data] = await this.prismaService.$transaction([
        this.prismaService.conversation.count({ where }),
        this.prismaService.conversation.findMany({
          where,
          select: {
            id: true,
            avatar: true,
            typeConversation: true,
            leaderId: true,
            lastMessage: {
              select: {
                id: true,
                content: true,
                createdAt: true,
              },
            },
            updatedAt: true,
            member: {
              select: {
                doctor: {
                  select: {
                    id: true,
                    fullName: true,
                    avatar: true,
                  },
                },
                patient: {
                  select: {
                    id: true,
                    fullName: true,
                    avatar: true,
                  },
                },
              },
            },
          },

          orderBy: {
            createdAt: 'desc',
          },
        }),
      ]);
      console.log('data', data);

      const newData = await Promise.all(
        data?.map(async (conversation) => {
          const lstMember = [];
          for (const member of conversation.member) {
            if (member?.doctor) {
              member['user'] = member.doctor;
              delete member.doctor;
              delete member.patient;
              lstMember.push(member['user']);
            }
            if (member?.patient) {
              member['user'] = member.patient;
              delete member.doctor;
              delete member.patient;
              lstMember.push(member['user']);
            }
          }
          return conversation;
        }),
      );

      return ResponseSuccess(newData, MESS_CODE['SUCCESS'], {
        total,
      });
    } catch (error) {}
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

      const data = await this.prismaService.message.create({
        data: messageData,
      });

      await this.prismaService.conversation.update({
        where: {
          id,
        },
        data: {
          updatedAt: data.createdAt,
          updatedBy: data.createdBy,
        },
      });

      await this.socketsService.newMessage({
        conversationId: id,
        data: messageData,
      });

      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
