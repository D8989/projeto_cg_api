export class ArrayFunctions {
  static getArray<T>(arr?: T[]): T[] {
    return arr && arr.length > 0 ? arr : [];
  }
}
