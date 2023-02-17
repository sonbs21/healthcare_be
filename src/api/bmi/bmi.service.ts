/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@services';
import { Pagination, ResponseSuccess } from '@types';
import { cleanup, convertFilterStringToArray, funcIndexBmi, MESS_CODE, t } from '@utils';
import { CreateBmiDto, FilterBmiDto, UpdateBmiDto } from './dto';

@Injectable()
export class BmiService {
  constructor(private prismaService: PrismaService) {}

  async checkBmiExist(id) {
    const bmi = await this.prismaService.bmi.findFirst({
      where: {
        id: id,
        isDeleted: false,
      },
    });
    return bmi;
  }

  async findAll(dto: FilterBmiDto, pagination: Pagination) {
    try {
      const { skip, take } = pagination;
      let where: Prisma.BmiWhereInput = {
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
        this.prismaService.bmi.count({ where }),
        this.prismaService.bmi.findMany({
          where,
          select: {
            id: true,
            healthRecordId: true,
            height: true,
            weight: true,
            indexBmi: true,
            createdAt: true,
            // type
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
    } catch (error) {}
  }

  async findOne(id: string) {
    try {
      const exist = await this.checkBmiExist({ id });
      if (!exist) throw new BadRequestException(t(MESS_CODE['BMI_NOT_FOUND'], {}));

      const data = await this.prismaService.bmi.findFirst({
        where: {
          id,
          isDeleted: false,
        },
      });
      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getBmi(memberId: string, pagination: Pagination) {
    try {
      const { skip, take } = pagination;

      const healthRecord = await this.prismaService.healthRecord.findFirst({
        where: { patientId: memberId },
        select: { id: true },
      });

      const [total, data] = await this.prismaService.$transaction([
        this.prismaService.bmi.count({ where: { healthRecordId: healthRecord.id } }),
        this.prismaService.bmi.findMany({
          where: { healthRecordId: healthRecord.id },
          orderBy: {
            createdAt: 'desc',
          },
          skip: skip,
          take: take,
        }),
      ]);

      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {
        pagination: pagination,
        total,
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async create(memberId: string, dto: CreateBmiDto) {
    try {
      const { height, weight, healthRecordId } = dto;
      if (Number(height) < 0) {
        throw new BadRequestException(t(MESS_CODE['INVALID_HEIGHT']));
      }
      if (Number(weight) < 0) {
        throw new BadRequestException(t(MESS_CODE['INVALID_WEIGHT']));
      }
      const indexBmi: any = funcIndexBmi(Number(height), Number(weight));

      const data = await this.prismaService.bmi.create({
        data: {
          weight,
          height,
          indexBmi,
          healthRecordId,
          createdBy: memberId,
        },
      });
      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
    } catch (error) {}
  }

  async update(memberId: string, id: string, dto: UpdateBmiDto) {
    try {
      const { height, weight } = dto;
      const exist = await this.checkBmiExist({ id });
      if (!exist) throw new BadRequestException(t(MESS_CODE['BMI_NOT_FOUND'], {}));

      if (Number(height) < 0) {
        throw new BadRequestException(t(MESS_CODE['INVALID_HEIGHT']));
      }
      if (Number(weight) < 0) {
        throw new BadRequestException(t(MESS_CODE['INVALID_WEIGHT']));
      }

      const data = await this.prismaService.bmi.update({
        where: { id },
        data: {
          weight,
          height,
          updatedBy: memberId,
        },
      });

      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
    } catch (error) {}
  }

  async delete(memberId: string, id: string) {
    try {
      const exist = await this.checkBmiExist({ id });
      if (!exist) throw new BadRequestException(t(MESS_CODE['BMI_NOT_FOUND'], {}));
      const data = await this.prismaService.bmi.update({
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
