module.exports = {
  
  collectCoverage: true,
  
  coverageDirectory: './logs/coverage',
  
  moduleNameMapper: {
    '\\.css$': '<rootDir>/libs/cssStub.js',
  },
  
  setupTestFrameworkScriptFile: '<rootDir>/source/config/testSetup.js',
  
};
