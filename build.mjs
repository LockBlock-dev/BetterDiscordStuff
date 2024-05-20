// This build script is the result of using two repositories:
// https://github.com/Vendicated/BetterDiscordPlugins/blob/main/build.mjs and
// https://github.com/Zerthox/BetterDiscord-Plugins/blob/master/scripts/build.ts

import { context } from "esbuild";
import chalk from "chalk";
import path from "path";
import minimist from "minimist";
import { readdirSync } from "fs";
import { open, readFile } from "fs/promises";

const success = (msg) => console.log(chalk.green(`[build] ${msg}`));
const warn = (msg) => console.warn(chalk.yellow(`[build] Warn: ${msg}`));
const error = (msg) => console.error(chalk.red(`[build] Error: ${msg}`));

// ESM hack
const __dirname = process.cwd();

// find sources
const sourceFolder = path.resolve(__dirname, "./src");
const pluginsSourceEntries = readdirSync(sourceFolder, {
    withFileTypes: true,
}).filter((entry) => entry.isDirectory());

// parse args
const args = minimist(process.argv.slice(2), { boolean: ["dev", "watch"] });

// resolve input paths
let inputPaths = [];

if (!args._.length) {
    inputPaths = pluginsSourceEntries.map((entry) =>
        path.resolve(sourceFolder, entry.name)
    );
} else {
    for (const name of args._) {
        const entry = pluginsSourceEntries.find(
            (entry) => entry.name.toLowerCase() === name.toLowerCase()
        );

        if (entry) {
            inputPaths.push(path.resolve(sourceFolder, entry.name));
        } else {
            warn(`Unknown plugin "${name}"`);
        }
    }
}

// check for inputs
if (!inputPaths.length) {
    error("No plugin to build");
    process.exit(1);
}

// resolve output directory
const outDir = path.resolve(__dirname, "./dist");

// build each input
for (const inputPath of inputPaths) {
    const pluginFolder = path.basename(inputPath);
    const outputFilename = `${pluginFolder}.plugin.js`;
    const outputPath = path.resolve(outDir, pluginFolder, outputFilename);

    const plugin = await context({
        entryPoints: [inputPath],
        outfile: outputPath,
        bundle: true,
        minify: false,
        treeShaking: true,
        format: "cjs",
        target: "esnext",
        jsx: "transform",
        jsxFactory: "BdApi.React.createElement",
        jsxFragment: "BdApi.React.Fragment",
        logLevel: "info",
        tsconfig: "./tsconfig.esbuild.json",
        plugins: [
            {
                name: "manifest-banner",
                setup: async (build) => {
                    const meta = await readFile(`${inputPath}/meta.js`, "utf8");
                    build.initialOptions.banner = {
                        js: meta.replace(/\r?\n$/, ""),
                    };
                },
            },
            {
                name: "json-minify-plugin",
                setup(build) {
                    build.onLoad({ filter: /\.json$/ }, async (args) => {
                        const contents = await readFile(args.path, "utf8");

                        return {
                            contents: JSON.stringify(JSON.parse(contents)),
                            loader: "json",
                        };
                    });
                },
            },
            {
                name: "auto-deploy",
                setup: (build) => {
                    build.onEnd(async (result) => {
                        if (!args.dev) return;

                        if (result.errors.length) return;

                        let deployDir;
                        const betterDiscordDirectory = "BetterDiscord/plugins";

                        switch (process.platform) {
                            case "win32":
                                deployDir = path.resolve(
                                    process.env.APPDATA,
                                    betterDiscordDirectory
                                );
                                break;
                            case "darwin":
                                deployDir = path.resolve(
                                    process.env.HOME,
                                    `Library/Application Support/${betterDiscordDirectory}`
                                );
                                break;
                            default: // Linux and other platforms
                                deployDir = path.resolve(
                                    process.env.HOME,
                                    `.config/${betterDiscordDirectory}`
                                );
                                break;
                        }

                        const deployPath = path.resolve(
                            deployDir,
                            outputFilename
                        );
                        const f = await open(deployPath, "w");

                        try {
                            await f.write(
                                await readFile(build.initialOptions.outfile)
                            );
                            success("Deployed", pluginFolder);
                        } finally {
                            f.close();
                        }
                    });
                },
            },
        ],
    });

    if (args.dev) {
        plugin.watch();
    } else {
        plugin.rebuild();
        plugin.dispose();
    }
}
