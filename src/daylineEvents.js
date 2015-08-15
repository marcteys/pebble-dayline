//Use wakeup to refresh envents "in  minutes". If it's more than 60 min, refresh every 30min, then refresh evenry 15min, then 5min
var DayLineWatch = require('daylineWatch');
var Utils = require('utils');
var Functions = require('functions');

var DaylineEvents =  {
  
  onGoingTimeout : null,
  
  displayEventDescription : function(date, niceFormat, description)
  {
   if(this.onGoingTimeout !== null ) clearTimeout(this.onGoingTimeout);
    var timeFormatted = this.formatTimeText(date, niceFormat,description);
    console.log(date, niceFormat, description);
    if(timeFormatted !== null) DayLineWatch.displayNextEventDetail(timeFormatted, description);
  },
  
  formatTimeText : function(date, niceFormat, description){
    var now = new Date();
    var that  = this;
    var difference = Utils.differenceRelativeBetweenDates(date,now);
    var textHour = niceFormat;
    this.onGoingTimeout = setTimeout(function(){that.displayEventDescription(date, niceFormat, description);}, 5 * 60000);

    if(difference <= 0) {
       textHour = "Now";
        this.onGoingTimeout = setTimeout(that.removeTextEvent,5 * 60000);
    } else if(difference == 1) {
       textHour = "In " + difference + " minute";
      this.onGoingTimeout = setTimeout(function(){that.displayEventDescription(date, niceFormat, description);}, 1 * 60000);
    }  else if(difference < 10) {
       textHour = "In " + difference + " minutes";
      this.onGoingTimeout = setTimeout(function(){that.displayEventDescription(date, niceFormat, description);}, 1 * 60000);
    } else if(difference < 30) {
       textHour = "In " + difference + " minutes";
      this.onGoingTimeout = setTimeout(function(){that.displayEventDescription(date, niceFormat, description);}, 5 * 60000);
    } else if(difference < 60) {
       textHour = "In " + difference + " minutes";
       this.onGoingTimeout = setTimeout(function(){that.displayEventDescription(date, niceFormat, description);}, 15 * 60000);
    }  else if(difference < 120) {
       textHour = niceFormat;
      this.onGoingTimeout = setTimeout(function(){that.displayEventDescription(date, niceFormat, description);}, 45 * 60000);
    } else {
      textHour = null;
      DayLineWatch.removeNextEventDetail();
      this.onGoingTimeout = setTimeout(function(){that.displayEventDescription(date, niceFormat, description);}, 60 * 60000);
    }

    return textHour;
  },

  removeTextEvent : function() {
       if(this.onGoingTimeout !== null ) clearTimeout(this.onGoingTimeout);
        DayLineWatch.removeNextEventDetail();
  }
  
  
  
};
this.exports = DaylineEvents;