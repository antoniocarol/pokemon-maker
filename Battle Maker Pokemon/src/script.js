let selectionContainer1 = document.querySelector(".p1");
let selectionContainer2 = document.querySelector(".p2");

let pokemonInfo = document.querySelectorAll(".pokemonInfo");
let pokemonImage = document.querySelectorAll(".pokemonImage");
let pokemonName = document.querySelectorAll(".pokemonName");
let pokemonInput = document.querySelectorAll(".pokemonInput");

let startButton = document.querySelector(".startButton");
let confirmButton = document.querySelector(".confirmButton");

let contentCalendar = document.querySelector(".calendarContainer");
let daysCalendar = document.querySelectorAll("#days td");
let monthCalendar = document.querySelector("#month");
let yearCalendar = document.querySelector("#year");

let pokemonPlayer1 = "";
let pokemonPlayer2 = "";
let dayCalendarSelected = "";
let monthCalendarSelected = null;
let yearCalendarSelected = null;

const monthsBR = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];
const tableDays = document.querySelector("#days");
const nextButton = document.querySelector("#nextButtonID");
const previousButton = document.querySelector("#previousButtonID");

let leftArrow = document.querySelectorAll(".leftArrow");
let rightArrow = document.querySelectorAll(".rightArrow");

let page = 0;
let offsetQuery = 0;
let counter = 0;
let backgroundDayCalendarSelected = false;

// SECÇAO DE REQUERIMENTO DA API
function getPokemon(next) {
  if (!next) {
    let url = `https://pokeapi.co/api/v2/pokemon/`;
    axios
      .get(url)
      .then((response) => {
        pokename = response.data.results[page].name;
        axios
          .get(`https://pokeapi.co/api/v2/pokemon/${pokename}`)
          .then((response2) => {
            imgSrc = response2.data.sprites.front_default;
            for (let i = 0; i < 2; i++) {
              pokemonImage[i].src = imgSrc;
              pokemonName[i].textContent = pokename;
              if (counter === 0) {
                pokemonPlayer1 = pokename;
              } else {
                pokemonPlayer2 = pokename;
              }
            }
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  } else {
    let url = `https://pokeapi.co/api/v2/pokemon/?offset=${offsetQuery}&limit=20`;
    axios
      .get(url)
      .then((response) => {
        pokename = response.data.results[page].name;
        axios
          .get(`https://pokeapi.co/api/v2/pokemon/${pokename}`)
          .then((response2) => {
            imgSrc = response2.data.sprites.front_default;
            for (let i = 0; i < 2; i++) {
              pokemonImage[i].src = imgSrc;
              pokemonName[i].textContent = pokename;
              if (counter === 0) {
                pokemonPlayer1 = pokename;
              } else {
                pokemonPlayer2 = pokename;
              }
            }
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  }
}

// BUTOES LATERAIS QUE FUNCIONAM JUNTAMENTE A API
for (let i = 0; i < 2; i++) {
  leftArrow[i].addEventListener("click", () => {
    if (page === 0 && offsetQuery === 0) {
      return;
    }
    if (offsetQuery >= 20 && page != 0) {
      getPokemon("next");
      page--;
      return;
    }
    if (page === 0) {
      offsetQuery -= 20;
      if (offsetQuery === 0) {
        page = 20;
      } else {
        page = 19;
        getPokemon("next");
        return;
      }
    }
    getPokemon();
    page--;
  });

  rightArrow[i].addEventListener("click", () => {
    if (page === 19) {
      offsetQuery += 20;
      page = 0;
    }
    if (offsetQuery >= 20) {
      getPokemon("next");
      page++;
      return;
    }
    getPokemon();
    page++;
  });
}

// CALENDARIO
function calendar() {
  function GetDaysCalendar(month, year) {
    document.querySelector("#month").innerHTML = monthsBR[month];
    document.querySelector("#year").innerHTML = year;

    let firstDayOfWeek = new Date(year, month, 1).getDay() - 1;
    let getLastDayThisMonth = new Date(year, month + 1, 0).getDate();

    for (
      let i = -firstDayOfWeek, index = 0;
      i < 42 - firstDayOfWeek;
      i++, index++
    ) {
      let dt = new Date(year, month, i);
      let dtNow = new Date();
      let dayTable = tableDays.getElementsByTagName("td")[index];
      dayTable.classList.remove("previousMonth");
      dayTable.classList.remove("nextMonth");
      dayTable.classList.remove("actualDay");

      dayTable.innerHTML = dt.getDate();

      if (
        dt.getFullYear() == dtNow.getFullYear() &&
        dt.getMonth() == dtNow.getMonth() &&
        dt.getDate() == dtNow.getDate()
      ) {
        dayTable.classList.add("actualDay");
      }

      if (i < 1) {
        dayTable.classList.add("previousMonth");
      }
      if (i > getLastDayThisMonth) {
        dayTable.classList.add("nextMonth");
      }
    }
  }
  let now = new Date();
  let month = now.getMonth();
  let year = now.getFullYear();
  GetDaysCalendar(month, year);

  nextButton.addEventListener("click", () => {
    month++;
    if (month > 11) {
      month = 0;
      year++;
    }
    GetDaysCalendar(month, year);
  });
  previousButton.addEventListener("click", () => {
    month--;
    if (month < 0) {
      month = 11;
      year--;
    }
    GetDaysCalendar(month, year);
  });
}

for (let i = 0; i < daysCalendar.length; i++) {
  daysCalendar[i].addEventListener("click", () => {
    if (backgroundDayCalendarSelected === false) {
      daysCalendar[i].style.backgroundColor = "rgba(255, 199, 87, 0.65)";
      backgroundDayCalendarSelected = true;
    } else {
      for (let i = 0; i < daysCalendar.length; i++) {
        daysCalendar[i].style.removeProperty("background-color");
      }
      daysCalendar[i].style.backgroundColor = "rgba(255, 199, 87, 0.65)";
    }

    dayCalendarSelected = daysCalendar[i].textContent;

    if (daysCalendar[i].classList.contains("nextMonth")) {
      let index = monthsBR.findIndex(monthCalendar.textContent);
      if (index + 1 > 11) {
        index = 0;
        monthCalendarSelected = monthsBR[index];
      } else {
        monthCalendarSelected = monthsBR[index + 1];
      }
    }
    if (daysCalendar[i].classList.contains("previousMonth")) {
      let index = monthsBR.findIndex(monthCalendar.textContent);
      if (index - 1 < 0) {
        index = 11;
        monthCalendarSelected = monthsBR[index];
      } else {
        monthCalendarSelected = monthsBR[index - 1];
      }
    }
    yearCalendarSelected = monthCalendar.textContent;
  });
}

//BUTOES DE CONFIRMACAO E STARTs
startButton.addEventListener("click", () => {
  startButton.classList.add("hidden");
  selectionContainer1.classList.remove("hidden");
  confirmButton.classList.remove("hidden");
});

confirmButton.addEventListener("click", () => {
  counter++;
  if (counter === 1) {
    selectionContainer1.classList.add("hidden");
    selectionContainer2.classList.remove("hidden");
    console.log(pokemonPlayer1);
  } else if (counter === 2) {
    confirmButton.style.top = "90%";
    selectionContainer2.classList.add("hidden");
    contentCalendar.classList.remove("hidden");
    console.log(pokemonPlayer2);
    calendar();
  } else if (counter === 3) {
    contentCalendar.classList.add("hidden");
    confirmButton.classList.add("hidden");
  }
});

getPokemon();
