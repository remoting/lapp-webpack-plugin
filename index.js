 
var fs = require("fs");
var crypto = require('crypto');
var archiver = require('archiver');
var PLUGIN_NAME = "LappWebpackPlugin"

function LappWebpackPlugin(options) {
    console.log("LappWebpackPlugin Init")
}
function md5(appZip,dist){
    const buffer = fs.readFileSync(appZip);
    const hash = crypto.createHash('md5');
    hash.update(buffer, 'utf8');
    const md5 = hash.digest('hex');
    var file=dist+"/app.json";
    var result=JSON.parse(fs.readFileSync(file));
    result.md5 = md5;
    console.log("file:",appZip,",md5:",md5)
    fs.writeFileSync(file, JSON.stringify(result,undefined,2));
}
async function zip(directory){
    var appZip = directory+'/app.zip'
    var output = fs.createWriteStream(appZip);
    output.on('close', function() {
        md5(appZip,directory)
        console.log("LappWebpackPlugin done")
    });
    var archive = archiver('zip', {
        zlib: { level: 9 }
    });
    archive.on('error', function(err){
        throw err;
    });   
    archive.pipe(output);
    archive.directory(directory,"/", function(data) {
        if (data.name === 'app.json') {
          return false;
        }
        if (data.name === 'app.zip') {
            return false;
        }
        return data;
    });
    await archive.finalize();
}
LappWebpackPlugin.prototype.apply = function(compiler) {
    compiler.hooks.afterEmit.tap(PLUGIN_NAME, async (compilation) => {
        if(compiler.options.mode == "production"){
            await zip(compiler.outputPath)
        }
    });
};

module.exports = LappWebpackPlugin;