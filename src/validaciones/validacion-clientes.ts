import validator from 'validator';
import { Wrapper } from '../modelos/wrapper';
import { Cliente } from '../modelos/cliente';


export async function validarCliente(cliente: Cliente, w: Wrapper) {

    if(!validator.isEmail(cliente.correo)) {
        return 'No es un correo válido'
      }
    
      return null;
}