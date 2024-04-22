/**
 * FLAG = false, representa sempre o erro
 */
export class RespBollClass {
  flag: boolean;
  message: string;

  constructor(obj: RespBollClass) {
    Object.assign(this, obj);
  }
}
