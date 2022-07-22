import Telegram from 'node-telegram-bot-api';
import { Wrapper } from '../modelos/wrapper';


export class ModuloTelegram {

  private bot: Telegram;

  constructor(private w: Wrapper) {

    // inicializar la conexión con telegram
    // el token de telegram lo proporciona el botFather
    this.bot = new Telegram(w.conf.telegramToken, {
      polling: false
    });
    
    // recibo mensajes (para que funcione correctamente solamente debería conectarse una aplicación)
    // bot.on('message', (msg) => {
      //   console.log(msg);
      // })
    }
    
  enviarMensaje(mensaje: string) {
    this.bot.sendMessage(this.w.conf.telegramId, mensaje);
  }
}