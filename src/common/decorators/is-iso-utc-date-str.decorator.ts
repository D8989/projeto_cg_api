import { ValidationOptions, registerDecorator } from 'class-validator';
import { DateFunctions } from '../functions/date-functions.class';

export function IsIsoUtcDateStr(validationOptions?: ValidationOptions) {
  return function (obj: object, propertyName: string) {
    const validOpt = {
      ...validationOptions,
      message: 'Data não está no formado ISO-string',
    };
    registerDecorator({
      name: 'IsIsoUtcDateStr',
      target: obj.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validOpt,
      validator: {
        validate(value, validationArguments) {
          console.log('VALUE: ', value, 'type: ', typeof value);

          if (typeof value !== 'string') {
            return false;
          }

          console.log('TESTE');

          return DateFunctions.isStrValid(value);
        },
      },
    });
  };
}
