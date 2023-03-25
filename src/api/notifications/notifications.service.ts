/* eslint-disable prettier/prettier */
import { ResponseSuccess } from '@/types';
import { MESS_CODE, t } from '@/utils';
import { SocketGateWayService } from '@api/socket-io/socket-io.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@services';
import { Pagination } from '@types';
import { cleanup } from '@utils';
import { notificationSelect, notificationsSelect } from './conditions';
import { CreateNotificationsDto, FilterNotificationsDto, UpdateNotificationDto } from './dto';

@Injectable()
export class NotificationsService {
  constructor(private prismaService: PrismaService, private socketsService: SocketGateWayService) {}

  async checkNotificationExist(options: Prisma.NotificationWhereInput) {
    return await this.prismaService.notification.findFirst({
      where: {
        ...options,
        isDeleted: false,
      },
    });
  }

  async findAll(userId: string, dto: FilterNotificationsDto, pagination: Pagination) {
    try {
      const { skip, take } = pagination;
      let where: Prisma.NotificationWhereInput = {
        isDeleted: false,
        userId,
      };

      if (dto.search) {
        where.OR = [{ title: { contains: dto?.search } }, { content: { contains: dto?.search } }];
      }

      where = cleanup(where);

      const [total, data] = await this.prismaService.$transaction([
        this.prismaService.notification.count({ where }),
        this.prismaService.notification.findMany({
          where,
          select: notificationsSelect,
          skip,
          take,
          orderBy: {
            createdAt: 'desc',
          },
        }),
      ]);
      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {
        pagination,
        total,
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async findOne(id: string) {
    try {
      const roleIdExist = await this.checkNotificationExist({ id });
      if (!roleIdExist) throw new BadRequestException(t(MESS_CODE['NOTIFICATION_NOT_FOUND']));

      const data = await this.prismaService.notification.findFirst({
        where: {
          id,
          isDeleted: false,
        },
        select: notificationSelect,
      });
      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getAll(userId: string, dto: FilterNotificationsDto, pagination: Pagination) {
    try {
      const { skip, take } = pagination;

      const [total, data] = await this.prismaService.$transaction([
        this.prismaService.notification.count({
          where: {
            userId: userId,
            isDeleted: false,
          },
        }),
        this.prismaService.notification.findMany({
          where: {
            userId: userId,
            isDeleted: false,
          },
          select: notificationsSelect,
          skip: !dto?.isAll ? skip : undefined,
          take: !dto?.isAll ? take : undefined,
          orderBy: {
            createdAt: 'desc',
          },
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

  async create(userId: string, dto: CreateNotificationsDto) {
    try {
      const data = await this.prismaService.notification.create({
        data: {
          ...dto,
          isRead: false,
          createdBy: userId,
        },
      });
      await this.socketsService.newNotification({
        notificationId: data.id,
        data: data,
      });
      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async update(userId: string, id: string, dto: UpdateNotificationDto) {
    try {
      const exist = await this.checkNotificationExist({ id });
      if (!exist) throw new BadRequestException(t(MESS_CODE['NOTIFICATION_NOT_FOUND']));

      const data = await this.prismaService.$transaction(async (prisma) => {
        const data = await prisma.notification.update({
          where: { id },
          data: {
            ...dto,
            updatedBy: userId,
          },
        });

        return data;
      });

      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async read(userId: string, id: string) {
    try {
      const exist = await this.checkNotificationExist({
        id,
        userId,
      });
      if (!exist) throw new BadRequestException(t(MESS_CODE['NOTIFICATION_NOT_FOUND']));

      const data = await this.prismaService.notification.update({
        where: { id },
        data: {
          isRead: true,
          updatedBy: userId,
        },
      });

      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async readAll(userId: string) {
    try {
      const data = await this.prismaService.notification.updateMany({
        where: { userId },
        data: {
          isRead: true,
          updatedBy: userId,
        },
      });

      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async remove(userId: string, id: string) {
    try {
      const exist = await this.checkNotificationExist({ id });
      if (!exist) throw new BadRequestException(t(MESS_CODE['NOTIFICATION_NOT_FOUND']));

      const data = await this.prismaService.notification.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedBy: userId,
        },
      });
      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
