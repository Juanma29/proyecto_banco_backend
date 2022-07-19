import { Configuracion } from "../modelos/configuracion";
import { BancoArchivos } from "../almacenamiento/banco-archivos";
import { BancoGestores } from "../opciones/banco-gestores";
import { Wrapper } from "../modelos/wrapper";

export async function mostrarMenuGestores(w: Wrapper) {
  
  // compruebo si el gestor está autenticado. Si no lo está se acaba el método con return y vuelve al menú principal
  if(
    (!w.moduloAutenticacion.estaGestorAutenticado()) && 
    (w.conf.autenticacionHabilitado)) {

    console.clear();
    console.log('El gestor no está autenticado');
    await w.rlp.questionAsync("");
    return;   
  }
  
  let opcion: string;
  const bancoGestores = new BancoGestores(w);

  do {
    console.clear();
    console.log("MENÚ GESTORES");
    console.log("-------------");
    console.log("1. Insertar gestor");
    console.log("2. Insertar gestores masivamente");
    console.log("3. Mostrar gestores");
    console.log("4. Mostrar gestor por identificador");
    console.log("5. Modificar gestor");
    console.log("6. Eliminar gestor por identificador");
    console.log("7. Eliminar todos los gestores");
    console.log("8. Atrás");

    opcion = await w.rlp.questionAsync("¿Qué opción deseas?\n");

    console.clear();

    // Opción 1 --> Insertar gestor
    if (opcion === "1") {
      await bancoGestores.insertarGestor();
      await w.rlp.questionAsync("");
    }

    // Opción 2 --> Insertar gestores de forma masiva
    if (opcion === "2") {
      await bancoGestores.insertarGestoresMasivo(w);
      await w.rlp.questionAsync("");
    }

    // Opción 3 --> Mostrar gestores
    else if (opcion === "3") {

      const paginacion: string = await w.rlp.questionAsync("¿Utilizar paginación (S/N)? ");
      
      // mostramos los gestores con paginación
      if (paginacion === 'S') {
        await bancoGestores.mostrarGestoresConPaginacion(w);
      } 
      else {
        await bancoGestores.mostrarGestores();
      }

      await w.rlp.questionAsync("");
    }

    // Opción 4 -->  Mostrar gestor por identificador
    else if (opcion === "4") {
      await bancoGestores.mostrarGestorPorId(w);
      await w.rlp.questionAsync("");
    }

    // Opción 5 --> Modificar gestor
    else if (opcion === '5') {
      await bancoGestores.actualizarGestorPorUsuario(w);
      await w.rlp.questionAsync("");
    }

    // Opción 6 --> Eliminar gestor por identificador
    else if (opcion === "6") {
      await bancoGestores.eliminarGestorPorId(w);
      await w.rlp.questionAsync("");
    }

    // Opción 7 --> Eliminar todos los gestores
    else if (opcion === "7") {
      await bancoGestores.eliminarGestores(w);
      await w.rlp.questionAsync("");
    }
  } while (opcion !== "8");
}
