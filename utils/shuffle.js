// Перемешивает числа
function _shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

module.exports = _shuffle