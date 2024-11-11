const apiBaseURL = "https://restfulcountries.com/api/v1"
const token = "1624|OzS4YRxxlZLmKRYRScDkph0Tf6IZKNH5IQvaakl3"
const currentPage = 0;

async function requestCountries() {
  try {
      const response = await fetch(`${apiBaseURL}/countries?per_page=10&page=${currentPage}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const data = await response.json()
  
    tokenizeAndAppendData(data.data)

    currentPage++

  } catch(error) {
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
    const {name, size, continent, population, href: {self, flag}} = country
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