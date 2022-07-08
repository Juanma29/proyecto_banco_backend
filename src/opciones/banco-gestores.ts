import { Gestor } from './../modelos/gestor';
import validator from 'validator';
import { Configuracion } from '../modelos/configuracion';
import { BancoArchivos } from '../almacenamiento/banco-archivos';
export class BancoGestores {

    // atributos
    private conf: Configuracion;
    private bancoArchivos: BancoArchivos;
    private rlp: any;
  
    constructor(
      conf: Configuracion,
      bancoArchivos: BancoArchivos,
      rlp) {
  
        this.conf = conf;
        this.bancoArchivos = bancoArchivos;
        this.rlp = rlp;
    }
  
    async insertarGestor() {
      const usuario: string = await this.rlp.questionAsync('Usuario: ');
  
      if((usuario.length < 3) || (usuario.length > 14)) {
        console.log('La longitud es incorrecta (3-14)');
        return;   
      }
  
      // extrae la primera letra del nombre de usuario
      const primeraLetra = usuario.charAt(0);
      
      // convierte la primera letra a número. Si no es número, entonces primeraLetraNum toma el valor de NaN
      const primeraLetraNum = +primeraLetra;
      
      // si primeraLetraNum no es NaN, entonces es un número
      if(!isNaN(primeraLetraNum)) {
        console.log('La primera letra del nombre usuario no puede ser un número');
        return;
      }
  
      // si gestorExistente es undefined, entonces ha pasado la validación, pero si existe, entonces mostramos una advertencia y retornamos
      const gestorExistente = await this.bancoArchivos.obtenerGestorPorUsuario(usuario);
      if(gestorExistente) {
        console.log('Ya existe un gestor con el mismo nombre de usuario');
        return
      }
      
      const password: string = await this.rlp.questionAsync('Password: ');
      if((password.length < 3) || (password.length > 25)) {
        console.log('La longitud es incorrecta (3-25)');
        return;   
      }

      //solicitamos el correo
      const correo: string = await this.rlp.questionAsync('Correo: ');
      if(!validator.isEmail(correo)) {
        console.log('No es un email válido');
        return;
      }

      const gestorExistente2 = await this.bancoArchivos.obtenerGestorPorCorreo
      (correo);
      if(gestorExistente2) {
        console.log('Ya exite un gestor con el mismo correo');
        return;
      }

      this.bancoArchivos.insertarGestor({
        usuario, 
        password,
        correo
      }as Gestor);
    }
  }