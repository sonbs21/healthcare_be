/* eslint-disable prettier/prettier */
import { MESS_CODE } from '@/utils';
import { BadRequestException, Injectable } from '@nestjs/common';
import { BcryptService, PrismaService } from '@services';
import { ResponseSuccess } from '../../types/response';
@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async checkUserExist(id: string) {
    return await this.prismaService.user.findFirst({
      where: {
        id,
        isDeleted: false,
      },
    });
  }

  async checkPhoneExist(phone: string) {
    return await this.prismaService.user.findFirst({
      where: {
        phone,
        isDeleted: false,
      },
    });
  }

  async getMe(userId: string) {
    try {
      const data = await this.prismaService.user.findFirst({
        where: {
          id: userId,
          isDeleted: false,
        },
        select: {
          id: true,
          phone: true,
          memberId: true,
          doctor: true,
          patient: true,
        },
      });
      return ResponseSuccess(data, MESS_CODE['SUCCESS'], {});
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  // async createUser(userId: string, dto: CreateUsersDto) {
  //   try {
  //     const { staffId, decentralizations, ...createUser } = dto;
  //     const staffExist = await this.prismaService.staff.findFirst({
  //       where: {
  //         id: staffId,
  //         isDeleted: false,
  //       },
  //     });
  //     if (!staffExist) throw new BadRequestException(t(MESS_CODE['STAFF_NOT_FOUND'], language));

  //     if (!dto?.username.match(USERNAME_REGEX))
  //       throw new BadRequestException(t(MESS_CODE['INVALID_USERNAME'], language));

  //     const usernameExist = await this.checkUsernameExist(createUser.username);
  //     if (usernameExist) throw new BadRequestException(t(MESS_CODE['USERNAME_EXIST'], language));

  //     const newHashPassword = await this.bcryptService.hash(process.env.DEFAULT_PASSWORD);

  //     const data = await this.prismaService.$transaction(async (prisma) => {
  //       const data = await this.prismaService.user.create({
  //         data: {
  //           ...createUser,
  //           password: newHashPassword,
  //           staff: { connect: { id: staffId } },
  //           createdBy: userId,
  //         },
  //       });

  //       await Promise.all(
  //         decentralizations.map(async (item: CreateUserDecentralization) => {
  //           if (item?.departmentIds?.length) {
  //             for (const id of item.departmentIds) {
  //               const departmentExist = await prisma.department.findFirst({ where: { id: id } });
  //               if (!departmentExist) throw new BadRequestException(t(MESS_CODE['DEPARTMENT_NOT_FOUND'], language));
  //             }
  //           }

  //           const decentralizationExist = await prisma.decentralization.findFirst({
  //             where: {
  //               userId: data.id,
  //               roleId: item.roleId,
  //             },
  //           });

  //           if (!decentralizationExist) {
  //             // Create decentralization
  //             await prisma.decentralization.create({
  //               data: {
  //                 role: { connect: { id: item.roleId } },
  //                 departments: item?.departmentIds?.length
  //                   ? { connect: item.departmentIds.map((item: string) => ({ id: item })) }
  //                   : undefined,
  //                 user: { connect: { id: data.id } },
  //                 createdBy: userId,
  //               },
  //             });
  //           } else {
  //             // Update decentralization
  //             await prisma.decentralization.update({
  //               where: { id: decentralizationExist?.id },
  //               data: {
  //                 role: { connect: { id: item.roleId } },
  //                 departments: item?.departmentIds?.length
  //                   ? { connect: item.departmentIds.map((item: string) => ({ id: item })) }
  //                   : undefined,
  //                 user: { connect: { id: data.id } },
  //                 updatedBy: userId,
  //               },
  //             });
  //           }
  //         }),
  //       );
  //       return await this.prismaService.user.findFirst({
  //         where: { id: data.id },
  //         select: usersSelect,
  //       });
  //     });
  //     return ResponseSuccess(data, MESS_CODE['SUCCESS'], { language });
  //   } catch (err) {
  //     throw new BadRequestException(err.message);
  //   }
  // }

  // async updateUser(userId: string, id: string, dto: UpdateUsersDto) {
  //   try {
  //     const { staffId, decentralizations, ...updateUser } = dto;
  //     const userIdExist = await this.prismaService.user.findFirst({
  //       where: {
  //         id,
  //         isDeleted: false,
  //       },
  //     });
  //     if (!userIdExist) throw new BadRequestException(t(MESS_CODE['USER_NOT_FOUND'], language));
  //     if (!dto?.username.match(USERNAME_REGEX))
  //       throw new BadRequestException(t(MESS_CODE['INVALID_USERNAME'], language));
  //     const usernameExist = await this.checkUsernameExist(dto.username);
  //     if (usernameExist && usernameExist.id !== id) {
  //       throw new BadRequestException(t(MESS_CODE['USERNAME_EXIST'], language));
  //     }
  //     const data = await this.prismaService.$transaction(async (prisma) => {
  //       const data = await this.prismaService.user.update({
  //         where: { id },
  //         data: {
  //           ...updateUser,
  //           staff: { connect: { id: staffId } },
  //           decentralizations: { set: [] },
  //           updatedBy: userId,
  //         },
  //       });
  //       await Promise.all(
  //         decentralizations.map(async (item: CreateUserDecentralization) => {
  //           for (const id of item.departmentIds) {
  //             const departmentExist = await prisma.department.findFirst({ where: { id: id } });
  //             if (!departmentExist) throw new BadRequestException(t(MESS_CODE['DEPARTMENT_NOT_FOUND'], language));
  //           }
  //           const decentralizationExist = await prisma.decentralization.findFirst({
  //             where: {
  //               userId: data.id,
  //               roleId: item.roleId,
  //             },
  //           });
  //           if (!decentralizationExist) {
  //             // Create decentralization
  //             await prisma.decentralization.create({
  //               data: {
  //                 role: { connect: { id: item.roleId } },
  //                 departments: { connect: item.departmentIds.map((item: string) => ({ id: item })) },
  //                 user: { connect: { id: data.id } },
  //                 createdBy: userId,
  //               },
  //             });
  //           } else {
  //             // Update decentralization
  //             await prisma.decentralization.update({
  //               where: { id: decentralizationExist?.id },
  //               data: {
  //                 role: { connect: { id: item.roleId } },
  //                 departments: { connect: item.departmentIds.map((item: string) => ({ id: item })) },
  //                 user: { connect: { id: data.id } },
  //                 updatedBy: userId,
  //               },
  //             });
  //           }
  //         }),
  //       );

  //       // Remove all decentralization userId === null
  //       await prisma.decentralization.findMany({ where: { userId: null } });

  //       return await this.prismaService.user.findFirst({
  //         where: { id: data.id },
  //         select: usersSelect,
  //       });
  //     });
  //     return ResponseSuccess(data, MESS_CODE['SUCCESS'], { language });
  //   } catch (err) {
  //     throw new BadRequestException(err.message);
  //   }
  // }

  // async updatePassword(userId: string, dto: UpdatePasswordDto) {
  //   try {
  //     if (!dto?.newPassword.match(PASSWORD_REGEX))
  //       throw new BadRequestException(t(MESS_CODE['PASSWORD_NOT_INVALID'], language));

  //     if (dto.newPassword !== dto.confirmNewPassword)
  //       throw new BadRequestException(t(MESS_CODE['NEW_PASSWORD_NOT_MATCH'], language));

  //     const newHashPassword = await this.bcryptService.hash(dto.newPassword);
  //     await this.prismaService.user.update({
  //       where: { id: dto.userId },
  //       data: {
  //         password: newHashPassword,
  //         updatedBy: userId,
  //       },
  //     });

  //     return ResponseSuccess({}, MESS_CODE['SUCCESS'], { language });
  //   } catch (err) {
  //     throw new BadRequestException(err.message);
  //   }
  // }

  // async changePassword(userId: string, dto: ChangePasswordDto) {
  //   try {
  //     if (!dto.newPassword.match(PASSWORD_REGEX))
  //       throw new BadRequestException(t(MESS_CODE['PASSWORD_NOT_INVALID'], language));

  //     if (dto.newPassword !== dto.confirmNewPassword)
  //       throw new BadRequestException(t(MESS_CODE['NEW_PASSWORD_NOT_MATCH'], language));

  //     const userIdExist = await this.prismaService.user.findFirst({
  //       where: {
  //         id: userId,
  //         isDeleted: false,
  //       },
  //     });
  //     if (!userIdExist) throw new BadRequestException(t(MESS_CODE['USER_NOT_FOUND'], language));

  //     const hashPassword = await this.prismaService.user.findUnique({
  //       where: { id: userId },
  //       select: { password: true },
  //     });
  //     if (!hashPassword) throw new BadRequestException(t(MESS_CODE['USER_NOT_FOUND'], language));

  //     const isPasswordMatch = await this.bcryptService.compare(dto.oldPassword, hashPassword.password);
  //     if (!isPasswordMatch) throw new BadRequestException(t(MESS_CODE['OLD_PASSWORD_NOT_MATCH'], language));

  //     const newHashPassword = await this.bcryptService.hash(dto.newPassword);
  //     await this.prismaService.user.update({
  //       where: { id: userId },
  //       data: { password: newHashPassword },
  //     });
  //     return ResponseSuccess({}, MESS_CODE['SUCCESS'], { language });
  //   } catch (err) {
  //     throw new BadRequestException(err.message);
  //   }
  // }

  // async deleteUser(userId: string, id: string) {
  //   try {
  //     const userIdExist = await this.checkUserExist(id);
  //     if (!userIdExist) throw new BadRequestException(t(MESS_CODE['USER_NOT_FOUND'], language));

  //     const data = await this.prismaService.user.update({
  //       where: { id },
  //       data: {
  //         isDeleted: true,
  //         deletedBy: userId,
  //       },
  //     });
  //     return ResponseSuccess(data, MESS_CODE['SUCCESS'], { language });
  //   } catch (err) {
  //     throw new BadRequestException(err.message);
  //   }
  // }
}
