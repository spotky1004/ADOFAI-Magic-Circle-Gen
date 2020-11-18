import ADOFAI from "./ADOFAI-WebModule/ADOFAI-WebModule.js";
window.ADOFAI = ADOFAI;

function findIndex(arr, toFind) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == toFind) {
      return i;
    }
  }
  return -1;
}
function generateCircle(leng=-1, perC=-1, twirl=0, midspin=0, maxoffset=360) {
  try {
    var map = new ADOFAI();
    map.pathData = [];
    map.pathData.push(new ADOFAI.PathData('R'));
    map.pathData.push(new ADOFAI.PathData('R'));

    if (maxoffset > 360 || maxoffset < 15) {
      maxoffset = 360;
    }
    if (!(twirl == 0 || twirl == 1)) {
      twirl = Math.floor(Math.random()*2);
    }
    if (twirl) {
      map.actions.push(new ADOFAI.Action(1, "Twirl"));
    }
    if (!(midspin == 0 || midspin == 1)) {
      midspin = Math.floor(Math.random()*2);
    }
    if (perC == -1 || !(perC == 2 || perC == 3 || perC == 4 || perC == 6 || perC == 8)) {
      var per = ((Math.floor(Math.random()*2)) ? ((Math.floor(Math.random()*2)) ? 2 : 3) : ((Math.floor(Math.random()*2)) ? 4 : 6));
    } else {
      var per = perC;
    }
    if (leng == -1) {
      var perLeng = Math.floor(Math.random()*100+100);
    } else {
      var perLeng = Math.ceil(leng/per);
    }

    var perArr = [];
    var totDeg = 0;
    for (var i = 0; i < perLeng; i++) {
      if (i == perLeng-1 && totDeg%(360/per) != 0) {
        perArr.splice(perArr.length-5, perArr.length-1);
        i -= 5;
      }
      pushPerDeg();
    }

    for (var i = 0; i < per; i++) {
      for (var j = 0; j < perArr.length; j++) {
        map.pathData.push(new ADOFAI.PathData(ADOFAI.PathData.ABSOLUTE_ANGLE_LIST[findIndex(ADOFAI.PathData.ABSOLUTE_ANGLE_LIST, (perArr[j]+360/per*i)%360)]));
        if (
          midspin &&
          findIndex(ADOFAI.PathData.ABSOLUTE_ANGLE_LIST, (perArr[j]+180+(twirl ? -1 : 1)*15)%360) != -1
        ) {
          map.pathData.push(new ADOFAI.PathData(ADOFAI.PathData.ABSOLUTE_ANGLE_LIST[findIndex(ADOFAI.PathData.ABSOLUTE_ANGLE_LIST, (perArr[j]+180+(twirl ? -1 : 1)*15)%360)]));
          map.pathData.push(new ADOFAI.PathData('!'));
        }
      }
    }

    console.log(map);
    var prevDeg = 180;
    var prevOffest = 180;
    for (var i = 1; i < map.pathData.length; i++) {
      map.actions.push(new ADOFAI.Action((twirl ? i+1 : i), "SetSpeed"));
      map.actions[i-1].eventValue.isSpeedTypeBPM = false;
      if (!(map.pathData[i].code == '!' || map.pathData[i-1].code == '!')) {
        var multThis = (getDeg(prevDeg, map.pathData[i].absoluteAngle)/prevOffest);
        map.actions[i-1].eventValue.BPM_Multiplier = multThis;
        prevOffest = getDeg(prevDeg, map.pathData[i].absoluteAngle);
        prevDeg = map.pathData[i].absoluteAngle;
      } else {
        if (map.pathData[i].code == '!') {
          map.actions[i-1].eventValue.BPM_Multiplier = 0.1;
        } else {
          map.actions[i-1].eventValue.BPM_Multiplier = 10;
        }
      }
    }

    map.settings.backgroundColor = '000000';
    map.settings.trackColor = 'debb7b';
    map.settings.hitsoundVolume = 1;
    map.settings.pitch = 1;
    map.settings.zoom = 1;
    map.settings.volume = 1;

    document.querySelector('#genOutput').innerHTML = map.Export();
    window.map = map;

    function pushPerDeg() {
      var degThis = ADOFAI.PathData.ABSOLUTE_ANGLE_LIST[Math.floor((ADOFAI.PathData.ABSOLUTE_ANGLE_LIST.length-5)*Math.random())];
      for (var i = 0; i < per; i++) {
        if ((degThis+360/per*i)%360 == 0 || (degThis-perArr[perArr.length-1]+720)%360 == 180 || getDeg(degThis, perArr[perArr.length-1]) == 360 || findIndex(ADOFAI.PathData.ABSOLUTE_ANGLE_LIST, (degThis+360/per*i)%360) == -1 || disDegs[findIndex(ADOFAI.PathData.ABSOLUTE_ANGLE_LIST, degThis)] == 1) {
          pushPerDeg();
          return;
        }
      }
      totDeg += degThis;
      perArr.push(degThis);
    }
    function getDeg(d1, d2) {
      var degOff = (d2-d1+540)%360;
      if (twirl) degOff = 360-degOff;
      if (degOff == 0) degOff = 360;
      return degOff;
    }
  } catch (e) {
    document.querySelector('#genOutput').innerHTML = 'bug!\n' + e;
  }
}

window.generateCircle = generateCircle;
