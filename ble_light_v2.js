var sound_links = [{link:"https://drive.google.com/uc?id=1UWVthywo-cLWRAafPUgCJDa4WnVMIPGw", name:"01"},
                   {link:"https://drive.google.com/uc?id=11hceyP4BjvHF7cBBKHMfxPdRNtIenxG2", name:"02"},
                   {link:"https://drive.google.com/uc?id=1-TN4fAtIb2KJkJkSeKwOT-rwcyWYsLqE", name:"03"},
                   {link:"https://drive.google.com/uc?id=1l3yD9RbjGQaCrqpLxXKm6VKYwkdvawdZ", name:"04"},
                   {link:"https://drive.google.com/uc?id=1-4aQLpD5XgxGBTOtKwtidITIkRpMJh2w", name:"05"},
                   {link:"https://drive.google.com/uc?id=18LlOcMmZo2uJB_sxlsaALApnBcoFyjv9", name:"06"},
                   {link:"https://drive.google.com/uc?id=1Lwwtjp8Ltjec4sS8qCZv66VxBq8oJSXO", name:"07"},
                   {link:"https://drive.google.com/uc?id=1s6CBqsp3P_cqTkWA5TmYUWcQ_mfSHgOG", name:"08"}];
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

document.addEventListener("DOMContentLoaded", function(){
    document.body.addEventListener('click', function (event) {
        ble_state = $("check_ble_connect").prop("checked");
        console.log(ble_state);
      //console.log(event.target.value);
        if(event.target.id = "check_ble_connect" && ble_state == true){
          connect();
        }
        else if(ble_state == false){
          disconnect();
        }

        if(event.target.id = "send"){
          sendMessage(event.target.value);
        }

    }, false)
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
  light_loop_state = $("check_light_loop").prop("checked");
  sound_loop_state = $("check_sound_loop").prop("checked");

  if(light_loop_state == true){
    characteristic.writeValue(TextEncoder().encode("l1"));
  }
  else{
    characteristic.writeValue(TextEncoder().encode("l0"));
  }

  var text = _num_str;
  var arrayBuffe = new TextEncoder().encode(text);

  setTimeout(function(){
    characteristic.writeValue(arrayBuffe);
  },50);

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

  if(c_state == true){
    setTimeout(function(){
      audio_list[Number(_num_str)].pause();
      audio_list[Number(_num_str)].currentTime = 0;
      audio_list[Number(_num_str)].play();
    },delay_time);
  }
  console.log(delay_time);

  pre_play_num = _num_str;

}
//BEL切断処理
function disconnect() {
  if (!bluetoothDevice || !bluetoothDevice.gatt.connected) return ;
  bluetoothDevice.gatt.disconnect();
  alert("BLE接続を切断しました。")
}
