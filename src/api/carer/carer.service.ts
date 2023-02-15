/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@services';
import { Pagination, ResponseSuccess } from '@types';
import { cleanup, convertFilterStringToArray, MESS_CODE, t } from '@utils';
import { CreateCarerlDto, FilterCarerDto, UpdateCarerDto } from './dto';

@Injectable()
export class CarerService {
  constructor(private prismaService: PrismaService) {}

  async checkCarerExist(id) {
    const carer = await this.prismaService.carer.findFirst({
      where: {
        id: id,
        isDeleted: false,
      },
    });
    return carer;
  }

  async findAll(dto: FilterCarerDto, pagination: Pagination) {
    try {
      const { skip, take } = pagination;
      let where: Prisma.CarerWhereInput = {
        isDeleted: false,
      };

      if (dto?.search) {
        where.OR = [
          { id: { contains: dto?.search.trim() } },
          { phone: { contains: dto?.search.trim() } },
          { fullName: { contains: dto?.search.trim() } },
        ];
      }
      const ids = convertFilterStringToArray(dto.ids);
      if (ids && ids.length > 0) {
        where.OR = ids.map((id) => ({
          id: id,
        }));
      }

      where = cleanup(where);

      const [total, data] = await this.prismaService.$transaction([
        this.prismaService.carer.count({ where }),
        this.prismaService.carer.findMany({
          where,
          select: {
            id: true,
            phone: true,
            fullName: true,
            patient: true,
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
      const exist = await this.checkCarerExist({ id });
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

  async getCarer(memberId: string, pagination: Pagination) {
    try {
      const { skip, take } = pagination;

      const [total, data] = await this.prismaService.$transaction([
        this.prismaService.carer.count({ where: { patient: { some: { id: memberId } } } }),
        this.prismaService.carer.findMany({
          where: { patient: { some: { id: memberId } } },
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

  async create(memberId: string, dto: CreateCarerlDto) {
    try {
      const { fullName, phone } = dto;

      const data = await this.prismaService.carer.create({
        data: {
          fullName,
          phone,
          patient: { connect: { id: memberId } },
          createdBy: memberId,
        },
      });
      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
    } catch (error) {}
  }

  async update(memberId: string, id: string, dto: UpdateCarerDto) {
    try {
      const { fullName, phone } = dto;
      // if (Number(cholesterol) < 0) {
      //   throw new BadRequestException(t(MESS_CODE['INVALID_HEIGHT']));
      // }
      const exist = await this.checkCarerExist({ id });
      if (!exist) throw new BadRequestException(t(MESS_CODE['BMI_NOT_FOUND'], {}));

      const data = await this.prismaService.carer.update({
        where: { id },
        data: {
          fullName,
          phone,
          updatedBy: memberId,
        },
      });

      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
    } catch (error) {}
  }

  async delete(memberId: string, id: string) {
    try {
      const exist = await this.checkCarerExist({ id });
      if (!exist) throw new BadRequestException(t(MESS_CODE['BMI_NOT_FOUND'], {}));
      const data = await this.prismaService.carer.update({
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
