import { Wrapper } from '../modelos/wrapper';
import express from 'express';
import { generarRespuestaError, Respuesta, generarRespuestaOK } from '../modelos/respuesta';
import { retornarPeliculaAsteriscos, retornarPeliculaOculta } from '../utilidades/utilidades-juego';
import { Pelicula } from '../modelos/pelicula';
import { TheMoviesDatabase } from '../almacenamiento/the-movies-database';

interface Jugador {
  nombre: string;
  direccionIP: string;
  puntuacion: number;
}


interface Jugadores {
  // [key: string] indica que el nombre de las claves es dinámico (no es fijo)
  [key: string]: Jugador
}

export class ModuloJuegoAnfitrion {

  estaModoAnfitrionActivo: boolean = false;
  estaJuegoActivo: boolean = true;

  /*
    {
      "::1@alejandro": {
        "nombre": "alejandro",
        "direccionIP": "::1"
        "puntuacion": 0
      }
    }
  */
  jugadores = {};

  private nombreSala: string;
  private app: express.Application;
  private serverExpress;
  private tituloPeliculaOculto: string;

  constructor(private w: Wrapper) { }

  async iniciar() {
    this.nombreSala = await this.w.rlp.questionAsync('Introduzca el nombre de la sala: ');

    this.app = express();

    // http://localhost:9000/anfitrion o http://192.168.0.201:9000/anfitrion
    this.app.get('/anfitrion', (req, res) => res.send(this.nombreSala));

    // http://localhost:9000/entrar/:nombreJugador
    // http://192.168.0.201:9000/entrar/:nombreJugador
    this.app.get('/entrar/:nombreJugador', (req, res) => {
      const nombreJugador = req.params.nombreJugador;
      const direccionIP = req.socket.remoteAddress; 
      const jugador: Jugador = {
        nombre: nombreJugador,
        direccionIP,
        puntuacion: 0
      }

      const identificadorJugador = `${direccionIP}@${nombreJugador}`
      
      // comprueba si el jugador ya se encuentra conectado
      if(identificadorJugador in this.jugadores) {
        const respuesta: Respuesta = generarRespuestaError('Jugador ya conectado');
        res.json(respuesta);
        return;
      }
      
      // si no se encuentra conectado, agregamos el nuevo jugador al objeto jugadores
      this.jugadores[identificadorJugador] = jugador;
      
      const respuesta: Respuesta = generarRespuestaOK();
      res.json(respuesta);
    })

    // http://localhost:9000/salir/:nombreJugador
    // http://192.168.0.201:9000/salir/:nombreJugador
    this.app.get('/salir/:nombreJugador', (req, res) => {
      const nombreJugador = req.params.nombreJugador;
      const direccionIP = req.socket.remoteAddress;
      const identificadorJugador = `${direccionIP}@${nombreJugador}`

      // comprueba si el jugador ya se encuentra conectado
      if(identificadorJugador in this.jugadores) {
        delete this.jugadores[identificadorJugador];
        const respuesta = generarRespuestaOK();
        res.json(respuesta);
        return;
      }

      // comprueba si el jugador NO se encuentra conectado
      const respuesta = generarRespuestaError('Jugador no conectado');
      res.json(respuesta);
    })

    // http://localhost:9000/pelicula/aleatoria
    this.app.get('/pelicula/aleatoria', async (req, res) => {
      const pelicula: Pelicula = await this.w.themoviesDatabase.obtenerPeliculaAleatoria()
      res.json(pelicula);
    })

    // http://localhost:9000/peliculas?num=10&pagina=1
    this.app.get('/peliculas', async(req, res) => {
      const numeroElementos = +req.query.num;
      const pagina = +req.query.pagina;
      const peliculas = await this.w.themoviesDatabase.obtenerPeliculasPorPaginacion(pagina, numeroElementos);
      res.json(peliculas)
    })

    // arranca el servicio de express (puerto 9000)
    this.serverExpress = this.app.listen(this.w.conf.juegoPuertoExpress, () => {
      console.log('Esperando jugadores...');      
    })

    // activado modo anfitrion
    this.estaModoAnfitrionActivo = true;
  }
  
  async detener() {
    // detiene el servicio de express
    this.serverExpress.close();
    this.estaModoAnfitrionActivo = false;
    this.estaJuegoActivo = false;
  }

  async mostrarInformacion() {

    // Si no hay jugadores
    if(Object.keys(this.jugadores).length === 0) {
      console.log('No hay jugadores');
      return;
    }

    // Si hay jugadores, itero el objeto y mostrar los valores de las propiedades
    for(let identificadorJugador in this.jugadores) {
      console.log(`Identificador: ${identificadorJugador}`);

      const nombreJugador = this.jugadores[identificadorJugador].nombre;
      const direccionIP = this.jugadores[identificadorJugador].direccionIP;
      const puntuacion = this.jugadores[identificadorJugador].puntuacion;
      console.log(`Nombre del jugador: ${nombreJugador}`);      
      console.log(`Dirección: ${direccionIP}`);      
      console.log(`Puntuación: ${puntuacion}`);      
      console.log('------');      
    }
  }

  async banearJugadores() {

    // Si no hay jugadores
    if(Object.keys(this.jugadores).length === 0) {
      console.log('No hay jugadores');
      return;
    }

    let opcion: string;
    
    // ['::1@paquito', '::ffff:192.168.0.202@pepita']
    do {
      const identificadoresJugadores = Object.keys(this.jugadores); 
      
      console.clear();
      if(Object.keys(this.jugadores).length === 0) {
        console.log('No hay jugadores');
        return;
      }

      identificadoresJugadores.forEach((identificadorJugador, i) => {
        const nombreJugador = this.jugadores[identificadorJugador].nombre;
        console.log(`${i+1}. ${nombreJugador}`)
      });

      console.log('0. Atrás');
      opcion = await this.w.rlp.questionAsync('Usuario a banear: ')

      
      const indiceJugador = +opcion - 1;

      // comprueba si el usuario ha introducido un número
      if(isNaN(indiceJugador)) {
        console.log('No existe el jugador')
      }

      // si no existe el jugador
      else if(!identificadoresJugadores[indiceJugador]) {
        console.log('No existe el jugador')
      }

      // si existe el jugador, se obtiene el identificador y se eliminar del objeto jugadores
      else {
        const identificadorJugador = identificadoresJugadores[indiceJugador]
        delete this.jugadores[identificadorJugador];
      }

    } while(opcion !== "0");
  }

  async iniciarJuego() {
    // obtener película aleatoria
    const pelicula = await this.w.themoviesDatabase.obtenerPeliculaAleatoria();
    const tituloPelicula = pelicula.title;

    this.tituloPeliculaOculto = retornarPeliculaAsteriscos(tituloPelicula);

    setInterval(() => {
      this.tituloPeliculaOculto = retornarPeliculaOculta(
        tituloPelicula,
        this.tituloPeliculaOculto
      );
    }, 5000)

    this.app.get('/pelicula', (req, res) => res.send(this.tituloPeliculaOculto));

    console.log(`Juego arranco: el nombre de la película es: ${tituloPelicula}`)
  }
}