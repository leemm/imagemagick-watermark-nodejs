/**
 * Add a watermark to each image in a supplied directory (requires nodejs, imagemagick)
 * 
 * parameters
 * source: root directory of images you want to add watermark to
 * backup (optional): directory representing backup of processed images, default: source + '/backup'
 * watermark: an icon from the icons/ directory e.g. n64, genesis
 * include (optional): path to a text file containing a filename on each line. Only these filenames will be watermarked.
 * 
 * e.g.
 * node watermark.js -source ~/Downloads/images -backup ~/Backup -watermark genesis
 * node watermark.js -source ~/Downloads/images -backup ~/Backup -watermark genesis -include ./games.txt
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { getArguments } from './args.js';

const isDirectory = (path) => fs.lstatSync(path) ? fs.lstatSync(path).isDirectory() : false;

const args = getArguments();

const root = args.source;
const backup = args.backup ? args.backup : path.join(args.source, 'backup');
const icons = './icons';
const watermark = args.watermark;
const images = args.include ? fs.readFileSync(args.include, 'utf8').split('\n') : [];

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

        const filename = path.basename(source, path.extname(source));
        const isValid = images.length === 0 || (images.length > 0 && images.includes(filename));

        if (isValid){

            // convert input.png -gravity southwest -crop 200x200+0+0 +repage -format "%[fx:100*mean]\%" info:
            console.log('convert', percentParts.join(' '));
            const dark = spawnSync('convert', percentParts);
            const percent = parseFloat(dark.stdout.toString().replaceAll('"', ''), 10);
            console.log('percent', percent);

            const ext = path.extname(source);
            const tmppath = path.join(root, `${filename}_temp${ext}`);

            // composite -watermark 40% -gravity southwest -geometry +10 \( icons/genesis.png -resize 128 \) input.png output.png
            const watermarkPath = path.join(icons, watermark + (percent <= 50 ? '-white' : '') + '.png');
            const convertParts = `-watermark 45% -gravity southwest -geometry +10+10 \( ${watermarkPath} -resize 128 \) ${source} ${tmppath}`.split(' ');

            console.log('composite', convertParts.join(' '));
            const cmd = spawnSync('composite', convertParts);
            console.log(cmd.stdout.toString());
            console.log(cmd.stderr.toString());

            // Tidy up
            fs.renameSync(source, dest);
            fs.renameSync(tmppath, source);

        }
    }
}
