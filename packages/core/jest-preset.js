module.exports = {
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.js"],
  collectCoverage: true,
  testPathIgnorePatterns: ["/dist/", "/node_modules/"],
  moduleNameMapper: {
    "\\.(scss|css)$": "identity-obj-proxy"
  }
};
