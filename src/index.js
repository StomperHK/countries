import "./themeSwitcher.js";
import "/index.css";

const loadingObserverEL = document.querySelector('[data-js="loading-observer"]')
let loadingObserver = null

const apiBaseURL = "https://restfulcountries.com/api/v1"
const apiToken = import.meta.env.VITE_API_TOKEN
let currentPage = 0;
let reachedEnd = false;

const countryDialogCloseButton = document.querySelector('[data-js="country-dialog-close"]')


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

    countryCardElement.addEventListener('click', populateAndShowCountryDialog)

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
    console.log(data);
    
    return data

  } catch (error) {
    console.log(error);
  }
}

async function populateAndShowCountryDialog() {
  const dialog = document.querySelector('[data-js="country-dialog"]')
  
  dialog.show()
  console.log(this.dataset.selfUrl);
  
  const {name, size, capital, full_name,  continent, population, independence_date, description, href: { flag }} = await requestCountry(this.dataset.selfUrl)

  const [dialogCountryFlag, dialogCountryName, dialogCountryPopulation, dialogCountrySize, dialogCountryContinent, dialogCountryCapital, independenceDate, dialogCountryDescription] = document.querySelectorAll('[data-js="dialog-country-flag"], [data-js="dialog-country-name"], [data-js="dialog-country-population"], [data-js="dialog-country-size"], [data-js="dialog-country-continent"], [data-js="dialog-country-capital"], [data-js="dialog-country-independence-date"], [data-js="dialog-country-currencies"], [data-js="dialog-country-languages"], [data-js="dialog-country-description"]')

  dialogCountryFlag.src = flag
  dialogCountryFlag.alt = name + " flag"
  dialogCountryName.textContent = name + " (" + full_name + ") "
  dialogCountryPopulation.textContent = population
  dialogCountrySize.textContent = size
  dialogCountryContinent.textContent = continent
  dialogCountryCapital.textContent = capital
  independenceDate.textContent = independence_date
  dialogCountryDescription.textContent = description

}

function closeCountryDialog() {
  const dialog = document.querySelector('[data-js="country-dialog"]')
  dialog.close()
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


countryDialogCloseButton.addEventListener('click', closeCountryDialog)