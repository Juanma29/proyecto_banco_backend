import { Configuracion } from './configuracion';
import { BancoArchivos } from '../almacenamiento/banco-archivos';
import { BancoDatabase } from '../almacenamiento/banco-database';
import { ModuloEmail } from '../modulos/modulo-email';
import { ModuloAutenticacion } from './../modulos/modulo-autenticacion';
import { ModuloExpress } from '../modulos/modulo-express';
import { ModuloAutenticacionWeb } from '../modulos/modulo-autenticacion-web';

export interface Wrapper {
  rlp: any;
  conf: Configuracion,
  bancoArchivos: BancoArchivos,
  bancoDatabase: BancoDatabase,
  moduloEmail: ModuloEmail,
  moduloAutenticacion: ModuloAutenticacion,
  moduloAutenticacionWeb: ModuloAutenticacionWeb,
  moduloExpress: ModuloExpress
};