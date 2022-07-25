import { Wrapper } from '../modelos/wrapper';
import validator from 'validator';
import { descargarPeliculas } from '../utilidades/the-movies';
import { ModuloJuegoJugador } from '../modulos/modulo-juego-jugador';

export async function mostrarMenuOtros(w: Wrapper) {

  let opcion: string;

  do {
    console.clear();

    const msg = (w.moduloJuegoAnfitrion.estaModoAnfitrionActivo) ?
      "MENÚ OTROS (modo anfitrión ACTIVADO)" :
      "MENÚ OTROS (modo anfitrión DESACTIVADO)"

    console.log(msg);
    console.log("-------------");
    console.log("1. Enviar correo");
    console.log("2. Descargar películas y guardar");
    console.log("3. Obtener película aleatoria");
    console.log("4. Obtener películas por paginación");
    console.log("5. Obtener páginas por número de elementos");

    // cuando no está activo el modo anfitrión
    if(!w.moduloJuegoAnfitrion.estaModoAnfitrionActivo) {
      console.log("6. Juego - Anfitrión");
    }

    console.log("7. Juego - Jugador"); 

    // cuando está activo el modo anfitrión
    if(w.moduloJuegoAnfitrion.estaModoAnfitrionActivo) {
      console.log("8. Juego - Anfitrión - Mostrar información de la sala")
      console.log("9. Juego - Anfitrión - Iniciar juego")
      console.log("10. Juego - Anfitrión - Detener modo anfitrión")
      console.log("11. Juego - Anfitrión - Banear jugadores");
    }

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
    else if(
      (opcion ==="6") && 
      (!w.moduloJuegoAnfitrion.estaModoAnfitrionActivo)) {
      
      console.clear();
      await w.moduloJuegoAnfitrion.iniciar();
      await w.rlp.questionAsync('');
    }

    // Opción 7 --> Juego - Jugador
    else if(opcion == "7") {
      console.clear();
      await w.moduloJuegoJugador.iniciar();
      await w.rlp.questionAsync('');
      await w.moduloJuegoJugador.detener();
    }

    if((w.moduloJuegoAnfitrion.estaModoAnfitrionActivo)) {

      // Opción 8 -> Mostrar información de la sala
      if(opcion === "8") {
        console.clear();
        await w.moduloJuegoAnfitrion.mostrarInformacion();
        await w.rlp.questionAsync('');
      }

      // Opción 9 -> Iniciar juego
      else if(opcion === "9") {
        console.clear();
        await w.moduloJuegoAnfitrion.iniciarJuego();
        await w.rlp.questionAsync('');
      }

      // Opción 10 -> Detener modo anfitrión
      else if(opcion === "10") {
        console.clear()
        console.log('Modo anfitrión detenido');
        await w.moduloJuegoAnfitrion.detener();
        await w.rlp.questionAsync('');
      }

      // Opción 11 -> Banear jugadores
      else if(opcion === "11") {
        console.clear();     
        await w.moduloJuegoAnfitrion.banearJugadores();
        await w.rlp.questionAsync('');
      }
    }

  } while (opcion !== "0");
}
