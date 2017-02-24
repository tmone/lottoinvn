var MNngay = new Array();
MNngay[1] = ["da-lat", "khanh-hoa", "kien-giang", "kon-tum", "mien-bac", "tien-giang"];
MNngay[2] = ["ca-mau", "dong-thap",  "phu-yen", "thua-thien-hue", "tp-hcm", "mien-bac"];
MNngay[3] = ["bac-lieu", "ben-tre", "dak-lak", "quang-nam", "vung-tau", "mien-bac"];
MNngay[4] = ["can-tho", "da-nang", "dong-nai", "soc-trang", "mien-bac", "khanh-hoa",];
MNngay[5] = ["an-giang", "binh-dinh", "binh-thuan",  "quang-binh", "quang-tri", "tay-ninh", "mien-bac"];
MNngay[6] = ["binh-duong", "gia-lai",  "ninh-thuan", "tra-vinh", "vinh-long", "mien-bac"];
MNngay[7] = ["binh-phuoc",  "dak-nong", "hau-giang", "long-an", "quang-ngai", "mien-bac", "tp-hcm", "da-nang"];

var MNmien = new Array();
MNmien[0] = ["mien-bac"];
MNmien[1] = [  
              "binh-dinh",
              "da-nang",
              "dak-nong",
              "dak-lak", 
              "gia-lai",
              "khanh-hoa",
              "kon-tum",
              "ninh-thuan",
              "quang-nam",
              "quang-ngai", 
              "quang-binh",
              "quang-tri",
              "phu-yen", 
              "thua-thien-hue",
            ];
MNmien[2] = [
              "bac-lieu",
              "ben-tre", 
              "binh-duong",
              "binh-phuoc",
              "binh-thuan" ,
              "ca-mau",
              "can-tho",                                      
              "da-lat",
              "dong-nai", 
              "dong-thap",
              "hau-giang",              
              "kien-giang",              
              "long-an",  
              "soc-trang",                           
              "tien-giang", 
              "tp-hcm",
              "tra-vinh",               
              "vinh-long",
              "vung-tau",
            ];



Blockly.Blocks['lotvar_all'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Tất cả đài");
    this.setOutput(true, "Array");
    this.setColour(110);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
Blockly.JavaScript['lotvar_all'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = "['mien-bac',    'an-giang',    'tien-giang'  ]";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks['lotvar_location'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["Miền Bắc","MB"], ["Miền Trung","MT"], ["Miền Nam","MN"]]), "LO");
    this.setOutput(true, "Array");
    this.setColour(110);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
Blockly.JavaScript['lotvar_location'] = function(block) {
  var dropdown_lo = block.getFieldValue('LO');
  // TODO: Assemble JavaScript into code variable.
  var code = '';
  var co_li = [];
  if(dropdown_lo =='MB')
    co_li = MNmien[0];
  else if(dropdown_lo=='MT'){
    co_li = MNmien[1];
  }else   {
    co_li = MNmien[2];
  }
  code = "['"+co_li.join("','")+"']";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks['lotope_uni'] = {
  init: function() {
    this.appendValueInput("UNI1")
        .setCheck("Array");
    this.appendValueInput("UNI2")
        .setCheck("Array");
    this.setOutput(true, "Array");
    this.setColour(160);
    this.setTooltip('Union');
    this.setHelpUrl('');
  }
};
Blockly.JavaScript['lotope_uni'] = function(block) {
  var value_uni1 = Blockly.JavaScript.valueToCode(block, 'UNI1', Blockly.JavaScript.ORDER_ATOMIC);
  var value_uni2 = Blockly.JavaScript.valueToCode(block, 'UNI2', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.  
  var code = value_uni1+".concat(" + value_uni2+")";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};