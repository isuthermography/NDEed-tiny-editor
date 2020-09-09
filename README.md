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
electron-packager . NDEed-TinyEditor --platform=linux --arch=x64 --overwrite
electron-packager . NDEed-TinyEditor --platform=darwin --arch=x64 --overwrite
electron-packager . NDEed-TinyEditor --platform=win32 --arch=x64 --overwrite

To install, download the binary ZIP file and unpack it in a suitable location.
You can run the editor by running the "NDEed-TinyEditor" or
"NDEed-TinyEditor.exe" binary inside the archive. You can also create a
shortcut to this binary.
