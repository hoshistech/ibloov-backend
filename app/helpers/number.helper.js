
/**
 * simply generates a number integer between 2 provided numbers
 * @param min
 * @param max
 */
const randomInt = (min, max) => {

    return Math.floor( Math.random() * ( max - min ) + min );
}

module.exports = { randomInt }