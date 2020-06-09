var formatDateYyyyMMdd = function(dateStr) {
 // var dateStr = '02-March-2018';
  //formats as 2018-03-02
  var dateBits = dateStr.split('-');
  var months = {'Jan':'01', 'Feb':'02', 'Mar':'03', 'Apr':'04', 'May':'05', 'Jun':'06', 'Jul':'07', 'Aug':'08', 'Sep':'09', 'Oct':'10', 'Nov':'11', 'Dec':'12'};
  return dateBits[2] + '-' + months[dateBits[1].substring(0,3)] + '-' + dateBits[0];
}

var formatDateDdMMMyyyy = function(dateStr) {
  // var dateStr = '02-March-2018';
   //formats as 02-Mar-2018
  var dateBits = dateStr.split('-');
  return dateBits[0] + '-' + dateBits[1].substring(0,3) + '-' + dateBits[2];
}

var formatDateDdMMMMyyyy = function(dateStr) {
  // var dateStr = '2018-03-02';
   //formats as 02-March-2018
  var dateBits = dateStr.split('-');
  var months = {'01':'January', '02':'February', '03':'March', '04':'April', '05':'May', '06':'June', '07':'July', '08':'August', '09':'September', '10':'October', '11':'November', '12':'December'};
  return dateBits[2] + '-' + months[dateBits[1]] + '-' + dateBits[0];
}

//Generic(ish) get failure handler
var handleGetFailure = function(err) {
  console.log('error', err)
  alert(err)
  loginForm.classList.remove("hide");
  expensesForm.classList.add("hide");
  forecastForm.classList.add("hide");
}
