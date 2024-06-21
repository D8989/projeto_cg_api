import { ValidationOptions, registerDecorator } from 'class-validator';
import { StringFunctionsClass } from '../functions/string-functions.class';

export function IsNumberStringDecimal(
  qtdDecimais: number,
  validationOptions?: ValidationOptions,
) {
  const validOpt = {
    message: `numeral string não respeita o formado desejado`,
    ...validationOptions,
  };
  return function (obj: object, propertyName: string) {
    registerDecorator({
      name: 'IsNumberStringDecimal',
      target: obj.constructor,
      propertyName: propertyName,
      constraints: [qtdDecimais],
      options: validOpt,
      validator: {
        validate(value, validationArguments) {
          if (value) {
            const [qtdDec] = validationArguments?.constraints
              ? validationArguments.constraints
              : [null];

            if (typeof qtdDec === 'number' && typeof value === 'string') {
              return StringFunctionsClass.isStringNumberDecimal(value, qtdDec);
            }
          }
          return false;
        },
      },
    });
  };
}
