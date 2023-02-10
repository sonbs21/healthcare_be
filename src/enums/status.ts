/* eslint-disable prettier/prettier */
import { Status } from '@prisma/client';
import { t } from '@utils';

export const getDiscountType = () => {
  return Object.values(Status).map((value) => {
    return {
      name: t(value),
      code: value,
    };
  });
};
