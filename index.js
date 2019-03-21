let films = [];

const perspectiveOrigin = {
  x: parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--scenePerspectiveOriginX"
    )
  ),
  y: parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--scenePerspectiveOriginY"
    )
  ),
  maxGap: 10
};

document.addEventListener("DOMContentLoaded", function() {
  axios
    .get("https://ghibliapi.herokuapp.com/films")
    .then(function(response) {
      films = response.data;
      appendFilms(films);
      window.addEventListener("scroll", moveCamera);
      window.addEventListener("mousemove", moveCameraAngle);
      setSceneHeight();
    })
    .catch(function(error) {
      console.log(error);
    });
});

function createFilmItem(film) {
  return `<div>
    <h2>${film.title}</h2>
    <p>Year: ${film.release_date}</p>
    <p>Director: ${film.director}</p>
    <p>${film.description}</p>
  </div>`;
}

function appendFilms(films) {
  const filmsEl = document.querySelector(".viewport .scene3D");
  let filmsNodes = [];

  for (film of films) {
    filmsNodes.push(createFilmItem(film));
  }

  filmsEl.innerHTML = filmsNodes.join(" ");
}

function moveCamera() {
  document.documentElement.style.setProperty("--cameraZ", window.pageYOffset);
}

function setSceneHeight() {
  const numberOfItems = films.length;
  const itemZ = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue("--itemZ")
  );
  const scenePerspective = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--scenePerspective"
    )
  );
  const cameraSpeed = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue("--cameraSpeed")
  );

  const height =
    window.innerHeight +
    scenePerspective * cameraSpeed +
    itemZ * cameraSpeed * numberOfItems;

  document.documentElement.style.setProperty("--viewportHeight", height);
}

function moveCameraAngle(event) {
  const xGap =
    (((event.clientX - window.innerWidth / 2) * 100) /
      (window.innerWidth / 2)) *
    -1;
  const yGap =
    (((event.clientY - window.innerHeight / 2) * 100) /
      (window.innerHeight / 2)) *
    -1;
  const newPerspectiveOriginX =
    perspectiveOrigin.x + (xGap * perspectiveOrigin.maxGap) / 100;
  const newPerspectiveOriginY =
    perspectiveOrigin.y + (yGap * perspectiveOrigin.maxGap) / 100;

  document.documentElement.style.setProperty(
    "--scenePerspectiveOriginX",
    newPerspectiveOriginX
  );
  document.documentElement.style.setProperty(
    "--scenePerspectiveOriginY",
    newPerspectiveOriginY
  );
}
