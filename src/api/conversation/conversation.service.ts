import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@services';
import { Pagination, ResponseSuccess } from '@types';
import { cleanup, MESS_CODE } from '@utils';

@Injectable()
export class ConversationService {
  constructor(private prismaService: PrismaService) {}

  async findAll(dto: any, pagination: Pagination) {
    try {
      let where: Prisma.ConversationWhereInput = {
        isDeleted: false,
      };

      const { skip, take } = pagination;

      where = cleanup(where);

      const [total, data] = await this.prismaService.$transaction([
        this.prismaService.conversation.count({ where }),
        this.prismaService.conversation.findMany({
          where,
          select: {
            id: true,
            // type
          },
          orderBy: {
            createdAt: 'desc',
          },
          skip: !dto?.isAll ? skip : undefined,
          take: !dto?.isAll ? take : undefined,
        }),
      ]);
    } catch (error) {}
  }

  async findOne(id: string) {
    try {
      // const exist = await this.checkFeatureExist({ id });
      // if (!exist) throw new BadRequestException(t(MESS_CODE['FEATURE_NOT_FOUND'], language));

      const data = await this.prismaService.conversation.findFirst({
        where: {
          id,
          isDeleted: false,
        },
      });

      return ResponseSuccess(data, MESS_CODE['SUCCESS']);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getAllConversationWithId(memberId: string) {
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
            // type
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
      ]);

      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {
        total,
      });
    } catch (error) {}
  }
}
