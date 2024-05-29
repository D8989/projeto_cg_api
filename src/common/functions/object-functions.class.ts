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

  static groupByKey<T>(arr: T[], prop: string) {
    return arr.reduce((previous, current) => {
      previous[current[prop]] = previous[current[prop]] || {};
      previous[current[prop]] = current;
      return previous;
    }, {});
  }

  static groupByKeyMany<T>(arr: T[], prop: string) {
    return arr.reduce((previous, current) => {
      previous[current[prop]] = previous[current[prop]] || [];
      previous[current[prop]].push(current);
      return previous;
    }, {});
  }

  static getKeys<T extends object>(obj: T): string[] {
    return Object.keys(obj);
  }

  static getValidKeys(obj?: MyObject, validKeys: string[] = []): string[] {
    if (!obj) {
      return [];
    }
    const keys = ObjectFunctions.getKeys(obj);
    return keys.filter((k) => validKeys.includes(k));
  }

  static hasKey(obj: MyObject, key: string): boolean {
    return this.getKeys(obj).includes(key);
  }
}
