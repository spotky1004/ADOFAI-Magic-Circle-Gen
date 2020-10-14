import ADOFAI from "./ADOFAI-WebModule/ADOFAI-WebModule.js";

function findIndex(arr, toFind) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == toFind) {
      return i;
    }
  }
  return -1;
}
var map = new ADOFAI();

var per = 6;
var perLeng = Math.floor(Math.random()*100+100);

var perArr = [];
var totDeg = 0;
for (var i = 0; i < perLeng || totDeg%(360/per) != 0; i++) {
  pushPerDeg();
}
function pushPerDeg() {
  var degThis = ADOFAI.PathData.ABSOLUTE_ANGLE_LIST[Math.floor((ADOFAI.PathData.ABSOLUTE_ANGLE_LIST.length-5)*Math.random())];
  for (var i = 0; i < per; i++) {
    if ((degThis+360/per*i)%360 == 0 || (degThis-perArr[perArr.length-1]+720)%360 == 180 || (degThis-perArr[perArr.length-1]+540)%360 > 240 || findIndex(ADOFAI.PathData.ABSOLUTE_ANGLE_LIST, (degThis+360/per*i)%360) == -1) {
      pushPerDeg();
      return;
    }
  }
  totDeg += degThis;
  perArr.push(degThis);
}
for (var i = 0; i < per; i++) {
  for (var j = 0; j < perArr.length; j++) {
    map.pathData.push(new ADOFAI.PathData(ADOFAI.PathData.ABSOLUTE_ANGLE_LIST[findIndex(ADOFAI.PathData.ABSOLUTE_ANGLE_LIST, (perArr[j]+360/per*i)%360)]));
  }
}

var prevDeg = 180;
var prevOffest = 180;
//var prevMult = 1;
for (var i = 1; i < map.pathData.length; i++) {
  map.actions.push(new ADOFAI.Action(i, "SetSpeed"));
  map.actions[i-1].eventValue.isSpeedTypeBPM = false;
  var multThis = (getDeg(prevDeg, map.pathData[i].absoluteAngle)/prevOffest);
  map.actions[i-1].eventValue.BPM_Multiplier = multThis;
  prevOffest = getDeg(prevDeg, map.pathData[i].absoluteAngle);
  prevDeg = map.pathData[i].absoluteAngle;
  //prevMult = multThis;
}
function getDeg(d1, d2) {
  return (d2-d1+540)%360;
}
map.settings.backgroundColor = '000000';
map.settings.trackColor = 'debb7b';

console.log(map.Export());
