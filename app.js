/* Global Variables */
// Buttons and inputs
const generateBtn = document.getElementById("generate");
const zipInput = document.getElementById("zip");
const feelingsInput = document.getElementById("feelings");

// Elements to update on the UI
const dateElem = document.getElementById("date");
const tempElem = document.getElementById("temp");
const contentElem = document.getElementById("content");

// Base URL and API Key for OpenWeatherMap
const baseURL = "https://api.openweathermap.org/data/2.5/weather?zip=";
const apiKey = "your_actual_api_key&units=metric"; // Replace 'your_actual_api_key' with your OpenWeatherMap API key

// Create a new date instance dynamically
const currentDate = () => {
  const d = new Date();
  return `${d.getMonth() + 1}.${d.getDate()}.${d.getFullYear()}`; // Format MM.DD.YYYY
};

// Event listener for Generate Button
generateBtn.addEventListener("click", () => {
  const zip = zipInput.value;
  const feelings = feelingsInput.value;

  if (zip) {
    // Fetch weather data and update UI
    getWeatherData(zip)
      .then((data) => {
        if (data && data.main) {
          return postData("/add", {
            temp: data.main.temp,
            date: currentDate(),
            content: feelings || "No feelings provided",
          });
        } else {
          alert("Invalid ZIP code or no data found.");
        }
      })
      .then(() => updateUI());
  } else {
    alert("Please enter a ZIP code!");
  }
});

// Fetch weather data from OpenWeatherMap API
const getWeatherData = async (zip) => {
  try {
    const response = await fetch(`${baseURL}${zip},us&appid=${apiKey}`);
    if (!response.ok) {
      throw new Error(`Unable to fetch weather data: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
};

// Post data to the server
const postData = async (url = "", data = {}) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to post data: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error posting data:", error);
  }
};

// Update UI with the most recent entry
const updateUI = async () => {
  try {
    const response = await fetch("/all");
    if (!response.ok) {
      throw new Error(`Failed to fetch data for UI: ${response.statusText}`);
    }
    const data = await response.json();

    dateElem.innerText = data.date || "N/A";
    tempElem.innerText = `${data.temp || "N/A"} °C`;
    contentElem.innerText = data.content || "N/A";
  } catch (error) {
    console.error("Error updating UI:", error);
  }
};
