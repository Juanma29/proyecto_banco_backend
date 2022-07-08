import { Configuracion } from '../modelos/configuracion';
import { BancoArchivos } from '../almacenamiento/banco-archivos';
import validator from 'validator';

export async function mostrarMenuGestores(
  conf: Configuracion, 
  bancoArchivos: BancoArchivos,
  rlp) {

    let opcion: string;

    do {

      console.clear();
      console.log('MENÚ GESTORES');
      console.log('-------------');
      console.log('1. Insertar gestor');
      console.log('2. Insertar gestores masivamente');
      console.log('3. Mostrar gestores');
      console.log('4. Mostrar gestor por identificador');
      console.log('5. Modificar gestor');
      console.log('6. Eliminar gestor por identificador');
      console.log('7. Atrás');
      
      opcion = await rlp.questionAsync('¿Qué opción deseas?\n');
      
      //validator.isEmail()

    } while(opcion !== '7')
}