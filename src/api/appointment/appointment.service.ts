/* eslint-disable prettier/prettier */
import { SocketGateWayService } from '@api/socket-io/socket-io.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, StatusAppointment, TypeNotification } from '@prisma/client';
import { PrismaService } from '@services';
import { Pagination, ResponseSuccess } from '@types';
import { cleanup, convertFilterStringToArray, MESS_CODE, t } from '@utils';
import moment from 'moment';
import { CreateAppointmentDto, FilterAppointmentDto, UpdateAppointmentDto } from './dto';

@Injectable()
export class AppointmentService {
  constructor(private prismaService: PrismaService, private socketsService: SocketGateWayService) {}

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
      let where: Prisma.AppointmentWhereInput = {
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
      const data = await this.prismaService.appointment.findFirst({
        where: {
          id,
          isDeleted: false,
        },
        select: {
          id: true,
          fullName: true,
          dateOfBirth: true,
          dateMeeting: true,
          phone: true,
          notes: true,
          reason: true,
          timeMeeting: true,
          statusAppointment: true,
          doctor: true,
          patient: true,
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
      const { timeDate } = dto;
      const date = timeDate ? new Date(timeDate) : new Date();

      date.setHours(0, 0, 0, 0);
      const timeInMs = date.getTime();

      const gte = new Date(timeInMs).toISOString();
      const lte = new Date(timeInMs + 86399999).toISOString();

      const [total, data] = await this.prismaService.$transaction([
        this.prismaService.appointment.count({
          where: {
            doctorId: memberId,
            statusAppointment: dto.status,
            dateMeeting: timeDate
              ? {
                  gte: timeDate ? gte : undefined,
                  lte: timeDate ? lte : undefined,
                }
              : undefined,
          },
        }),
        this.prismaService.appointment.findMany({
          where: {
            doctorId: memberId,
            statusAppointment: dto.status,
            dateMeeting: timeDate
              ? {
                  gte: timeDate ? gte : undefined,
                  lte: timeDate ? lte : undefined,
                }
              : undefined,
          },
          select: {
            id: true,
            fullName: true,
            dateOfBirth: true,
            dateMeeting: true,
            phone: true,
            notes: true,
            reason: true,
            timeMeeting: true,
            statusAppointment: true,
            doctor: true,
            patient: true,
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
      const { timeDate } = dto;
      const date = timeDate ? new Date(timeDate) : new Date();
      date.setHours(0, 0, 0, 0);
      const timeInMs = date.getTime();

      const gte = new Date(timeInMs).toISOString();
      const lte = new Date(timeInMs + 86399999).toISOString();
      const [total, data] = await this.prismaService.$transaction([
        this.prismaService.appointment.count({
          where: {
            patientId: memberId,
            statusAppointment: dto.status,
            dateMeeting: timeDate
              ? {
                  gte: timeDate ? gte : undefined,
                  lte: timeDate ? lte : undefined,
                }
              : undefined,
          },
        }),
        this.prismaService.appointment.findMany({
          where: {
            patientId: memberId,
            statusAppointment: dto.status,
            dateMeeting: timeDate
              ? {
                  gte: timeDate ? gte : undefined,
                  lte: timeDate ? lte : undefined,
                }
              : undefined,
          },
          select: {
            id: true,
            fullName: true,
            dateOfBirth: true,
            dateMeeting: true,
            phone: true,
            notes: true,
            reason: true,
            timeMeeting: true,
            statusAppointment: true,
            doctor: true,
            patient: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          skip: skip,
          take: take,
        }),
      ]);
      const newData = await Promise.all(
        data.map(async (item) => {
          if (item.dateMeeting.getTime() < Date.now() && item.statusAppointment === StatusAppointment.APPROVED) {
            const itemUpdate = await this.prismaService.appointment.update({
              where: {
                id: item.id,
              },
              data: {
                statusAppointment: StatusAppointment.COMPLETED,
              },
            });

            return itemUpdate;
          }
          return item;
        }),
      );

      return ResponseSuccess(newData, MESS_CODE['SUCCESS'], {
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

      const notification = await this.prismaService.notification.create({
        data: {
          title: 'Đặt lịch hẹn',
          content: `Bệnh nhân ${patient.fullName} đã đặt lịch hẹn với bạn`,
          typeNotification: TypeNotification.APPOINTMENT,
          isRead: false,
          userId: patient.doctorId,
        },
      });

      await this.socketsService.newNotification({
        notificationId: notification.id,
        data: notification,
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

  async post(memberId: string, id: string, dto: CreateAppointmentDto) {
    try {
      const doctor = await this.prismaService.patient.findFirst({
        where: {
          id: memberId,
        },
      });

      const notification = await this.prismaService.notification.create({
        data: {
          title: 'Đặt lịch hẹn',
          content: `Bác sĩ ${doctor.fullName} đã đặt lịch hẹn với bạn`,
          typeNotification: TypeNotification.APPOINTMENT,
          isRead: false,
          userId: id,
        },
      });

      await this.socketsService.newNotification({
        notificationId: notification.id,
        data: notification,
      });
      const data = await this.prismaService.appointment.create({
        data: {
          fullName: dto.fullName,
          phone: dto.phone,
          notes: dto.notes,
          dateOfBirth: dto.dateOfBirth,
          dateMeeting: dto.dateMeeting,
          timeMeeting: dto.timeMeeting,
          statusAppointment: StatusAppointment.APPROVED,
          patientId: id,
          doctorId: memberId,
          createdBy: memberId,
        },
      });
      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
    } catch (error) {}
  }

  async approve(memberId: string, id: string) {
    try {
      const doctor = await this.prismaService.doctor.findFirst({
        where: {
          id: memberId,
        },
      });

      if (!doctor) {
        throw new BadRequestException(t(MESS_CODE['NOT_PERMISSION'], {}));
      }

      const appointment = await this.prismaService.appointment.findFirst({
        where: {
          id: id,
        },
      });

      if (!appointment) {
        throw new BadRequestException(t(MESS_CODE['APPOINTMENT_NOT_FOUND'], {}));
      }

      const notification = await this.prismaService.notification.create({
        data: {
          title: 'Đặt lịch hẹn thành công',
          content: `Bác sĩ ${doctor.fullName} đã đồng ý với lịch hẹn của bạn`,
          typeNotification: TypeNotification.APPOINTMENT,
          isRead: false,
          userId: appointment.patientId,
        },
      });

      await this.socketsService.newNotification({
        notificationId: notification.id,
        data: notification,
      });

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
      const doctor = await this.prismaService.doctor.findFirst({
        where: {
          id: memberId,
        },
      });

      if (!doctor) {
        throw new BadRequestException(t(MESS_CODE['NOT_PERMISSION'], {}));
      }
      const appointment = await this.prismaService.appointment.findFirst({
        where: {
          id: id,
        },
      });

      if (!appointment) {
        throw new BadRequestException(t(MESS_CODE['BLOOD_PRESSURE_NOT_FOUND'], {}));
      }

      const notification = await this.prismaService.notification.create({
        data: {
          title: 'Đặt lịch hẹn thất bại',
          content: `Bác sĩ ${doctor.fullName} đã từ chối với lịch hẹn của bạn`,
          typeNotification: TypeNotification.APPOINTMENT,
          isRead: false,
          userId: appointment.patientId,
        },
      });

      await this.socketsService.newNotification({
        notificationId: notification.id,
        data: notification,
      });

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
      const patient = await this.prismaService.patient.findFirst({
        where: {
          id: memberId,
        },
      });

      const doctor = await this.prismaService.doctor.findFirst({
        where: {
          id: memberId,
        },
      });

      const appointment = await this.prismaService.appointment.findFirst({
        where: {
          id: id,
        },
      });

      if (!appointment) {
        throw new BadRequestException(t(MESS_CODE['BLOOD_PRESSURE_NOT_FOUND'], {}));
      }

      if (patient) {
        const notification = await this.prismaService.notification.create({
          data: {
            title: 'Hủy lịch hẹn',
            content: `Bệnh nhân ${patient.fullName} đã hủy lịch hẹn`,
            typeNotification: TypeNotification.APPOINTMENT,
            isRead: false,
            userId: patient.doctorId,
          },
        });
        await this.socketsService.newNotification({
          notificationId: notification.id,
          data: notification,
        });
      }

      if (doctor) {
        const notification = await this.prismaService.notification.create({
          data: {
            title: 'Hủy lịch hẹn',
            content: `Bác sĩ ${doctor.fullName} đã hủy lịch hẹn`,
            typeNotification: TypeNotification.APPOINTMENT,
            isRead: false,
            userId: appointment.patientId,
          },
        });
        await this.socketsService.newNotification({
          notificationId: notification.id,
          data: notification,
        });
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
