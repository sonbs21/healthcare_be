/* eslint-disable prettier/prettier */

import { Status } from '@prisma/client';

export const numberToColumn = (n) => {
  const res = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[n % 26];
  return n >= 26 ? numberToColumn(Math.floor(n / 26) - 1) + res : res;
};

export const funcIndexBmi = (height, weight) => {
  const tmp = Number(height) / 100;
  const indexBmi = Number(weight) / (tmp * tmp);

  return indexBmi;
};

export const getIdPageWithFbUrl = (url: string) => {
  if (url) {
    const str = url?.split('-')[url?.split('-')?.length - 1];
    const newStr = str?.replace('/', '');
    return newStr;
  }
  return '';
};

export const recordHeartBeat = (index) => {
  if (50 <= Number(index) && Number(index) < 66) {
    return {
      status: Status.SAFE,
      message: 'Nhịp tim bạn trong trạng thái an toàn. Hãy chăm sóc và bảo vệ sức khỏe để có một nhịp tim tốt',
    };
  }

  if (66 <= Number(index) && Number(index) < 72) {
    return {
      status: Status.DANGER,
      message: 'Nhịp tim bạn trong trạng thái cảnh báo. Hãy chú ý sức khỏe của mình tốt hơn',
    };
  }
  if (72 <= Number(index) || Number(index) < 50) {
    return {
      status: Status.CRITIAL,
      message: 'Nhịp tim bạn trong trạng thái nguy hiểm. Hãy liên hệ bác sĩ để được chăm sóc',
    };
  }
};

export const recordGlucose = (index) => {
  if (50 <= Number(index) && Number(index) < 115) {
    return {
      status: Status.SAFE,
      message: 'Đường huyết của bạn trong trạng thái an toàn. Hãy chăm sóc và bảo vệ sức khỏe để có một nhịp tim tốt',
    };
  }

  if (115 <= Number(index) && Number(index) < 180) {
    return {
      status: Status.DANGER,
      message: 'Đường huyết bạn trong trạng thái cảnh báo. Hãy chú ý sức khỏe của mình tốt hơn',
    };
  }
  if (180 <= Number(index) || Number(index) < 50) {
    return {
      status: Status.CRITIAL,
      message: 'Đường huyết bạn trong trạng thái nguy hiểm. Hãy liên hệ bác sĩ để được chăm sóc',
    };
  }
};

export const recordCholesterol = (index) => {
  if (Number(index) < 200) {
    return {
      status: Status.SAFE,
      message: 'Đường huyết của bạn trong trạng thái an toàn. Hãy chăm sóc và bảo vệ sức khỏe để có một nhịp tim tốt',
    };
  }

  if (200 <= Number(index) && Number(index) < 239) {
    return {
      status: Status.DANGER,
      message: 'Đường huyết bạn trong trạng thái cảnh báo. Hãy chú ý sức khỏe của mình tốt hơn',
    };
  }
  if (240 <= Number(index)) {
    return {
      status: Status.CRITIAL,
      message: 'Đường huyết bạn trong trạng thái nguy hiểm. Hãy liên hệ bác sĩ để được chăm sóc',
    };
  }
};

export const recordBloodPressure = (systolic, diastolic) => {
  if (
    (Number(systolic) < 119 && Number(diastolic) >= 60 && Number(diastolic) < 79) ||
    (Number(diastolic) < 70 && Number(systolic) >= 90 && Number(systolic) < 119)
  ) {
    return {
      status: 'SAFE',
      message: 'Huyết áp của bạn trong trạng thái an toàn. Hãy chăm sóc và bảo vệ sức khỏe để có một nhịp tim tốt',
    };
  } else if (Number(diastolic) < 60 && Number(systolic) < 90) {
    return {
      status: 'LOW',
      message: 'Huyết áp của bạn trong trạng thái thấp. Hãy liên hệ bác sĩ để được chăm sóc',
    };
  } else if (
    (Number(systolic) < 129 && Number(diastolic) >= 80) ||
    (Number(diastolic) < 80 && Number(systolic) >= 130)
  ) {
    return {
      status: 'HIGH',
      message: 'Huyết áp của bạn trong trạng thái cao. Hãy liên hệ bác sĩ để được chăm sóc',
    };
  } else {
    return {
      status: 'HIGH',
      message: 'Huyết áp của bạn trong trạng thái cao. Hãy liên hệ bác sĩ để được chăm sóc',
    };
  }
};

export const recordIndexBmi = (index) => {
  if (Number(index) < 18.5) {
    return {
      status: 'LIGHT',
      message:
        'Bạn đang trong trạng thái suy dinh dưỡng. Hãy chú ý dinh dưỡng của các bữa ăn hoặc liên hệ bác sĩ để được chăm sóc',
    };
  }

  if (Number(index) >= 18.5 && Number(index) < 22.9) {
    return {
      status: 'GOOD',
      message: 'Bạn đang có 1 thân hình cân đối hãy chăm sóc thật tốt cơ thể',
    };
  }

  if (Number(index) >= 23 && Number(index) < 24.9) {
    return {
      status: 'OVERWEIGHT',
      message: 'Bạn đang trong trạng thái thừa cân. Hãy chú ý dinh dưỡng cơ thể',
    };
  }

  if (Number(index) >= 25) {
    return {
      status: 'FAT',
      message:
        'Bạn đang trong trạng thái béo phì. Hãy chú ý dinh dưỡng của các bữa ăn hoặc liên hệ bác sĩ để được chăm sóc',
    };
  }
};
