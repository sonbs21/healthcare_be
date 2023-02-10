/* eslint-disable prettier/prettier */
export const MESS_CODE = {
  SUCCESS: 'Thành công',
  PHONE_OR_PASSWORD_INCORRECT: 'Số điện thoại hoặc mật khẩu không đúng',
  PHONE_EXIST: 'Số điện thoại đã tồn tại',
  EMAIL_EXIST: 'Email đã tồn tại',
  PASSWORD_INVALID: 'Mật khẩu phải nhiều hơn 6 ký tự',
  PATIENT_NOT_FOUND:"Bệnh nhân không tồn tại",
  DOCTOR_NOT_FOUND:"Bác sĩ không tồn tại",
  BMI_NOT_FOUND:"Mã số bmi không tồn tại",
  INVALID_HEIGHT:"Chiều cao phải lớn hơn 0",
  INVALID_WEIGHT:"Cân nặng phải lớn hơn 0",
  BLOOD_PRESSURE_NOT_FOUND:"Mã số huyết áp không tồn tại",
  INVALID_SYSTOLIC:"Tâm thu phải lớn hơn 0",
  INVALID_DIASTOLIC:"Tâm trương phải lớn hơn 0",
};

const TranslationCode = (mess: string, options?: object) => {
  let message = mess;

  if (options && Object.keys(options).length) {
    Object.keys(options).map((i) => {
      message = message.replace('${' + `${i}` + '}', options[i]);
    });
  }
  return message;
};
export const t = TranslationCode;
