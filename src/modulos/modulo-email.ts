import nodemailer from 'nodemailer';
import { Configuracion } from '../modelos/configuracion';

export class ModuloEmail {

    constructor(private conf: Configuracion) {
      // this.conf = conf;
    }
  
    async enviarCorreo(
      correoDestino: string,
      asunto: string,
      texto: string
    ): Promise<boolean> {
  
      try {
        const transporter = nodemailer.createTransport({
          host: this.conf.smtpHost,
          port: this.conf.smtpPuerto,
          secure: true,
          auth: {
            user: this.conf.smtpUsuario,
            pass: this.conf.smtpPassword
          }
        });
      
        const info = await transporter.sendMail({
          from: this.conf.smtpUsuario,
          to: correoDestino,   // email destino
          subject: asunto,
          text: texto
        });
  
        // el correo se ha enviado correctamente
        return true;
      } 
      catch {
        // el correo no se ha enviado correctamente
        return false;
      }
    }
  }