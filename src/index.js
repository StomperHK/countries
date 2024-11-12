import "./themeSwitcher.js";
import "/index.css";

const loadingObserverEL = document.querySelector('[data-js="loading-observer"]')
let loadingObserver = null

const apiBaseURL = "https://restfulcountries.com/api/v1"
const apiToken = import.meta.env.VITE_API_TOKEN
let currentPage = 17;
let reachedEnd = false;


async function requestCountries() {
  try {
    if (reachedEnd) return

    const response = await fetch(`${apiBaseURL}/countries?per_page=10&page=${currentPage}`, {
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
      deleteLoadingObserer()

      return
    }

    tokenizeAndAppendData(data)

    if (!loadingObserver) createLoadingObserver()

    currentPage++

  } catch (error) {
    console.log(error);
  }
}

// requestCountries()

function tokenizeAndAppendData(data) {
  const countries = data
  const countriesList = document.querySelector('[data-js="countries-list"]')
  const fragment = document.createDocumentFragment()
  const cardTemplate = document.querySelector('[data-js="card-template"]')

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

    fragment.appendChild(countryCardElement)
  })

  countriesList.appendChild(fragment)
}

function createLoadingObserver() {
  loadingObserverEL.classList.remove("hidden")

  loadingObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      requestCountries()
    }
  })

  loadingObserver.observe(loadingObserverEL)
}

function deleteLoadingObserer() {
  loadingObserverEL.textContent = "you reached the end :O"

  loadingObserver.unobserve(loadingObserverEL)
}