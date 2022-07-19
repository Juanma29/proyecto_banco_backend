import fs from 'fs';
import path from 'path';
import { Configuracion } from './modelos/configuracion';
import { BancoArchivos } from './almacenamiento/banco-archivos';
import { mostrarMenuPrincipal } from './menu/menu-principal';
import { Wrapper } from './modelos/wrapper';
import readline from 'readline-promise';
import { validarConfiguracion } from './validaciones/validacion-configuracion';
import { BancoDatabase } from './almacenamiento/banco-database';
import { ModuloEmail } from './modulos/modulo-email';
import { ModuloAutenticacion } from './modulos/modulo-autenticacion';
import { ModuloExpress } from './modulos/modulo-express';
import { ModuloAutenticacionWeb } from './modulos/modulo-autenticacion-web';

async function main() {
  // __dirname = C:\workspace_backend\proyecto_banco_backend\dist
  // .. -> directorio superior (C:\workspace_backend\proyecto_banco_backend\)
  // C:\workspace_backend\proyecto_banco_backend\conf.json
  const rutaArchivo = path.join(__dirname, '..', 'conf.json');

  if(!fs.existsSync(rutaArchivo)) {
    console.log('No existe el archivo de configuración');
    return;
  }

  const datos = fs.readFileSync(rutaArchivo ).toString();
  const conf: Configuracion = JSON.parse(datos);
  const msg: string = validarConfiguracion(conf);
  if(msg) {  // msg !== 'null'
    console.log(msg);
    return;
  }

  // inicialización de la gestión de los datos en archivos
  // const bancoArchivos = new BancoArchivos(conf);
  const bancoDatabase = new BancoDatabase(conf);
  await bancoDatabase.conectar();
  
  const w: Wrapper = {
    conf,
    bancoArchivos: new BancoArchivos(conf),
    bancoDatabase,
    moduloEmail: new ModuloEmail(conf),
    moduloAutenticacion: null,
    moduloAutenticacionWeb: null,
    moduloExpress: null,
    rlp: readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    })
  } as Wrapper
  
  w.moduloAutenticacionWeb = new ModuloAutenticacionWeb(w);
  w.moduloExpress = new ModuloExpress(w);
  w.moduloAutenticacion = new ModuloAutenticacion(w);

  // await mostrarMenuPrincipal(w);
}

main();

