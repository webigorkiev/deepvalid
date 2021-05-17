const path = require("path");
const crypto = require('crypto');

const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const { ESBuildMinifyPlugin } = require("esbuild-loader");

const progress = require("./deploy/progress");

module.exports = (env, argv) => {
    const mode = argv?.mode || "development";
    const isDevelopment = mode === "development";
    const settings = {
        entry: {
            index: "./src/index.ts"
        },
        externalsPresets: { node: true },
        externals: [nodeExternals()],
        stats: {
            all: false,
            assets: false,
            entrypoints: isDevelopment,
            errors: true,
            warnings: false,
            assetsSort: "name",
            cachedAssets: false,
            builtAt: false
        },
        target: "node",
        output: {
            filename: isDevelopment ? "[name]-dev.js" : "[name].js",
            chunkFilename:  ((!isDevelopment) ? "prod/" : "dev/") + "[name].js",
            path: path.resolve("./dist"),
            libraryTarget: "commonjs2",
            globalObject: "this"
        },
        mode,
        devtool: isDevelopment ? "inline-cheap-module-source-map" : false,
        optimization: {
            minimize: true,
            minimizer: isDevelopment ? [] : [
                new ESBuildMinifyPlugin({
                    target: "es2020",
                    sourcemap: isDevelopment,
                    minify: !isDevelopment
                }),
                new webpack.NoEmitOnErrorsPlugin()],
        },
        plugins: [
            new webpack.DefinePlugin({
                NODE_ENV: JSON.stringify(mode),
                WEBPACKHASH: JSON.stringify(crypto.createHash("md5").update(Math.random().toString()).digest("hex"))
            })
        ],
        resolve: {
            modules: ["node_modules"],
            extensions: [".js", ".mjs", ".ts", ".tsx"],
            alias: {
                "@": path.resolve("./src/"),
            }
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: "esbuild-loader",
                    options: {
                        target: "es2020"
                    }
                },
                {
                    test: /\.tsx?$/,
                    loader: "esbuild-loader",
                    options: {
                        loader: "tsx",
                        target: "es2020",
                        //tsconfigRaw: path.resolve("./tsconfig.json")
                    }
                },
            ]
        }
    }
    progress(settings);

    return settings;
}