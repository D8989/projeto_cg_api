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
}
