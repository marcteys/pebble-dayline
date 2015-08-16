/* global clearTimeout */
//Use wakeup to refresh envents "in  minutes". If it's more than 60 min, refresh every 30min, then refresh evenry 15min, then 5min
var DayLineWatch = require('daylineWatch');
var Utils = require('utils');

function lol(parent) {
  parent.fetchEventsExternal();
}

var DaylineEvents =  {
  
  onGoingTimeout : null,
  functionParent : null,
  
  displayEventDescription : function(date, niceFormat, description, parent)
  {
   // parent.fetchEventsExternal();
    
   if(this.onGoingTimeout !== null ) clearTimeout(this.onGoingTimeout);
    this.onGoingTimeout = setTimeout(lol,1000,parent); //change 1 to 5
    var timeFormatted = this.formatTimeText(date, niceFormat,description, parent);
    if(timeFormatted !== null) DayLineWatch.displayNextEventDetail(timeFormatted, description);
  },

  formatTimeText : function(date, niceFormat, description, parent){
    var now = new Date();
    var that  = this;
    var difference = Utils.differenceRelativeBetweenDates(date,now);
    var textHour = niceFormat;
    
    if(difference <= 0 && difference > -5) {
       textHour = "Now";
      this.onGoingTimeout = setTimeout(function(){that.removeTextEvent(parent);},1 * 60000); //change 1 to 5
    } else if(difference == 1 && difference > -5) {
       textHour = "In " + difference + " minute";
      this.onGoingTimeout = setTimeout(function(){that.displayEventDescription(date, niceFormat, description, parent );}, 1 * 60000);
    }  else if(difference < 10 && difference > -5) {
       textHour = "In " + difference + " minutes";
      this.onGoingTimeout = setTimeout(function(){that.displayEventDescription(date, niceFormat, description, parent);}, 1 * 60000);
    } else if(difference < 30 && difference > -5) {
       textHour = "In " + difference + " minutes";
      this.onGoingTimeout = setTimeout(function(){that.displayEventDescription(date, niceFormat, description, parent);}, 5 * 60000);
    } else if(difference < 60 && difference > -5) {
       textHour = "In " + difference + " minutes";
       this.onGoingTimeout = setTimeout(function(){that.displayEventDescription(date, niceFormat, description, parent);}, 15 * 60000);
    } else if(difference < 70 && difference > -5) {
       textHour = "In 1 hour";
       this.onGoingTimeout = setTimeout(function(){that.displayEventDescription(date, niceFormat, description, parent);}, 15 * 60000);
    }  else if(difference < 120 && difference > -5) {
       textHour = niceFormat;
      this.onGoingTimeout = setTimeout(function(){that.displayEventDescription(date, niceFormat, description, parent);}, 45 * 60000);
    } else {
      textHour = null;
      DayLineWatch.removeNextEventDetail();
      this.onGoingTimeout = setTimeout(function(){that.displayEventDescription(date, niceFormat, description, parent);}, 60 * 60000);
    }

    return textHour;
  },

  removeTextEvent : function() {
    if(this.onGoingTimeout !== null ) clearTimeout(this.onGoingTimeout);
    DayLineWatch.removeNextEventDetail();
  }
  
  
  
};
this.exports = DaylineEvents;
