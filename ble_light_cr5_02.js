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

  $("#base_light_01").click(function(){
    sendInterruptLight();
  });
  
  $("#base_light_02").click(function(){
    sendInterruptLight();
  });
  
  $("#base_light_03").click(function(){
    sendInterruptLight();
  });
  
  $("#base_light_04").click(function(){
    sendInterruptLight();
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

  })
  .catch(error => {
    console.log(error);
  });


}
//ESP32に値を送信
function sendInterruptLight(){
  if (!bluetoothDevice || !bluetoothDevice.gatt.connected || !characteristic) return ;
  var selected_base = $("input[name='radio1']:checked").val();
  //characteristic.writeValue(new TextEncoder().encode(selected_base));
  //console.log("selected_base = " + selected_base);

  //光のループ処理関係
  //var select_light_loop_num = $("#light_loop_num").val();
  var select_light_loop_num = 1;
  
  if(selected_base == 0){
    select_light_loop_num = 'n';
  }

  var text = "i" + selected_base + "," + select_light_loop_num;
  var arrayBuffe = new TextEncoder().encode(text);
  //console.log("send InterruptLight signal = " + text)
  setTimeout(function(){
    characteristic.writeValue(arrayBuffe);
    console.log("send InterruptLight signal = " + text)
  },200);
}


//BEL切断処理
function disconnect() {
  if (!bluetoothDevice || !bluetoothDevice.gatt.connected) return ;
  bluetoothDevice.gatt.disconnect();
  alert("BLE接続を切断しました。")
}
