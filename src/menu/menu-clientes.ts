import { Wrapper } from "../modelos/wrapper";

export async function mostrarMenuClientes(w: Wrapper) {
    
let opcion: string;
 // const bancoClientes = new BancoClientes(w);

do {

    console.log('Menú Clientes');
    console.log('----------------');
    console.log('1. Insertar Clientes');
    console.log('2. Insertar Clientes masivamente');
    console.log('3. Mostrar Clientes');
    console.log('4. Mostrar Clientes por Identificador');
    console.log('5. Modificar Cliente');
    console.log('6. Eliminar Cliente por identificador');
    console.log('7. Atrás <-- vuelve al menú principal');
    
    opcion = await w.rlp.questionAsync('¿Qué opción deseas?\n');

    console.clear();

    // Opción 1 --> Insertar cliente 
    if(opcion === '1') {
        await w.rlp.questionAsync('');
      }
  
      // Opción 2 --> Insertar clientes de forma masiva
      if(opcion === '2') {
        await w.rlp.questionAsync('');
      }
  
      // Opción 3 --> Mostrar clientes 
      else if(opcion === '3') {
        await w.rlp.questionAsync('');
      }
  
       // Opción 4 --> Modificar cliente
       else if(opcion === '4') {
        await w.rlp.questionAsync('');
      }
  
      else if(opcion === '5') {
        await w.rlp.questionAsync('');
      }
  
      // Opción 6 --> Eliminar todos los clientes
      else if(opcion === '6') {
        await w.rlp.questionAsync('');
      }

    } while(opcion !== '7');

}