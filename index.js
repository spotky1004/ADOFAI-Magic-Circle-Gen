document.querySelector('#genButton').onclick = new Function(`
  generateCircle(
    cutNumber(document.querySelector('#tileCount').innerHTML),
    cutNumber(document.querySelector('#perCount').innerHTML),
    cutNumber(document.querySelector('#twirlDrict').innerHTML)
  );`
);

function cutNumber(a) {
  if (!isNaN(Number(a))) {
    return Number(a);
  } else {
    return -1;
  }
}
