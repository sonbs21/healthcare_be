/* eslint-disable prettier/prettier */


export const MESS_CODE = {

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
