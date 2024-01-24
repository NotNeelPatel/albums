createEntries(true);
const dataTemplate = document.querySelector("[data-template]");
const entryContainer = document.querySelector("[data-entries-container");
const searchInput = document.querySelector("[data-search]");
const clearContainer = document.getElementsByClassName("entries");

let entries = [];
var searchEvent;

searchInput.addEventListener("input", (e) => {
  searchEvent = e;
  search(e);
});

function search(e){
  const value = e.target.value.toLowerCase();
  entries.forEach((entry) => {
      a = entry.artist.join(" ");
      g = entry.genres.join(" ")
    const isVisible =
      entry.name.toLowerCase().includes(value) ||
      entry.year.includes(value) ||
      a.toLowerCase().includes(value) ||
      g.toLowerCase().includes(value);
    entry.element.classList.toggle("hide", !isVisible);
  });
}

  
function createEntries(firstTime) {
    fetch("./assets/albums.json")
        .then((res) => res.json())
        .then((data) => {
        if (firstTime) {
            albumData = data.reverse();
            document.getElementById("num-albums").innerHTML = "A collection of " + (Object.keys(albumData).length) + " hand-picked albums";
        } else {
            entryContainer.innerHTML = "";
        }
        entries = albumData.map((entry) => {
            const card = dataTemplate.content.cloneNode(true).children[0];
            const url = card.querySelector("[data-url]");
            const artist_card = card.querySelector("[data-artist]");
            const year = card.querySelector("[data-year]");
            const img = card.querySelector("[data-img]");
            img.src = entry.image_url
            img.href = entry.album_url
            url.textContent = entry.name;
            artist_card.textContent = entry.artists;
            year.textContent = entry.release_date;
            url.href = entry.album_url;
            entryContainer.append(card);
            return {
                name: entry.name,
                artist: entry.artists,
                genres: entry.genres,
                year: entry.release_date,
                element: card,
              };
        });
        search(searchEvent);
    });

}

var enabled_sliders = {
    'popularity' : true,
    'acousticness' : true,
    'danceability' : true,
    'energy' : true,
    'instrumentalness' : true,
    'valence' : true
}

var popularitySlider = document.getElementById("popularity-slider");
var popularityValue = document.getElementById("popularity-value");

var acousticnessSlider = document.getElementById("acousticness-slider");
var acousticnessValue = document.getElementById("acousticness-value");

var danceabilitySlider = document.getElementById("danceability-slider");
var danceabilityValue = document.getElementById("danceability-value");

var energySlider = document.getElementById("energy-slider");
var energyValue = document.getElementById("energy-value");

var instrumentalnessSlider = document.getElementById("instrumentalness-slider");
var instrumentalnessValue = document.getElementById("instrumentalness-value");

var valenceSlider = document.getElementById("valence-slider");
var valenceValue = document.getElementById("valence-value");


popularitySlider.oninput = function () {
    popularityValue.innerHTML = this.value;
    filter()
  };
acousticnessSlider.oninput = function () {
    acousticnessValue.innerHTML = this.value;
    filter()
  };

danceabilitySlider.oninput = function () {
    danceabilityValue.innerHTML = this.value;
    filter()
  };

energySlider.oninput = function () {
    energyValue.innerHTML = this.value;
    filter()
  };

instrumentalnessSlider.oninput = function () {
    instrumentalnessValue.innerHTML = this.value;
    filter()
  };
  
  
valenceSlider.oninput = function () {
    valenceValue.innerHTML = this.value;
    filter()
  };

function filter() {
    let parameters = new Array();
    Object.keys(enabled_sliders).forEach(function(key) {
        if (enabled_sliders[key]){
            parameters.push(key);
        }
      });

    for (let i = 0; i < albumData.length; i++) {
        albumData[i].score = 0;
        for(let j = 0; j < parameters.length; j++){
            let p = parameters[j]
            let s = document.getElementById(p+"-slider");
            albumData[i].score += Math.pow(s.value - albumData[i][p] * 10, 2)
        }
    }

    albumData.sort(function(a, b) {
        return a.score - b.score;
    });

    createEntries(false);
  }

  function enable_checkbox(id) {
    var checkBox = document.getElementById("checkbox-"+id);
    if (checkBox.checked) {
        document.getElementById(id+'-slider').disabled = false;
        enabled_sliders[id] = true;
    } else {
        document.getElementById(id+'-slider').disabled = true;
        enabled_sliders[id] = false;
    }
    filter()
  }