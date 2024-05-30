export class ArrayFunctions {
  static getArray<T>(arr?: T[]): T[] {
    return arr && arr.length > 0 ? arr : [];
  }

  static uniqueArray<T>(arr1: T[], arr2: T[]): T[] {
    return [...new Set([...arr1, ...arr2])];
  }
}
