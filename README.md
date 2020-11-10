# NDEed-tiny-editor: Editor for the NDE-ed.org website 
# forked from https://github.com/bmaranville/el-tiny-editor

To build:
```
npm install
patch -p0 <tinymce_importcss_ceFalseOverride.patch
cp node_modules/tinymce/plugins/importcss/plugin.js node_modules/tinymce/plugins/importcss/plugin.min.js
npm install
npm start
```
To run, install node and npm and `npm install`, then `npm start` from
this directory

on Linux, to install systemwide: `sudo npm install -g electron --unsafe-perm=true --allow-root`

Can then run from central path with `electron <this_directory> [ file_to_open.html ]`


# To build binary ZIP files:
sudo npm install electron-packager -g
electron-packager . NDEed-TinyEditor --platform=linux --ignore="packaged_archives" --arch=x64 --overwrite
electron-packager . NDEed-TinyEditor --platform=darwin --ignore="packaged_archives" --arch=x64 --overwrite
electron-packager . NDEed-TinyEditor --platform=win32 --ignore="packaged_archives" --arch=x64 --overwrite

export VERSION=1.1.1

cp README.md NDEed-TinyEditor-darwin-x64/
cp README.md NDEed-TinyEditor-linux-x64/
cp README.md NDEed-TinyEditor-win32-x64/
zip -r packaged_archives/NDEed-TinyEditor-$VERSION-win32-x64.zip NDEed-TinyEditor-win32-x64/
zip -r packaged_archives/NDEed-TinyEditor-$VERSION-linux-x64.zip NDEed-TinyEditor-linux-x64/
zip -r packaged_archives/NDEed-TinyEditor-$VERSION-darwin-x64-macos.zip NDEed-TinyEditor-darwin-x64/


To install, download the binary ZIP file and unpack it in a suitable location.
You can run the editor by running the "NDEed-TinyEditor" or
"NDEed-TinyEditor.exe" binary inside the archive. You can also create a
shortcut to this binary.
