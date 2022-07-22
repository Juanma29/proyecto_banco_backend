import { Wrapper } from '../modelos/wrapper';
import validator from 'validator';
import { descargarPeliculas } from '../utilidades/the-movies';

export async function mostrarMenuOtros(w: Wrapper) {

  let opcion: string;

  do {
    console.clear();
    console.log("MENÚ OTROS");
    console.log("-------------");
    console.log("1. Enviar correo");
    console.log("2. Descargar películas y guardar");
    console.log("3. Obtener película aleatoria");
    console.log("4. Obtener películas por paginación");
    console.log("5. Obtener páginas por número de elementos");
    console.log("6. Juego - Anfitrión");    
    console.log("7. Juego - Jugador");    
    console.log("0. Atrás");

    opcion = await w.rlp.questionAsync("¿Qué opción deseas?\n");

    console.clear();

    // Opción 1 --> Enviar correo
    if (opcion === "1") {

      const correoDestino: string = await w.rlp.questionAsync('Correo destino: ');
      if(!validator.isEmail(correoDestino)) {
        console.log('Correo no válido'); 
        await w.rlp.questionAsync("");
        continue;     
      }

      const asunto: string = await w.rlp.questionAsync('Asunto: ')
      const texto: string = await w.rlp.questionAsync('Texto: ');

      const ok = await w.moduloEmail.enviarCorreo(
        correoDestino, 
        asunto, 
        texto);

      const msg = (ok) ? 'Mensaje enviado': 'Error';
      console.log(msg);

      // await bancoGestores.insertarGestor();
      await w.rlp.questionAsync("");
    }

    // Opción 2 --> Descargar películas y guardar
    else if(opcion === "2") {
      // await descargarPeliculas(w);
      await w.rlp.questionAsync('');
    }

    // Opción 3 --> Obtener película aleatoria
    else if(opcion === "3") {
      console.clear();
      const pelicula = await w.themoviesDatabase.obtenerPeliculaAleatoria();
      console.log(pelicula.title);      
      await w.rlp.questionAsync('');
    }

    // Opción 4 -> Obtener películas por paginación
    else if(opcion === "4") {
      console.clear();

      const numElementos = +(await w.rlp.questionAsync('Número de elementos: '));
      if(isNaN(numElementos)) {
        console.log('Número de elementos incorrecto');        
      }

      const numPagina = +(await w.rlp.questionAsync('Número de página: '));
      if(isNaN(numPagina)) {
        console.log('Número de página incorrecto');
      }

      const peliculas = await w.themoviesDatabase.obtenerPeliculasPorPaginacion(
        numPagina, 
        numElementos
      );

      peliculas.forEach((pelicula, i) => {
        console.log(`${i+1}. ${pelicula.title}`);        
      });

      await w.rlp.questionAsync('')
    }

    // Opción 5 -> Obtener páginas por número de elementos
    else if(opcion === "5") {

      console.clear();

      const numElementos = +(await w.rlp.questionAsync('Número de elementos: '));
      if(isNaN(numElementos)) {
        console.log('Número de elementos incorrecto');        
      }

      const numeroPaginas = await w.themoviesDatabase.obtenerPaginasPorNumeroDeElementos(
        numElementos
      );
      console.log(`Número de páginas: ${numeroPaginas}`);      

      await w.rlp.questionAsync('');
    }

    // Opción 6 --> Juego - Anfitrión
    else if(opcion ==="6") {
      console.clear();
      await w.moduloJuegoAnfitrion.iniciar();
      await w.rlp.questionAsync('');
      await w.moduloJuegoAnfitrion.detener();
    }

    // Opción 7 --> Juego - Jugador
    else if(opcion == "7") {
      console.clear();
      await w.moduloJuegoJugador.iniciar();
      await w.rlp.questionAsync('');
      await w.moduloJuegoJugador.detener();
    }

  } while (opcion !== "0");
}