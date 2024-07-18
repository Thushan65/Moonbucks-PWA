// Register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchMenu();
    applyDarkMode();
});

async function fetchMenu() {
    try {
        const response = await fetch('menu.json');
        const data = await response.json();
        const menuItemsDiv = document.getElementById('menu-items');
        menuItemsDiv.innerHTML = '';
        data.forEach(item => {
            // Create a div for each menu item
            const menuItemDiv = document.createElement('div');
            menuItemDiv.classList.add('menu-item');

            // Create elements for name, price, and image
            const nameHeader = document.createElement('h2');
            const priceParagraph = document.createElement('p');
            const imageElement = document.createElement('img');

            // Set content and attributes based on the item data
            nameHeader.textContent = item.name;
            priceParagraph.textContent = item.price;
            imageElement.src = item.image;
            imageElement.alt = `Picture of ${item.name}`;

            // Append elements to the menu item div
            menuItemDiv.appendChild(nameHeader);
            menuItemDiv.appendChild(priceParagraph);
            menuItemDiv.appendChild(imageElement);

            //Append menu item div to the menu items container
            menuItemsDiv.appendChild(menuItemDiv);
        });
    } catch (error) {
        console.error('Error fetching menu:', error);
    }
}

// Call fetchMenu to populate the menu when the page loads
window.onload = fetchMenu;

function applyDarkMode() {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const darkModeEnabled = darkModeMediaQuery.matches;

    if (darkModeEnabled) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }

    darkModeMediaQuery.addListener((e) => {
        const darkModeEnabled = e.matches;
        if (darkModeEnabled) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    });
}

const myMap = document.getElementById('myMap');

if (myMap) {
    if (navigator.onLine) {
        loadMapScript();
    } else {
        displayOfflineMap();
    }
}

/*
function loadMapScript() {
    let bing = "https://www.bing.com/api/maps/mapcontrol?key=AtDUHPDSMcrVeHnzgzbEWfu5sh_4VGuWq_x07cIY-Qi0-4IdF5hUIEVv2MLZsW2o&callback=loadMapScenario";
    const script = document.createElement('script');
    script.src = bing;
    script.setAttribute('async', true);
    script.setAttribute('defer', true);
    document.body.appendChild(script);
}

function loadMapScenario() {
    var map = new Microsoft.Maps.Map(document.getElementById('myMap'), {
        center: new Microsoft.Maps.Location(53.025780, -2.177390),
        mapTypeId: Microsoft.Maps.MapTypeId.road,
        zoom: 10
    });
    var pushpin = new Microsoft.Maps.Pushpin(map.getCenter(), null);
    map.entities.push(pushpin);
}

function displayOfflineMap() {
    myMap.classList.add('offline-map');
} */
