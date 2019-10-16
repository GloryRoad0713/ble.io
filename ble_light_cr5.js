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

/*
  //光の位置の変更関係
  $('#p01_text').change(function() {
    changelightPosition();
  });

  $('#p04_text').change(function() {
    changelightPosition();
  });

  $("#bright_down").on( 'input', function (event) {
    changeBlightValue(event.type);
  });

  $("#bright_down").on( 'change', function (event) {
    changeBlightValue(event.type);
  });
  */


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

  $("#send4").click(function(event){
    var val = $(this).val()
    //console.log("InterruptLight value = " + val);
    sendInterruptLight(val);
  });

  $("#send5").click(function(event){
    var val = $(this).val()
    //console.log("InterruptLight value = " + val);
    sendInterruptLight(val);
  });

  $("#send6").click(function(event){
    var val = $(this).val()
    //console.log("InterruptLight value = " + val);
    sendInterruptLight(val);
  });

  $("#send7").click(function(event){
    var val = $(this).val()
    //console.log("InterruptLight value = " + val);
    sendInterruptLight(val);
  });

  $("#send8").click(function(event){
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

    //setTimeout(changelightPosition, 200);
    //setTimeout(changeBlightValue, 400, "change");
    //setTimeout(changeBlendValue, 600, "change");
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
  //var select_light_loop_num = $("#light_loop_num").val();
  var select_light_loop_num = 1;

  if(_num_str == 1 || _num_str == 2){
    select_light_loop_num = 'n';
  }
  else if(_num_str == 5){
    select_light_loop_num = 3;
  }

  var text = "i" + _num_str + "," + select_light_loop_num;
  var arrayBuffe = new TextEncoder().encode(text);

  setTimeout(function(){
    characteristic.writeValue(arrayBuffe);
    console.log("send InterruptLight signal = " + text)
  },200);

  //playSound(_num_str);
}

//音の処理
/*
function playSound(_num_str){
  var num = Number(_num_str) - 1;

  if(10 <= num){
    num = num - 2;
  }
  //var c_name = "check" + String(num);
  //var o_name = "output" + String(num);
  //var c_state = $("[id=" + c_name + "]").prop("checked");
  //var delay_time = $("[id=" + o_name + "]").val()*1000;
  var delay_time = 0;
  //var duration = audio_list[num].duration * 1000;
  console.log("sound_num = " + num);
  console.log(sound_links[num].name + " : " * sound_links[num].link);

  if(0 <= pre_play_num){
    audio_list[pre_play_num].pause();
    audio_list[pre_play_num].currentTime = 0;
    audio_count[pre_play_num] = 10000;
    clearInterval(timerId);
  }
  //音のループ処理関係
  var select_sound_loop_num = $("#sound_loop_num").val();

  //console.log("duration = " + String(audio_list[num].duration * 1000));


  if(0 <= num){
    setTimeout(function(){
      playSoundLoop(num, select_sound_loop_num, audio_list[num].duration * 1000);

    },delay_time);
  }


  console.log("delay_time = " + delay_time);

  pre_play_num = num;
  console.log("pre_play_num = " + pre_play_num);

}
*/

/*
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
*/

//BEL切断処理
function disconnect() {
  if (!bluetoothDevice || !bluetoothDevice.gatt.connected) return ;
  bluetoothDevice.gatt.disconnect();
  alert("BLE接続を切断しました。")
}

//LEDの光位置の変更処理
/*
function changelightPosition(){
  if (!bluetoothDevice || !bluetoothDevice.gatt.connected || !characteristic) return ;

  var position_sgiganl = "p" + $("#p01_text").val() + "," + $("#p01_text").val() + "," + $("#p01_text").val() + "," + $("#p04_text").val();
  console.log("position_sgiganl = " + position_sgiganl);
  characteristic.writeValue(new TextEncoder().encode(position_sgiganl));
  //console.log("send position signal")
}

function changeBlendValue(_type){
  if (!bluetoothDevice || !bluetoothDevice.gatt.connected || !characteristic) return ;
  //var blend_value = "b" + $("#blend").val();
  var blend_value = "b100";
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
*/


/*
function changeBlightValue(_type){
  console.log(_type);
  if (!bluetoothDevice || !bluetoothDevice.gatt.connected || !characteristic) return ;
  var bright_value = "br" + $("#bright_down").val() + "," + $("#bright_down").val() + "," + $("#bright_down").val();

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
*/
