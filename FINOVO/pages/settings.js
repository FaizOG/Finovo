function createPreferencesSection(){
  const section = document.createElement("section");
  // section.className = "settings-card";

  section.innerHTML = `
  <div class="setting-tab-Preferences-card">
                        <h4 class="setting-tab-Preferences-card-title">Preferences</h4>

                        <!-- Theme row -->
                        <div class="setting-tab-Preferences-card-theme-row">
                            <div class="setting-tab-Preferences-theme-info">
                                <h6 class="setting-tab-theme-label">Theme</h6>
                                <p class="setting-tab-theme-description">(Switch between dark and light mode)</p>
                            </div>

                            <div class="setting-tab-theme-switcher">
                                <button class="screen-mode-btn setting-tab-dark-mode-btn" id="darkBtn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" class="lucide lucide-moon size-4" aria-hidden="true">
                                        <path
                                            d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401">
                                        </path>
                                    </svg>
                                </button>
                                <button class="screen-mode-btn setting-tab-light-mode-btn" id="lightBtn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" class="lucide lucide-sun size-4" aria-hidden="true">
                                        <circle cx="12" cy="12" r="4"></circle>
                                        <path d="M12 2v2"></path>
                                        <path d="M12 20v2"></path>
                                        <path d="m4.93 4.93 1.41 1.41"></path>
                                        <path d="m17.66 17.66 1.41 1.41"></path>
                                        <path d="M2 12h2"></path>
                                        <path d="M20 12h2"></path>
                                        <path d="m6.34 17.66-1.41 1.41"></path>
                                        <path d="m19.07 4.93-1.41 1.41"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <!-- Currency row -->
                        <div class="setting-tab-Preferences-card-theme-row">
                            <div class="setting-tab-Preferences-theme-info">
                                <h6 class="setting-tab-theme-label">Currency</h6>
                                <p class="setting-tab-theme-description">(Used to format all amounts)</p>
                            </div>

                            <div class="setting-tab-theme-switcher">
                                <div class="custom-dropdown" id="currencyDropdown">
                                    <div class="dropdown-selected" onclick="toggleCurrencyDropdown()">
                                        <span id="selectedCurrency">&#8377;</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round"
                                            class="lucide lucide-chevron-down h-4 w-4 opacity-50" aria-hidden="true">
                                            <path d="m6 9 6 6 6-6"></path>
                                        </svg>
                                    </div>

                                    <div class="dropdown-menu" id="currencyDropdownMenu">
                                        <div class="dropdown-item active">&#8377;</div>
                                        <div class="dropdown-item">&#36;</div>
                                        <div class="dropdown-item">&euro;</div>
                                        <div class="dropdown-item">&pound;</div>
                                        <div class="dropdown-item">&yen;</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
  `;

  return section;
}


function createBackAndDataSection(){
  const section = document.createElement("section");
  // section.className = "settings-card";

  section.innerHTML = `
  <div class="setting-tab-Preferences-card">
                        <h4 class="setting-tab-Preferences-card-title">Backup & data</h4>
                        <div class="btn-container">
                            <button class="ExportJSON-btn">
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" class="lucide lucide-download size-4 mr-1"
                                        aria-hidden="true">
                                        <path d="M12 15V3"></path>
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <path d="m7 10 5 5 5-5"></path>
                                    </svg>
                                </span>
                                Export JSON
                            </button>
                            <button class="ExportCSV-btn">
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" class="lucide lucide-download size-4 mr-1"
                                        aria-hidden="true">
                                        <path d="M12 15V3"></path>
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <path d="m7 10 5 5 5-5"></path>
                                    </svg>
                                </span>
                                Export CSV
                            </button>
                            <button class="ImportJSON-btn">
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" class="lucide lucide-upload size-4 mr-1"
                                        aria-hidden="true">
                                        <path d="M12 3v12"></path>
                                        <path d="m17 8-5-5-5 5"></path>
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    </svg>
                                </span>
                                Import JSON
                            </button>
                            <button class="RestAccount-btn">
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" class="lucide lucide-rotate-ccw size-4 mr-1"
                                        aria-hidden="true">
                                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                                        <path d="M3 3v5h5"></path>
                                    </svg>
                                </span>
                                Rest Account
                            </button>
                        </div>
                    </div>
  `
  return section;
}

// OPEN / CLOSE
function toggleCurrencyDropdown() {
    document
        .getElementById("currencyDropdownMenu")
        .classList.toggle("active");
}

function selectCurrency(el) {
    document
        .querySelectorAll("#currencyDropdownMenu .dropdown-item")
        .forEach(i => i.classList.remove("active"));

    el.classList.add("active");

    const symbol = el.textContent;

    document.getElementById("selectedCurrency").textContent = symbol;

    document.getElementById("currencyDropdownMenu").classList.remove("active");

    updateCurrencyUI(symbol);
}

function initCurrencyDropdown() {
    const menu = document.getElementById("currencyDropdownMenu");

    menu.addEventListener("click", (e) => {
        if (e.target.classList.contains("dropdown-item")) {
            selectCurrency(e.target);
        }
    });
}

window.toggleCurrencyDropdown = toggleCurrencyDropdown;
window.selectCurrency = selectCurrency;



let currencySymbol = document.querySelector("#selectedCurrency");
// console.log(currencySymbol.innerText);


// let asideBarTotoal = document.querySelector(".total__aside_balance h3 span").innerHTML = currencySymbol.innerText;
// currencySymbol.innerText


function updateCurrencyUI(symbol) {

    // update currency display everywhere
    document.querySelectorAll(".currency-symbol").forEach(el => {
        el.textContent = symbol;
    });

    // update sidebar total (if it exists)
    const totalEl = document.querySelector(".total__aside_balance h3 span");

    if (totalEl) {
        totalEl.textContent = symbol;
    }
}




// Light - Dark mode code
function initTheme(container) {
  const darkBtn = container.querySelector("#darkBtn");
  const lightBtn = container.querySelector("#lightBtn");
  const body = document.body;

  if (!darkBtn || !lightBtn) return;

  if (localStorage.getItem("theme") === "light") {
    body.classList.add("light");
    setActive("light");
  } else {
    setActive("dark");
  }

  darkBtn.addEventListener("click", () => {
    body.classList.remove("light");
    localStorage.setItem("theme", "dark");
    setActive("dark");
  });

  lightBtn.addEventListener("click", () => {
    body.classList.add("light");
    localStorage.setItem("theme", "light");
    setActive("light");
  });

  function setActive(mode) {
    if (mode === "light") {
      lightBtn.classList.add("active");
      darkBtn.classList.remove("active");
    } else {
      darkBtn.classList.add("active");
      lightBtn.classList.remove("active");
    }
  }
}


export default {
  mount(container) {
    container.innerHTML = `<h2 class="setting-tab-title">Settings</h2>
                    <p class="setting-tab-subtitle">Preferences, recurring entries and backups</p>
    `;

    container.appendChild(createPreferencesSection());
    container.appendChild(createBackAndDataSection());
    initTheme(container);
    initCurrencyDropdown();
  }
};