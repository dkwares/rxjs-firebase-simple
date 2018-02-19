// Karma configuration

module.exports = function (config) {
    config.set({
        frameworks: ["jasmine", "karma-typescript"],
        preprocessors: {
            "**/*.ts": ["karma-typescript"],
        },
        files: [{ pattern: "src/**/*.ts" }],
        reporters: ["progress", "karma-typescript"],
        singleRun: false,
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        karmaTypescriptConfig: {
            tsconfig: "./tsconfig.json"
        },
        autoWatch: true,
        browsers: ["Chrome"]
    });
};