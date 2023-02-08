
import * as moment from 'moment';
import { ForbiddenException } from '@nestjs/common';
import * as https from 'https';
import * as fs from 'fs';



export const numberToColumn = (n) => {
  const res = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[n % 26];
  return n >= 26 ? numberToColumn(Math.floor(n / 26) - 1) + res : res;
};

export const getIdPageWithFbUrl = (url: string) => {
  if (url) {
    const str = url?.split('-')[url?.split('-')?.length - 1];
    const newStr = str?.replace('/', '');
    return newStr;
  }
  return '';
};
