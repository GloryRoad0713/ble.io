<!DOCTYPE html>
<html>
  <head>
    <title>ble-control</title>
    <link rel="stylesheet" type="text/css" href="style_air.css">
    <script src="https://d3js.org/d3.v5.min.js"></script>
    <script src="https://unpkg.com/ionicons@4.4.8/dist/ionicons.js"></script>
    <script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>-
    <script type="text/javascript" src="ble_light_air.js"></script>
  </head>
  <body>

    <div class="container">
      <div class="title margin">
          <p id="title">光と音のコントロール</p>
          <p id="subtitle">esp32との連携用(AC版)</p>
      </div>

      <br>

        <p class = "Catergory_text"><ion-icon name="bluetooth" class = "menu_icon"></ion-icon>Bluetooth接続</p>
        <div class="switch">
        <label class="switch__label" padding = "30px">
          <input type="checkbox" class="switch__input"/ id = "check_ble_connect">
          <span class="switch__content"></span>
          <span class="switch__circle"></span>
        </label>
      </div>

      <hr>

      <p class = "Catergory_text"><ion-icon name="infinite" class = "menu_icon"></ion-icon>割り込む光のループ再生回数</p>
      <div class="custom">
        <select name="options" id = "light_loop_num">
          <option value="1">ループしない</option>
          <option value="2">1回</option>
          <option value="3">2回</option>
          <option value="4">3回</option>
          <option value="5">4回</option>
          <option value="n">常にループ</option>
        </select>
      </div>

      <hr>

      <p class = "Catergory_text"><ion-icon name="infinite" class = "menu_icon"></ion-icon>割り込む音のループ再生</p>
      <div class="custom">
        <select name="options"  id = "sound_loop_num">
          <option value="1">ループしない</option>
          <option value="2">1回</option>
          <option value="3">2回</option>
          <option value="4">3回</option>
          <option value="5">4回</option>
          <option value="10000">常にループ</option>
        </select>
      </div>

      <hr>
      <p class = "Catergory_text"><ion-icon name="locate" class = "menu_icon"></ion-icon>LEDの位置</p>
      <div class="cp_iptxt">
        <label class="ef"><span>LED01</span>
        <input type="number"  value="1" id  = "p01_text" pattern="([1-9][0-9]*)">
        </label>
        <label class="ef"><span>LED02</span>
        <input type="number"  value="12" id  = "p02_text" pattern="([1-9][0-9]*)">
        </label>
        <label class="ef"><span>LED03</span>
        <input type="number"  value="23" id  = "p03_text" pattern="([1-9][0-9]*)">
        </label>
        <label class="ef"><span>セット数</span>
        <input type="number"  value="2" id  = "p04_text" pattern="([1-9][0-9]*)">
        </label>
      </div>

      <hr>

      <p class = "Catergory_text"><ion-icon name="power" class = "menu_icon"></ion-icon>ベースの光：
        <output id = "base_light_name">名前1</output></p>
      <ul class="radios" id = "base_light">
          <li>
              <input type="radio" name="radio1" value="1" id="名前1"  oninput="document.getElementById('base_light_name').value=this.id" checked="checked"/>
              <label for="radio1">1</label>
          </li>
          <li>
              <input type="radio" name="radio1" value="2" id="名前2"  oninput="document.getElementById('base_light_name').value=this.id"/>
              <label for="radio2">2</label>
          </li>
          <li>
              <input type="radio" name="radio1" value="3" id="名前3" oninput="document.getElementById('base_light_name').value=this.id"/>
              <label for="radio3">3</label>
          </li>
          <li>
              <input type="radio" name="radio1" value="4" id="名前4" oninput="document.getElementById('base_light_name').value=this.id"/>
              <label for="radio4">4</label>
          </li>
          <li>
              <input type="radio" name="radio1" value="5" id="名前5" oninput="document.getElementById('base_light_name').value=this.id"/>
              <label for="radio4">5</label>
          </li>
          <li>
              <input type="radio" name="radio1" value="6" id="名前6" oninput="document.getElementById('base_light_name').value=this.id"/>
              <label for="radio4">6</label>
          </li>
          <li>
              <input type="radio" name="radio1" value="7" id="名前7" oninput="document.getElementById('base_light_name').value=this.id"/>
              <label for="radio4">7</label>
          </li>
          <li>
              <input type="radio" name="radio1" value="8" id="名前8" oninput="document.getElementById('base_light_name').value=this.id"/>
              <label for="radio4">8</label>
          </li>
          <li>
              <input type="radio" name="radio1" value="0" id="OFF" oninput="document.getElementById('base_light_name').value=this.id"/>
              <label for="radio5">なし</label>
          </li>
      </ul>

      <hr>
      <p class = "Catergory_text"><ion-icon name="flask" class = "menu_icon"></ion-icon>ブレンドの割合 : <output id="output_blend">50</output><span>%</span></p>
      <div class="base_setting_bar">
          <input id = "blend" type="range" class="base-input-range" value="50" min="0" max="100"  step="1" data-unit="%"
              oninput="document.getElementById('output_blend').value=this.value">
      </div>
      <hr>

      <p class = "Catergory_text"><ion-icon name="flashlight" class = "menu_icon"></ion-icon></ion-icon>明るさ　上部：<output id="output_up">100</output><span>%</span>　下部：<output id="output_down">100</output><span>%</span></p>
      <div class="base_setting_bar">
          <input id = "bright_up" type="range" class="base-input-range" value="100" min="0" max="100"  step="1" data-unit="%"
              oninput="document.getElementById('output_up').value=this.value">
      </div>
      <div class="base_setting_bar">
          <input id = "bright_down" type="range" class="base-input-range" value="100" min="0" max="100"  step="1" data-unit="%"
              oninput="document.getElementById('output_down').value=this.value">
      </div>
      <hr>


      <br>
      <br>
      <br>

      <div class = "button_container">
        <button id="send0" value="0" class="btn-animation-02"><span>光と音の停止</span></a></button>
      </div>

      <div class = "button_container">
        <button id="send1" value="11" class="btn-animation-02"><span>行き来する光</span></a></button>
        <div class="cp_ipcheck">
              <input type="checkbox" id = "check0" class="check-animation" checked="checked">
              <input id = "time" type="range" class="input-range" value="0.0" min="0.0" max="5.0"  step="0.1" data-unit="%"
                  oninput="document.getElementById('output0').value=Number(this.value).toFixed(1)">
              <output id="output0">0.0</output><span>秒後に音を再生</span>
        </div>
      </div>

      <div class = "button_container">
        <button id="send2" value="12" class="btn-animation-02"><span>全灯する光</span></a></button>
        <div class="cp_ipcheck">
            <input type="checkbox" id = "check1" class="check-animation" checked="checked">
            <input id = "time" type="range" class="input-range" value="0" min="0" max="5"  step="0.1" data-unit="%"
                oninput="document.getElementById('output1').value=Number(this.value).toFixed(1)">
            <output id="output1">0.0</output><span>秒後に音を再生</span>
        </div>
      </div>

      <div class = "button_container">
        <button id="send3" value="13" class="btn-animation-02"><span>呼吸する光</span></a></button>
        <div class="cp_ipcheck">
            <input type="checkbox" id = "check2" class="check-animation" checked="checked">
            <input id = "time" type="range" class="input-range" value="0" min="0" max="5"  step="0.1" data-unit="%"
                oninput="document.getElementById('output2').value=Number(this.value).toFixed(1)">
            <output id="output2">0.0</output><span>秒後に音を再生</span>
        </div>
      </div>

    </div>


  </body>
</html>
