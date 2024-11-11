const themeSwitch = document.querySelector('[data-js="theme-switcher"]')


function loadThemeFromLocalStorage() {
  if (!("localStorage" in window)) return

  const currentTheme = localStorage.getItem('theme')

  if (currentTheme === 'dark') {
    document.body.classList.add('dark')
  }

  changeButtonText(currentTheme)
}

loadThemeFromLocalStorage()

function changeButtonText(currentTheme) {
  switch (currentTheme) {
    case "dark":
      themeSwitch.children[0].classList.remove("hidden")
      themeSwitch.children[1].classList.add("hidden")
      break;
    case "light":
      themeSwitch.children[0].classList.add("hidden")
      themeSwitch.children[1].classList.remove("hidden")
      break;
  }
}

function toggleTheme() {
  const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light'
  const finalTheme = currentTheme === 'dark' ? 'light' : 'dark'

  changeButtonText(finalTheme)
  
  if (currentTheme === 'dark') {
    document.body.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
  else {
    document.body.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  }
}


themeSwitch.addEventListener('click', toggleTheme)