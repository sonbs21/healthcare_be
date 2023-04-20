/* eslint-disable prettier/prettier */
export const MESS_CODE = {
  SUCCESS: 'Thành công',
  PHONE_OR_PASSWORD_INCORRECT: 'Số điện thoại hoặc mật khẩu không đúng',
  PHONE_EXIST: 'Số điện thoại đã tồn tại',
  EMAIL_EXIST: 'Email đã tồn tại',
  PASSWORD_INVALID: 'Mật khẩu phải nhiều hơn 6 ký tự',
  PATIENT_NOT_FOUND: 'Bệnh nhân không tồn tại',
  DOCTOR_NOT_FOUND: 'Bác sĩ không tồn tại',
  APPOINTMENT_NOT_FOUND: 'Cuộc hẹn không tồn tại',
  BMI_NOT_FOUND: 'Mã số bmi không tồn tại',
  HEALTH_RECORD_NOT_FOUND: 'Báo cáo sức khỏe không tồn tại',
  INVALID_HEIGHT: 'Chiều cao là số và phải lớn hơn 0',
  INVALID_WEIGHT: 'Cân nặng là số và phải lớn hơn 0',
  BLOOD_PRESSURE_NOT_FOUND: 'Mã số huyết áp không tồn tại',
  INVALID_SYSTOLIC: 'Tâm thu là số và phải lớn hơn 0',
  INVALID_DIASTOLIC: 'Tâm trương là số và phải lớn hơn 0',
  INVALID_CHOLESTEROL: 'Chỉ số cholesterol là số và phải lớn hơn 0',
  INVALID_GLUCOSE: 'Chỉ số glucose là số và phải lớn hơn 0',
  INVALID_HEARTBEAT: 'Chỉ số nhịp tim là số và phải lớn hơn 0',
  NOT_PERMISSION: 'Bạn không có quyền thực hiện công việc này',
  NEW_PASSWORD_NOT_MATCH: 'Mật khẩu không khớp',
  OLD_PASSWORD_NOT_MATCH: 'Nhập sai mật khẩu cũ',
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
