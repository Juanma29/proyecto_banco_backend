import { Configuracion } from '../modelos/configuracion';
import { BancoArchivos } from '../almacenamiento/banco-archivos';
import readline from 'readline-promise';
import { mostrarGestores} from '../mostrar';
import { mostrarMenuGestores } from './menu-gestores';
import { Wrapper } from '../modelos/wrapper';
import { mostrarMenuClientes } from './menu-clientes';
import { mostrarMenuOtros } from './menu-otros';
import { mostrarMenuLogin } from './menu-login';


// export porque la función se utiliza fuera de este archivo
// async porque dentro se utiliza await
export async function mostrarMenuPrincipal(w: Wrapper) {

  let opcion: string;

  do {

    console.clear();
    console.log(`
______
| ___ \\                      
| |_/ / __ _ _ __   ___ ___  
| ___ \\/ _ | '_ \\ / __/ _ \\ 
| |_/ / (_| | | | | (_| (_) |
\____/ \\____|_| |_|\\___\\___/ `);
    
    console.log('-------------');

    // si el gestor no está autenticado
    if(!w.moduloAutenticacion.estaGestorAutenticado()) {
      console.log('No autenticado'); 
    }
    
    // si el gestor está autenticado
    else if(w.moduloAutenticacion.estaGestorAutenticado()) {
      const gestorAutenticado = w.moduloAutenticacion.obtenerUsuarioGestor();
      console.log(`Gestor autenticado: ${gestorAutenticado}`);
    }
    
    console.log('-------------');
    console.log('1. Gestores');
    console.log('2. Clientes');
    console.log('3. Mensajes');
    console.log('4. Transferencias');
    console.log('5. Otros');
    
    if(w.conf.autenticacionHabilitado) {

      if(!w.moduloAutenticacion.estaGestorAutenticado()) {
        console.log('6. Login');
      }

      else if(w.moduloAutenticacion.estaGestorAutenticado()) {
        console.log('6. Logout');
      }
    }

    console.log('0. Salir');
    
    opcion = await w.rlp.questionAsync('¿Qué opción deseas?\n');
    
    if(opcion === '1') {
      await mostrarMenuGestores(w);
    }

    else if(opcion === '2') {
      await mostrarMenuClientes(w);
    }

    else if(opcion === '5') {
      await mostrarMenuOtros(w);
    }

    else if(opcion === '6') {

      if(!w.moduloAutenticacion.estaGestorAutenticado()) {
        await mostrarMenuLogin(w);
      }

      else if(w.moduloAutenticacion.estaGestorAutenticado()) {
        w.moduloAutenticacion.logout();
      }
    }

  } while(opcion !== '0');

  // esta es la última línea del programa
  w.rlp.close();
}