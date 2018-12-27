var sound_links = [{link:"https://dl.dropboxusercontent.com/s/i8gsheqfsopckxj/09_sound.mp3", name:"01"},
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

var timerId;

$(function(){
  $("#check_ble_connect").click(function(){
    if (this.checked) {
        connect();
    } else {
        disconnect();
    }
  });

  //光の位置の変更関係
  $('#p01_text').change(function() {
    changelightPosition();
  });
  $('#p02_text').change(function() {
    changelightPosition();
  });
  $('#p03_text').change(function() {
    changelightPosition();
  });
  $('#p04_text').change(function() {
    changelightPosition();
  });

  $("#send0").click(function(event){
    var val = $(this).val()
    sendMessage(val);
  });

  $("#send1").click(function(event){
    var val = $(this).val()
    sendMessage(val);
  });

  $("#send2").click(function(event){
    var val = $(this).val()
    sendMessage(val);
  });

  $("#send3").click(function(event){
    var val = $(this).val()
    sendMessage(val);
  });
  $("#send4").click(function(event){
    var val = $(this).val()
    sendMessage(val);
  });

  $("#send5").click(function(event){
    var val = $(this).val()
    sendMessage(val);
  });

  $("#send6").click(function(event){
    var val = $(this).val()
    sendMessage(val);
  });

  $("#send7").click(function(event){
    var val = $(this).val()
    sendMessage(val);
  });

  $("#send8").click(function(event){
    var val = $(this).val()
    sendMessage(val);
  });
});



document.addEventListener("DOMContentLoaded", function(){
  document.body.addEventListener('click', function (event) {
      if(event.target.id == "send"){
        console.log("pressed button");
        sendMessage(event.target.value);
      }
  }, false);
}, false);


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

  //光のループ処理関係
  var select_light_loop_num = $("#light_loop_num").val();

  var text = _num_str + "," + select_light_loop_num;
  var arrayBuffe = new TextEncoder().encode(text);

  setTimeout(function(){
    characteristic.writeValue(arrayBuffe);
    console.log("send InterruptLight signal = " + text)
  },200);

  playSound(_num_str);
}


//音の処理
function playSound(_num_str){
  var num = Number(_num_str) - 11;
  var c_name = "check" + String(num);
  var o_name = "output" + String(num);
  var c_state = $("[id=" + c_name + "]").prop("checked");
  var delay_time = $("[id=" + o_name + "]").val()*1000;
  //var duration = audio_list[num].duration * 1000;

  if(0 <= pre_play_num){
    audio_list[pre_play_num].pause();
    audio_list[pre_play_num].currentTime = 0;
    audio_count[pre_play_num] = 10000;
    clearInterval(timerId);
  }
  //音のループ処理関係
  var select_sound_loop_num = $("#sound_loop_num").val();

  //console.log("duration = " + String(audio_list[num].duration * 1000));

  if(c_state == true){
    setTimeout(function(){
      //audio_list[num].load();
      //print("duration = " + audio_list[num].duration);
      playSoundLoop(num, select_sound_loop_num, audio_list[num].duration * 1000);

    },delay_time);
  }
  console.log("delay_time = " + delay_time);

  pre_play_num = num;
  console.log("pre_play_num = " + pre_play_num);

}

function playSoundLoop(_num, _count, _duration){
  audio_list[_num].pause();
  audio_count[_num] = 1;

  audio_list[_num].currentTime = 0;
  audio_list[_num].play();

  console.log(audio_count[_num] + ", _count = " + _count);

  audio_count[_num]++;

  timerId = setInterval(function(){
    if (audio_count[_num] > _count){
      clearInterval(timerId);
      return;
    }

    audio_list[_num].currentTime = 0;
    audio_list[_num].play();

    console.log(audio_count[_num] + ", _count = " + _count);
    audio_count[_num]++;

  },_duration - 200)
  //}duration
}


//BEL切断処理
function disconnect() {
  if (!bluetoothDevice || !bluetoothDevice.gatt.connected) return ;
  bluetoothDevice.gatt.disconnect();
  alert("BLE接続を切断しました。")
}
