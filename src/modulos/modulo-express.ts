import express from 'express';
import path from 'path';
import { Gestor } from '../modelos/gestor';
import { generarRespuestaError, generarRespuestaOKConDatos, generarRespuestaOK } from '../modelos/respuesta';
import { Wrapper } from '../modelos/wrapper';

export class ModuloExpress {

  app: express.Application;

  constructor(private w: Wrapper) {
    this.app = express();

    const rutaAngular = path.join(require.main.path, '..', 'public');

    // middlewares
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static(rutaAngular));
    
    // definición de rutas
    this.inicializar();

    // comenzar a escuchar peticiones
    this.app.listen(w.conf.expressPuerto);
  }

  // este método inicializa las rutas
  inicializar() {

    // http://localhost:8085/ok (GET)
    this.app.get('/ok', (req, res) => res.send('ok'));

    // http://localhost:8085/login/gestor (POST)
    this.app.post('/login/gestor', async (req, res) => {
      // console.log(req.body);      

      const usuario = req.body.usuario;
      const password = req.body.password;

      const token = await this.w.moduloAutenticacionWeb.loginGestor(
        usuario, 
        password);

      // autenticación correcta (el token no es null)
      if(token) {
        const respuesta = generarRespuestaOKConDatos({
          token
        });
        res.json(respuesta);
        return;
      };

      // autenticación no es correcta (el token es null)
      const respuesta = generarRespuestaError('Autenticación incorrecta');
      res.json(respuesta);
    });

    // http://localhost:8085/gestores (GET) (obtener todos los gestores)
    this.app.get('/gestores', async (req, res) => {

      // si no tengo autorización, devuelve un objeto JSON de tipo de respuesta con un mensaje de error
      // if(!this.w.moduloAutenticacionWeb.autorizacionGestor(req)) {
      //   const respuesta = generarRespuestaError('Privilegios insuficientes');
      //   res.json(respuesta);
      //   return;
      // }

      // el código de abajo solamente se ejecuta si el gestor tiene autorización (si el token enviado en la cabecera es correcto)

      const gestores = await this.w.bancoDatabase.obtenerGestores();
      
      const gestoresDevueltos = gestores.map(gestor => {
        delete(gestor.password)
        return gestor;
      });

      const respuesta = generarRespuestaOKConDatos(gestoresDevueltos);
      res.json(respuesta);
    
    });

    // http://localhost:8085/gestores (POST) (agregar un gestor)
    this.app.post('/gestores', async (req, res) => {

      const gestor: Gestor = req.body;
      console.log(gestor);

      await this.w.bancoDatabase.insertarGestor(gestor);
      
      res.json(generarRespuestaOK())
    })

    this.app.delete('/gestores/:id', async(req, res) => {

      const id = +req.params.id;
      await this.w.bancoDatabase.eliminarGestorPorId(id);
      res.json(generarRespuestaOK())
    })


    // manejador para los errores (obligatoriamente recibe cuatro parámetros: err, req, res, next)
    this.app.use(async (err: Error, req, res, next) => {
      console.log(err);

      // aviso por correo electrónico
      // await this.w.moduloEmail.enviarCorreo(
      //   'cursosatb@gmail.com',
      //   'Error en la aplicación del banco',
      //   err.name + err.stack);

      res.status(500).json(generarRespuestaError('Error interno del servidor'))
    });

    // manejador para ruta no encontrada (siempre al final)
    this.app.all('*', (req, res) => {
      // res.json(generarRespuestaError('Ruta no encontrada'));
      res.redirect('/');
    })

  }

}