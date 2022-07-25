import axios from 'axios';
import { Respuesta } from './../modelos/respuesta';
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
          timeout: 10
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

    console.log('\n-----')
    do {
      salaAConectar = await this.w.rlp.questionAsync(
        '¿Sala? (salir para volver atrás): ');

      // si el anfitrion no es encontrado, entonces su valor null
      anfitrionEncontrado = anfitriones.find(
        (anfitrion) => anfitrion.nombreSala === salaAConectar);

    } while((salaAConectar !== 'salir') && (!anfitrionEncontrado));

    if(salaAConectar === 'salir') {
      return;
    }

    console.log(`Sala seleccionada ${anfitrionEncontrado.nombreSala} - ${anfitrionEncontrado.direccionIp}`); 
    console.log('\n-----')

    // solicita el nombre del usuario
    const nombreJugador: string = await this.w.rlp.questionAsync('Introduzca nombre de jugador: ');

    if((nombreJugador.length === 0) || (nombreJugador.length > 10)) {
      console.log('El nombre del jugador tiene que estar comprendido entre 1 y 10 caracteres');
      return;
    }

    // conectar al anfitrión
    const ip = anfitrionEncontrado.direccionIp;
    const puerto = this.w.conf.juegoPuertoExpress;
    const respuesta = await axios.get(`http://${ip}:${puerto}/entrar/${nombreJugador}`);
    const datos: Respuesta = respuesta.data;

    // conexión correcta con el anfitrión
    if(!datos.ok) {
      console.log(datos.msg);
      return;
    }
    
    console.log('Conexión correcta con el anfitrión. Esperando inicio del juego...');

    let peliculasOculto = ''
    setInterval(async () => {

      try {
        const respuesta = await axios.get(`http://${ip}:${puerto}/pelicula`, {
          timeout: 100
        })
        peliculasOculto = respuesta.data;
        console.log(peliculasOculto);
      } catch {}
    }, 3000)

  }

  async detener() {

  }
}