async function spawn_boxes(row, column, anim = true, delay = 0) {
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

  const anime = window.anime;

  // Add new boxes
  setTimeout(function () {
    for (var i = starting_row; i < row + starting_row; i++) {
      var tr = tbody.appendChild(document.createElement("tr"));
      tr.className = "tr";

      for (var j = 0; j < column; j++) {
        var box = document.createElement("td");
        box.className = "box";
        box.id = "box-" + i + "-" + j;
        tr.appendChild(box);

        // Animate entry of boxes
        if (anim) {

          anime({
            targets: box,
            opacity: [0, 1],
            scale: [0, 0, 1],
            duration: 100 * (i),
          })
        }
      }
    }
  }, delay);

  // Return promise when all boxes are added
  return new Promise(function (resolve, _) {
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

function unmute_fast() {
  var audio = document.getElementById("audio");
  var vol = document.getElementById("volume");
  audio.muted = false;
  audio.volume = 0.5;
  vol.value = 0.5;
  vol.style.setProperty("--thumb-color", "#26a641")
  document.getElementById("muted").remove();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const anime = window.anime;

function create_muted() {
  muted = document.getElementById("muted");
  muted.addEventListener("click", () => {
    anime({
      targets: muted,
      opacity: [0.7, 0.0],
      duration: 200,
      complete: unmute_fast,
    })
  });

  muted.addEventListener("mouseenter", () => {
    anime({
      targets: muted,
      opacity: [0.0, 0.7],
      duration: 1000,
    });
  });

  muted.addEventListener("mouseleave", () => {
    anime({
      targets: muted,
      opacity: [0.7, 0.0],
      duration: 1000,
    });
  });
}


const GRAY = "#272b33";

// COLOR: WEIGHT OF OCCURENCE
const ARR = create_arr({
  "#0e4429": 700,
  "#006d32": 75,
  "#26a641": 5,
  "#39d353": 1,
});

spawn_boxes(10, 40, false);


fetch("https://lnus.github.io/git-apple/frames.json")
  .then(function (response) {
    return response.json();
  })
  .then(async function (frames) {
    var audio = document.getElementById("audio");

    await sleep(1000);
    await spawn_boxes(20, 40, true);

    audio.play();
    document.getElementById("volume").value = 0.0;
    audio.volume = 0.0;

    create_muted();

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
