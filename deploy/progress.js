const webpack = require('webpack');
const { performance } = require('perf_hooks');

/**
 * Add progress
 * @param settings
 */
module.exports = settings => {
    const timeNow = performance.now();
    let progress = 0;

    if(settings.mode !== 'development') {
        const entery = Object.values(settings.entry).map(v => v.split('/').pop()).join(', ');
        const str = entery + ':';
        process.stdout.write(str.padEnd(32) + "\t");

        settings.plugins.push(
            new webpack.ProgressPlugin((percentage, message, ...args) => {
                percentage = Math.round(percentage * 20);

                if(percentage > progress) {
                    const sub = percentage - progress;
                    progress = percentage;

                    for(let i = 0; i < sub; i++){
                        process.stdout.write("+");
                    }

                    if(progress === 20) {
                        const timeEnd = performance.now();
                        const seconds = Math.round((timeEnd - timeNow)/1000);
                        process.stdout.write("\t");
                        process.stdout.write(seconds + "s");
                        process.stdout.write("\n");
                    }
                }
            })
        );
    }
}