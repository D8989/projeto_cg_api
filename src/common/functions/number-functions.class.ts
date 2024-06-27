import { ValueTransformer } from 'typeorm';

export class NumberFunctions {
  static round(num: number, dec = 2) {
    return parseFloat(num.toFixed(dec));
  }

  static roundMath(num: number) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  }

  static numericTransform(): ValueTransformer {
    return {
      from(value: string) {
        return parseFloat(value);
      },
      to(value: number) {
        return value.toString();
      },
    };
  }
}
