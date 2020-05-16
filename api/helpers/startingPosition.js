var playerSpacing = 8000;

var calcRingCord = (itemIndex, ringIndex) => {
  var i = ringIndex
  var r = itemIndex / (2 * i);
  r = Math.floor(r) % 2 === 1 ? -1 * (r - Math.floor(r)) : r - Math.floor(r);
  if (r > 0.5) r = 1 - r;
  if (r < - 0.5) r = -1 - r;
  r = Math.round(r * (2 * i));
  return (r)
}

exports.generateStartposition = (playerIndex) => {
  console.log('playerIndex = ' + playerIndex)
  var n = playerIndex;
  if (n === 0) return ({ x: 0, y: 0 })
  var i = 1
  while (n > 4 * i) {
    n = n - 4 * i
    i++;
  }
  var x = calcRingCord(n, i) * playerSpacing
  var y = calcRingCord(n + i, i) * playerSpacing
  return ({ x, y })
}