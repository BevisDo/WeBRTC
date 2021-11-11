const socket = io('http://localhost:3000');

$('#chat').hide();

socket.on('DANH_SACH_ONLINE',arrUserInfo=>{
    $('#chat').show();
    $('#sign').hide();
    arrUserInfo.forEach(user=>{
        const {ten,peerId} = user;
        $('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
    })
    socket.on('NEW',user=>{
        const {ten,peerId} = user;
        $('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
    })
    socket.on('NGAT_KET_NOI',peerId=>{
        $('#${peerId}').remove();
    })
})

socket.on('DANG_KY_THAT_BAI',()=> alert('Dat lai!'))

function openStream(){
    const config = {Audio: false, video: true};
    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag,stream){
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}

// openStream()
// .then(stream => playStream('localStream',stream));

//Tao id nguoi goi
const peer = new Peer(/*{key:'peerjs',host:'9000-rose-parrot-zmguzpj2.ws-us18.gitpod.io',secure: true, port:443}*/); 
peer.on('open',id => {
    $('#my-id').append(id);
    $('#btnSign').click(()=>{
        const userName = $('#userName').val();
        socket.emit('NGUOI_DUNG_DANG_KY',{ten: userName, peerId: id});
    });
});

//nguoi goi
$('#btnCall').click(()=>{
    const id = $('#remote-id').val();
    openStream()
    .then(stream=>{
        playStream('localStream',stream);
        const call = peer.call(id,stream);
        call.on('stream', remoteStream => playStream('remoteStream',remoteStream));       
    })
})

//nguoi nhan
peer.on ('call',call=>{
    openStream()
    .then(stream=>{
        call.answer(stream);
        playStream('localStream',stream);
        call.on('stream',remoteStream =>playStream('remoteStream',remoteStream));
    })
})

$('#ulUser').on('click','li',function(){
    const id = $(this).attr('id');
    openStream()
    .then(stream=>{
        playStream('localStream',stream);
        const call = peer.call(id,stream);
        call.on('stream', remoteStream => playStream('remoteStream',remoteStream));       
    })
})
