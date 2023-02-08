import { AuthService } from '@auth/auth.service';
import { applyDecorators, CanActivate, ExecutionContext, Injectable, SetMetadata, UseGuards } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
// import { validateRoleAllow } from '@utils';

const ROLE_STRATEGY = Symbol.for('ROLE_STRATEGY');

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector, private readonly authService: AuthService) {}
//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const { path, role, specialRole } = this.reflector.get(ROLE_STRATEGY, context.getHandler());

//     const user = request.user;
//     const language = request.headers['language'];

//     // const listPermissions = await this.authService.getFeaturePermissions(user?.id, false);
//     return validateRoleAllow(listPermissions, path, { role: role, specialRole: specialRole }, language);

//     // const itemPermission = listDataPermission.filter((e) => strategy.path.includes(e.path));

//     // if (!itemPermission?.length) throw new ForbiddenException(t('FORBIDDEN', language));
//     // const per = await itemPermission.map((i) => {
//     //   if (i.all) return true;
//     //   if (!i.view) return false;
//     //   return i[strategy.role.toLowerCase()];
//     // });
//     // if ([...new Set(per)].length === 1) {
//     //   if ([...new Set(per)][0]) {
//     //     return true;
//     //   } else {
//     //     throw new ForbiddenException(t('FORBIDDEN', language));
//     //   }
//     // }
//     // return true;

//     // if (itemPermission.all) return true;
//     // if (!itemPermission.view) throw new ForbiddenException(t('FORBIDDEN', language));

//     // switch (strategy.role) {
//     //   case VIEW_PERMISSION:
//     //     if (!itemPermission.view) throw new ForbiddenException(t('FORBIDDEN', language));
//     //     return true;
//     //   case CREATE_PERMISSION:
//     //     if (!itemPermission.create) throw new ForbiddenException(t('FORBIDDEN', language));
//     //     return true;
//     //   case UPDATE_PERMISSION:
//     //     if (!itemPermission.update) throw new ForbiddenException(t('FORBIDDEN', language));
//     //     return true;
//     //   case DELETE_PERMISSION:
//     //     if (!itemPermission.delete) throw new ForbiddenException(t('FORBIDDEN', language));
//     //     return true;
//     //   case UPLOAD_PERMISSION:
//     //     if (!itemPermission.upload) throw new ForbiddenException(t('FORBIDDEN', language));
//     //     return true;
//     //   case DOWNLOAD_PERMISSION:
//     //     if (!itemPermission.download) throw new ForbiddenException(t('FORBIDDEN', language));
//     //     return true;
//     //   default:
//     //     throw new ForbiddenException(t('FORBIDDEN', language));
//     // }
//   }
// }

// export const RoleAllow = (path: string[], role: string, specialRole?: string) => {
//   return applyDecorators(SetMetadata(ROLE_STRATEGY, { path, role, specialRole }), UseGuards(RolesGuard));
// };
