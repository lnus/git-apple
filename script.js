function spawn_boxes(row, column, visible = true) {
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

  let boxes = []
  let rows = []

  // Add new boxes
  for (var i = starting_row; i < row + starting_row; i++) {
    var tr = tbody.appendChild(document.createElement("tr"));
    tr.className = "tr";
    rows.push(tr);

    for (var j = 0; j < column; j++) {
      var box = document.createElement("td");
      box.className = "box";
      box.id = "box-" + i + "-" + j;


      if (!visible) {
        box.style.opacity = 0;
        box.style.display = "none";
        tr.style.display = "none";
      }

      boxes.push(box);
      console.log(box)

      tr.appendChild(box);
    }
  }

  return [boxes, rows];
}

function set_box_color(row, column, color) {
  var box = document.getElementById("box-" + row + "-" + column);
  box.style.backgroundColor = color;
  return box;
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
  muted.style.display = "flex";
  muted.addEventListener("click", () => {
    anime({
      targets: muted,
      opacity: [0.7, 0.0],
      duration: 100,
      complete: unmute_fast,
    })
  });

  muted.addEventListener("mouseenter", () => {
    anime({
      targets: muted,
      opacity: [0.0, 0.5],
      delay: anime.stagger(100)
    });
  });

  muted.addEventListener("mouseleave", () => {
    anime({
      targets: muted,
      opacity: [0.5, 0.0],
      delay: anime.stagger(100)
    });
  });
}

const GRAY = "#272b33";

// COLOR: WEIGHT OF OCCURENCE
const ARR = create_arr({
  "#0e4429": 1000,
  "#006d32": 100,
  "#26a641": 10,
  "#39d353": 1,
});

spawn_boxes(10, 40);

fetch("https://lnus.github.io/git-apple/assets/frames.json")
  .then(function (response) {
    return response.json();
  })
  .then(async function (frames) {
    // animate in container when loaded
    var c = document.getElementById("container");
    anime({
      targets: c,
      opacity: [0, 1],
      delay: anime.stagger(100)
    })

    var audio = document.getElementById("audio");
    var boxes = []
    var contrib = document.getElementById("contrib");
    var contributions = 0;
    // Randmoize the first 10x40 boxes
    for (var i = 0; i < 10; i++) {
      for (var j = 0; j < 40; j++) {
        // Either gray or random green
        // Gray being more common than green
        if (Math.random() < 0.8) {
          boxes.push(set_box_color(i, j, GRAY));
        } else {
          boxes.push(set_box_color(i, j, get_random_green(ARR)));
          contributions += 1;
        }
      }
    }
    contrib.innerHTML = contributions + " contributions in the last year";


    // Spawn remaining boxes
    var res = spawn_boxes(20, 40, false);
    res[0].map(box => boxes.push(box));

    await sleep(2000);

    // Animate in all boxes
    anime({
      targets: boxes,
      backgroundColor: GRAY,
      opacity: 1.0,
      scale: 1,
      delay: function (el, i) {
        el.closest("tr").style.display = "";
        el.style.display = "";
        return i * 1.5;
      }
    });

    await sleep(boxes.length * 1.5);

    // Start playing audio
    audio.play();
    document.getElementById("volume").value = 0.0;
    audio.volume = 0.0;

    // Create the muted overlay
    create_muted();

    frames.forEach(function (frame, i) {
      setTimeout(function () {
        contributions = 0;
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
