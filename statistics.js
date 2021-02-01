const stats = require('simple-statistics')

// Evan Miller's algorithm for ranking stuff based on upvotes

// Node.js implementation from => https://gist.github.com/Gattermeier/d89024e3f6d054dea952220387fe7bc5

module.exports.lowerBound = (upvotes, n = 0, confidence = 0.95) => {
    if (n === 0) return 0

    const z = stats.probit(1 - (1 - confidence) / 2)
    const phat = 1.0 * upvotes / n

    return (phat + z * z / (2 * n) - z * Math.sqrt((phat * (1 - phat) + z * z / (4 * n)) / n)) / (1 + z * z / n)
}