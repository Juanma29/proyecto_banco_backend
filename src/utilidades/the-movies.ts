import axios from 'axios';
import { Wrapper } from '../modelos/wrapper';
import { TheMoviesDatabase } from '../almacenamiento/the-movies-database';
import { Pelicula } from '../modelos/pelicula';
/*
  https://www.themoviedb.org/settings/api  <--- API_KEY
  https://developers.themoviedb.org/3/getting-started/introduction  <-- DOCS
*/

const URL_MOVIES = 'https://api.themoviedb.org/3';

export async function descargarPeliculas(w: Wrapper) {

  const theMoviesDatabase = new TheMoviesDatabase(w.conf);
  await theMoviesDatabase.conectar();

  // eliminar toda la colección de peliculas (base de datos themovies)
  await theMoviesDatabase.eliminarPeliculas();

  for(let i=100; i<200; i++) {

    try {
      const url = `${URL_MOVIES}/movie/${i}?api_key=${w.conf.peliculasApiKey}&language=es-ES`
      const respuesta = await axios.get(url);
      const pelicula: Pelicula = respuesta.data;
      await theMoviesDatabase.insertarPelicula(pelicula);
      console.log(`Identificador de película descargada: ${i}`);
    } catch {
      console.log('No existe la película con el identificador ' + i)
    }
  }

  // console.log(datos);
  
}