const countryDialogCloseButton = document.querySelector('[data-js="country-dialog-close"]')

export function setCountryModalState(state) {
  hideAllDialogContainers()

  switch (state) {
    case 'success':
      document.querySelector('[data-js="dialog-country-content"]').classList.remove('opacity-0');
      break;
    case 'loading':
      document.querySelector('[data-js="dialog-country-spinner"]').classList.remove('opacity-0');
      break;
    case 'error':
      document.querySelector('[data-js="dialog-country-error"]').classList.remove('opacity-0');
      break;
  }
  
}

function hideAllDialogContainers() {
  Array.from(document.querySelectorAll('[data-js="dialog-country"] > div'), container => container.classList.add("opacity-0"))
}

export async function populateAndShowCountryDialog(selfUrl, requestCountry) {
  const dialog = document.querySelector('[data-js="dialog-country"]')
  
  dialog.show()
  countryDialogCloseButton.focus()
  setCountryModalState('loading')
  
  const {name, size, capital, full_name, currency, continent, population, href: { flag }} = await requestCountry(selfUrl)

  const [dialogCountryFlag, dialogCountryName, dialogCountryPopulation, dialogCountrySize, dialogCountryContinent, dialogCountryCapital, dialogCountryCurrency] = document.querySelectorAll('[data-js="dialog-country-flag"], [data-js="dialog-country-name"], [data-js="dialog-country-population"], [data-js="dialog-country-size"], [data-js="dialog-country-continent"], [data-js="dialog-country-capital"], [data-js="dialog-country-currency"]')

  setCountryModalState("success")

  dialogCountryFlag.src = flag
  dialogCountryFlag.alt = name + " flag"
  dialogCountryName.textContent = name + " (" + full_name + ") "
  dialogCountryPopulation.textContent = population
  dialogCountrySize.textContent = size
  dialogCountryContinent.textContent = continent
  dialogCountryCapital.textContent = capital
  dialogCountryCurrency.textContent = currency
}

function closeCountryDialog() {
  const dialog = document.querySelector('[data-js="dialog-country"]')
  setCountryModalState("loading")
  dialog.close()
}

countryDialogCloseButton.addEventListener('click', closeCountryDialog)