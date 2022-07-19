import validator from 'validator';
import bcrypt from 'bcrypt';
import { uniqueNamesGenerator, names } from'unique-names-generator';
import { randomEmail } from 'random-email';
import { Configuracion } from '../modelos/configuracion';
import { BancoArchivos } from '../almacenamiento/banco-archivos';
import { Gestor } from '../modelos/gestor';
import { Wrapper } from '../modelos/wrapper';
import { validarCorreo, validarPassword, validarUsuario } from '../validaciones/validacion-gestores';
import { mostrarGestores, mostrarGestor } from '../mostrar';
import { BancoDatabase } from '../almacenamiento/banco-database';

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

    // si está habilitado el almacenamiento en archivos, guardamos el gestor en el archivo gestores.json
    if(this.conf.archivosHabilitado) {
      await this.bancoArchivos.insertarGestor({
        usuario, 
        password: passwordHash,
        correo
      } as Gestor);
    }

    // si está habilitado el almacenamiento base de datos, se guarda el gestor en la colección gestores de la base de datos banco
    else if(this.conf.databaseHabilitado) {
      await this.w.bancoDatabase.insertarGestor({
        usuario, 
        password: passwordHash,
        correo
      } as Gestor)
    }


    console.log('Gestor insertado correctamente');    
  }

  async insertarGestoresMasivo(w: Wrapper) {
    const numeroGestores: string = await w.rlp.questionAsync('Número de gestores a insertar: ');
    const numeroGestoresNum = +numeroGestores;
    if(isNaN(numeroGestoresNum)) {
      console.log('El número de gestores introducidos no es un número');      
    }

    for(let i=0; i<numeroGestoresNum; i++) {
      const emailAleatorio = randomEmail();
      const usuarioAleatorio = uniqueNamesGenerator({ dictionaries: [names] });
      const password = '123456';
      const passwordHash = bcrypt.hashSync(password, 10);

      await w.bancoDatabase.insertarGestor({
        usuario: usuarioAleatorio,
        password: passwordHash,
        correo: emailAleatorio
      } as Gestor)
    }

    console.log('Gestores introducidos correctamente');
    
  }

  async mostrarGestores() {
    
    // comprueba si el almacenamiento en fichero está habilitado
    if(this.w.conf.archivosHabilitado) {
      mostrarGestores(this.bancoArchivos.gestores);
    }

    // comprueba si el almacemiento en la base datos está habilitado
    else if(this.w.conf.databaseHabilitado) {
      const gestores = await this.w.bancoDatabase.obtenerGestores();
      mostrarGestores(gestores);      
      const numeroGestores = await this.w.bancoDatabase.obtenerNumeroGestores();
      console.log(`Número de gestores totales: ${numeroGestores}`);   
    }

  }
  
  async mostrarGestoresConPaginacion(w: Wrapper) {

    const numPagina: number = +(await w.rlp.questionAsync("Número de página: "));
    
    
    const numElementos: number = +(await w.rlp.questionAsync("Número de elementos: "));

    if((isNaN(numPagina)) || (numPagina < 1)) {
      console.log('Número de página incorrecto');
      return;  
    }

    if((isNaN(numElementos)) || (numElementos < 1)) {
      console.log('Número de elementos incorrecto');
      return;  
    }

    const gestores = await this.w.bancoDatabase.obtenerGestoresPorPaginacion(
      numPagina,
      numElementos
    );
    mostrarGestores(gestores);   
  }

  async mostrarGestorPorId(w: Wrapper) {
    const id: string = await w.rlp.questionAsync('Id del gestor: ')
    const idNum = +id;

    // buscar si existe un gestor con el id introducido por el usuario
    const gestor = await w.bancoDatabase.obtenerGestorPorId(idNum);
    if(!gestor) {
      console.log(`No existe el gestor con el id ${id}`);
      return;
    }

    mostrarGestor(gestor);
  }

  async actualizarGestorPorUsuario(w: Wrapper) {
    const usuario: string = await w.rlp.questionAsync('Usuario gestor: ')
    const gestor = await w.bancoDatabase.obtenerGestorPorUsuario(usuario);
    if(!gestor) {
      console.log(`No existe el gestor con el nombre de usuario ${usuario}`); 
      return;  
    }

    // en esta línea del programa sabemos que el usuario existe y ahora que hay solicitar los campos a cambiar (password, correo)
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

    await w.bancoDatabase.actualizarGestor({
      usuario,
      password: passwordHash,
      correo
    } as Gestor);

    console.log('Gestor actualizado correctamente');
    
  }

  async eliminarGestorPorId(w: Wrapper) {
    const id: string = await w.rlp.questionAsync('Introduzca el id del gestor a eliminar: ');

    if(this.w.conf.archivosHabilitado) {
      await w.bancoArchivos.eliminarGestorPorId(Number(id));
    }

    if(this.w.bancoDatabase) {
      await w.bancoDatabase.eliminarGestorPorId(Number(id));   
    }

    console.log('Gestor eliminado');   
  }

  async eliminarGestores(w: Wrapper) {

    if(this.w.conf.archivosHabilitado) {
      await w.bancoArchivos.eliminarGestores();
    }
    
    if(this.w.bancoDatabase) {
      await w.bancoDatabase.eliminarGestores();
    }
    
    console.log('Todos los gestores eliminados');    
  }
}