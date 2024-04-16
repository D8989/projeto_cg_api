import { Injectable } from '@nestjs/common';
import 'dotenv/config';

@Injectable()
export class ConfigService {
  constructor() {}

  get(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Chave ${key} não existe no .env`);
    }
    return value;
  }

  getBoll(key: string): boolean {
    return this.get(key).localeCompare('true') ? true : false;
  }

  getInt(key: string): number {
    return parseInt(this.get(key));
  }
}
