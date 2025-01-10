/**
 * Add a watermark to each image in a supplied directory (requires nodejs, imagemagick)
 * 
 * parameters
 * source: root directory of images you want to add watermark to
 * backup (optional): directory representing backup of processed images, default: source + '/backup'
 * watermark: an icon from the icons/ directory e.g. n64, genesis
 * 
 * e.g.
 * node watermark.js -source ~/Downloads/images -backup ~/Backup -watermark genesis
 */

const fs = require('node:fs'),
    path = require('node:path'),
    { spawnSync } = require('node:child_process');

const isDirectory = (path) => fs.lstatSync(path) ? fs.lstatSync(path).isDirectory() : false;
const getArguments = () => {
    const keys = process.argv.filter((arg, idx) => idx > 1 && !(idx % 2));
    const values = process.argv.filter((arg, idx) => idx > 1 && idx % 2);
    return keys.map((k, idx) => {
        return {
            [k.substring(1)]: values[idx]
        };
    }).reduce((result, currentObject) => {
        for (var key in currentObject) {
            result[key] = currentObject[key];
        }
        return result;
    });
};

const args = getArguments();

const root = args.source;
const backup = args.backup ? args.backup : path.join(args.source, 'backup');
const icons = './icons';
const watermark = args.watermark;

console.log('root', root);
console.log('backup', backup);
console.log('icons', icons);
console.log('watermark', watermark);

// Create backup dir if not exists
if (!fs.existsSync(backup)){ fs.mkdirSync(backup); }

for (var file of fs.readdirSync(root)) {
    const source = path.join(root, file);
    const dest = path.join(backup, file);
    const percentParts = `${source} -gravity southwest -crop 200x200+0+0 +repage -format "%[fx:100*mean]" info:`.split(' ');

    if (!isDirectory(source)){
        // convert input.png -gravity southwest -crop 200x200+0+0 +repage -format "%[fx:100*mean]\%" info:
        console.log('convert', percentParts.join(' '));
        const dark = spawnSync('convert', percentParts);
        const percent = parseFloat(dark.stdout.toString().replaceAll('"', ''), 10);
        console.log('percent', percent);

        const filename = path.basename(source, path.extname(source));
        const ext = path.extname(source);
        const tmppath = path.join(root, `${filename}_temp${ext}`);

        // composite -watermark 40% -gravity southwest -geometry +10 \( icons/genesis.png -resize 128 \) input.png output.png
        const watermarkPath = path.join(icons, watermark + (percent <= 50 ? '-white' : '') + '.png');
        const convertParts = `-watermark 40% -gravity southwest -geometry +10 \( ${watermarkPath} -resize 128 \) ${source} ${tmppath}`.split(' ');

        console.log('composite', convertParts.join(' '));
        const cmd = spawnSync('composite', convertParts);
        console.log(cmd.stdout.toString());
        console.log(cmd.stderr.toString());

        // Tidy up
        fs.renameSync(source, dest);
        fs.renameSync(tmppath, source);
    }
}