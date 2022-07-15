import { Wrapper } from "../modelos/wrapper";

export async function mostrarMenuLogin(w: Wrapper) {

  let opcion: string;

  do {
    console.clear();
    console.log("MENÚ LOGIN");
    console.log("-------------");
    console.log("1. Login gestor");
    console.log("2. Login cliente");
    console.log("3. Atrás");

    opcion = await w.rlp.questionAsync("¿Qué opción deseas?\n");

    console.clear();

  // Opción 1 --> Login gestor
  if (opcion === "1") {

    const usuario: string = await w.rlp.questionAsync('Usuario: ');
    const password: string = await w.rlp.questionAsync('Password: ');

    const ok = await w.moduloAutenticacion.loginGestor(usuario, password);
    const msg = (ok) ? 'Autenticación correcta' : 'Autenticación incorrecta';
    console.log(msg);      

    await w.rlp.questionAsync("");
  }

  } while (opcion !== "3");
}
