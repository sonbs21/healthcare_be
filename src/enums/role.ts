/* eslint-disable prettier/prettier */
import { Role } from '@prisma/client';
import { t } from '@utils';

export { Role } from '@prisma/client';


export const getDiscountType = () => {
  return Object.values(Role).map((value) => {
    return {
      name: t(value),
      code: value,
    };
  });
};
