/* eslint-disable prettier/prettier */
import { ResponseSuccess } from '@/types';
import { convertFilterStringToArray, MESS_CODE, t } from '@/utils';
import { SocketGateWayService } from '@api/socket-io/socket-io.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, TypeConversation, TypeNotification } from '@prisma/client';
import { PrismaService } from '@services';
import { Pagination } from '@types';
import { cleanup } from '@utils';
import { patientSelect } from './conditions';
import { FilterPatientsDto, RatingDto, SelectDoctorDto, UpdatePatientDto } from './dto';

@Injectable()
export class PatientService {
  constructor(private prismaService: PrismaService, private socketsService: SocketGateWayService) {}

  async findAll(dto: FilterPatientsDto, pagination: Pagination) {
    try {
      const { skip, take } = pagination;
      let where: Prisma.DoctorWhereInput = {
        isDeleted: false,
      };

      const whereAND = [];
      const whereOR = [];

      if (dto.search) {
        whereOR.push({
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
      if (!exist) throw new BadRequestException(t(MESS_CODE['PATIENT_NOT_FOUND']));

      const data = await this.prismaService.patient.findFirst({
        where: { id },
        select: patientSelect,
      });
      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async update(memberId: string, dto: UpdatePatientDto) {
    try {
      const exist = await this.prismaService.patient.findFirst({
        where: { id: memberId },
      });
      if (!exist) throw new BadRequestException(t(MESS_CODE['PATIENT_NOT_FOUND']));

      const data = await this.prismaService.patient.update({
        where: { id: memberId },
        data: {
          ...dto,
        },
      });

      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async selectDoctor(memberId: string, dto: SelectDoctorDto) {
    try {
      const exist = await this.prismaService.doctor.findFirst({
        where: { id: dto.doctorId },
      });
      if (!exist) throw new BadRequestException(t(MESS_CODE['DOCTOR_NOT_FOUND']));

      const patient = await this.prismaService.patient.findFirst({
        where: { id: memberId },
        select: patientSelect,
      });

      if (patient?.doctorId !== null) {
        throw new BadRequestException(t(MESS_CODE['DOCTOR_NOT_FOUND']));
      }
      const data = await this.prismaService.patient.update({
        where: { id: memberId },
        data: {
          doctorId: dto.doctorId,
        },
      });

      const arr = [memberId, dto.doctorId];
      const conversation = await this.prismaService.conversation.create({
        data: {
          avatar: null,
          typeConversation: TypeConversation.SINGLE,
          leaderId: dto.doctorId,
          member: arr.length ? { connect: arr.map((v) => ({ memberId: v })) } : undefined,
        },
      });

      await this.socketsService.newConversation({
        conversationId: conversation.id,
        data: conversation,
      });

      const notification = await this.prismaService.notification.create({
        data: {
          title: 'Chăm sóc bệnh nhân',
          content: `Bệnh nhân ${patient.fullName} đã được phân công cho bạn`,
          typeNotification: TypeNotification.SYSTEM,
          isRead: false,
          userId: dto.doctorId,
        },
      });

      await this.socketsService.newNotification({
        notificationId: notification.id,
        data: notification,
      });
      // await this.prismaService

      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async revokeDoctor(id: string) {
    try {
      const user = await this.prismaService.user.findFirst({
        where: { id },
      });
      const patient = await this.prismaService.patient.findFirst({
        where: { id: user.memberId },
      });
      const data = await this.prismaService.patient.update({
        where: { id: patient.id },
        data: {
          doctorId: null,
        },
      });

      const conversation = await this.prismaService.conversation.findMany({
        where: {
          member: { some: { id: { in: id } } },
          leaderId: patient.doctorId,
          isDeleted: false,
        },
      });

      await Promise.all(
        conversation.map(async (i) => {
          if (i.typeConversation === TypeConversation.SINGLE) {
            await this.prismaService.conversation.update({
              where: {
                id: i.id,
              },
              data: {
                isDeleted: true,
                deletedBy: patient.id,
              },
            });
          } else {
            await this.prismaService.conversation.update({
              where: {
                id: i.id,
              },
              data: {
                member: { disconnect: { id: id } },
              },
            });
          }
        }),
      );

      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async createRating(memberId: string, dto: RatingDto) {
    try {
      const rating = await this.prismaService.rating.findFirst({
        where: {
          patientId: memberId,
          doctorId: dto.doctorId,
        },
      });

      if (rating) {
        const data = await this.prismaService.rating.update({
          where: {
            id: rating?.id,
          },
          data: {
            rate: Number(dto.rating),
            updatedBy: memberId,
          },
        });
        return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
      } else {
        const data = await this.prismaService.rating.create({
          data: {
            rate: Number(dto.rating),
            doctorId: dto.doctorId,
            patientId: memberId,
            createdBy: memberId,
          },
        });

        return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getRating(memberId: string, dto: SelectDoctorDto) {
    try {
      const data = await this.prismaService.rating.findFirst({
        where: {
          patientId: memberId,
          doctorId: dto.doctorId,
        },
      });

      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
