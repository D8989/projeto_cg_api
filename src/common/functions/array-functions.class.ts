export class ArrayFunctions {
  static getArray<T>(arr?: T[]): T[] {
    return arr && arr.length > 0 ? arr : [];
  }

  static uniqueArray<T>(arr1: T[], arr2: T[]): T[] {
    return [...new Set([...arr1, ...arr2])];
  }

  static isEqualById<T extends { id: number }>(arr1: T[], arr2: T[]) {
    if (arr1.length !== arr2.length) {
      return false;
    }

    for (let i = 0; i < arr1.length; i++) {
      if (!arr2.find((ar2) => ar2.id === arr1[i].id)) {
        return false;
      }
    }
    return true;
  }
}
