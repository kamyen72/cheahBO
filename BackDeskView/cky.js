let express = require('express');
//載入express模組
const bodyParser = require('body-parser');
const path = require('path');
try {
    const edge = require('edge');
}
catch (error) {
    alert(error.message);
}
//開cors
const cors = require('cors');
let app = express();
app.use(cors())
// 使用express
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const env =process.argv[2]
if (env=='dev'){
    app.use(express.static(path.join(__dirname)));
}else{
    app.use(express.static(path.join(__dirname,'build')));
}

// console.log("http://localhost:44306/#!/Lobby?key=token%3DBABAAABZZ72%26symbol%3DHKL%26technology%3DH5%26platform%3DWeb%26language%3Den%26APID%3DHL20210416%26IsStaging%3DTrue")
console.log("http://localhost:44306/#!/winLoseReportByGame")

//設定port位置
let port = 44306;
// 監聽 port
app.listen(port);
