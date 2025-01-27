# Image Watermarks

Simple script to apply watermarks with directory of images.

## Description

I created this to add gaming icons e.g. megadrive, snes to a directory of images for emulation purposes.
It's a simple node.js script that utilises _imagemagick_, and creates a backup of the existing images.

## Getting Started

### Dependencies

* *imagemagick* (for MacOS use your prefered package manager)
```
sudo apt install imagemagick
```
* *nodejs*
```
sudo apt install nodejs
```

### Installing

```
git clone git@github.com:leemm/imagemagick-watermark-nodejs.git
```

### Executing program

* How to run the program
* Step-by-step bullets

```
// Example
node watermark.js -source source/dir -backup backup/dir -watermark icon

// Example 2
node watermark.js -source source/dir -backup backup/dir -watermark icon -include ./games.txt
```

*arguments*
```
-source source/dir
The directory containing the images where you wish to apply a watermark

-backup backup/dir (optional)
Where the original images should be backed up. This is optional and defaults to source/dir + '/backup'

-watermark icon
An icon e.g. genesis found in the icons. Add your own if want.

-include path/to/txtfile
A txt file with a filename on each line. ONLY these files will be processed.
```

### Icon set

Icons in this set are from https://www.softicons.com/computer-icons/gaming-icon-set-by-deleket