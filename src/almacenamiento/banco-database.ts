import { Configuracion } from '../modelos/configuracion';
import { Collection, MongoClient } from 'mongodb';
import { Gestor } from '../modelos/gestor';

export class BancoDatabase {
  obtenerNumeroGestores() {
    throw new Error('Method not implemented.');
  }

  // atributos
  private conf: Configuracion;
  private cGestores: Collection<Gestor>
  private idSiguiente: number = 1;

  constructor(conf: Configuracion) {
    this.conf = conf;
  }

  async conectar() {
    const uri = `mongodb://${this.conf.databaseHost}:${this.conf.databasePuerto}`
    const client = new MongoClient(uri);

    try {
      await client.connect();
      const db = client.db(this.conf.databaseNombre);
      this.cGestores = db.collection('gestores');

      // obtener el último id que existe en la colección de gestores
      const gestores = await this.cGestores.find({}, {
        projection: {
          id: 1,
          _id: 0
        }
      }).sort({
        id: -1
      }).limit(1).toArray();

      if(gestores.length > 0) {
        this.idSiguiente = gestores[0].id + 1
      }

    }
    catch {
      await client.close();
      console.log('Error conectando a la base de datos');      
    }
  }

  async obtenerGestores(): Promise<Gestor[]> {
    // toArray es un método del cursor. La otra manera de obtener los datos es iterando el cursor mediante el método forEach
    const gestores = await this.cGestores.find({}).toArray();
    return gestores;
    
    // const cursor = this.cGestores.find({});
    // cursor.forEach(gestor => {
    //   console.log(gestor);      
    // })

  }

  async obtenerGestorPorCorreo(correo: string): Promise<Gestor> {
    const gestor = await this.cGestores.findOne({
      correo
    })
    return gestor;
  }

  async obtenerGestorPorUsuario(usuario: string): Promise<Gestor> {
    const gestor = await this.cGestores.findOne({
      usuario
    })
    return gestor;
  }

  async insertarGestor(gestor: Gestor) {
    gestor.id = this.idSiguiente;
    await this.cGestores.insertOne(gestor);
    this.idSiguiente++;
  }

  async eliminarGestorPorId(id: number) {
    await this.cGestores.deleteOne({
      id
    });
  }

  async eliminarGestores() {
    await this.cGestores.deleteMany({});
  }
}
