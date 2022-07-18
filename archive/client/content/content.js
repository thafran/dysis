console.log('content.js');

// As reddit is a modern web app (i.e., using React) this listeners
// react to changes
window.addEventListener('load', updateElements)
window.addEventListener('popstate', updateElements)
window.addEventListener('click', updateElements)

// Scroll throttling
let scrolling = false;
window.addEventListener('scroll', () => {
  console.log("Scrolling detected")
  scrolling = true
});

function updateElements() {
  const userElements = getRelevantUsernameElements();

}


class DysisApp {
  constructor() {
    console.log('Dysis App started ...')
    this.dysisInstances = []
  }

  updateElements() {
    console.log('Called update Element')
    const x = new DysisElement()
  }
}

class DysisElement {
  constructor(element) {
    console.log('Dysis Element instance created ...')
    this.element = element;
    this.beep();
  }

  beep() {
    setInterval(
      () => {
        console.log('Beep from a Dysis Element')
      },
      1000
    )
  }

  
}

abstract class 

const dysisApp = new DysisApp();
dysisApp.updateElements(document);




function getUsernameParamFromPath(path) {
  if (!path.match('\/user\/.+')) {
    throw Error('Path must be user path with username param ')
  }
  let username = path.replace('https://www.reddit.com/user/', '').slice(0, -1)
  return username;
}

function getRelevantUsernameElements() {
  // Create empty Array
  let userElements = []
  // Find all anchor tags ('a' HTML elements) and push them into userElements array
  const anchorTags = document.getElementsByTagName('a');
  for (const anchorTag of anchorTags) {
    userElements.push(anchorTag)
  }
  // Filter anchor elements based on them including the user path pattern as link
  userElements = userElements.filter(element => element.href.match('\/user\/.+'))
  // Filter anchor elements based on them including user name as text in their inner content
  userElements = userElements.filter(element => {
    // Extract username from href of element
    const extractedUsername = getUsernameParamFromPath(element.href)
    // Filter for the element if the said username has been found in the inner HTML of the element, else not
    return (element.innerHTML.includes(extractedUsername))
  })
  // Return found and filtered elements
  return userElements
}

/**
// For webpages that use dynamic JavaScript (e.g., using React) this listener
// waits until a page has been fully loaded
window.addEventListener('load', update)
window.addEventListener('popstate', update)
window.addEventListener('click', update)

// Scroll throttling
let scrolling = false;
window.addEventListener('scroll', () => {
  console.log("Scrolling detected")
  scrolling = true
});

setInterval(() => {
  if (scrolling === true) {
    scrolling = false;
    logActivity('Scroll update')
    update()
  }
}, 5000)
  
// As fallback the extension will try to update every interval step (in ms)
// setInterval(update, 1000)

async function update() {
  // Add all functions that should be executed after the webpage has finished loading
  updateUserInformations()
  logActivity('Updating information')  
}

function getRelevantUsernameElements() {
  // Create empty Array
  let userElements = []
  // Find all anchor tags ('a' HTML elements) and push them into userElements array
  const anchorTags = document.getElementsByTagName('a');
  for (const anchorTag of anchorTags) {
    userElements.push(anchorTag)
  }
  // Filter anchor elements based on them including the user path pattern as link
  userElements = userElements.filter(element => element.href.match('\/user\/.+'))
  // Filter anchor elements based on them including user name as text in their inner content
  userElements = userElements.filter(element => {
    // Extract username from href of element
    const extractedUsername = getUsernameParamFromPath(element.href)
    // Filter for the element if the said username has been found in the inner HTML of the element, else not
    return (element.innerHTML.includes(extractedUsername))
  })
  // Return found and filtered elements
  return userElements
}

async function appendUserInformationToElement(element) {
  if (element.getAttributeNames().includes('data-dysis')) {
    return;
  }
  let enrichment = document.createElement('span')
  enrichment.className = 'dysis';
  enrichment.setAttribute('style', 'font_weight: bold !important; color: red !important');
  const extractedUsername = getUsernameParamFromPath(element.href)
  const extractedInformation = JSON.stringify(await getInformationForIdentifier(extractedUsername));
  removeUserInformationFromElement(element)
  enrichment.innerText = `  DYSIS info for '${extractedUsername}': ${extractedInformation} `
  element.setAttribute('data-dysis', 'injected')
  element.appendChild(enrichment)
}

function updateUserInformations() {
  const relevantUsernameElements = getRelevantUsernameElements();
  for (const element of relevantUsernameElements) {
    appendUserInformationToElement(element)
  }
}

function removeUserInformation() {
  const appendedElements = document.querySelectorAll('.dysis');
  for (const appendedElement of appendedElements) {
    appendedElement.remove();
  }
}
function removeUserInformationFromElement(element) {
  const appendedElements = element.querySelectorAll('.dysis');
  for (const appendedElement of appendedElements) {
    appendedElement.remove();
  }
}

function getUsernameParamFromPath(path) {
  if (!path.match('\/user\/.+')) {
    throw Error('Path must be user path with username param ')
  }
  let username = path.replace('https://www.reddit.com/user/', '').slice(0, -1)
  return username;
}

async function getInformationForIdentifier(identifier) {
  const response = await request('GET', `reddit?identifier=${identifier}`)
  if (response.data !== null) { 
    return response.data;
  } else {
    throw Error(response) 
  }
}

async function request(method, path, body = null) {
  const API_PROD = 'https://dysis-server.herokuapp.com/api/';
  const API_DEV = 'http://localhost:8080/api/';
  const API = DEBUG ? API_DEV : API_PROD;
  const request = [
    API + path,
    {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: body
    }
  ]
  try {
    const response = await fetch(...request);
    if (response.ok) {
      return response.json();
    } else {
      throw Error(response)
    }
  } catch (error) {
    throw Error(error)
  }
}

// DEBUG FUNCTIONS BELOW
const DEBUG = true;

function markArrayOfElementsForDebugging(elements) {
  for (const element of elements) {
    const marker = document.createElement('span')
    marker.innerText = 'Debug Marker'
    marker.className = 'dysis'
    marker.setAttribute('style', 'color: orange !important')
    element.appendChild(marker)
  }
}

function logActivity(activity) {
  console.log(`DYSIS (${new Date().toLocaleTimeString('de-DE')}): ${activity.toString()}`);
}

function logElements(userElements) {
  for (const userElement of userElements) {
    console.log(userElement.innerHTML);
  }
}

 */