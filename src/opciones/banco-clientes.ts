import { Wrapper } from '../modelos/wrapper';


export class BancoClientes {

  // atributos
  private w: Wrapper;

  constructor(w: Wrapper) {
    this.w = w;
  }

  async insertarCliente() {

    const id_gestor = +(await this.w.rlp.questionAsync('Id del gestor: '));

    const usuario = await this.w.rlp.questionAsync('Usuario: ');
  }

}