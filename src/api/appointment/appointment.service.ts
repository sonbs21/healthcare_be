/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, StatusAppointment } from '@prisma/client';
import { PrismaService } from '@services';
import { Pagination, ResponseSuccess } from '@types';
import { cleanup, convertFilterStringToArray, MESS_CODE, t } from '@utils';
import moment from 'moment';
import { CreateAppointmentDto, FilterAppointmentDto, UpdateAppointmentDto } from './dto';

@Injectable()
export class AppointmentService {
  constructor(private prismaService: PrismaService) {}

  async checkAppointmentExist(id) {
    const appointment = await this.prismaService.appointment.findFirst({
      where: {
        id: id,
        isDeleted: false,
      },
    });
    return appointment;
  }

  async findAll(dto: FilterAppointmentDto, pagination: Pagination) {
    try {
      const { skip, take } = pagination;
      const { startDate, endDate } = dto;
      let where: Prisma.AppointmentWhereInput = {
        createdAt:
          startDate || endDate
            ? {
                gte: startDate ? moment(startDate).toISOString() : undefined,
                lte: endDate ? moment(endDate).toISOString() : undefined,
              }
            : undefined,
        isDeleted: false,
      };

      if (dto?.search) {
        where.OR = [{ id: { contains: dto?.search.trim() } }];
      }
      const ids = convertFilterStringToArray(dto.ids);
      if (ids && ids.length > 0) {
        where.OR = ids.map((id) => ({
          id: id,
        }));
      }

      where = cleanup(where);

      const [total, data] = await this.prismaService.$transaction([
        this.prismaService.appointment.count({ where }),
        this.prismaService.appointment.findMany({
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
      const exist = await this.checkAppointmentExist({ id });
      if (!exist) throw new BadRequestException(t(MESS_CODE['BLOOD_PRESSURE_NOT_FOUND'], {}));

      const data = await this.prismaService.appointment.findFirst({
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

  async getAppointmentDoctor(memberId: string, dto: FilterAppointmentDto, pagination: Pagination) {
    try {
      const { skip, take } = pagination;
      const { startDate, endDate } = dto;

      const [total, data] = await this.prismaService.$transaction([
        this.prismaService.appointment.count({
          where: {
            doctorId: memberId,
            createdAt:
              startDate || endDate
                ? {
                    gte: startDate ? moment(startDate).toISOString() : undefined,
                    lte: endDate ? moment(endDate).toISOString() : undefined,
                  }
                : undefined,
          },
        }),
        this.prismaService.appointment.findMany({
          where: {
            doctorId: memberId,
            createdAt:
              startDate || endDate
                ? {
                    gte: startDate ? moment(startDate).toISOString() : undefined,
                    lte: endDate ? moment(endDate).toISOString() : undefined,
                  }
                : undefined,
          },
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

  async getAppointmentPatient(memberId: string, dto: FilterAppointmentDto, pagination: Pagination) {
    try {
      const { skip, take } = pagination;
      const { startDate, endDate } = dto;

      const [total, data] = await this.prismaService.$transaction([
        this.prismaService.appointment.count({
          where: {
            patientId: memberId,
            createdAt:
              startDate || endDate
                ? {
                    gte: startDate ? moment(startDate).toISOString() : undefined,
                    lte: endDate ? moment(endDate).toISOString() : undefined,
                  }
                : undefined,
          },
        }),
        this.prismaService.appointment.findMany({
          where: {
            patientId: memberId,
            createdAt:
              startDate || endDate
                ? {
                    gte: startDate ? moment(startDate).toISOString() : undefined,
                    lte: endDate ? moment(endDate).toISOString() : undefined,
                  }
                : undefined,
          },
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

  async create(memberId: string, dto: CreateAppointmentDto) {
    try {
      const patient = await this.prismaService.patient.findFirst({
        where: {
          id: memberId,
        },
      });
      const data = await this.prismaService.appointment.create({
        data: {
          fullName: dto.fullName,
          phone: dto.phone,
          notes: dto.notes,
          dateOfBirth: dto.dateOfBirth,
          dateMeeting: dto.dateMeeting,
          timeMeeting: dto.timeMeeting,
          statusAppointment: StatusAppointment.CREATED,
          patientId: memberId,
          doctorId: patient.doctorId,
          createdBy: memberId,
        },
      });
      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
    } catch (error) {}
  }

  async approve(memberId: string, id: string) {
    try {
      const appointment = await this.prismaService.appointment.findFirst({
        where: {
          id: id,
        },
      });

      if (!appointment) {
        throw new BadRequestException(t(MESS_CODE['BLOOD_PRESSURE_NOT_FOUND'], {}));
      }

      const data = await this.prismaService.appointment.update({
        where: {
          id,
        },
        data: {
          statusAppointment: StatusAppointment.APPROVED,
          updatedBy: memberId,
        },
      });
      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
    } catch (error) {}
  }

  async refuse(memberId: string, id: string) {
    try {
      const appointment = await this.prismaService.appointment.findFirst({
        where: {
          id: id,
        },
      });

      if (!appointment) {
        throw new BadRequestException(t(MESS_CODE['BLOOD_PRESSURE_NOT_FOUND'], {}));
      }

      const data = await this.prismaService.appointment.update({
        where: {
          id,
        },
        data: {
          statusAppointment: StatusAppointment.REFUSED,
          updatedBy: memberId,
        },
      });
      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
    } catch (error) {}
  }

  async cancel(memberId: string, id: string) {
    try {
      const appointment = await this.prismaService.appointment.findFirst({
        where: {
          id: id,
        },
      });

      if (!appointment) {
        throw new BadRequestException(t(MESS_CODE['BLOOD_PRESSURE_NOT_FOUND'], {}));
      }

      const data = await this.prismaService.appointment.update({
        where: {
          id,
        },
        data: {
          statusAppointment: StatusAppointment.CANCELED,
          updatedBy: memberId,
        },
      });
      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
    } catch (error) {}
  }

  async update(memberId: string, id: string, dto: UpdateAppointmentDto) {
    try {
      const data = await this.prismaService.appointment.update({
        where: { id },
        data: {
          fullName: dto.fullName,
          phone: dto.phone,
          notes: dto.notes,
          dateOfBirth: dto.dateOfBirth,
          dateMeeting: dto.dateMeeting,
          timeMeeting: dto.timeMeeting,
          updatedBy: memberId,
        },
      });

      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
    } catch (error) {}
  }

  async delete(memberId: string, id: string) {
    try {
      const exist = await this.checkAppointmentExist({ id });
      if (!exist) throw new BadRequestException(t(MESS_CODE['BLOOD_PRESSURE_NOT_FOUND'], {}));
      const data = await this.prismaService.appointment.update({
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
