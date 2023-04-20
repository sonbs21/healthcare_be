import { SocketGateWayService } from '@api/socket-io/socket-io.service';
import { PutObjectCommand, PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@services';
import { Pagination, ResponseSuccess } from '@types';
import { MESS_CODE, cleanup, t } from '@utils';
import { S3 } from 'aws-sdk';
import { FilterChatDto, PostMessageDto } from './dto';
const aws_s3_url: string = process.env.AWS_S3_URL || '';
const bucket_region: string | undefined = process.env.AWS_S3_BUCKET_REGION;
const bucket_name: string = process.env.AWS_S3_BUCKET_NAME || '';
const folder_name: string = process.env.AWS_S3_FOLDER_NAME || '';

const s3 = new S3({
  apiVersion: '2006-03-01',
  region: bucket_region,
});
const s3Client = new S3Client({ region: bucket_region });

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
            updatedAt: 'desc',
          },
        }),
      ]);

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

  async uploads(files) {
    try {
      const dataUpload = [];
      if (!files.length) throw new BadRequestException(t(MESS_CODE['DATA_NOT_FOUND'], {}));

      for (const file of files) {
        // console.log(12312321, file.mimetype.match(IMAGE_REGEX));
        // if (!file.mimetype.match(IMAGE_REGEX)) {
        //   throw new BadRequestException(t(MESS_CODE['IMAGE_NOT_FORMAT'], {}));
        // }
        if (file.size > process.env.MAX_SIZE) {
          throw new BadRequestException(t(MESS_CODE['MAX_SIZE_WARNING'], {}));
        }

        const fileName = `${new Date().getTime()}_${file.originalname}`;
        const params: PutObjectCommandInput = {
          Bucket: bucket_name,
          Key: `${folder_name}/${fileName}`,
          Body: file.buffer,
          ACL: 'public-read',
          ContentType: file.mimetype,
        };
        try {
          const data = await s3Client.send(new PutObjectCommand(params));
          if (data && data?.$metadata?.httpStatusCode === 200) {
            const data = await this.prismaService.file.create({
              data: {
                name: fileName,
                url: aws_s3_url + params.Key,
              },
              select: {
                id: true,
                name: true,
                url: true,
              },
            });

            dataUpload.push(data);
          }
        } catch (err) {
          throw new BadRequestException(err.message);
        }
      }
      return dataUpload;
    } catch (error) {
      console.log('🚀 ~~~~~~ error:', error.message);
      throw new BadRequestException(error.message);
    }
  }
}
