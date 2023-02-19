/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@services';
import { Pagination, ResponseSuccess } from '@types';
import { cleanup, convertFilterStringToArray, MESS_CODE, t } from '@utils';
import { CreateHeartBeatDto, FilterHeartbeatDto, FilterHeartbeatGetMemberDto, UpdateHeartbeatDto } from './dto';

@Injectable()
export class HeartbeatService {
  constructor(private prismaService: PrismaService) {}

  async checkBloodPressureExist(id) {
    const heartbeat = await this.prismaService.heartbeat.findFirst({
      where: {
        id: id,
        isDeleted: false,
      },
    });
    return heartbeat;
  }

  async findAll(dto: FilterHeartbeatDto, pagination: Pagination) {
    try {
      const { skip, take } = pagination;
      let where: Prisma.HeartbeatWhereInput = {
        isDeleted: false,
      };

      if (dto?.search) {
        where.OR = [{ id: { contains: dto?.search.trim() } }, { healthRecordId: { contains: dto?.search.trim() } }];
      }
      const ids = convertFilterStringToArray(dto.ids);
      if (ids && ids.length > 0) {
        where.OR = ids.map((id) => ({
          id: id,
        }));
      }

      const healthRecordIds = convertFilterStringToArray(dto.healthRecordIds);
      if (healthRecordIds && healthRecordIds.length > 0) {
        where.OR = healthRecordIds.map((id) => ({
          healthRecordId: id,
        }));
      }

      where = cleanup(where);

      const [total, data] = await this.prismaService.$transaction([
        this.prismaService.heartbeat.count({ where }),
        this.prismaService.heartbeat.findMany({
          where,
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            healthRecordId: true,
            heartRateIndicator: true,
            createdAt: true,
            createdBy: true,
          },
          skip: !dto?.isAll ? skip : undefined,
          take: !dto?.isAll ? take : undefined,
        }),
      ]);

      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {
        pagination: !dto?.isAll ? pagination : undefined,
        total,
      });
    } catch (error) {}
  }

  async findOne(id: string) {
    try {
      const exist = await this.checkBloodPressureExist({ id });
      if (!exist) throw new BadRequestException(t(MESS_CODE['HEARTBEAT_NOT_FOUND'], {}));

      const data = await this.prismaService.heartbeat.findFirst({
        where: {
          id,
          isDeleted: false,
        },
        select: {
          id: true,
          healthRecordId: true,
          heartRateIndicator: true,
          createdAt: true,
          createdBy: true,
        },
      });
      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getHeartbeat(memberId: string, dto: FilterHeartbeatGetMemberDto, pagination: Pagination) {
    try {
      const { skip, take } = pagination;

      const healthRecord = await this.prismaService.healthRecord.findFirst({
        where: { patientId: memberId },
        select: { id: true },
      });

      const [total, data] = await this.prismaService.$transaction([
        this.prismaService.heartbeat.count({ where: { healthRecordId: healthRecord.id } }),
        this.prismaService.heartbeat.findMany({
          where: { healthRecordId: healthRecord.id },
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            healthRecordId: true,
            heartRateIndicator: true,
            createdAt: true,
            createdBy: true,
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

  async create(memberId: string, dto: CreateHeartBeatDto) {
    try {
      const { heartRateIndicator, healthRecordId } = dto;
      if (Number(heartRateIndicator) < 0) {
        throw new BadRequestException(t(MESS_CODE['INVALID_HEART_RATE_INDICATOR']));
      }

      const data = await this.prismaService.heartbeat.create({
        data: {
          heartRateIndicator,
          healthRecordId,
          createdBy: memberId,
        },
      });
      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
    } catch (error) {}
  }

  async update(memberId: string, id: string, dto: UpdateHeartbeatDto) {
    try {
      const { heartRateIndicator } = dto;
      const exist = await this.checkBloodPressureExist({ id });
      if (!exist) throw new BadRequestException(t(MESS_CODE['HEARTBEAT_NOT_FOUND'], {}));

      if (Number(heartRateIndicator) < 0) {
        throw new BadRequestException(t(MESS_CODE['INVALID_HEART_RATE_INDICATOR']));
      }

      const data = await this.prismaService.heartbeat.update({
        where: { id },
        data: {
          heartRateIndicator,
          updatedBy: memberId,
        },
      });

      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
    } catch (error) {}
  }

  async delete(memberId: string, id: string) {
    try {
      const exist = await this.checkBloodPressureExist({ id });
      if (!exist) throw new BadRequestException(t(MESS_CODE['BLOOD_PRESSURE_NOT_FOUND'], {}));
      const data = await this.prismaService.heartbeat.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedBy: memberId,
        },
      });

      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
    } catch (error) {}
  }
}
