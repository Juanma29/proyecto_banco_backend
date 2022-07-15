import { Configuracion } from './configuracion';
import { BancoArchivos } from '../almacenamiento/banco-archivos';
import { BancoDatabase } from '../almacenamiento/banco-database';
import { ModuloEmail } from '../modulos/modulo-email';
import { ModuloAutenticacion } from '../modulos/modulo-autenticacion';

export interface Wrapper {
  rlp: any;
  conf: Configuracion,
  bancoArchivos: BancoArchivos,
  bancoDatabase: BancoDatabase,
  moduloEmail: ModuloEmail,
  moduloAutenticacion: ModuloAutenticacion
};