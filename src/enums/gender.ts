/* eslint-disable prettier/prettier */
import { Gender } from '@prisma/client';
import { t } from '@utils';
export { Gender } from '@prisma/client';


export const getGenders = () => {
  return Object.values(Gender).map((value) => {
    return {
      name: t(value),
      code: value,
    };
  });
};
