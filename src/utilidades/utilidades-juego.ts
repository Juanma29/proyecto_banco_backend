// esta función recibe como parámetro el nombre de una película y devuelve la película con todas las letras convertidas a asteriscos
export function retornarPeliculaAsteriscos(tituloPelicula): string {
    let tituloPeliculaOculto = '';
    for(let i=0; i<tituloPelicula.length; i++) {
      const letra = tituloPelicula[i];
      if (letra === ' ') {
        tituloPeliculaOculto += ' '
      } else { // si la letra no es un espacio en blanco
        tituloPeliculaOculto += '*'
      }
    }
    return tituloPeliculaOculto;
  }
  
  // esta función recibe como parámetro el título de la película y el título de la película con asteriscos y retorna el título de la película con un asterisco y una letra más
  export function retornarPeliculaOculta(tituloPelicula: string, tituloPeliculaOculto) {
  
    const tituloPeliculaArray = tituloPelicula.split('');
    const tituloPeliculaOcultoArray = tituloPeliculaOculto.split('');
    let posicionesAsterisco = [];
    for(let i=0; i<tituloPeliculaOculto.length; i++) {
      const letra = tituloPeliculaOculto[i];
      if (letra === '*') {
        posicionesAsterisco.push(i)
      }
    }
  
    const lon = posicionesAsterisco.length;
    const posicionAleatoria = posicionesAsterisco[Math.round(Math.random() * lon)]
    const letraPelicula = tituloPeliculaArray[posicionAleatoria];
    tituloPeliculaOcultoArray[posicionAleatoria] = letraPelicula
    posicionesAsterisco = posicionesAsterisco.filter(posicion => posicion !== posicionAleatoria);
    return tituloPeliculaOcultoArray.join('')
  }