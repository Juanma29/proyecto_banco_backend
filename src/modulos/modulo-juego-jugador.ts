import axios from 'axios';
import { Wrapper } from '../modelos/wrapper';

interface Anfitrion {
  nombreSala: string;
  direccionIp: string;
}

export class ModuloJuegoJugador {

  constructor(private w: Wrapper) { }

  async iniciar() {

    const anfitriones: Anfitrion[] = []

    // iniciar búsqueda anfitriones
    for(let i=2; i<255; i++) {
      try {        
        const respuesta = await axios.get(
          `http://192.168.0.${i}:9000/anfitrion`, 
        {
          timeout: 5
        });
        const nombreSala = respuesta.data;
        const direccionIp = `192.168.0.${i}`;

        console.log(`Sala ${nombreSala} disponible en la IP ${direccionIp}`);
        anfitriones.push({ nombreSala, direccionIp });
      }
      catch {}
    }

    // solicitar a qué anfitrión conectarse
    let salaAConectar: string;
    let anfitrionEncontrado: Anfitrion;

    do {
      salaAConectar = await this.w.rlp.questionAsync(
        '¿Sala? (salir para volver atrás): ');

      // si el anfitrion no es encontrado, entonces su valor null
      anfitrionEncontrado = anfitriones.find(
        (anfitrion) => anfitrion.nombreSala === salaAConectar);

    } while((salaAConectar !== 'salir') && (!anfitrionEncontrado));


    console.log(`Sala seleccionada ${anfitrionEncontrado.nombreSala} - ${anfitrionEncontrado.direccionIp}`);
    

  }

  async detener() {

  }
}