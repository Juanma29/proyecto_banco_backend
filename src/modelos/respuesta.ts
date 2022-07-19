export interface Respuesta {
    ok: boolean;
    msg: string;
    data: any
  }
  
  export function generarRespuestaOK(): Respuesta {
    return{
        ok: true,
        msg: '',
        data: {}
    }
  }

  export function generarRespuestaOKConDatos(data: any): Respuesta {
    return {
        ok: true,
        msg: '',
        data
      }
  }

  export function generarRespuestaError(msg: string): Respuesta {
    return {
      ok: false,
      msg,
      data: {}
    }
  }