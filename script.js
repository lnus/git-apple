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
var greens = ["#0e4429", "#006d32", "#26a641", "#39d353"];

fetch("http://localhost:8000/frames.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (frames) {
    console.log(frames);
    frames.forEach(function (frame, i) {
      setTimeout(function () {
        var green = 0;
        var contrib = document.getElementById("contrib");
        frame.forEach(function (row, i) {
          row.forEach(function (color, j) {
            if (color == 0) {
              green += 1;
              color = get_random_green();
            } else {
              color = gray;
            }
            set_box_color(i, j, color);
            contrib.innerHTML = green + " contributions in the last year";
          });
        });
      }, (1000 / 30) * i);
    });
  });
