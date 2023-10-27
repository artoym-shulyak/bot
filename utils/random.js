// РАНДОМ
const _rndNum = max => {
	return Math.floor(Math.random() * max)
}


const _getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
	_getRandomInt,
	_rndNum
}
