/*
var sound_links = [{link:"https://drive.google.com/uc?id=1UWVthywo-cLWRAafPUgCJDa4WnVMIPGw", name:"01"},
                   {link:"https://drive.google.com/uc?id=11hceyP4BjvHF7cBBKHMfxPdRNtIenxG2", name:"02"},
                   {link:"https://drive.google.com/uc?id=1-TN4fAtIb2KJkJkSeKwOT-rwcyWYsLqE", name:"03"},
                   {link:"https://drive.google.com/uc?id=1l3yD9RbjGQaCrqpLxXKm6VKYwkdvawdZ", name:"04"},
                   {link:"https://drive.google.com/uc?id=1-4aQLpD5XgxGBTOtKwtidITIkRpMJh2w", name:"05"},
                   {link:"https://drive.google.com/uc?id=18LlOcMmZo2uJB_sxlsaALApnBcoFyjv9", name:"06"},
                   {link:"https://drive.google.com/uc?id=1Lwwtjp8Ltjec4sS8qCZv66VxBq8oJSXO", name:"07"},
                   {link:"https://drive.google.com/uc?id=1s6CBqsp3P_cqTkWA5TmYUWcQ_mfSHgOG", name:"08"}];
*/

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
    //audio_list[i].loop = true;
    
    //console.log(sound_links[i].link);
}

var pre_select_num = 0;

var bluetoothDevice;
var characteristic;
//chibi:bit BLE UUID
var LED_SERVICE_UUID                        = '000000ff-0000-1000-8000-00805f9b34fb';
var LED_TEXT_CHARACTERISTIC_UUID            = '0000ff01-0000-1000-8000-00805f9b34fb';
//ボタンイベントリスナー
d3.select("#connect").on("click", connect);
d3.select("#disconnect").on("click", disconnect);
//d3.select("#send").on("click", sendMessage);
document.body.addEventListener('click', function (event) {
  //console.log(event.target.value);
    if(event.target.id = "send"){
      sendMessage(event.target.value);
    }

}, false)
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
  //console.log(_num);
  
  var text = _num_str;
  var arrayBuffe = new TextEncoder().encode(text);
  
  /*
  console.log(text);
  if(_num_str == '0' || _num_str == '4' || _num_str == '7' || _num_str == '8'){
      console.log("loop off");
      var loopBuffe = new TextEncoder().encode("l0");
      characteristic.writeValue(loopBuffe);
  }
  else{
      console.log("loop on");
      var arrayBuffe = new TextEncoder().encode("l1");
      characteristic.writeValue(loopBuffe);
  }
  */
  //setTimeout(function(){
  characteristic.writeValue(arrayBuffe);
  //},100);
             
  playSound(_num_str);

}
function playSound(_num_str){
  if(Number(_num_str) == pre_select_num){
    audio_list[pre_select_num].pause();
    //audio_list[pre_select_num].currentTime = 0;
  }
  var c_name = "check" + _num_str;
  var o_name = "output" + _num_str;
  var c_state = $("[id=" + c_name + "]").prop("checked");
  var delay_time = $("[id=" + o_name + "]").val()*1000;
  if(c_state == true){
    setTimeout(function(){
      audio_list[Number(_num_str)].pause();
      audio_list[Number(_num_str)].currentTime = 0;
      audio_list[Number(_num_str)].play();
    },delay_time);
  }
  console.log(delay_time);
  pre_select_num = Number(_num_str);
}
//BEL切断処理
function disconnect() {
  if (!bluetoothDevice || !bluetoothDevice.gatt.connected) return ;
  bluetoothDevice.gatt.disconnect();
  alert("BLE接続を切断しました。")
}
