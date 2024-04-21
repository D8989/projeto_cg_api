export class ObjectFunctions {
  static isObjectEmpty(obj: any): boolean {
    if (typeof obj === 'object') {
      if (Object.keys(obj).length === 0) {
        return true;
      }
      if (Object.values(obj).every((x) => x === null || x === undefined)) {
        return true;
      }
    }

    return false;
  }

  static removeEmptyProperties<T>(obj: T) {
    for (const key in obj) {
      if (obj[key] === null || obj[key] === undefined) {
        delete obj[key];
      }
    }
    return obj;
  }
}
