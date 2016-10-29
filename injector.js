// get all the module.json's in pages/*/, return them
var fs = require('fs');
var path = require('path');
var os = require('os');

const PAGES_DIR = path.join(__dirname, "public", "pages");

var pageFolders = fs.readdirSync(PAGES_DIR);
var moduleData = pageFolders
    .map(function (name) {
        var modulefilename = path.join(PAGES_DIR, name, "module.json");
        var entryPath = path.join("public", "pages", name, "index.html");
        try {
            return {entryPath: entryPath, module: JSON.parse(fs.readFileSync(modulefilename, 'utf8'))};
        } catch (e) {
            return {entryPath: entryPath, error: "no module.json found", module: { title: name }};
        }
    })
    .filter(function (x) {
        return x;
    });

console.log(moduleData.length, "modules detected.");

var Injector = {
    readModules: function (){
        return moduleData;
    }
}

module.exports = Injector;
