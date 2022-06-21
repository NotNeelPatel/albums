createEntries(true);
const dataTemplate = document.querySelector("[data-template]");
const entryContainer = document.querySelector("[data-entries-container");
const searchInput = document.querySelector("[data-search]");
const clearContainer = document.getElementsByClassName("entries");
var albumData;
var ogData;
var images = false;

let entries = [];

searchInput.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  entries.forEach((entry) => {
    const isVisible =
      entry.album.toLowerCase().includes(value) ||
      entry.artists.toLowerCase().includes(value);
    entry.element.classList.toggle("hide", !isVisible);
  });
});

var artist;
var options;

function createEntries(firstTime) {
  fetch("./assets/albums.json")
    .then((res) => res.json())
    .then((data) => {
      if (firstTime) {
        albumData = data;
      } else {
        entryContainer.innerHTML = "";
      }
      entries = albumData.map((entry) => {
        const card = dataTemplate.content.cloneNode(true).children[0];
        const links = card.querySelector("[data-links]");
        const artists = card.querySelector("[data-artists]");
        const cover = card.querySelector("[data-cover]");
        if (images) {
          artist = entry.artists;
          options = { album: entry.album, size: "small" };
          albumArt(artist, options, function (err, res) {
            cover.src = res;
          });
        }

        links.textContent = entry.album;
        artists.textContent = entry.artists;

        links.href = entry.url;
        entryContainer.append(card);
        return {
          album: entry.album,
          artists: entry.artists,
          happiness: entry.happiness,
          energy: entry.energy,
          lyrics: entry.lyrics,
          element: card,
        };
      });
    });
}

function image() {
  var checkBox = document.getElementById("checkbox");
  if (checkBox.checked) {
    images = true;
  } else {
    images = false;
  }
  createEntries(false);
}

var happinessSlider = document.getElementById("happiness-slider");
var happinessValue = document.getElementById("happiness-value");

var energySlider = document.getElementById("energy-slider");
var energyValue = document.getElementById("energy-value");

var experimentalSlider = document.getElementById("experimental-slider");
var experimentalValue = document.getElementById("experimental-value");

var lyricsSlider = document.getElementById("lyrics-slider");
var lyricsValue = document.getElementById("lyrics-value");

happinessValue.innerHTML = happinessSlider.value;
energyValue.innerHTML = energySlider.value;
experimentalValue.innerHTML = experimentalSlider.value;
lyricsValue.innerHTML = lyricsSlider.value;

happinessSlider.oninput = function () {
  happinessValue.innerHTML = this.value;
};

energySlider.oninput = function () {
  energyValue.innerHTML = this.value;
};

experimentalSlider.oninput = function () {
  experimentalValue.innerHTML = this.value;
};

lyricsSlider.oninput = function () {
  lyricsValue.innerHTML = this.value;
};

function search() {
  var happiness = 0;
  var energy = 0;
  var experimental = 0;
  var lyrics = 0;

  let score = new Array(albumData.length);
  for (let i = 0; i < albumData.length; ++i) score[i] = 0;

  for (let i = 0; i < albumData.length; i++) {
    happiness = Math.abs(happinessSlider.value - albumData[i].happiness);
    energy = Math.abs(energySlider.value - albumData[i].energy);
    experimental = Math.abs(
      experimentalSlider.value - albumData[i].experimental
    );
    lyrics = Math.abs(lyricsSlider.value - albumData[i].lyrics);

    if (happiness <= 1) {
      score[i] += 2 - happiness;
    }
    if (energy <= 1) {
      score[i] += 2 - energy;
    }
    if (experimental <= 1) {
      score[i] += 2 - experimental;
    }
    if (lyrics <= 1) {
      score[i] += 2 - lyrics;
    }
  }

  for (let j = 1; j < albumData.length; j++) {
    let current = score[j];
    let current2 = albumData[j];
    let k = j - 1;
    while (k > -1 && current < score[k]) {
      score[k + 1] = score[k];
      albumData[k + 1] = albumData[k];
      k--;
    }
    score[k + 1] = current;
    albumData[k + 1] = current2;
  }
  albumData.reverse();
  createEntries(false);
}
