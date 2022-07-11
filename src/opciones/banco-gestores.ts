import validator from 'validator';

import { Configuracion } from '../modelos/configuracion';
import { BancoArchivos } from '../almacenamiento/banco-archivos';
import { Gestor } from '../modelos/gestor';
import { Wrapper } from '../modelos/wrapper';
import { validarCorreo, validarPassword, validarUsuario } from '../validaciones/validacion-gestores';

export class BancoGestores {

  // atributos
  private conf: Configuracion;
  private bancoArchivos: BancoArchivos;
  private rlp: any;
  private w: Wrapper;

  constructor(w: Wrapper) {
    this.w = w;
    this.conf = w.conf;
    this.bancoArchivos = w.bancoArchivos;
    this.rlp = w.rlp;
  }

  async insertarGestor() {
    const usuario: string = await this.rlp.questionAsync('Usuario: ');
    const msgUsuario = await validarUsuario(usuario, this.w);
    if(msgUsuario) { // msgUsuario !== null
      console.log(msgUsuario);
      return;      
    }

    // en este punto del código msgUsuario = null y, por tanto, no hay error de validación en el usuario

    const password: string = await this.rlp.questionAsync('Password: ');
    const msgPassword = await validarPassword(password, this.w);
    if(msgPassword) { // msgPassword !== null
      console.log(msgPassword);
      return;   
    }

    // solicitamos el correo
    const correo: string = await this.rlp.questionAsync('Correo: ');
    const msgCorreo = await validarCorreo(correo, this.w);
    if(msgCorreo) {
      console.log(msgCorreo);
      return;
    }

    await this.bancoArchivos.insertarGestor({
      usuario, 
      password,
      correo
    } as Gestor);

    console.log('Gestor insertado correctamente');    
  }
}