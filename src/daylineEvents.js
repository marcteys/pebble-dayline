//Use wakeup to refresh envents "in  minutes". If it's more than 60 min, refresh every 30min, then refresh evenry 15min, then 5min
var DayLineWatch = require('daylineWatch');
var Wakeup = require('wakeup');
var Utils = require('utils');
var DayLineSettings = require('daylineSettings');

var DaylineEvents =  {
  
  onGoingWakeup : null,
  
  displayEventDescription : function(date, niceFormat, description)
  {
    console.log(niceFormat + " + " + description);
    var timeFormatted = this.formatTimeText(date, niceFormat);
     DayLineWatch.displayNextEventDetail(timeFormatted, description);
  },
  
  formatTimeText : function(date, niceFormat){
    var now = new Date();
    var difference = Utils.differenceBetweenDates(now, date);
    var textHour = niceFormat;
    /*
    if(difference <= 80) {
      
    }else if(difference < 50) {
    
    }else if(difference < 30) {
       
    }
    else if(difference < 20) {
       
    }
    else if(difference < 15) {
       textHour = "In " + difference + "minutes";
    }*/
    
    if(difference < 60) textHour = "In " + difference + " minutes";

    return textHour;
  },
  
  timeToString : function(hours, minutes) {
    var stringText = "";
    if(DayLineSettings.getTimeFormat() == "24") {
      
    }
    return stringText;
  }
  
};
this.exports = DaylineEvents;