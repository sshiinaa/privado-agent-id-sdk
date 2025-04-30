module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/test/**/*.test.js'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
    verbose: true
}; 