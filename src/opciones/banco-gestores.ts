import validator from 'validator';
import bcrypt from 'bcrypt';
import { Configuracion } from '../modelos/configuracion';
import { BancoArchivos } from '../almacenamiento/banco-archivos';
import { Gestor } from '../modelos/gestor';
import { Wrapper } from '../modelos/wrapper';
import { validarCorreo, validarPassword, validarUsuario } from '../validaciones/validacion-gestores';
import { mostrarGestores } from '../mostrar';

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

    // obtener el hash mediante bcrypt
    const passwordHash = bcrypt.hashSync(password, 10);
    console.log(password, passwordHash);

    await this.bancoArchivos.insertarGestor({
      usuario, 
      password,
      correo
    } as Gestor);

    console.log('Gestor insertado correctamente');    
  }

  async mostrarGestores(){
    mostrarGestores(this.bancoArchivos.gestores);
  }

  async eliminargestoresPorId(w: Wrapper) {

  const id = await w.rlp.questionAsync('Introduzca el id del gestor a eliminar');
  await w.bancoArchivos.eliminarGestorPorId(Number(id));
  console.log('Gestor eliminado');
  
 }

 async eliminarGestores (w: Wrapper){
  await w.bancoArchivos.eliminarGestores();
  console.log('Todos los gestores eliminados');
 }
}