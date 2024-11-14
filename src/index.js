import "./themeSwitcher.js";
import {setCountryModalState, populateAndShowCountryDialog} from "./countryModal.js";
import "/index.css";

const searchBar = document.querySelector('[data-js="search-bar"]')
const searchBarClearButton = document.querySelector('[data-js="search-bar-clear"]')

const loadingObserverEL = document.querySelector('[data-js="loading-observer"]')
let loadingObserver = null

const apiBaseURL = "https://restfulcountries.com/api/v1/countries"
const apiToken = import.meta.env.VITE_API_TOKEN
let currentPage = 0;
let reachedEnd = false;


function setCountryListState(state) {
  hideAllListContainers()

  switch (state) {
    case "visible":
      document.querySelector('[data-js="countries-list-content"]').classList.remove('opacity-0')
      break;
      
    case "loading":
      document.querySelector('[data-js="main-spinner"]').classList.remove('opacity-0');
      break;
    case "error":
      document.querySelector('[data-js="countries-list-error"]').classList.remove('hidden')
      break;
    case "empty":
      document.querySelector('[data-js="countries-list-empty"]').classList.remove('hidden')
      break;
    default:
      throw new Error(`Unknown state: ${state}`)
  }
}

function hideAllListContainers() {
  [...document.querySelectorAll('[data-js="countries-list-wrapper"] > div')].slice(1).forEach(container => container.classList.add("hidden"))

  document.querySelector('[data-js="countries-list-content"]').classList.add('opacity-0')
  document.querySelector('[data-js="main-spinner"]').classList.add("opacity-0")
}

async function requestCountries(isInfiniteScrollFetching = false) {
  setCountryListState("loading")
  if (isInfiniteScrollFetching) document.querySelector('[data-js="countries-list-content"]').classList.remove('opacity-0')

  try {
    if (reachedEnd) return

    const response = await fetch(`${apiBaseURL}?per_page=10&page=${currentPage}`, {
      headers: {
        Authorization: `Bearer ${apiToken}`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }

    const data = (await response.json()).data
    
    if (!data) {
      reachedEnd = true
      deleteLoadingObserver()

      return
    }

    tokenizeAndAppendData(data)

    if (!loadingObserver) createLoadingObserver()

    currentPage++

  } catch (error) {
    setCountryModalState("error")
  }
}

requestCountries()

function tokenizeAndAppendData(data, clearData = false) {
  let countries = data
  const countriesList = document.querySelector('[data-js="countries-list-content"]')
  const fragment = document.createDocumentFragment()
  const cardTemplate = document.querySelector('[data-js="card-template"]')

  if (clearData) {
    countriesList.innerHTML === ""
  }

  setCountryListState("visible")

  if (!Array.isArray(countries)) countries = [countries]

  countries.forEach(country => {
    const { name, size, continent, population, href: { self, flag } } = country
    const countryCardElement = cardTemplate.content.cloneNode(true).firstElementChild

    const [countryFlag, countryName, countryPopulation, countryContinent, countrySize] =
      countryCardElement.querySelectorAll('[data-js="country-flag"], [data-js="country-name"], [data-js="country-population"], [data-js="country-continent"], [data-js="country-size"]');

    countryName.textContent = name
    countryPopulation.textContent = population
    countryContinent.textContent = continent
    countrySize.textContent = size
    countryFlag.src = flag
    countryFlag.alt = name + " flag"
    countryCardElement.dataset.selfUrl = self

    countryCardElement.addEventListener('click', () => populateAndShowCountryDialog((self), requestCountry))

    fragment.appendChild(countryCardElement)
  })

  countriesList.appendChild(fragment)
}

function debounceRequestCountry() {
  let timer

  return function () {
    const searchBarValue = searchBar.value
    
    checkSearchBarValue(searchBarValue)
    clearTimeout(timer)
    setCountryListState("loading")

    timer = setTimeout(() => {
      if (searchBarValue === "") {    // if the search bar is empty, dont request the countries
        clearSeachBarAndRequestCountries()
        return
      }

      const countriesList = document.querySelector('[data-js="countries-list-content"]')
      countriesList.innerHTML = ""

      requestCountry(apiBaseURL + "/" + searchBarValue.trim(), "search-bar").then(data => data !== 404 ? tokenizeAndAppendData(data, true) : setCountryListState("empty"))
      deleteLoadingObserver()
    }, 1000)
  }
}

function checkSearchBarValue(searchBarValue) {
  if (!searchBarValue) searchBarClearButton.classList.add("invisible")
  else searchBarClearButton.classList.remove("invisible")
}

function clearSeachBarAndRequestCountries() {
  const countriesList = document.querySelector('[data-js="countries-list-content"]')
  countriesList.innerHTML = ""
  searchBar.value = ""
  currentPage = 0
  reachedEnd = false

  searchBarClearButton.classList.add("invisible")

  requestCountries()
}

async function requestCountry(countrySelfUrl, componentThatMadeTheRequest) {
  if (componentThatMadeTheRequest === "search-bar") setCountryListState("loading")
  else setCountryModalState("loading")

  try {
    const response = await fetch(countrySelfUrl, {
      headers: {
        Authorization: `Bearer ${apiToken}`
      }
    })

    if (!response.ok) {
      throw new Error(response.status)
    }

    setCountryListState("visible")

    const data = (await response.json()).data
    
    return data

  } catch (errorCode) {
    if (errorCode.message == 404) return 404

    if (componentThatMadeTheRequest === "search-bar") setCountryListState("error")
    else setCountryModalState("error")
  }
}

function createLoadingObserver() {
  loadingObserverEL.classList.remove("hidden")

  loadingObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      requestCountries(true)
    }
  })

  loadingObserver.observe(loadingObserverEL)
}

function deleteLoadingObserver() {
  loadingObserver.unobserve(loadingObserverEL)
  loadingObserver = null

  loadingObserverEL.classList.add("hidden")
}


searchBar.addEventListener('input', debounceRequestCountry())

searchBarClearButton.addEventListener('click', clearSeachBarAndRequestCountries)
