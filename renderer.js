// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {remote} = require('electron')
const {Menu, MenuItem, dialog, app} = remote
const tinymce = require("tinymce")
const fs = require('fs')
const path = require('path')
const beautify = require('js-beautify').html;

let menu
let filename
let working_directory

function save() {
  if (filename == null) {
    saveas();
  } else {
    var output = tinymce.editors[0].getContent(); // {format: 'raw'});
    var fullpath = path.join(working_directory, filename);
    console.log("saving file:");  
    console.log(fullpath);  
    fs.writeFile(fullpath, beautify(output, {indent_size: 2}), (err) => {
      if (err) throw err;
      console.log('It\'s saved!');
    });
  }
}

function saveas() {
  var options = {
    filters: [
      {name: 'xhtml', extensions: ['xhtml']},
      {name: 'All Files', extensions: ['*']}
    ],
    defaultPath: working_directory
  };
    dialog.showSaveDialog(options).then((n) => {
    if (n.canceled) {
      return; // cancelled
    }
    else {
      console.log("Save dialog returned");
      console.log(n);
      change_working_directory(path.dirname(n.filePath));
      filename = path.basename(n.filePath); 
      save();
    }
  });
}

function load() {
  console.log('calling load()');
    dialog.showOpenDialog({properties: ["openFile"], defaultPath: working_directory}).then((fn) => {
	if (fn.canceled) return;

      change_working_directory(path.dirname(fn.filePaths[0]));

      filename=path.basename(fn.filePaths[0]);
      console.log('calling readFile()');
      console.log(fn.filePaths[0]);
      fs.readFile(fn.filePaths[0], 'utf8', (err, data) => {
        if (err) throw err;
        tinymce.editors[0].setContent(data);
      });
  });
}

function change_working_directory(new_path) {
  //if (new_path=="") {
  //  new_path=".";
  //}
  working_directory = new_path;
  if (tinymce.activeEditor) {
    var doc = tinymce.activeEditor.getDoc(),
        head = doc.head;
    if (head.getElementsByTagName("base").length == 0) {
      base = document.createElement("base");
      head.appendChild(base);
     }
    base.setAttribute("href", "file://" + new_path + "/");
    tinymce.activeEditor.documentBaseURI.setPath(new_path + "/");
  }
}

function choose_working_directory() {
  dialog.showOpenDialog({properties: ["openDirectory"], defaultPath: working_directory}).then((fn) => {
    if (!fn.cancelled) {
      change_working_directory(fn.filePaths[0]);
    }
  });
}

//menu = Menu.getApplicationMenu();
//menu.items[0].submenu.append(new MenuItem({label: "Save", click: save}));
//menu.items[0].submenu.append(new MenuItem({label: "Save As", click: function() {saveas(filename)}}));
//menu.items[0].submenu.append(new MenuItem({label: "Load", click: load}));

tinymce.PluginManager.add('menusave', function(editor, url) {
    editor.addMenuItem('menuwd', {
        text: 'Set working directory',
        context: 'file',
        //shortcut: 'Ctrl+w',
        onclick: choose_working_directory
    });
    editor.addMenuItem('menuload', {
        text: 'Open',
        context: 'file',
        //shortcut: 'Ctrl+o',
        onclick: load
    });
    editor.addMenuItem('menusave', {
        text: 'Save',
        context: 'file',
        shortcut: 'Ctrl+s',
        onclick: save
    });
    editor.addShortcut('Meta+S', '', function(){save();});

    editor.addMenuItem('menusaveas', {
        text: 'Save As',
        context: 'file',
        //shortcut: 'Ctrl+a',
        onclick: function() {saveas(filename)}
    });
    editor.addMenuItem('menuquit', {
        text: 'Quit',
        context: 'file',
        //shortcut: 'Ctrl+a',
        onclick: function() {app.quit()}
    });
});

tinymce.baseURL = "node_modules/tinymce";

tinymce.init({ 
  selector:'div.tinymce-full',
  height: "100%",
  indent: true,
    theme: 'modern',
    valid_elements: "+*[*]", // allow all elements and attributes
  //#extended_valid_elements : "link[rel|href],a[class|name|href|target|title|onclick|rel],script[type|src],iframe[src|style|width|height|scrolling|marginwidth|marginheight|frameborder],img[class|src|border=0|alt|title|hspace|vspace|width|height|align|onmouseover|onmouseout|name]",
  plugins: [
    'advlist autolink lists link image charmap print hr anchor pagebreak',
    'searchreplace wordcount visualblocks visualchars code importcss', //  autosave
    'insertdatetime media nonbreaking table contextmenu directionality',
    'emoticons template paste textcolor colorpicker textpattern imagetools toc', //codesample
    'menusave',
      'fullpage',
  ],
  toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | numlist bullist | outdent indent | code',

  //menubar: "tools",
  element_format: "xhtml",
  fix_list_elements: true,
  file_picker_types: 'image',
  entities: '160,#160', // # use &#160; instead of &nbsp;
  content_css:  "nde-ed.css",
  importcss_append :  true,
  importcss_groups: [
      {title: "Figures", filter: /^(figure|figcaption)\./},
      {title: "Sidebars", filter: /^aside\./},
      {title: "Frames", filter: /.*frame./},
  ],
    
    importcss_selector_filter: function(selector) {
	regex=/^[-_0-9a-zA-Z]+[.][-_0-9a-zA-Z]+$/; // only allow tag name + one class
	return selector.match(regex) && selector != "div.nde-ed-edobjective" && selector != "div.nde-ed-review" && selector != "div.displaymath";
	
    }, 
  visualblocks_content_css:  new URL("node_modules/tinymce/plugins/visualblocks/css/visualblocks.css", document.baseURI).href,
    image_caption: true,  // enable image captioning
    image_advtab: true,
    //style_formats: [
    //  {title: "figure", block: "figure", wrapper: true},
    //  {title: "figcaption", block: "figcaption", wrapper: true},
  //],
  //  valid_children: '+figure[img],+figure[figcaption]',
    // and here's our custom image picker
    style_formats: [
	{ title: 'Create sidebar; then style below', block: 'aside', wrapper: true },
	{ title: 'Educational objective; add h3 heading then add bulleted list', block: 'div', wrapper: true, 
	  classes: "nde-ed-edobjective" },
	{ title: 'Review; add h3 heading then add numbered list', block: 'div', wrapper: true, 
	  classes: "nde-ed-review" },
	{ title: 'DisplayMath', block: 'div', wrapper: true, 
	  classes: "displaymath" }
    ],
    style_formats_merge: true,
  file_picker_callback: function(cb, value, meta) {
    dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{name: 'Images', extensions: ['jpg', 'png', 'gif', 'svg']}],
      defaultPath: working_directory
    }).then((fn) => {
      if (fn.canceled) return;
      var filename = path.basename(fn.filePaths[0]);
      var rel_filename = path.relative(working_directory || "", fn.filePaths[0]);
      cb(rel_filename, { title: filename});
    });
  },
  setup: function(editor) {
      editor.on('init', function(e) {
	  //console.log("argv is:");
	  //console.log(require('electron').remote.process.argv);
	  var argv_array = require('electron').remote.process.argv;
	  if (argv_array.length > 2) {
	      console.log("argv[2] is:");
	      console.log(argv_array[2]);
	      // load file specified on command line

	      
	      //filename=path.basename(argv_array[2]);
	      var filepath=path.resolve(argv_array[2]);
	      filename = path.basename(filepath); // set global
	      change_working_directory(path.dirname(filepath));
	      console.log('calling readFile()');
	      console.log(filepath);
	      fs.readFile(filepath, 'utf8', (err, data) => {
		  if (err) throw err;
		  editor.setContent(data);
	      });
	  
	  } else {
	      // initialize with blank document 
	      editor.setContent(`<?xml version="1.0" encoding="utf-8"?>
<?xml-stylesheet type="text/xsl" href="topic.xsl"?>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>Enter Page Title Here</title>
<!-- <meta name="keywords" content=""/> --> <!-- keywords separated by commas and spaces -->
<!-- <meta name="description" content=""/> -->
<!-- <meta name="author" content=""/>  -->
</head>
<body>
<p>
Enter content here.
</p><p>Try to use relative sizing for  
images (use percentage under Dimensions and Check "constrain proportions")
</p><p>  
Be sure to set the metadata (under File... Document Properties). In 
particular the title must match exactly either the navigation 
name or navigation shortname for the page.  
</p>
</body>
</html>
`);
	  }
      });
  }
}	     // end of init() call...	     
	    );
