var sound_links = [{link:"https://dl.dropboxusercontent.com/s/62b9cmkxx109nev/01_sound.mp3", name:"01"},
                   {link:"https://dl.dropboxusercontent.com/s/s3fgpg3niutrljd/02_sound.mp3", name:"02"},
                   {link:"https://dl.dropboxusercontent.com/s/j3quvvsrnqes32m/03_sound.mp3", name:"03"},
                   {link:"https://dl.dropboxusercontent.com/s/yxrfy5kegcdug80/04_sound.mp3", name:"04"},
                   {link:"https://dl.dropboxusercontent.com/s/e74cx8wjnbbsyb5/05_sound.mp3", name:"05"},
                   {link:"https://dl.dropboxusercontent.com/s/0em3gqmewk91acx/06_sound.mp3", name:"06"},
                   {link:"https://dl.dropboxusercontent.com/s/xjv58j2r600dlqr/07_sound.mp3", name:"07"},
                   {link:"https://dl.dropboxusercontent.com/s/fi70pfrtqagbcf6/08_sound.mp3", name:"08"}];


audio_list = new Array(8);
for(var i=0; i < audio_list.length; i++){
    audio_list[i] = new Audio();
    audio_list[i].src = sound_links[i].link;
    audio_list[i].preload ="auto";

    //console.log(sound_links[i].link);
}

var bluetoothDevice;
var characteristic;
//chibi:bit BLE UUID
var LED_SERVICE_UUID                        = '000000ff-0000-1000-8000-00805f9b34fb';
var LED_TEXT_CHARACTERISTIC_UUID            = '0000ff01-0000-1000-8000-00805f9b34fb';
//ボタンイベントリスナー
//d3.select("#connect").on("click", connect);
//d3.select("#disconnect").on("click", disconnect);
//d3.select("#send").on("click", sendMessage);
var ble_state = false;
var light_loop_state = false;
var sound_loop_state = false;
var pre_play_num = "0";


$(function(){
  $("#check_ble_connect").click(function(){
    if (this.checked) {
        connect();
    } else {
        disconnect();
    }    
  });
  
  
  $("#check_light_loop").click(function(){
    if (this.checked) {
        light_loop_state = true;
        console.log("light_loop_state is true");
    } else {
        light_loop_state = false;
       console.log("light_loop_state is false");
    }
  });
  
  $("#check_sound_loop").click(function(){
    if (this.checked) {
        sound_loop_state = true;
        console.log("sound_loop_state is true");
    } else {
        sound_loop_state = false;
        console.log("sound_loop_state is false");
    }
  });
  
  $("#send").click(function(event){
    sendMessage(event.target.value);
    console.log("pressed button");
  });
  
});

/*
document.addEventListener("DOMContentLoaded", function(){
  document.body.addEventListener('click', function (event) {
      if(event.target.id = "send"){
        sendMessage(event.target.value);
      }
  }, false);
}, false);
*/

//chibi:bitに接続する
function connect() {
  let options = {};

  //options.acceptAllDevices = true;

  options.filters = [
    {services: [LED_SERVICE_UUID]},
    {name: "ESP_GATTS_DEMO"}
  ];

  navigator.bluetooth.requestDevice(options)
  .then(device => {
    bluetoothDevice = device;
    console.log("device", device);
    return device.gatt.connect();
  })
  .then(server =>{
    console.log("server", server)
    return server.getPrimaryService(LED_SERVICE_UUID);
  })
  .then(service => {
    console.log("service", service)
    return service.getCharacteristic(LED_TEXT_CHARACTERISTIC_UUID)
  })
  .then(chara => {
    console.log("characteristic", chara)
    alert("BLE接続が完了しました。");
    characteristic = chara;
  })
  .catch(error => {
    console.log(error);
  });
}
//ESP32に値を送信
function sendMessage(_num_str) {
  //console.log(_num_str);
  if (!bluetoothDevice || !bluetoothDevice.gatt.connected || !characteristic) return ;
  //light_loop_state = $("check_light_loop").prop("checked");
  //sound_loop_state = $("check_sound_loop").prop("checked");

  if(light_loop_state == true){
    characteristic.writeValue(new TextEncoder().encode("l1"));
    console.log("send light loop signal")
  }
  else{
    characteristic.writeValue(new TextEncoder().encode("l0"));
    console.log("send light not-loop signal")
  }

  var text = _num_str;
  var arrayBuffe = new TextEncoder().encode(text);

  setTimeout(function(){
    characteristic.writeValue(arrayBuffe);
  },100);

  playSound(_num_str);
}


function playSound(_num_str){
  var c_name = "check" + _num_str;
  var o_name = "output" + _num_str;
  var c_state = $("[id=" + c_name + "]").prop("checked");
  var delay_time = $("[id=" + o_name + "]").val()*1000;

  audio_list[Number(pre_play_num)].pause();

  if(sound_loop_state == true){
    audio_list[Number(_num_str)].loop = true;
  }
  else{
    audio_list[Number(_num_str)].loop = false;
  }
  
  console.log("c_state = " + c_state);
  
  if(c_state == true){
    setTimeout(function(){
      audio_list[Number(_num_str)].pause();
      audio_list[Number(_num_str)].currentTime = 0;
      audio_list[Number(_num_str)].play();
    },delay_time);
  }
  console.log("delay_time = " + delay_time);

  pre_play_num = _num_str;

}
//BEL切断処理
function disconnect() {
  if (!bluetoothDevice || !bluetoothDevice.gatt.connected) return ;
  bluetoothDevice.gatt.disconnect();
  alert("BLE接続を切断しました。")
}
