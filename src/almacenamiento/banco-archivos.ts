import fs from 'fs';
import path from 'path';
import { Configuracion } from '../modelos/configuracion';
import { Gestor } from '../modelos/gestor';
import { mostrarGestores } from '../mostrar';

export class BancoArchivos {

  rutaGestores: string;
  gestores: Gestor[];

  // este atributo tiene el valor del id del nuevo gestor que se inserta
  idSiguiente: number;

  constructor(conf: Configuracion) {

    // rutaArchivos = C:\workspace_backend\proyecto_banco_backend\datos
    const rutaArchivos = path.join(require.main.path, '..', conf.archivosUbicacion)

    if(!fs.existsSync(rutaArchivos)) {
      console.log('No existe el directorio de los datos');

      // crea el directorio
      console.log(rutaArchivos);           
      fs.mkdirSync(rutaArchivos);
    }

    // escribir en el archivo datos/gestores.json, pero solamente si NO existe el archivo
    // rutaGestores = C:\workspace_backend\proyecto_banco_backend\datos\gestores.json
    this.rutaGestores = path.join(rutaArchivos, 'gestores.json');
    if (!fs.existsSync(this.rutaGestores)) {
      console.log('No existe el archivo gestores.json');

      // crea el archivo gestores.json
      fs.writeFileSync(this.rutaGestores, '[]')   
    }

    const gestoresStr = fs.readFileSync(this.rutaGestores).toString();
    this.gestores = JSON.parse(gestoresStr);

    // guardar los id de todos los gestores en un array
    const ids = this.gestores.map(gestor => gestor.id);
    const idMaximo = Math.max(...ids);
    this.idSiguiente = idMaximo + 1;

    mostrarGestores(this.gestores)
  }

  async obtenerGestorPorUsuario(usuario: string): Promise<Gestor> {
    return new Promise((resolve, reject) => {

      // si no existe, gestor tendrá el valor de undefined
      const gestor = this.gestores.find(gestor => gestor.usuario === usuario)
      resolve(gestor);
    });
  }

  async obtenerGestorPorCorreo(correo: string): Promise<Gestor> {
    return new Promise((resolve, reject) => {

      // si no existe, gestor tendrá el valor de undefined
      const gestor = this.gestores.find(gestor => gestor.correo === correo)
      resolve(gestor);
    });
  }

  async insertarGestor(gestor: Gestor) {
    
    // asignamos el id del nuevo gestor a insertar
    gestor.id = this.idSiguiente;

    // incrementamos en 1 el valor this.idSiguiente para preparar el id del próximo gestor que inserte
    this.idSiguiente++;

    // se inserta el gestor en el array de gestores
    this.gestores.push(gestor);

    // el array de gestores se guarda en el disco duro (archivo gestores.json)
    this.guardarGestores();
  }

  guardarGestores() {
    const gestoresStr = JSON.stringify(this.gestores, null, 2);

    // this.rutaGestores = C:\workspace_backend\proyecto_banco_backend\datos\gestores.json
    fs.writeFileSync(this.rutaGestores, gestoresStr);
  }
}