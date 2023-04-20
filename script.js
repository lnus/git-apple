function spawn_boxes(row, column) {
  var grid = document.getElementById("grid");
  var tbody = document.createElement("tbody");
  grid.appendChild(tbody);
  for (var i = 0; i < row; i++) {
    var tr = tbody.appendChild(document.createElement("tr"));
    tr.className = "tr";
    for (var j = 0; j < column; j++) {
      var box = document.createElement("td");
      box.className = "box";
      box.id = "box-" + i + "-" + j;
      tr.appendChild(box);
    }
  }
}

function set_box_color(row, column, color) {
  var box = document.getElementById("box-" + row + "-" + column);
  box.style.backgroundColor = color;
}

function get_random_green() {
  var greens = {
    "#0e4429": 700,
    "#006d32": 75,
    "#26a641": 5,
    "#39d353": 1,
  };

  var total = 0;
  for (var key in greens) {
    total += greens[key];
  }

  var random = Math.floor(Math.random() * total);
  var current = 0;
  for (var key in greens) {
    current += greens[key];
    if (random < current) {
      return key;
    }
  }

  return "#0e4429";
}

spawn_boxes(30, 40);

var gray = "#272b33";

function set_volume() {
  var audio = document.getElementById("audio");
  var vol = document.getElementById("volume");
  audio.volume = vol.value;

  if (audio.muted) {
    audio.muted = false;
  }

  if (audio.volume == 0) {
    vol.style.setProperty("--thumb-color", "#272b33")
  } else if (audio.volume < 0.25) {
    vol.style.setProperty("--thumb-color", "#0e4429")
  } else if (audio.volume < 0.5) {
    vol.style.setProperty("--thumb-color", "#006d32")
  } else if (audio.volume < 0.75) {
    vol.style.setProperty("--thumb-color", "#26a641")
  } else {
    vol.style.setProperty("--thumb-color", "#39d353")
  }
}


fetch("https://lnus.github.io/git-apple/frames.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (frames) {
    document.getElementById("volume").value = 0.0;
    document.getElementById("audio").volume = 0.0;
    frames.forEach(function (frame, i) {
      setTimeout(function () {
        var contributions = 0;
        var contrib = document.getElementById("contrib");

        frame.forEach(function (row, i) {
          row.forEach(function (color, j) {
            if (color == 0) {
              contributions += 1;
              color = get_random_green();
            } else {
              color = gray;
            }
            set_box_color(i, j, color);
          });
        });

        contrib.innerHTML = contributions + " contributions in the last year";
      }, (1000 / 30) * i);
    });
  });
