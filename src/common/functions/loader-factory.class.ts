import * as DataLoader from 'dataloader';
import { ObjectFunctions } from 'src/common/functions/object-functions.class';

export class LoaderFactory {
  static createLoader<T>(
    func: (ids: number[]) => Promise<T[]>,
    property = 'id',
  ) {
    const bash = async (ids: number[]) => {
      const entities = await func(ids);
      const entMap = ObjectFunctions.groupByKey(entities, property);
      return ids.map((id) => entMap[id]);
    };

    return new DataLoader(bash);
  }
}
