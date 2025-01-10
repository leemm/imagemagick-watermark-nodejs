/**
 * Extract shortcuts from steam vdf files and generate a list of appids (which can be used by watermark.js)
 *
 * parameters
 * sizes: comma separated list. options are horizontal, vertical, hero, logo
 * romsFolder: part of the rom folder e.g. megadrive
 * username: local folder username e.g. deck
 * userid: your steamuserid
 *
 * e.g.
 * node steamgrids.js -romsFolder megadrive -username deck -userid 1234456
 */

import { readVdf } from 'steam-binary-vdf';
import fs from 'node:fs';
import { getArguments } from './args.js';

const args = getArguments();

const sizes = {
    horizontal: '',
    vertical: 'p',
    hero: '_hero',
    logo: '_logo'
};

const extensions = args.sizes.split(',').map(s => sizes[s]);
const romsFolder = args.romsFolder;
const localUserName = args.username;
const steamUserId = args.userid;


const inBuffer = fs.readFileSync(`/home/${localUserName}/.steam/steam/userdata/${steamUserId}/config/shortcuts.vdf`);
const shortcuts = readVdf(inBuffer);
//fs.writeFileSync('shortcuts.json', JSON.stringify(shortcuts, null, 4), 'utf8');

const entries = [];
for (const key in shortcuts.shortcuts){
    entries.push(shortcuts.shortcuts[key]);
}

// filter by entries that contain only the romsFolder name.
const games = entries.filter(entry => entry.exe.indexOf(romsFolder) > -1).map(entry => {
    return extensions.map(ext => entry.appid + ext);
}).flat();

if (fs.existsSync('./games.txt')){ fs.unlinkSync('./games.txt'); }
fs.writeFileSync('./games.txt', games.join('\n'), 'utf8');
