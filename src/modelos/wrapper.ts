import { Configuracion } from './configuracion';
import { BancoArchivos } from '../almacenamiento/banco-archivos';
import { BancoDatabase } from '../almacenamiento/banco-database';

export interface Wrapper {
  rlp: any;
  conf: Configuracion,
  bancoArchivos: BancoArchivos,
  bancoDatabase: BancoDatabase
};