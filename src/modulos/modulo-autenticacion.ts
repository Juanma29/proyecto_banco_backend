import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import { Wrapper } from '../modelos/wrapper';

export class ModuloAutenticacion {

  private gestorAutenticado: string;
  private gestorToken: string;

  constructor(private w: Wrapper) {}

  async loginGestor(usuario: string, password: string): Promise<boolean> {

    const gestor = await this.w.bancoDatabase.obtenerGestorPorUsuario(usuario);
    
    // si el objeto gestor no existe, se retorna false (la autenticación incorrecta)
    if(!gestor) {
      return false;
    }

    // "$2b$10$pUW5b1MErU07.....
    const passwordHash = gestor.password;

    const ok = bcrypt.compareSync(password, passwordHash);

    // si la autenticación es correcta, guardo el usuario que se está autenticado y genero el token
    if(ok) {
      this.gestorAutenticado = gestor.usuario;

      // el primer parámetro es una variable que está relacionada con el gestor autenticado
      // el segundo parámetro es una clave para obtener un token con mayor seguridad
      this.gestorToken = jsonwebtoken.sign(gestor, 'jdsMTJZUjdsMTJZU%$12S!');

      // autenticación correcta
      return true;
    }

    // autenticación no correcta
    return false;
  }

  logout() {
    this.gestorAutenticado = undefined;
    this.gestorToken = undefined;
  }

  estaGestorAutenticado(): boolean {
    // si this.gestorAutenticado tiene cualquier valor distinto que resuelva a true, entonces el gestor está autenticado y retornamos true y en caso contrario, false
    return (this.gestorAutenticado) ? true : false;
  }

  obtenerTokenGestor(): string {
    return this.gestorToken;
  }

  obtenerUsuarioGestor(): string {
    return this.gestorAutenticado;
  }
}