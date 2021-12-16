let pagina = 1;
const btnAnterior = document.getElementById('btnAnterior');
const btnSiguiente = document.getElementById('btnSiguiente');

btnSiguiente.addEventListener('click', () => {
  if (pagina < 1000) {
    pagina += 1;
    cargarPeliculas();
  }
});

btnAnterior.addEventListener('click', () => {
  if (pagina > 1) {
    pagina -= 1;
    cargarPeliculas();
  }
});

const cargarPeliculas = async () => {
  try {
    const respuesta = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=23668f2caf6a3f8ff3a4aa1643b9ecab&language=es-MX&page=${pagina}`);
    // Si la respuesta es correcta
    if (respuesta.status === 200) {
      const datos = await respuesta.json();

      let peliculas = '';
      datos.results.forEach(pelicula => {
        peliculas += `
					<div class="pelicula">
						<img class="poster" data-idpelicula= ${pelicula.id} src="https://image.tmdb.org/t/p/w500/${pelicula.poster_path}">
						<h3 class="titulo">${pelicula.title}</h3>
					</div>
				`;
      });

      document.getElementById('contenedor').innerHTML = peliculas;

    } else if (respuesta.status === 401) {
      console.log('Pusiste la llave mal');
    } else if (respuesta.status === 404) {
      console.log('La pelicula que buscas no existe');
    } else {
      console.log('Hubo un error y no sabemos que paso');
    }

  } catch (error) {
    console.log(error);
  }

}

const cargarPelicula = async (idPelicula) => {
  try {
    const bodyModal = document.getElementById('peliculaBodyModal');
    const tituloModal = document.getElementById('tituloModal');
    bodyModal.innerHTML = '';
    tituloModal.innerHTML = '';
    const respuesta = await fetch(`https://api.themoviedb.org/3/movie/${idPelicula}?api_key=23668f2caf6a3f8ff3a4aa1643b9ecab&language=es-MX`)
    if (respuesta.status === 200) {
      const datos = await respuesta.json();

      const { title, vote_average, poster_path, homepage, overview, release_date, genres, spoken_languages, production_companies } = datos;

      tituloModal.textContent = title
      let generos = '', lenguajes = '', productoras = '';

      genres.forEach((genero) => { generos += `<span class="badge rounded-pill bg-danger me-2">${genero.name}</span>` })
      spoken_languages.forEach((lenguaje) => { lenguajes += `<span class="badge rounded-pill bg-secondary me-2">${lenguaje.name}</span>` })
      production_companies.forEach((productora) => {
        productoras += `<img src="${productora.logo_path !== null ? `https://image.tmdb.org/t/p/w500/${productora.logo_path}` : "./default-placeholder.png"} " alt="${productora.name}" class="img-fluid p-2 bd-highlight">`
      })

      let pelicula = `<div class="datos-pelicula">
						<div class="poster-pelicula">
							<img src="https://image.tmdb.org/t/p/w500/${poster_path}" class="poster-modal img-thumbnail" alt="${title}">
							<div class="badge-overage">${vote_average}</div>
						</div>
						<h3 class="titulo"><a href="${homepage}" target="_blank" rel="noopener noreferrer">${title}</a></h3>

						<h4 class="mt-4"><strong>Información general</strong></h4>
						<hr class="hr-1">
						<p class="text-start">${overview}</p>

						<h4><strong>Fecha de lanzamiento</strong></h4>
						<hr class="hr-1">
						<p class="text-start"><i class="bi bi-calendar-check me-2"></i> ${release_date}</p>

						<h4><strong>Generos</strong></h4>
						<hr class="hr-1">
						<div class="row mb-3">
							<div class="col">
								${generos}
							</div>
						</div>

						<h4><strong>Lenguajes</strong></h4>
						<hr class="hr-1">
						<div class="row mb-3">
							<div class="col">
								${lenguajes}
							</div>
						</div>
						<h4><strong>Productoras</strong></h4>
						<hr class="hr-1">
						<div class="d-flex flex-row bd-highlight mb-3 productoras">
							${productoras}
						</div>
					</div>`;
      bodyModal.innerHTML = pelicula;
    }
  } catch (error) {
    console.log(error)
  }
}
const mostrarPelicula = () => {
  const contenedor = document.getElementById('contenedor');
  contenedor.addEventListener('click', (e) => {
    if (e.target && e.target.tagName == 'IMG') {
      const myModal = new bootstrap.Modal(document.getElementById('datosPeliculaModal'))
      cargarPelicula(e.target.dataset.idpelicula).then(myModal.show())

    }
  })
}

cargarPeliculas().then(mostrarPelicula);


