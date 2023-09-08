/* eslint-disable prettier/prettier */
import { SocketGateWayService } from '@api/socket-io/socket-io.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, Status, TypeNotification } from '@prisma/client';
import { PrismaService } from '@services';
import { Pagination, ResponseSuccess } from '@types';
import {
  MESS_CODE,
  cleanup,
  funcIndexBmi,
  recordBloodPressure,
  recordCholesterol,
  recordGlucose,
  recordHeartBeat,
  recordIndexBmi,
  t,
} from '@utils';
import axios, { Axios } from 'axios';
import * as moment from 'moment';
import { FilterHealthRecordDto, Position, ResultSearch } from './dto';
import { CreateHealthRecordCareDto, CreateHealthRecordDto } from './dto/create-health-record.dto';

@Injectable()
export class HealthRecordService {
  private client: Axios;

  constructor(private prismaService: PrismaService, private socketsService: SocketGateWayService) {
    this.client = axios.create({
      baseURL: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
    });
  }

  async findHealthRecordWithId(memberId: string, dto: FilterHealthRecordDto, pagination: Pagination) {
    try {
      const { skip, take } = pagination;
      const healthRecord = await this.prismaService.healthRecord.findFirst({
        where: {
          patientId: memberId,
        },
        select: {
          id: true,
        },
      });

      const [total, data] = await this.prismaService.$transaction([
        this.prismaService.bloodPressure.count({ where: { healthRecordId: healthRecord.id } }),
        this.prismaService.bloodPressure.findMany({
          where: { healthRecordId: healthRecord.id },
          select: {
            id: true,
            createdAt: true,
            healthRecordId: true,
            systolic: true,
            diastolic: true,
            // type
          },
          orderBy: {
            createdAt: 'desc',
          },
          skip: !dto?.isAll ? skip : undefined,
          take: !dto?.isAll ? take : undefined,
        }),
      ]);

      await Promise.all(
        data.map(async (i) => {
          const bmi = await this.prismaService.bmi.findFirst({
            where: {
              healthRecordId: healthRecord.id,
              createdAt: {
                gte: i?.createdAt,
                lte: i?.createdAt,
              },
            },
            select: {
              height: true,
              weight: true,
              indexBmi: true,
              createdAt: true,
            },
          });

          i['height'] = bmi?.height ?? '';
          i['weight'] = bmi?.weight ?? '';
          i['indexBmi'] = bmi?.indexBmi ?? '';

          const heartbeat = await this.prismaService.heartbeat.findFirst({
            where: {
              healthRecordId: healthRecord.id,
              createdAt: {
                gte: i?.createdAt,
                lte: i?.createdAt,
              },
            },
            select: {
              heartRateIndicator: true,
            },
          });

          i['heartRateIndicator'] = heartbeat?.heartRateIndicator ?? '';

          const glucose = await this.prismaService.glucose.findFirst({
            where: {
              healthRecordId: healthRecord.id,
              createdAt: {
                gte: i?.createdAt,
                lte: i?.createdAt,
              },
            },
            select: {
              glucose: true,
            },
          });

          i['glucose'] = glucose?.glucose ?? '';

          const cholesterol = await this.prismaService.cholesterol.findFirst({
            where: {
              healthRecordId: healthRecord.id,
              createdAt: {
                gte: i?.createdAt,
                lte: i?.createdAt,
              },
            },
            select: {
              cholesterol: true,
            },
          });

          i['cholesterol'] = cholesterol?.cholesterol ?? '';
        }),
      );

      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {
        pagination: !dto?.isAll ? pagination : undefined,
        total,
      });
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

      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {
        pagination: !dto?.isAll ? pagination : undefined,
        total,
      });
    } catch (error) {}
  }

  async findOne(memberId: string) {
    try {
      const data = await this.prismaService.healthRecord.findFirst({
        where: {
          patientId: memberId,

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

      const patient = await this.prismaService.patient.findFirst({
        where: { id: memberId },
        select: {
          id: true,
          fullName: true,
          doctorId: true,
          healthRecord: {
            select: {
              id: true,
            },
          },
        },
      });

      const bmiExist = await this.prismaService.bmi.findFirst({
        where: {
          healthRecordId: patient.healthRecord.id,
          createdAt: {
            gte: moment().startOf('D').toISOString(),
            lte: moment().endOf('D').toISOString(),
          },
        },
      });

      const cholesterolExist = await this.prismaService.cholesterol.findFirst({
        where: {
          healthRecordId: patient.healthRecord.id,
          createdAt: {
            gte: moment().startOf('D').toISOString(),
            lte: moment().endOf('D').toISOString(),
          },
        },
      });

      const heartbeatExist = await this.prismaService.heartbeat.findFirst({
        where: {
          healthRecordId: patient.healthRecord.id,
          createdAt: {
            gte: moment().startOf('D').toISOString(),
            lte: moment().endOf('D').toISOString(),
          },
        },
      });

      const glucoseExist = await this.prismaService.glucose.findFirst({
        where: {
          healthRecordId: patient.healthRecord.id,
          createdAt: {
            gte: moment().startOf('D').toISOString(),
            lte: moment().endOf('D').toISOString(),
          },
        },
      });

      const bloodPressureExist = await this.prismaService.bloodPressure.findFirst({
        where: {
          healthRecordId: patient.healthRecord.id,
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
              healthRecordId: patient.healthRecord.id,
              height,
              weight,
              indexBmi: `${indexBmi.toFixed(2)}`,

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
              indexBmi: `${indexBmi.toFixed(2)}`,
              updatedBy: memberId,
            },
          });
        }

        if (!cholesterolExist) {
          await prisma.cholesterol.create({
            data: {
              healthRecordId: patient.healthRecord.id,
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
              healthRecordId: patient.healthRecord.id,
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
              healthRecordId: patient.healthRecord.id,
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
              healthRecordId: patient.healthRecord.id,
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
      });

      const data = {};
      let checkBmi = false;
      let checkGlucose = false;
      let checkCholesterol = false;
      let checkBloodPressure = false;
      let checkHeartbeat = false;
      let num = 0;

      const bmi = await this.prismaService.bmi.findFirst({
        where: {
          healthRecordId: patient.healthRecord.id,
          createdAt: {
            gte: moment().startOf('D').toISOString(),
            lte: moment().endOf('D').toISOString(),
          },
        },
        select: {
          createdAt: true,
          indexBmi: true,
        },
      });
      const rcBmi = recordIndexBmi(indexBmi);

      data['healthRecordId'] = patient.healthRecord.id;
      data['createdAt'] = bmi.createdAt;
      data['indexBmi'] = bmi.indexBmi;
      data['recordBmi'] = rcBmi;
      if (rcBmi.status === 'LIGHT' || rcBmi.status === 'FAT') {
        checkBmi = true;
        num += 1;
      }

      const cholesterolIdx = await this.prismaService.cholesterol.findFirst({
        where: {
          healthRecordId: patient.healthRecord.id,
          createdAt: {
            gte: moment().startOf('D').toISOString(),
            lte: moment().endOf('D').toISOString(),
          },
        },
        select: {
          cholesterol: true,
        },
      });
      const rcCholesterol = recordCholesterol(cholesterol);
      data['cholesterol'] = cholesterolIdx.cholesterol;
      data['recordCholesterol'] = rcCholesterol;

      if (rcCholesterol.status === 'CRITIAL') {
        checkCholesterol = true;
        num += 1;
      }

      const heartbeat = await this.prismaService.heartbeat.findFirst({
        where: {
          healthRecordId: patient.healthRecord.id,
          createdAt: {
            gte: moment().startOf('D').toISOString(),
            lte: moment().endOf('D').toISOString(),
          },
        },
        select: {
          heartRateIndicator: true,
        },
      });
      const rcHeartBeat = recordHeartBeat(heartRateIndicator);
      data['heartRateIndicator'] = heartbeat.heartRateIndicator;
      data['recordHeartBeat'] = rcHeartBeat;
      if (rcHeartBeat.status === 'CRITIAL') {
        checkHeartbeat = true;
        num += 1;
      }

      const glucoseIdx = await this.prismaService.glucose.findFirst({
        where: {
          healthRecordId: patient.healthRecord.id,
          createdAt: {
            gte: moment().startOf('D').toISOString(),
            lte: moment().endOf('D').toISOString(),
          },
        },
        select: {
          glucose: true,
        },
      });
      const rcGlucose = recordGlucose(glucose);
      data['glucose'] = glucoseIdx.glucose;
      data['recordGlucose'] = rcGlucose;
      if (rcGlucose.status === 'CRITIAL') {
        checkGlucose = true;
        num += 1;
      }

      const bloodPressure = await this.prismaService.bloodPressure.findFirst({
        where: {
          healthRecordId: patient.healthRecord.id,
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

      const rcBloodPressure = recordBloodPressure(systolic, diastolic);
      data['systolic'] = bloodPressure.systolic;
      data['diastolic'] = bloodPressure.diastolic;
      data['recordBloodPressure'] = rcBloodPressure;
      if (rcBloodPressure.status === 'LOW' || rcBloodPressure.status === 'HIGH') {
        checkBloodPressure = true;
        num += 1;
      }

      let str = '';
      if (checkBmi) str += 'BMI, ';
      if (checkBloodPressure) str += 'huyết áp, ';
      if (checkCholesterol) str += 'cholesterol, ';
      if (checkGlucose) str += 'glucose, ';
      if (checkHeartbeat) str += 'nhịp tim, ';

      const dateTime = moment(data['createdAt']).format('DD/MM/YYY');

      let healthRecordStatus: Status = Status.SAFE;
      if (num >= 2 && num < 4) {
        healthRecordStatus = Status.DANGER;
      } else if (num >= 4) {
        healthRecordStatus = Status.CRITIAL;
      }

      const healthRecord = await this.prismaService.healthRecord.update({
        where: {
          id: patient.healthRecord.id,
        },
        data: {
          status: healthRecordStatus,
        },
      });

      data['status'] = healthRecord.status;
      const notification = await this.prismaService.notification.create({
        data: {
          title: 'Cảnh báo',
          content: `Chỉ số ${str} trong báo cáo sức khỏe ngày ${dateTime} của bệnh nhân ${patient.fullName} trong tình trạng cảnh báo`,
          typeNotification: TypeNotification.WARNING,
          isRead: false,
          userId: patient.doctorId,
        },
      });

      await this.socketsService.newNotification({
        notificationId: notification.id,
        data: notification,
      });

      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async emergency(memberId: string, dto: Position) {
    try {
      // const response = await this.client.post(
      //   'https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBRm7R6WMe0kidaFKn7LB4V_W3lvX-Ft4w',
      // );
      // const lat = response.data.location.lat;
      // const lng = response.data.location.lng;

      const patient = await this.prismaService.patient.findFirst({
        where: {
          id: memberId,
        },
        select: {
          fullName: true,
          doctorId: true,
        },
      });

      const notification = await this.prismaService.notification.create({
        data: {
          title: 'Cấp cứu',
          content: `Bệnh nhân ${patient.fullName} đã gửi yêu cầu cấp cứu`,
          typeNotification: TypeNotification.EMERGENCY,
          url: `https://www.google.com/maps/search/?api=1&query=${dto.lat},${dto.lng}`,
          isRead: false,
          userId: patient.doctorId,
        },
      });

      await this.socketsService.newNotification({
        notificationId: notification.id,
        data: notification,
      });
      return ResponseSuccess({}, MESS_CODE['SUCCESS'], {});
    } catch (error) {}
  }

  async getHospitals(dto: Position) {
    const radius = 5000;
    const type = 'hospital';
    const apiKey = 'AIzaSyBRm7R6WMe0kidaFKn7LB4V_W3lvX-Ft4w';
    const location = `${dto?.lat},${dto?.lng}`;

    const response = await this.client.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&key=${apiKey}`,
    );

    const hospitals = response.data.results;
    return ResponseSuccess(hospitals, MESS_CODE['SUCCESS'], {});
  }

  async getPosition(dto: ResultSearch) {
    const apiKey = 'AIzaSyBRm7R6WMe0kidaFKn7LB4V_W3lvX-Ft4w';

    const response = await this.client.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${dto.resultSearch}&key=${apiKey}`,
    );

    const position = response.data.results;
    return ResponseSuccess(position, MESS_CODE['SUCCESS'], {});
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
          status: true,
          id: true,
        },
      });
      data['status'] = healthRecord.status;
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
          createdAt: true,
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

      data['heartRateIndicator'] = heartbeat?.heartRateIndicator ?? '';

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

  async createCare(memberId: string, dto: CreateHealthRecordCareDto) {
    try {
      const { height, weight, cholesterol, systolic, diastolic, glucose, heartRateIndicator, dateRecord } = dto;
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

      const patient = await this.prismaService.patient.findFirst({
        where: { id: memberId },
        select: {
          id: true,
          fullName: true,
          doctorId: true,
          healthRecord: {
            select: {
              id: true,
            },
          },
        },
      });

      const indexBmi: any = funcIndexBmi(Number(height), Number(weight));
      const data = await this.prismaService.$transaction(async (prisma) => {
        await prisma.bmi.create({
          data: {
            healthRecordId: patient.healthRecord.id,
            height,
            weight,
            indexBmi: `${indexBmi.toFixed(2)}`,
            createdAt: dateRecord,
            createdBy: memberId,
          },
        });

        await prisma.cholesterol.create({
          data: {
            healthRecordId: patient.healthRecord.id,
            cholesterol,
            createdAt: dateRecord,
            createdBy: memberId,
          },
        });

        await prisma.glucose.create({
          data: {
            healthRecordId: patient.healthRecord.id,
            glucose,
            createdAt: dateRecord,
            createdBy: memberId,
          },
        });

        await prisma.heartbeat.create({
          data: {
            healthRecordId: patient.healthRecord.id,
            heartRateIndicator,
            createdAt: dateRecord,
            createdBy: memberId,
          },
        });

        await prisma.bloodPressure.create({
          data: {
            healthRecordId: patient.healthRecord.id,
            systolic,
            diastolic,
            createdAt: dateRecord,
            createdBy: memberId,
          },
        });
      });

      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
