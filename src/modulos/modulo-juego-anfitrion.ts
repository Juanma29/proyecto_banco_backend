import { Wrapper } from '../modelos/wrapper';
import express from 'express';

export class ModuloJuegoAnfitrion {

    private nombreSala: string;
    private app: express.Application;
    private serverExpress;
  
    constructor(private w: Wrapper) { }
  
    async iniciar() {
      this.nombreSala = await this.w.rlp.questionAsync('Introduzca el nombre de la sala: ');
  
      this.app = express();
  
      // http://localhost:9000/anfitrion o http://192.168.0.201:9000/anfitrion
      this.app.get('/anfitrion', (req, res) => res.send(this.nombreSala));
  
      this.app.get('/entrar/:nombreJugador', (req, res) => {
        const nombreJugador = req.params.nombreJugador;
        console.log(`Jugador ${nombreJugador} conectado`); 
        res.send('ok')     
      })
  
      // arranca el servicio de express (puerto 9000)
      this.serverExpress = this.app.listen(this.w.conf.juegoPuertoExpress, () => {
        console.log('Esperando jugadores...');      
      })
    }
  
    async detener() {
      // detiene el servicio de express
      this.serverExpress.close();
    }
  }