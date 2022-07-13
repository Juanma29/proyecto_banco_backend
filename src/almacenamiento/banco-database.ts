import { Configuracion } from '../modelos/configuracion';
import { Collection, MongoClient } from 'mongodb';
import { Gestor } from '../modelos/gestor';

export class BancoDatabase {

  // atributos
  private conf: Configuracion;
  private cGestores: Collection<Gestor>

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
    }
    catch {
      console.log('Error conectando a la base de datos');      
    }
    finally { // liberación de recursos
      await client.close();
    }
  }
}