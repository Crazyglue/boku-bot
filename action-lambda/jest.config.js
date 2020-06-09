module.exports = {
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json"
    }
  },
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.js$": "babel-jest",
    "^.+\\.(ts)$": "ts-jest"
  },
  testEnvironment: "node"
};
