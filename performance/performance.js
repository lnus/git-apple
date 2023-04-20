function binary() {
  var greens = [
    { color: "#0e4429", weight: 700 },
    { color: "#006d32", weight: 75 },
    { color: "#26a641", weight: 5 },
    { color: "#39d353", weight: 1 }
  ];

  var total = 0;
  for (var i = 0; i < greens.length; i++) {
    total += greens[i].weight;
    greens[i].cumulativeWeight = total;
  }

  var random = Math.floor(Math.random() * total);
  var low = 0;
  var high = greens.length - 1;
  while (low < high) {
    var mid = Math.floor((low + high) / 2);
    if (random < greens[mid].cumulativeWeight) {
      high = mid;
    } else {
      low = mid + 1;
    }
  }

  return greens[low].color;
}

function linear() {
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

// This is way more memory intensive than the linear version
// but it's also way faster. Given at least 2 iterations.
// 
// NOTE: The memory doesn't even matter since the array is <1000 elements.
function create_arr() {
  var greens = {
    "#0e4429": 700,
    "#006d32": 75,
    "#26a641": 5,
    "#39d353": 1,
  };

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

var startDate = new Date();
var iterations = 1000000;
for (var i = 0; i < iterations; i++) {
  binary();
}
var endDate = new Date();
console.log("binary: " + (endDate - startDate) + "ms");

startDate = new Date();
for (var i = 0; i < iterations; i++) {
  linear();
}
endDate = new Date();
console.log("linear: " + (endDate - startDate) + "ms");

startDate = new Date();
var arr = create_arr();
endDate = new Date();
console.log("create_arr: " + (endDate - startDate) + "ms");

startDate = new Date();
for (var i = 0; i < iterations; i++) {
  get_random_green(arr);
}
endDate = new Date();
console.log("get_random_green: " + (endDate - startDate) + "ms");

/* ANCHOR Results
100,000 iterations
binary: 63ms performance.js:87:9
linear: 24ms performance.js:94:9
create_arr: 0ms performance.js:99:9
get_random_green: 3ms performance.js:106:9

1,000,000 iterations
binary: 564ms performance.js:87:9
linear: 224ms performance.js:94:9
create_arr: 0ms performance.js:99:9
get_random_green: 25ms performance.js:106:9

10,000,000 iterations
binary: 5356ms performance.js:87:9
linear: 2167ms performance.js:94:9
create_arr: 0ms performance.js:99:9
get_random_green: 229ms performance.js:106:9
*/
