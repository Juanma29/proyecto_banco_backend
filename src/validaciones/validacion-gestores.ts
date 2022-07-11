import validator from 'validator';
import { Wrapper } from '../modelos/wrapper';

export async function validarUsuario(
  usuario: string,
  w: Wrapper
): Promise<string> {

  if((usuario.length < 3) || (usuario.length > 14)) {
    return 'La longitud es incorrecta (3-14)';
  }

  // extrae la primera letra del nombre de usuario
  const primeraLetra = usuario.charAt(0);
  
  // convierte la primera letra a número. Si no es número, entonces primeraLetraNum toma el valor de NaN
  const primeraLetraNum = +primeraLetra;
  
  // si primeraLetraNum no es NaN, entonces es un número
  if(!isNaN(primeraLetraNum)) {
    return 'La primera letra del nombre usuario no puede ser un número';
  }

  // si gestorExistente es undefined, entonces ha pasado la validación, pero si existe, entonces mostramos una advertencia y retornamos
  const gestorExistente = await w.bancoArchivos.obtenerGestorPorUsuario(usuario);
  if(gestorExistente) {
    return 'Ya existe un gestor con el mismo nombre de usuario';
  }

  // en esta línea del código sabemos que no se ha producido ningún error de validación
  return null;
}

export async function validarPassword(
  password: string,
  w: Wrapper
): Promise<string> {
  if((password.length < 3) || (password.length > 25)) {
    return 'La longitud es incorrecta (3-25)';
  }

  return null;
}

export async function validarCorreo(
  correo: string,
  w: Wrapper
): Promise<string> {

  if(!validator.isEmail(correo)) {
    return 'No es un email válido';
  }
  
  const gestorExistente2 = await w.bancoArchivos.obtenerGestorPorCorreo(correo);
  if(gestorExistente2) {
    return 'Ya existe un gestor con el mismo correo';
  }

  return null;
}