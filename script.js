const api_url = "https://api.themoviedb.org/3";
const api_key = "";
const imgPath = "https://image.tmdb.org/t/p/original";

const apiFetch = {
  fetchAllCategories: `${api_url}/genre/movie/list?api_key=${api_key}`,
  fetchMoviesByCategory: (id) =>
    `${api_url}/discover/movie?api_key=${api_key}&with_genres=${id}`,
  fetchTrending: `${api_url}/trending/all/day?api_key=${api_key}`,
};

function init() {
  fetchTrendingList(), fetchAndBuildCategories();
}

function fetchTrendingList() {
  fetchAndGetCategory(apiFetch.fetchTrending, "Trending Now");
  fetch(apiFetch.fetchTrending)
    .then((res) => res.json())
    .then((res) => {
      trendingList = res.results;
      if (Array.isArray(trendingList) && trendingList.length > 0) {
        bannerSection(trendingList);
      }
    })
    .catch((err) => console.log(err));
}

function bannerSection(list) {
  // console.log(list);
  const randomMovie = Math.floor(Math.random() * list.length);
  const currentMovie = list[randomMovie]
  const banner = document.getElementById("banner");
  const imgUrl = imgPath + currentMovie.backdrop_path;
  banner.style.backgroundImage = `url(${imgUrl})`;
  banner.innerHTML = `
  <div class="main_cont">
      <div class="banner_container">
        <h2 class="banner_title">${currentMovie.title ? currentMovie.title : currentMovie.name}</h2>
         <p class="banner_desc">${currentMovie.overview ? currentMovie.overview : "Description is not available"}</p>
    <div class="banner_btns">
      <button>Play</button>
      <button>More Info</button>
    </div>
  </div>
</div>
`;
}

function fetchAndBuildCategories() {
  fetch(apiFetch.fetchAllCategories)
    .then((res) => res.json())
    .then((res) => {
      const catergories = res.genres;
      if (Array.isArray(catergories) && catergories.length > 0)
        catergories.forEach((category) => {
          fetchAndGetCategory(
            apiFetch.fetchMoviesByCategory(category.id),
            category.name
          );
        });
    })
    .catch((err) => console.log(err));
}

function fetchAndGetCategory(fetchurl, categoryName) {
  // console.log(fetchurl, categoryName);
  fetch(fetchurl)
    .then((res) => res.json())
    .then((res) => {
      const movies = res.results;
      if (Array.isArray(movies) && movies.length > 0) {
        buildMovieRow(movies, categoryName);
      }
      return movies;
    })
    .catch((err) => console.log(err));
}

function buildMovieRow(list, categoryName) {
  const movieContainer = document.getElementById("movies_cont");

  const movieImgHtml = list
    .map((movie) => {
      // console.log(movie, categoryName)
      return `<img class="movie_img" src=${imgPath}${movie.poster_path} alt=${movie.title}>`;
    })
    .join(" ");

  // console.log(movieImgHtml);

  const movieRowSectionHtml = `
        <h3 class="movie_section_heading">${categoryName}<span class="spanTag">Explore all</span></h3>
        <div class="movies_row">
            ${movieImgHtml}
        </div>
    `;

  const rowSection = document.createElement("div");
  rowSection.className = "movies_section";
  rowSection.innerHTML = movieRowSectionHtml;
  movieContainer.append(rowSection);
}

window.addEventListener("load", function () {
  init();
});
