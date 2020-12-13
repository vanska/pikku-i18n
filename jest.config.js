module.exports = {
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.jsx?$": "babel-jest", // Enable ES modules
    "^.+\\.tsx?$": "ts-jest"
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"]
}
