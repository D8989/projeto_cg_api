import DataLoader from 'dataloader';

export type TypeLoader<T> = DataLoader<number, T | null>;
