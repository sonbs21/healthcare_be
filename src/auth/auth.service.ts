import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { BcryptService, PrismaService } from '@services';
import * as _ from 'lodash';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private bcryptService: BcryptService,
    private configService: ConfigService,
  ) {}

  async validateUser(phone: string, password: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        phone,
        isDeleted: false,
      },
    });
    if (!user) return null;

    const isPasswordMatch = await this.bcryptService.compare(password, user.password);

    if (isPasswordMatch) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async getUser(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) return null;
    const { ...result } = user;
    return result;
  }

  // async getDepartmentId(id: string) {
  //   const departmentId = await this.prismaService.user.findUnique({
  //     where: { id },
  //     select: { staff: { select: { departmentId: true } } },
  //   });
  //   return departmentId.staff.departmentId;
  // }

  // async getFeaturePermissions(userId: string, isTree?: boolean) {
  //   const userDecentralization: any = await this.prismaService.user.findFirst({
  //     where: {
  //       id: userId,
  //       isDeleted: false,
  //     },
  //     select: userDecentralizationSelect,
  //   });
  //   const tmp = [];
  //   const parentIds = [];
  //   if (userDecentralization.decentralizations?.length) {
  //     await Promise.all(
  //       userDecentralization.decentralizations.map(async (item) => {
  //         const featurePermissions = item.role.featurePermissions;
  //         const specialPermissions = item.role?.specialPermissions;

  //         if (featurePermissions?.length) {
  //           await Promise.all(
  //             featurePermissions.map(async (i) => {
  //               const z = specialPermissions.find((item) => item.applicationId === i.feature?.applicationId);

  //               const checkExistTmp = tmp.findIndex((e) => e.id === i.featureId);

  //               if (checkExistTmp > -1) {
  //                 const concatTmp = [...tmp[checkExistTmp].specialPermissions, ...(specialPermissions || [])];
  //                 const isValid = concatTmp.reduce((acc, current) => {
  //                   const x = acc.find((item) => item.id === current.id);
  //                   if (!x) return acc.concat([current]);
  //                   else return acc;
  //                 }, []);

  //                 tmp[checkExistTmp] = {
  //                   id: i.featureId,
  //                   all: !i.all ? tmp[checkExistTmp].all : i.all,
  //                   view: !i.view ? tmp[checkExistTmp].view : i.view,
  //                   create: !i.create ? tmp[checkExistTmp].create : i.create,
  //                   update: !i.update ? tmp[checkExistTmp].update : i.update,
  //                   delete: !i.delete ? tmp[checkExistTmp].delete : i.delete,
  //                   upload: !i.upload ? tmp[checkExistTmp].upload : i.upload,
  //                   download: !i.download ? tmp[checkExistTmp].download : i.download,
  //                   specialPermissions: z ? isValid : [],
  //                   ...i.feature,
  //                 };
  //               } else {
  //                 const feature = { ...i.feature };
  //                 delete i.feature;

  //                 if (i[VIEW_PERMISSION.toLowerCase()]) {
  //                   if (feature.parentId) parentIds.push(feature.parentId);

  //                   tmp.push({
  //                     id: i.featureId,
  //                     ...i,
  //                     ...feature,
  //                     featureId: undefined,
  //                     specialPermissions: z ? specialPermissions : [],
  //                   });
  //                 }
  //               }
  //             }),
  //           );
  //         }
  //       }),
  //     );

  //     if (isTree) {
  //       await Promise.all(
  //         [...new Set(parentIds)].map(async (i) => {
  //           const featureParent = await this.prismaService.feature.findFirst({
  //             where: {
  //               id: i,
  //               isDeleted: false,
  //             },
  //             select: featuresWithoutApplicationSelect,
  //           });
  //           if (featureParent)
  //             tmp.push({
  //               ...featureParent,
  //               specialPermissions: [],
  //             });
  //         }),
  //       );
  //     }
  //   }
  //   return isTree
  //     ? convertFromListToTree(_.orderBy(tmp, ['createdAt'], ['asc']), 'parentId')
  //     : _.orderBy(tmp, ['createdAt'], ['asc']);
  // }

  async updateTokenUser(id: string, token: string) {
    const hashToken = await this.bcryptService.hash(token);
    await this.prismaService.user.update({
      where: { id },
      data: { token: hashToken },
    });
  }

  async login(userOrId: User | string) {
    const id = typeof userOrId === 'string' ? userOrId : userOrId.id;

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        {
          id,
        },
        {
          secret: this.configService.get('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get('JWT_ACCESS_DURATION'),
        },
      ),
      this.jwtService.signAsync(
        {
          id,
        },
        {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get('JWT_REFRESH_DURATION'),
        },
      ),
    ]);

    await this.updateTokenUser(id, refresh_token);
    return {
      access_token,
      refresh_token,
    };
  }

  async logout(userOrId: User | string) {
    const id = typeof userOrId === 'string' ? userOrId : userOrId.id;
    await this.updateTokenUser(id, null);
  }

  async refresh(userOrId: User | string, _token: string) {
    const id = typeof userOrId === 'string' ? userOrId : userOrId.id;
    // let oldToken = '';

    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) throw new UnauthorizedException();
    // oldToken = user.token;

    // const isTokenMatch = await this.bcryptService.compare(token, oldToken);
    // if (!isTokenMatch) throw new UnauthorizedException();

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        { id },
        {
          secret: this.configService.get('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get('JWT_ACCESS_DURATION'),
        },
      ),
      this.jwtService.signAsync(
        { id },
        {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get('JWT_REFRESH_DURATION'),
        },
      ),
    ]);

    await this.updateTokenUser(id, refresh_token);
    return {
      access_token,
      refresh_token,
    };
  }
}
