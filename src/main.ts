import fs from 'fs';
import path from 'path';
import { Configuracion } from './modelos/configuracion';
import { BancoArchivos } from './almacenamiento/banco-archivos';
import { mostrarMenuPrincipal } from './menu/menu-principal';

async function main() {
  // __dirname = C:\workspace_backend\proyecto_banco_backend\dist
  // .. -> directorio superior (C:\workspace_backend\proyecto_banco_backend\)
  // C:\workspace_backend\proyecto_banco_backend\conf.json
  const rutaArchivo = path.join(__dirname, '..', 'conf.json');
  const datos = fs.readFileSync(rutaArchivo ).toString();
  const conf: Configuracion = JSON.parse(datos);

  // inicialización de la gestión de los datos en archivos
  const bancoArchivos = new BancoArchivos(conf);
  
  await mostrarMenuPrincipal(conf, bancoArchivos);
}

main();


// console.log(conf.archivosUbicacion);

// console.log(__dirname);