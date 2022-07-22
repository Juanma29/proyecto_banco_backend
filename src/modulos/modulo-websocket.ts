import { Server, WebSocket } from 'ws';
import { Wrapper } from '../modelos/wrapper';

export class ModuloWebsocket {

  private clientes: WebSocket[] = [];

  constructor(private w: Wrapper) {

    const ws = new Server({
      port: 8086
    });

    // connection es un evento que se dispara cuando se conecta un cliente
    ws.on('connection', (cliente) => {
      console.log('Se ha conectado un cliente'); 
      this.clientes.push(cliente);
      
      // enviar datos al cliente
      cliente.send('Bienvenido al servicio Websocket');
      
      // message es un evento que se dispara cuando el cliente envía datos
      cliente.on('message', (datos) => {
        // cliente.send('Recibido');

        this.clientes.forEach(cliente => cliente.send(datos.toString()))

        console.log(`Datos recibidos: ${datos}`);
      });
      
    });
    
  }
}