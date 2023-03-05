/* eslint-disable prettier/prettier */
import { FilterHealthRecordDto } from '@api/doctor/dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@services';
import { Pagination, ResponseSuccess } from '@types';
import { cleanup, convertFilterStringToArray, MESS_CODE, t } from '@utils';
import {
  CreateBloodPressureDto,
  FilterBloodPressureDto,
  FilterBloodPressureGetMemberDto,
  UpdateBloodPressureDto,
} from './dto';

@Injectable()
export class BloodPressureService {
  constructor(private prismaService: PrismaService) {}

  async checkBloodPressureExist(id) {
    const bloodPressure = await this.prismaService.bloodPressure.findFirst({
      where: {
        id: id,
        isDeleted: false,
      },
    });
    return bloodPressure;
  }

  async findAll(dto: FilterBloodPressureDto, pagination: Pagination) {
    try {
      const { skip, take } = pagination;
      let where: Prisma.BloodPressureWhereInput = {
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
        this.prismaService.bloodPressure.count({ where }),
        this.prismaService.bloodPressure.findMany({
          where,
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            healthRecordId: true,
            systolic: true,
            diastolic: true,
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
      if (!exist) throw new BadRequestException(t(MESS_CODE['BLOOD_PRESSURE_NOT_FOUND'], {}));

      const data = await this.prismaService.bloodPressure.findFirst({
        where: {
          id,
          isDeleted: false,
        },
        select: {
          id: true,
          healthRecordId: true,
          systolic: true,
          diastolic: true,
          createdAt: true,
          createdBy: true,
        },
      });
      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getBloodPressure(memberId: string, dto: FilterBloodPressureGetMemberDto, pagination: Pagination) {
    try {
      const { skip, take } = pagination;

      const healthRecord = await this.prismaService.healthRecord.findFirst({
        where: { patientId: memberId },
        select: { id: true },
      });

      const [total, data] = await this.prismaService.$transaction([
        this.prismaService.bloodPressure.count({ where: { healthRecordId: healthRecord.id } }),
        this.prismaService.bloodPressure.findMany({
          where: { healthRecordId: healthRecord.id },
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            healthRecordId: true,
            systolic: true,
            diastolic: true,
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

  async getBloodPressureForDoctor(dto: FilterHealthRecordDto, pagination: Pagination) {
    try {
      const { skip, take } = pagination;

      const healthRecord = await this.prismaService.healthRecord.findFirst({
        where: { patientId: dto.patientId },
        select: { id: true },
      });

      const [total, data] = await this.prismaService.$transaction([
        this.prismaService.bloodPressure.count({ where: { healthRecordId: healthRecord.id } }),
        this.prismaService.bloodPressure.findMany({
          where: { healthRecordId: healthRecord.id },
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            healthRecordId: true,
            systolic: true,
            diastolic: true,
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

  async create(memberId: string, dto: CreateBloodPressureDto) {
    try {
      const { systolic, diastolic, healthRecordId } = dto;
      if (Number(systolic) < 0) {
        throw new BadRequestException(t(MESS_CODE['INVALID_HEIGHT']));
      }
      if (Number(diastolic) < 0) {
        throw new BadRequestException(t(MESS_CODE['INVALID_HEIGHT']));
      }

      const data = await this.prismaService.bloodPressure.create({
        data: {
          systolic,
          diastolic,
          healthRecordId,
          createdBy: memberId,
        },
      });
      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
    } catch (error) {}
  }

  async update(memberId: string, id: string, dto: UpdateBloodPressureDto) {
    try {
      const { systolic, diastolic } = dto;
      const exist = await this.checkBloodPressureExist({ id });
      if (!exist) throw new BadRequestException(t(MESS_CODE['BLOOD_PRESSURE_NOT_FOUND'], {}));

      if (Number(systolic) < 0) {
        throw new BadRequestException(t(MESS_CODE['INVALID_SYSTOLIC']));
      }
      if (Number(diastolic) < 0) {
        throw new BadRequestException(t(MESS_CODE['INVALID_DIASTOLIC']));
      }

      const data = await this.prismaService.bloodPressure.update({
        where: { id },
        data: {
          systolic,
          diastolic,
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
      const data = await this.prismaService.bloodPressure.update({
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
