import express from 'express';
export interface Configuracion {
  archivosUbicacion: string;
  archivosHabilitado: boolean;

  databaseHabilitado: boolean,
  databaseHost: string,
  databasePuerto: number,
  databaseNombre: string,

  smtpHost: string,
  smtpPuerto: number,
  smtpUsuario: string,
  smtpPassword: string,
  
  autenticacionHabilitado: boolean,

  expressPuerto: number,

  peliculasApiKey: string,

  telegramToken: string,
  telegramId: string,

  juegoPuertoExpress: number,
  juegoPuertoWebsocket: number
}