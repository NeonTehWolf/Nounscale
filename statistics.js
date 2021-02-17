const stats = require('simple-statistics')

/**
 * Evan Miller's algorithm for ranking stuff based on upvotes
 * @param {Number} upvotes Number of Upvotes
 * @param {Number} n Total number of votes
 * @param {Number} confidence Confidence
 * @author Matthias Gattermeier
 * @see Gist: git.io/Jt1H8
 */
export const lowerBound = (upvotes, n = 0, confidence = 0.95) => {
    if (n === 0) return 0

    const z = stats.probit(1 - (1 - confidence) / 2)
    const phat = 1.0 * upvotes / n

    return (phat + z * z / (2 * n) - z * Math.sqrt((phat * (1 - phat) + z * z / (4 * n)) / n)) / (1 + z * z / n)
}