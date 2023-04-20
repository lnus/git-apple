async function spawn_boxes(row, column, anim = true) {
  var grid = document.getElementById("grid");

  // Attach to tbody if it already exists
  var tbody = document.getElementById("tbody");
  if (tbody == null) {
    tbody = document.createElement("tbody");
    tbody.id = "tbody";
  }

  grid.appendChild(tbody);

  // Get latest box id (if any)
  if (tbody.lastChild != null) {
    var latest_box = tbody.lastChild.lastChild;
    var latest_box_id = latest_box.id.split("-");
    var starting_row = parseInt(latest_box_id[1]) + 1;
  } else {
    starting_row = 0;
  }

  // Add new boxes
  for (var i = starting_row; i < row + starting_row; i++) {
    var tr = tbody.appendChild(document.createElement("tr"));
    tr.className = "tr";
    for (var j = 0; j < column; j++) {
      var box = document.createElement("td");
      box.className = "box";
      box.id = "box-" + i + "-" + j;
      box.style.opacity = "0";
      tr.appendChild(box);

      // Timeout opacity animation
      if (anim) {
        setTimeout(function (box) {
          box.style.display = "table-cell"
        }, i * 100, box);
        setTimeout(function (box) {
          box.style.opacity = "1";
        }, i * 120, box);
      } else {
        box.style.display = "table-cell"
        box.style.opacity = "1";
      }
    }
  }

  // Return promise when all boxes are added
  return new Promise(function (resolve, reject) {
    resolve();
  });
}

function set_box_color(row, column, color) {
  var box = document.getElementById("box-" + row + "-" + column);
  box.style.backgroundColor = color;
}

function create_arr(greens) {
  let arr = [];
  for (var key in greens) {
    for (var i = 0; i < greens[key]; i++) {
      arr.push(key);
    }
  }

  return arr;
}

function get_random_green(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

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

// Spawn initial boxes
spawn_boxes(10, 40, false);

const GRAY = "#272b33";

// COLOR: WEIGHT OF OCCURENCE
const ARR = create_arr({
  "#0e4429": 700,
  "#006d32": 75,
  "#26a641": 5,
  "#39d353": 1,
});


fetch("https://lnus.github.io/git-apple/frames.json")
  .then(function (response) {
    return response.json();
  })
  .then(async function (frames) {
    await spawn_boxes(20, 40);

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
              color = get_random_green(ARR);
            } else {
              color = GRAY;
            }
            set_box_color(i, j, color);
          });
        });

        contrib.innerHTML = contributions + " contributions in the last year";
      }, (1000 / 30) * i);
    });
  });
