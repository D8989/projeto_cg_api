import { isValid } from 'date-fns';

export class DateFunctions {
  static isDateValid(date: Date): boolean {
    return isValid(date);
  }

  static isStrValid(str: string): boolean {
    console.log('str: ', str);

    console.log('T1: ', this.isStrIsoUtcValid(str));
    console.log('T2: ', this.isDateValid(new Date(str)));

    return this.isStrIsoUtcValid(str) && this.isDateValid(new Date(str));
  }

  private static isStrIsoUtcValid(str: string) {
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(str);
  }
}
