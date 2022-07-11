import { Configuracion } from '../modelos/configuracion';
import { BancoArchivos } from '../almacenamiento/banco-archivos';
import readline from 'readline-promise';
import { mostrarGestores} from '../mostrar';
import { mostrarMenuGestores } from './menu-gestores';
import { Wrapper } from '../modelos/wrapper';


// export porque la función se utiliza fuera de este archivo
// async porque dentro se utiliza await
export async function mostrarMenuPrincipal(w: Wrapper){


  
  let opcion: string;

  do {

    console.log('BANCO');
    console.log('-------------');
    console.log('1. Gestores');
    console.log('2. Clientes');
    console.log('3. Mensajes');
    console.log('4. Transferencias');
    console.log('5. Otros');
    console.log('6. Login');
    console.log('0. Salir');
    
    opcion = await w.rlp.questionAsync('¿Qué opción deseas?\n');
    
    if(opcion === '1'){
       await mostrarMenuGestores(w);
    }

  } while(opcion !== '0');


  //esta es la última línea del programa
  w.rlp.close();
}