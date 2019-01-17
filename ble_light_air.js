var sound_links = [{link:"https://dl.dropboxusercontent.com/s/62b9cmkxx109nev/01_sound.mp3", name:"01"},
                   {link:"https://dl.dropboxusercontent.com/s/s3fgpg3niutrljd/02_sound.mp3", name:"02"},
                   {link:"https://dl.dropboxusercontent.com/s/j3quvvsrnqes32m/03_sound.mp3", name:"03"},
                   {link:"https://dl.dropboxusercontent.com/s/yxrfy5kegcdug80/04_sound.mp3", name:"04"},
                   {link:"https://dl.dropboxusercontent.com/s/e74cx8wjnbbsyb5/05_sound.mp3", name:"05"},
                   {link:"https://dl.dropboxusercontent.com/s/0em3gqmewk91acx/06_sound.mp3", name:"06"},
                   {link:"https://dl.dropboxusercontent.com/s/xjv58j2r600dlqr/07_sound.mp3", name:"07"},
                   {link:"https://dl.dropboxusercontent.com/s/fi70pfrtqagbcf6/08_sound.mp3", name:"08"},
                   {link:"https://dl.dropboxusercontent.com/s/2vv6q8z78z7rdwt/11_sound.mp3", name:"11"},
                   {link:"https://dl.dropboxusercontent.com/s/w8qxiw1wtt0clyi/12_sound.mp3", name:"12"},
                   {link:"https://dl.dropboxusercontent.com/s/kp7qe5m5oy4xrvq/13_sound.mp3", name:"13"}];

audio_list = new Array(11);
//audio_duration = new Array(8);
audio_count = new Array(11);
for(var i=0; i < audio_list.length; i++){
    audio_list[i] = new Audio();
    audio_list[i].src = sound_links[i].link;
    audio_list[i].preload ="auto";
    audio_count[i] = 0;
    //console.log(audio_list[i].src);
}

//var audio_count = 0;

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

  $("#base_light").click(function(){
    changeBageLight();
  });

  $("#blend").on( 'input', function (event) {
    changeBlendValue(event.type);
  });

  $("#blend").on( 'change', function (event) {
    changeBlendValue(event.type);
  });

  $("#bright_up").on( 'input', function (event) {
    changeBlightValue(event.type);
  });

  $("#bright_up").on( 'change', function (event) {
    changeBlightValue(event.type);
  });

  $("#bright_down").on( 'input', function (event) {
    changeBlightValue(event.type);
  });

  $("#bright_down").on( 'change', function (event) {
    changeBlightValue(event.type);
  });


  $("#send0").click(function(event){
    var val = $(this).val()
    //console.log("InterruptLight value = " + val);
    sendInterruptLight(val);
  });

  $("#send1").click(function(event){
    var val = $(this).val()
    //console.log("InterruptLight value = " + val);
    sendInterruptLight(val);
  });

  $("#send2").click(function(event){
    var val = $(this).val()
    //console.log("InterruptLight value = " + val);
    sendInterruptLight(val);
  });

  $("#send3").click(function(event){
    var val = $(this).val()
    //console.log("InterruptLight value = " + val);
    sendInterruptLight(val);
  });

});

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

    setTimeout(changelightPosition, 200);
    setTimeout(changeBageLight, 400);
    setTimeout(changeBlendValue, 600, "change");
    setTimeout(changeBlightValue, 800, "change");
  })
  .catch(error => {
    console.log(error);
  });


}
//ESP32に値を送信
function sendInterruptLight(_num_str) {
  //console.log(_num_str);
  if (!bluetoothDevice || !bluetoothDevice.gatt.connected || !characteristic) return ;

  //光のループ処理関係
  var select_light_loop_num = $("#light_loop_num").val();

  var text = "i" + _num_str + "," + select_light_loop_num;
  var arrayBuffe = new TextEncoder().encode(text);

  setTimeout(function(){
    characteristic.writeValue(arrayBuffe);
    console.log("send InterruptLight signal = " + text)
  },200);

  playSound(_num_str);
}

//音の処理
function playSound(_num_str){
  var num = Number(_num_str) - 1;

  if(11 < num){
    num = num - 3;
  }
  //var c_name = "check" + String(num);
  //var o_name = "output" + String(num);
  //var c_state = $("[id=" + c_name + "]").prop("checked");
  //var delay_time = $("[id=" + o_name + "]").val()*1000;
  var delay_time = 0;
  //var duration = audio_list[num].duration * 1000;

  console.log(sound_links[num].name);

  if(0 <= pre_play_num){
    audio_list[pre_play_num].pause();
    audio_list[pre_play_num].currentTime = 0;
    audio_count[pre_play_num] = 10000;
    clearInterval(timerId);
  }
  //音のループ処理関係
  var select_sound_loop_num = $("#sound_loop_num").val();

  //console.log("duration = " + String(audio_list[num].duration * 1000));


  if(num < 0){
    setTimeout(function(){
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

//LEDの光位置の変更処理
function changelightPosition(){
  if (!bluetoothDevice || !bluetoothDevice.gatt.connected || !characteristic) return ;

  var position_sgiganl = "p" + $("#p01_text").val() + "," + $("#p02_text").val() + "," + $("#p03_text").val() + "," + $("#p04_text").val();
  console.log("position_sgiganl = " + position_sgiganl);
  characteristic.writeValue(new TextEncoder().encode(position_sgiganl));
  //console.log("send position signal")
}

//ベースの光の変更処理
function changeBageLight(){
  if (!bluetoothDevice || !bluetoothDevice.gatt.connected || !characteristic) return ;
  var selected_base = $("input[name='radio1']:checked").val();
  characteristic.writeValue(new TextEncoder().encode(selected_base));
  console.log("selected_base = " + selected_base);

  playSound(selected_base);
}

function changeBlendValue(_type){
  if (!bluetoothDevice || !bluetoothDevice.gatt.connected || !characteristic) return ;
  var blend_value = "b" + $("#blend").val();
  if(_type == "input"){
    console.log("【input】blend value = " + blend_value);
    characteristic.writeValue(new TextEncoder().encode(blend_value));
  }
  else{
    setTimeout(function(){
      console.log("【changed】blend value = " + blend_value);
      characteristic.writeValue(new TextEncoder().encode(blend_value));
    },200);
  }
}


function changeBlightValue(_type){
  console.log(_type);
  if (!bluetoothDevice || !bluetoothDevice.gatt.connected || !characteristic) return ;
  var bright_value = "br" + $("#bright_up_back").val() + "," + $("#bright_down").val();
  //var bright_value = "br" + $("#bright_up_front").val() + "," + $("#bright_up_back").val() + "," + $("#bright_down").val();
  if(_type == "input"){
    console.log("【input】bright value = " + bright_value);
    characteristic.writeValue(new TextEncoder().encode(bright_value));
  }
  else{
    setTimeout(function(){
      console.log("【changed】bright value = " + bright_value);
      characteristic.writeValue(new TextEncoder().encode(bright_value));
    },200);
  }
}
