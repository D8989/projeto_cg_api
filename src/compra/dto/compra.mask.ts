export class CompraMask {
  id?: number;
  codigo?: number;
  dataCompra?: Date;
  lojaId?: number;
  atualizadoEm?: Date;
  desativadoEm?: Date;

  constructor(partial: Partial<CompraMask>) {
    Object.assign(this, partial);
  }
}
