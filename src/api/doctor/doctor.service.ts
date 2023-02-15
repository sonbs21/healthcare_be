/* eslint-disable prettier/prettier */
import { ResponseSuccess } from '@/types';
import { convertFilterStringToArray, MESS_CODE, t } from '@/utils';
import { patientSelect } from '@api/patient/conditions';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@services';
import { Pagination } from '@types';
import { cleanup } from '@utils';
import * as _ from 'lodash';
import * as moment from 'moment';
import { doctorsSelect } from './conditions';
import { FilterDoctorsDto, FilterPatientsWithDoctorIdDto, UpdateDoctorDto } from './dto';

@Injectable()
export class DoctorService {
  constructor(private prismaService: PrismaService) {}

  async findAll(dto: FilterDoctorsDto, pagination: Pagination) {
    try {
      const { skip, take } = pagination;
      let where: Prisma.DoctorWhereInput = {
        isDeleted: false,
      };

      const whereAND = [];
      const whereOR = [];

      if (dto.search) {
        whereAND.push({
          OR: [
            { name: { contains: dto?.search } },
            { email: { contains: dto?.search } },
            { description: { contains: dto?.search } },
            { experience: { contains: dto?.search } },
            { workPlace: { contains: dto?.search } },
            ,
            { specialize: { contains: dto?.search } },
          ],
        });
      }

      const ids = convertFilterStringToArray(dto?.ids);
      if (ids && ids?.length > 0) {
        whereAND.push({ id: { in: ids } });
      }

      if (whereAND.length) {
        where.AND = [...whereAND];
      }
      if (whereOR.length) where.OR = [...whereOR];

      where = cleanup(where);

      const [total, data] = await this.prismaService.$transaction([
        this.prismaService.doctor.count({ where }),
        this.prismaService.doctor.findMany({
          where,
          select: doctorsSelect,
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

  async findOne(id: string) {
    try {
      const exist = await this.prismaService.doctor.findFirst({
        where: { id },
      });
      if (!exist) throw new BadRequestException(t(MESS_CODE['DOCTOR_NOT_FOUND']));

      const data = await this.prismaService.doctor.findFirst({
        where: { id },
        select: doctorsSelect,
      });
      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async update(id: string, dto: UpdateDoctorDto) {
    try {
      const exist = await this.prismaService.doctor.findFirst({
        where: { id },
      });
      if (!exist) throw new BadRequestException(t(MESS_CODE['DOCTOR_NOT_FOUND']));

      const data = await this.prismaService.doctor.update({
        where: { id },
        data: {
          ...dto,
        },
      });

      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
    } catch (err) {
      console.log(err);

      throw new BadRequestException(err.message);
    }
  }

  async getAllPatient(memberId: string, dto: FilterPatientsWithDoctorIdDto, pagination: Pagination) {
    try {
      console.log('memberId', memberId);
      const { skip, take } = pagination;
      let where: Prisma.PatientWhereInput = {
        isDeleted: false,
        doctorId: memberId,
      };

      const whereAND = [];
      const whereOR = [];

      if (dto?.search) {
        whereOR.push({
          OR: [
            { fullName: { contains: dto?.search } },
            { email: { contains: dto?.search } },
            { description: { contains: dto?.search } },
            { experience: { contains: dto?.search } },
            { workPlace: { contains: dto?.search } },
            { specialize: { contains: dto?.search } },
          ],
        });
      }

      const ids = convertFilterStringToArray(dto?.ids);
      if (ids && ids?.length > 0) {
        whereAND.push({ id: { in: ids } });
      }

      if (whereAND.length) {
        where.AND = [...whereAND];
      }
      if (whereOR.length) where.OR = [...whereOR];

      where = cleanup(where);

      const [total, data] = await this.prismaService.$transaction([
        this.prismaService.patient.count({ where }),
        this.prismaService.patient.findMany({
          where,
          select: patientSelect,
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
}
