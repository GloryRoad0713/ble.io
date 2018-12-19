
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
    changeBlendValue(event);
  });

  $("#blend").on( 'change', function (event) {
    changeBlendValue(event);
  });

  $("#bright_up").on( 'input', function (event) {
    changeBlightValue(event);
  });

  $("#bright_up").on( 'change', function (event) {
    changeBlightValue(event);
  });

  $("#bright_down").on( 'input', function (event) {
    changeBlightValue(event);
  });

  $("#bright_down").on( 'change', function (event) {
    changeBlightValue(event);
  });


  $("#send0").click(function(event){
    var val = $(this).val()
    console.log("InterruptLight value = " + val);
    sendInterruptLight(val);
  });

  $("#send1").click(function(event){
    var val = $(this).val()
    console.log("InterruptLight value = " + val);
    sendInterruptLight(val);
  });

  $("#send2").click(function(event){
    var val = $(this).val()
    console.log("InterruptLight value = " + val);
    sendInterruptLight(val);
  });

  $("#send3").click(function(event){
    var val = $(this).val()
    console.log("InterruptLight value = " + val);
    sendInterruptLight(val);
  });

});

/*
document.addEventListener("DOMContentLoaded", function(){
  document.body.addEventListener('click', function (event) {
      if(event.target.id == "send"){
        console.log("pressed button");
        sendInterruptLight(event.target.value);
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
function sendInterruptLight(_num_str) {
  //console.log(_num_str);
  if (!bluetoothDevice || !bluetoothDevice.gatt.connected || !characteristic) return ;

/*
  console.log(_num_str)
  if (typeof _num_str === "undefined"){
    console.log("_num_strは未定義")
    return;
  }
*/

  //光のループ処理関係
  var select_light_loop_num = $("#light_loop_num").val();
  /*
  console.log("select_light_loop_num = " + select_light_loop_num)
  //if(select_light_loop_num != 0){
  characteristic.writeValue(new TextEncoder().encode(select_light_loop_num));
  console.log("send light " + String(select_light_loop_num) + " times loop signal")

  }
  else{
    characteristic.writeValue(new TextEncoder().encode("ln"));
    console.log("send light loop signal")
  }
*/
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
  var c_name = "check" + _num_str;
  var o_name = "output" + _num_str;
  var c_state = $("[id=" + c_name + "]").prop("checked");
  var delay_time = $("[id=" + o_name + "]").val()*1000;

  audio_list[Number(pre_play_num)].pause();

  //音のループ処理関係
  var select_sound_loop_num = $("#sound_loop_num").val();
  if(select_sound_loop_num != 0){
    //characteristic.writeValue(new TextEncoder().encode("l" + String(select_sound_loop_num)));
    //console.log("send sound " + String(select_sound_loop_num) + " times loop signal")
  }
  else{
    //characteristic.writeValue(new TextEncoder().encode("ln"));
    //console.log("send sound loop signal")
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
}

function changeBlendValue(_event){
  if (!bluetoothDevice || !bluetoothDevice.gatt.connected || !characteristic) return ;
  var blend_value = "b" + $("#blend").val();
  if(_event.type == "input"){
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


function changeBlightValue(_event){
  console.log(_event.type);
  if (!bluetoothDevice || !bluetoothDevice.gatt.connected || !characteristic) return ;
  var bright_value = "br" + $("#bright_up").val() + "," + $("#bright_down").val();
  if(_event.type == "input"){
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
