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
          id: true,
          conversationId: true,
          typeMessage: true,
          content: true,
          createdAt: true,
          createdBy: true,
          file: true,
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
              doctor: {
                select: {
                  id: true,
                  avatar: true,
                  fullName: true,
                },
              },
              patient: {
                select: {
                  id: true,
                  avatar: true,
                  fullName: true,
                },
              },
            },
          });

          if (user.doctor) {
            item['user'] = user.doctor;
          }

          if (user.patient) {
            item['user'] = user.patient;
          }

          return item;
        }),
      );

      return ResponseSuccess(newData, MESS_CODE['SUCCESS'], {
        pagination: !dto?.isAll ? pagination : undefined,
      });
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
      const { file = [] } = dto;
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

      const data = await this.prismaService.message.create({
        data: {
          conversationId: id,
          typeMessage: dto.typeMessage,
          content: dto.content,
          file: file.length
            ? {
                connect: dto.file.map((i) => ({ id: i })),
              }
            : undefined,
          createdBy: memberId,
        },
        include: {
          file: true,
        },
      });

      const user = await this.prismaService.user.findFirst({
        where: {
          memberId: data.createdBy,
        },
        select: {
          doctor: {
            select: {
              id: true,
              avatar: true,
              fullName: true,
            },
          },
          patient: {
            select: {
              id: true,
              avatar: true,
              fullName: true,
            },
          },
        },
      });

      if (user.doctor) {
        data['user'] = user.doctor;
      }

      if (user.patient) {
        data['user'] = user.patient;
      }

      await this.prismaService.conversation.update({
        where: {
          id,
        },
        data: {
          lastMessageId: data.id,
          updatedAt: data.createdAt,
          updatedBy: data.createdBy,
        },
      });

      await this.socketsService.newMessage({
        conversationId: id,
        data: data,
      });

      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
