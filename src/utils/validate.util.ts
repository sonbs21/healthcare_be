import {
  Gender,
} from '@prisma/client';
import * as moment from 'moment';
import { t } from './message';

export const validateGender = (value: string) => {
  // Check gender'
  let tmp = '';
  switch (value) {
    case t(Gender.FEMALE):
      tmp = Gender.FEMALE;
      break;
    case t(Gender.MALE):
      tmp = Gender.MALE;
      break;
    
      break;
    default:
      break;
  }
  return tmp;
};
