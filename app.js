const express = require('express');
const expressHandlebars = require('express-handlebars')
const app = express();
const port = 3000;
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const arrUserInfo =[]
const config = require('config')

let xirsys = config.get('xirsys')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main',
}))
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'))

app.get('/',function(req,res){
    res.render('call')
})

io.on('connection', socket => {
    socket.on('NGUOI_DUNG_DANG_KY',user=>{
        const isExist = arrUserInfo.some(e => e.ten === user.ten)
        socket.peerId = user.peerId;
        if(isExist){
            return socket.emit('DANG_KY_THAT_BAI');
        }
        arrUserInfo.push(user);
        socket.emit('DANH_SACH_ONLINE',arrUserInfo);
        socket.broadcast.emit('NEW',user);
    })
    socket.on('disconnect',()=>{
        const index = arrUserInfo.findIndex(user => user.peerId===socket.peerId);
        arrUserInfo.splice(index,1)
        io.emit('NGAT_KET_NOI',socket.peerId);
    })
});
  
server.listen(process.env.PORT||3000, () => {
    console.log('listening on *:3000');
});
// server.listen(process.env.PORT, () => {
//     console.log('listening on *:3000');
// });

//custom 404 page
app.use((req, res) => {
    res.type('/text/plain');
    res.status(404);
    res.send('404 - not found');
})

//custom 500 page
app.use((err, req, res, next) => {
    console.error(err.message);
    res.type('text/plain');
    res.status(500);
    res.send('500 - server error');
})
// app.listen(port, () => console.log(
//     `Dang chay o port ${port};` + 'nhan Ctrl - C de dung lai'
// ))
