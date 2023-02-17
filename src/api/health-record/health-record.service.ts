/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@services';
import { Pagination, ResponseSuccess } from '@types';
import { cleanup, funcIndexBmi, MESS_CODE, t } from '@utils';
import * as moment from 'moment';
import { FilterHealthRecordDto } from './dto';
import { CreateHealthRecordDto } from './dto/create-health-record.dto';

@Injectable()
export class HealthRecordService {
  constructor(private prismaService: PrismaService) {}

  async findHealthRecordWithId(memberId: string, dto: FilterHealthRecordDto) {
    try {
      let where: Prisma.ConversationWhereInput = {
        isDeleted: false,
      };

      where.AND = { member: { some: { memberId: memberId } } };

      where = cleanup(where);

      const [total, data] = await this.prismaService.$transaction([
        this.prismaService.healthRecord.count({ where }),
        this.prismaService.healthRecord.findMany({
          where,
          select: {
            id: true,
            // type
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
      ]);
    } catch (error) {}
  }

  async findAll(dto: FilterHealthRecordDto, pagination: Pagination) {
    try {
      let where: Prisma.ConversationWhereInput = {
        isDeleted: false,
      };

      const { skip, take } = pagination;

      where = cleanup(where);

      const [total, data] = await this.prismaService.$transaction([
        this.prismaService.healthRecord.count({ where }),
        this.prismaService.healthRecord.findMany({
          where,
          select: {
            id: true,
            // type
          },
          orderBy: {
            createdAt: 'desc',
          },
          skip: !dto?.isAll ? skip : undefined,
          take: !dto?.isAll ? take : undefined,
        }),
      ]);
    } catch (error) {}
  }

  async findOne(id: string) {
    try {
      // const exist = await this.checkFeatureExist({ id });
      // if (!exist) throw new BadRequestException(t(MESS_CODE['FEATURE_NOT_FOUND'], language));

      const data = await this.prismaService.healthRecord.findFirst({
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

  async create(memberId: string, dto: CreateHealthRecordDto) {
    try {
      const { height, weight, cholesterol, systolic, diastolic, glucose, heartRateIndicator } = dto;
      if (!Number(height) && Number(height) <= 0) throw new BadRequestException(t(MESS_CODE['INVALID_HEIGHT']));
      if (!Number(weight) && Number(weight) <= 0) throw new BadRequestException(t(MESS_CODE['INVALID_WEIGHT']));
      if (!Number(cholesterol) && Number(cholesterol) <= 0)
        throw new BadRequestException(t(MESS_CODE['INVALID_CHOLESTEROL']));
      if (!Number(diastolic) && Number(diastolic) <= 0)
        throw new BadRequestException(t(MESS_CODE['INVALID_DIASTOLIC']));
      if (!Number(glucose) && Number(glucose) <= 0) throw new BadRequestException(t(MESS_CODE['INVALID_GLUCOSE']));
      if (!Number(systolic) && Number(systolic) <= 0) throw new BadRequestException(t(MESS_CODE['INVALID_SYSTOLIC']));
      if (!Number(heartRateIndicator) && Number(heartRateIndicator) <= 0)
        throw new BadRequestException(t(MESS_CODE['INVALID_HEARTBEAT']));

      const heathRecord = await this.prismaService.healthRecord.findFirst({
        where: { patientId: memberId },
        select: { id: true },
      });

      const bmiExist = await this.prismaService.bmi.findFirst({
        where: {
          healthRecordId: heathRecord.id,
          createdAt: {
            gte: moment().startOf('D').toISOString(),
            lte: moment().endOf('D').toISOString(),
          },
        },
      });

      const cholesterolExist = await this.prismaService.cholesterol.findFirst({
        where: {
          healthRecordId: heathRecord.id,
          createdAt: {
            gte: moment().startOf('D').toISOString(),
            lte: moment().endOf('D').toISOString(),
          },
        },
      });

      const heartbeatExist = await this.prismaService.heartbeat.findFirst({
        where: {
          healthRecordId: heathRecord.id,
          createdAt: {
            gte: moment().startOf('D').toISOString(),
            lte: moment().endOf('D').toISOString(),
          },
        },
      });

      const glucoseExist = await this.prismaService.glucose.findFirst({
        where: {
          healthRecordId: heathRecord.id,
          createdAt: {
            gte: moment().startOf('D').toISOString(),
            lte: moment().endOf('D').toISOString(),
          },
        },
      });

      const bloodPressureExist = await this.prismaService.bloodPressure.findFirst({
        where: {
          healthRecordId: heathRecord.id,
          createdAt: {
            gte: moment().startOf('D').toISOString(),
            lte: moment().endOf('D').toISOString(),
          },
        },
      });
      const indexBmi: any = funcIndexBmi(Number(height), Number(weight));
      await this.prismaService.$transaction(async (prisma) => {
        if (!bmiExist) {
          await prisma.bmi.create({
            data: {
              healthRecordId: heathRecord.id,
              height,
              weight,
              indexBmi: `${indexBmi.toFixed(5)}`,

              createdBy: memberId,
            },
          });
        } else {
          await prisma.bmi.update({
            where: {
              id: bmiExist.id,
            },
            data: {
              height,
              weight,
              indexBmi: `${indexBmi.toFixed(5)}`,
              updatedBy: memberId,
            },
          });
        }

        if (!cholesterolExist) {
          await prisma.cholesterol.create({
            data: {
              healthRecordId: heathRecord.id,
              cholesterol,
              createdBy: memberId,
            },
          });
        } else {
          await prisma.cholesterol.update({
            where: {
              id: cholesterolExist.id,
            },
            data: {
              updatedBy: memberId,
              cholesterol,
            },
          });
        }

        if (!glucoseExist) {
          await prisma.glucose.create({
            data: {
              healthRecordId: heathRecord.id,
              glucose,
              createdBy: memberId,
            },
          });
        } else {
          await prisma.glucose.update({
            where: {
              id: glucoseExist.id,
            },
            data: {
              updatedBy: memberId,
              glucose,
            },
          });
        }

        if (!heartbeatExist) {
          await prisma.heartbeat.create({
            data: {
              healthRecordId: heathRecord.id,
              heartRateIndicator,
              createdBy: memberId,
            },
          });
        } else {
          await prisma.heartbeat.update({
            where: {
              id: heartbeatExist.id,
            },
            data: {
              updatedBy: memberId,
              heartRateIndicator,
            },
          });
        }

        if (!bloodPressureExist) {
          await prisma.bloodPressure.create({
            data: {
              healthRecordId: heathRecord.id,
              systolic,
              diastolic,
              createdBy: memberId,
            },
          });
        } else {
          await prisma.bloodPressure.update({
            where: {
              id: bloodPressureExist.id,
            },
            data: {
              updatedBy: memberId,
              systolic,
              diastolic,
            },
          });
        }

        return ResponseSuccess({}, MESS_CODE['SUCCESS'], {});
      });
    } catch (err) {
      console.log('er', err.message);
      throw new BadRequestException(err.message);
    }
  }

  async findHealthRecordDay(memberId: string) {
    try {
      // const exist = await this.checkFeatureExist({ id });
      // if (!exist) throw new BadRequestException(t(MESS_CODE['FEATURE_NOT_FOUND'], language));

      const data = {};
      const healthRecord = await this.prismaService.healthRecord.findFirst({
        where: {
          patientId: memberId,
        },
        select: {
          id: true,
        },
      });

      data['healthRecordId'] = healthRecord.id;

      const bmi = await this.prismaService.bmi.findFirst({
        where: {
          healthRecordId: healthRecord.id,
          createdAt: {
            gte: moment().startOf('D').toISOString(),
            lte: moment().endOf('D').toISOString(),
          },
        },
        select: {
          height: true,
          weight: true,
          indexBmi: true,
          createdAt:true
        },
      });

      data['height'] = bmi?.height ?? '';
      data['weight'] = bmi?.weight ?? '';
      data['indexBmi'] = bmi?.indexBmi ?? '';
      data['createdAt'] = bmi?.createdAt ?? '';

      const heartbeat = await this.prismaService.heartbeat.findFirst({
        where: {
          healthRecordId: healthRecord.id,
          createdAt: {
            gte: moment().startOf('D').toISOString(),
            lte: moment().endOf('D').toISOString(),
          },
        },
        select: {
          heartRateIndicator: true,
        },
      });

      data['heartbeat'] = heartbeat?.heartRateIndicator ?? '';

      const bloodPressure = await this.prismaService.bloodPressure.findFirst({
        where: {
          healthRecordId: healthRecord.id,
          createdAt: {
            gte: moment().startOf('D').toISOString(),
            lte: moment().endOf('D').toISOString(),
          },
        },
        select: {
          systolic: true,
          diastolic: true,
        },
      });
      data['systolic'] = bloodPressure?.systolic ?? '';
      data['diastolic'] = bloodPressure?.diastolic ?? '';

      const glucose = await this.prismaService.glucose.findFirst({
        where: {
          healthRecordId: healthRecord.id,
          createdAt: {
            gte: moment().startOf('D').toISOString(),
            lte: moment().endOf('D').toISOString(),
          },
        },
        select: {
          glucose: true,
        },
      });

      data['glucose'] = glucose?.glucose ?? '';

      const cholesterol = await this.prismaService.cholesterol.findFirst({
        where: {
          healthRecordId: healthRecord.id,
          createdAt: {
            gte: moment().startOf('D').toISOString(),
            lte: moment().endOf('D').toISOString(),
          },
        },
        select: {
          cholesterol: true,
        },
      });

      data['cholesterol'] = cholesterol?.cholesterol ?? '';

      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
