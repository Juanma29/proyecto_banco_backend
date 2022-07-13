import validator from 'validator';
import { Configuracion } from '../modelos/configuracion';
export function validarConfiguracion (conf: Configuracion):string{


    if(!validator.isIP(conf.databaseHost)) {
        return 'El host de la base de datos no tiene un formato correcto';
    }

/*
    conf.archivosHabilitado = false  conf.databaseHabilitado = false --> ERROR
    conf.archivosHabilitado = false  conf.databaseHabilitado = true --> OK
    conf.archivosHabilitado = true  conf.databaseHabilitado = false --> OK
    conf.archivosHabilitado = true  conf.databaseHabilitado = true --> ERROR
*/

 // conf.archivosHabilitado = false  conf.databaseHabilitado = false 
 if((!conf.archivosHabilitado) && (!conf.databaseHabilitado)) {
    return 'Ningún sistema de almacenamiento seleccionado';
   }
  
   // conf.archivosHabilitado = true  conf.databaseHabilitado = true
   if((conf.archivosHabilitado) && (conf.databaseHabilitado)) {
    return 'Dos sistemas de almacenamiento no permitido';
   }

   // el archivo de configuración ha pasado toda la validación (todo OK)
    return null;
}