import { Configuracion } from './configuracion';
import { BancoArchivos } from '../almacenamiento/banco-archivos';

export interface Wrapper {
    rlp: any;
    conf: Configuracion,
    bancoArchivos: BancoArchivos
};