import DataLoader from 'dataloader';
import { MarcaEntity } from 'src/marca/marca.entity';

export type MarcaLoader = DataLoader<number, MarcaEntity>;
