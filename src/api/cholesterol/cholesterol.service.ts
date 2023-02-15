/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@services';
import { Pagination, ResponseSuccess } from '@types';
import { cleanup, convertFilterStringToArray, MESS_CODE, t } from '@utils';
import { CreateCholesterolDto, FilterCholesterolDto, UpdateCholesterolDto } from './dto';

@Injectable()
export class CholesterolService {
  constructor(private prismaService: PrismaService) {}

  async checkCholesterolExist(id) {
    const cholesterol = await this.prismaService.cholesterol.findFirst({
      where: {
        id: id,
        isDeleted: false,
      },
    });
    return cholesterol;
  }

  async findAll(dto: FilterCholesterolDto, pagination: Pagination) {
    try {
      const { skip, take } = pagination;
      let where: Prisma.CholesterolWhereInput = {
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
        this.prismaService.cholesterol.count({ where }),
        this.prismaService.cholesterol.findMany({
          where,
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
      const exist = await this.checkCholesterolExist({ id });
      if (!exist) throw new BadRequestException(t(MESS_CODE['BMI_NOT_FOUND'], {}));

      const data = await this.prismaService.cholesterol.findFirst({
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

  async getCholesterol(memberId: string, pagination: Pagination) {
    try {
      const { skip, take } = pagination;

      const healthRecord = await this.prismaService.healthRecord.findFirst({
        where: { patientId: memberId },
        select: { id: true },
      });

      const [total, data] = await this.prismaService.$transaction([
        this.prismaService.cholesterol.count({ where: { healthRecordId: healthRecord.id } }),
        this.prismaService.cholesterol.findMany({
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

  async create(memberId: string, dto: CreateCholesterolDto) {
    try {
      const { cholesterol, healthRecordId } = dto;
      if (Number(cholesterol) < 0) {
        throw new BadRequestException(t(MESS_CODE['INVALID_HEIGHT']));
      }

      const data = await this.prismaService.cholesterol.create({
        data: {
          cholesterol,
          healthRecordId,
          createdBy: memberId,
        },
      });
      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
    } catch (error) {}
  }

  async update(memberId: string, id: string, dto: UpdateCholesterolDto) {
    try {
      const { cholesterol } = dto;
      if (Number(cholesterol) < 0) {
        throw new BadRequestException(t(MESS_CODE['INVALID_HEIGHT']));
      }
      const exist = await this.checkCholesterolExist({ id });
      if (!exist) throw new BadRequestException(t(MESS_CODE['BMI_NOT_FOUND'], {}));

      const data = await this.prismaService.cholesterol.update({
        where: { id },
        data: {
          cholesterol,
          updatedBy: memberId,
        },
      });

      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
    } catch (error) {}
  }

  async delete(memberId: string, id: string) {
    try {
      const exist = await this.checkCholesterolExist({ id });
      if (!exist) throw new BadRequestException(t(MESS_CODE['BMI_NOT_FOUND'], {}));
      const data = await this.prismaService.cholesterol.update({
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
