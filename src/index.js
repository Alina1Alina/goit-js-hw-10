import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};

refs.input.addEventListener(
  'input',
  debounce(generationCountry, DEBOUNCE_DELAY)
);

function renderingCountry(arrayCountry) {
  if (arrayCountry.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }
  if (arrayCountry.length > 1 || arrayCountry.length <= 10) {
    let result = arrayCountry.map(
      item =>
        `<li class="country-item"><img src=${item.flags.svg} alt="${item.flags.alt}"/><p class="country_name">${item.name.official}</p></li>`
    );
    refs.list.innerHTML = result;
  }
  if (arrayCountry.length === 1) {
    refs.list.innerHTML = '';
    let infoCountry = arrayCountry.map(item => {
      let arr = Object.values(item.languages);
      let stringLanguages = arr;
      return `<div class="container-info"><div class="container-title"><img class="title-svg" src=${item.flags.svg} alt="${item.flags.alt}"/><h1 class="title">${item.name.official}</h1></div><ul class="country-list"><li class="country-info-item"><b>Capital:</b><p class="text">${item.capital}</p></li><li class="country-info-item"><b>Population:</b><p class="text">${item.population}</p></li><li class="country-info-item"><b>languages:</b><p class="text">${stringLanguages}</p></ul></div>`;
    });
    refs.info.innerHTML = infoCountry;
  }
  if (arrayCountry.length !== 1) {
    refs.info.innerHTML = '';
  }
}

function generationCountry(e) {
  let countryName = e.target.value;
  let countryNameFixed = countryName.toLowerCase().trim();
  if (!countryNameFixed) {
    refs.list.innerHTML = '';
    refs.info.innerHTML = '';
    return;
  }
  fetchCountries(countryNameFixed)
    .then(renderingCountry)
    .catch(error => Notiflix.Notify.failure(error.message));
}

