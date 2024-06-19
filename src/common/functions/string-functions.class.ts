export class StringFunctionsClass {
  static toLowerUnaccent(str: string) {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  static firstLetterUppercase(str: string): string {
    return str.charAt(0).toUpperCase() + str.toLowerCase().slice(1);
  }

  static isStringNumberDecimal(str: string, decimals: number) {
    if (decimals < 0) return false;
    console.log(this.getRegexDecimal(decimals));

    return this.getRegexDecimal(decimals).test(str);
  }

  private static getRegexDecimal(d: number) {
    let regexStr = '[1-9]+';

    if (d === 0) {
      return new RegExp(`^${regexStr}$`);
    }
    if (d === 1) {
      return new RegExp(`^${regexStr.concat('(\\.\\d)')}$`);
    }

    regexStr = regexStr.concat('(\\.\\d)?');
    for (let i = 0; i < d - 1; i++) {
      regexStr = regexStr.concat('\\d?');
    }

    return new RegExp(`^${regexStr}$`);
  }
}
