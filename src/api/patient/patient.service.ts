/* eslint-disable prettier/prettier */
import { ResponseSuccess } from '@/types';
import { convertFilterStringToArray, MESS_CODE, t } from '@/utils';
import { BadRequestException, Injectable } from '@nestjs/common';
import {
  Prisma,
  Status,
  TypeConversation,
  TypeNotification,
} from '@prisma/client';
import { PrismaService } from '@services';
import { Pagination } from '@types';
import { cleanup } from '@utils';
import * as _ from 'lodash';
import * as moment from 'moment';
import { patientSelect } from './conditions';
import { FilterPatientsDto, SelectDoctorDto, UpdatePatientDto } from './dto';

@Injectable()
export class PatientService {
  constructor(private prismaService: PrismaService) {}

  async findAll(dto: FilterPatientsDto, pagination: Pagination) {
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

  async findOne(id: string) {
    try {
      const exist = await this.prismaService.patient.findFirst({
        where: { id },
      });
      if (!exist)
        throw new BadRequestException(t(MESS_CODE['PATIENT_NOT_FOUND']));

      const data = await this.prismaService.patient.findFirst({
        where: { id },
        select: patientSelect,
      });
      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async update(id: string, dto: UpdatePatientDto) {
    try {
      const exist = await this.prismaService.patient.findFirst({
        where: { id },
      });
      if (!exist)
        throw new BadRequestException(t(MESS_CODE['PATIENT_NOT_FOUND']));

      const data = await this.prismaService.patient.update({
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

  async selectDoctor(memberId: string, dto: SelectDoctorDto) {
    try {
      const exist = await this.prismaService.doctor.findFirst({
        where: { id: dto.doctorId },
      });
      if (!exist)
        throw new BadRequestException(t(MESS_CODE['DOCTOR_NOT_FOUND']));

      const data = await this.prismaService.$transaction(async (prisma) => {
        await prisma.patient.update({
          where: { id: memberId },
          data: {
            doctorId: dto.doctorId,
          },
        });

        const patient = await prisma.patient.findFirst({
          where: { id: memberId },
          select: patientSelect,
        });

        const arr = [memberId, dto.doctorId];

        await prisma.conversation.create({
          data: {
            avatar: null,
            typeConversation: TypeConversation.SINGLE,
            member: arr.length
              ? { connect: arr.map((v) => ({ memberId: v })) }
              : undefined,
          },
        });

        await prisma.healthRecord.create({
          data: {
            patientId: memberId,
            status: Status.SAFE,
          },
        });

        await prisma.notification.create({
          data: {
            title: 'Chăm sóc bệnh nhân',
            content: `Bệnh nhân ${patient.fullName} đã được phân công cho bạn`,
            typeNotification: TypeNotification.SYSTEM,
            isRead: false,
            userId: dto.doctorId,
          },
        });

        // await this.prismaService
        return data;
      });

      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
    } catch (err) {
      console.log(err);

      throw new BadRequestException(err.message);
    }
  }

  async revokeDoctor(memberId: string) {
    try {
      const data = await this.prismaService.patient.update({
        where: { id: memberId },
        data: {
          doctorId: undefined,
        },
      });

      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
    } catch (err) {
      console.log(err);

      throw new BadRequestException(err.message);
    }
  }
}
