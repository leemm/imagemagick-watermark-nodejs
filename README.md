# Image Watermarks

Simple script to apply watermarks with directory of images.

## Description

I created this to add gaming icons e.g. megadrive, snes to a directory of images for emulation purposes.
It's a simple node.js script that utilises _imagemagick_, and creates a backup of the existing images.
The script applies a black or white version of the watermark icon, dependant on 100% of dark on the south east corner of the image.

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

```

### Executing program

* How to run the program
* Step-by-step bullets

```
// Example
node watermark.js -source source/dir -backup backup/dir -watermark icon
```

* arguments
```
-source source/dir
The directory containing the images you wish to apply a watermark to

-backup backup/dir (optional)
Where the original images should be backed up. This is optional and defaults to source/dir + '/backup'

-watermark
An icon e.g. genesis found in the icons. Add your own if want to.
```