import { readVdf } from 'steam-binary-vdf';
import fs from 'node:fs';

const vdfData = async () => {
    const inBuffer = fs.readFileSync('/home/leemmcc/.steam/steam/userdata/65085830/config/shortcuts.vdf');
    const shortcuts = readVdf(inBuffer);
    console.log(shortcuts);
};

vdfData();