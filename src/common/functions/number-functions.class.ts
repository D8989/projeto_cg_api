export class NumberFunctions {
  static round(num: number, dec = 2) {
    return parseFloat(num.toFixed(dec));
  }

  static roundMath(num: number) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  }
}
