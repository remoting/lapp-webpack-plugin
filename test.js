 
var fs = require("fs");
var crypto = require('crypto');

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

md5("D:/project/app001/dist/app.zip","D:/project/app001/dist")