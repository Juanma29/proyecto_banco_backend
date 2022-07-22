import { Collection, MongoClient } from "mongodb";
import { Configuracion } from "../modelos/configuracion";
import { Pelicula } from '../modelos/pelicula';

export class TheMoviesDatabase {

  private conf: Configuracion;
  private cPeliculas: Collection<Pelicula>;

  constructor(conf: Configuracion) {
    this.conf = conf;
  }

  async conectar() {
    const uri = `mongodb://${this.conf.databaseHost}:${this.conf.databasePuerto}`
    const client = new MongoClient(uri);

    try {
      await client.connect();
      const db = client.db("themovies");
      this.cPeliculas = db.collection('peliculas');
    }
    catch {
      await client.close();
      console.log('Error conectando a la base de datos');      
    }
  }

  async eliminarPeliculas() {
    await this.cPeliculas.deleteMany({});
  }

  async insertarPelicula(pelicula: Pelicula) {
    await this.cPeliculas.insertOne(pelicula);
  }

  async insertarPeliculas(peliculas: Pelicula[]) {
    await this.cPeliculas.insertMany(peliculas);
  }

  async obtenerPeliculaAleatoria(): Promise<Pelicula> {

    // obtengo el número de películas en la colección (32951)
    const numPeliculas = await this.cPeliculas.countDocuments({});

    const posicionPelicula = +(Math.random()*numPeliculas)
    .toFixed(0);

    const peliculas = await this.cPeliculas
    .find()
    .skip(posicionPelicula)
    .limit(1)  // solamente obtenemos una película
    .toArray();

    return peliculas[0];
  }

  async obtenerPeliculasPorPaginacion(
    numPagina: number,
    numElementos: number
  ): Promise<Pelicula[]> {

    if (numElementos > 100) {
      numElementos = 100;
    }

    const skip = (numPagina - 1) * numElementos;

    return await this.cPeliculas
    .find()
    .skip(skip)
    .limit(numElementos)
    .toArray();
  }

  async obtenerPaginasPorNumeroDeElementos(numElementos: number): Promise<number>{
    
    const numPeliculas = await this.cPeliculas.countDocuments({});
    return Math.ceil(numPeliculas / numElementos);
  }
}