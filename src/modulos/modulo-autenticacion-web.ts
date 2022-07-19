import { Wrapper } from '../modelos/wrapper';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import express from 'express';

export class ModuloAutenticacionWeb {

  private w: Wrapper;


  /*
    {
      "gestor1": "node012fxec1s005vf1e5uciv3khme30",
      "gestor2": "node012fxec1s005vf1e5u"
    }
  */
  private gestoresAutenticados = {};

  constructor(w: Wrapper) {
     this.w = w; 
  }

  async loginGestor(usuario: string, password: string): Promise<string> {

    const gestor = await this.w.bancoDatabase.obtenerGestorPorUsuario(usuario);
    
    // si el objeto gestor no existe, se retorna false (la autenticación incorrecta)
    if(!gestor) {
      return null;
    }

    // "$2b$10$pUW5b1MErU07.....
    const passwordHash = gestor.password;

    const ok = bcrypt.compareSync(password, passwordHash);

    // si la autenticación es correcta, guardo el usuario que se está autenticado y genero el token
    if(ok) {
      const token = jsonwebtoken.sign(gestor, 'jdsMTJZUjdsMTJZU%$12S!');

      this.gestoresAutenticados[gestor.usuario] = token;

      console.log(this.gestoresAutenticados);
      
      // autenticación correcta
      return token;
    }

    // autenticación no correcta
    return null;
  }

  logout(usuario: string) {
    delete(this.gestoresAutenticados[usuario])
  }

  autorizacionGestor(req: express.Request): boolean {

    // Basic 2nd9s78gfusdfhgluisg
    const authorization = req.header('Authorization');;

    // ['Basic', '2nd9s78gfusdfhgluisg']
    const campos = authorization.split(' ')
    if(campos.length !== 2) {
      return false;
    }

    const token = campos[1];

    /*
    {
      "gestor1": "node012fxec1s005vf1e5uciv3khme30",
      "gestor2": "node012fxec1s005vf1e5u"
    }
    */
    // console.log(this.gestoresAutenticados);
    
    // ["node012fxec1s005vf1e5uciv3khme30", "node012fxec1s005vf1e5u"]
    const tokensGuardados = Object.values(this.gestoresAutenticados);

    // si el token enviado en la cabecera lo tengo guardado, entonces el gestor tiene privilegios para realizar la petición
    if(tokensGuardados.includes(token)) {
      return true;
    }

    // el token enviado no lo tenemos almacenado y, por tanto, el gestor no tiene privilegios
    return false;
  }
}  