import "./themeSwitcher.js";
import {setCountryModalState, populateAndShowCountryDialog} from "./countryModal.js";
import "/index.css";

const loadingObserverEL = document.querySelector('[data-js="loading-observer"]')
let loadingObserver = null

const apiBaseURL = "https://restfulcountries.com/api/v1"
const apiToken = import.meta.env.VITE_API_TOKEN
let currentPage = 0;
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
    setCountryModalState("error")
  }
}

requestCountries()

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

    countryCardElement.addEventListener('click', () => populateAndShowCountryDialog((self), requestCountry))

    fragment.appendChild(countryCardElement)
  })

  countriesList.appendChild(fragment)
}

/*tokenizeAndAppendData([{
  "name": "Switzerland",
  "full_name": "Swiss Confederation",
  "capital": "Berne",
  "iso2": "CH",
  "iso3": "CHE",
  "covid19": {
    "total_case": "317,017",
    "total_deaths": "4,236",
    "last_updated": "2020-12-01T08:35:33.000000Z"
  },
  "current_president": null,
  "currency": "CHF",
  "phone_code": "41",
  "continent": "Europe",
  "description": null,
  "size": "41,285 km²",
  "independence_date": null,
  "population": "8,681,478",
  "href": {
    "self": "https://restfulcountries.com/api/v1/countries/Switzerland",
    "states": "https://restfulcountries.com/api/v1/countries/Switzerland/states",
    "presidents": "https://restfulcountries.com/api/v1/countries/Switzerland/presidents",
    "flag": "https://restfulcountries.com/assets/images/flags/Switzerland.png"
  }
}, {
  "name": "Switzerland",
  "full_name": "Swiss Confederation",
  "capital": "Berne",
  "iso2": "CH",
  "iso3": "CHE",
  "covid19": {
    "total_case": "317,017",
    "total_deaths": "4,236",
    "last_updated": "2020-12-01T08:35:33.000000Z"
  },
  "current_president": null,
  "currency": "CHF",
  "phone_code": "41",
  "continent": "Europe",
  "description": null,
  "size": "41,285 km²",
  "independence_date": null,
  "population": "8,681,478",
  "href": {
    "self": "https://restfulcountries.com/api/v1/countries/Switzerland",
    "states": "https://restfulcountries.com/api/v1/countries/Switzerland/states",
    "presidents": "https://restfulcountries.com/api/v1/countries/Switzerland/presidents",
    "flag": "https://restfulcountries.com/assets/images/flags/Switzerland.png"
  }
}])*/

async function requestCountry(countrySelfUrl) {
  try {
    const response = await fetch(countrySelfUrl, {
      headers: {
        Authorization: `Bearer ${apiToken}`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }

    const data = (await response.json()).data
    
    return data

  } catch (error) {
    console.log(error);
  }
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
