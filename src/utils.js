var Utils =  {
  
  differenceBetweenDates : function(date1,date2) {
    var diff = Math.abs(date1 - date2);
    var minutes = Math.floor((diff/1000)/60);
    console.log("differenceBetweenDates : date1  " + date1  + " - date 2 " +  date2 + " - duration " + minutes );
    return minutes;
  },
  
  calculateOverlapingEvent : function(a_start, a_end, b_start, b_end) {
    var n_start = null;
    var n_end = null;
    var newEvent = false;

    //TODO : Handle more exeptions
    if (a_start <= b_start && b_start <= a_end) {  // b starts in a
      n_start = b_start;
      n_end = a_end;
      console.log("calculateOverlapingEvent a");
    }
    if (a_start <= b_end && b_end <= a_end) { // b ends in a
      n_start = b_start;
      n_end = b_end;
      console.log("calculateOverlapingEvent d");
    }
    if (b_start <  a_start && a_end < b_end){ // a in b
      n_start = a_start;
      n_end = a_end ;
      console.log("calculateOverlapingEvent c");
    }
    
    if(n_start !== null && n_end !== null) newEvent = {start:n_start, end : n_end, duration : this.differenceBetweenDates(n_start,n_end) };
    
    return newEvent;
  },
  
  //TODO : Delete (unused anymore)
  dateAdd : function(date, interval, units) {
    var ret = new Date(date); //don't change original date
    switch(interval.toLowerCase()) {
      case 'year'   :  ret.setFullYear(ret.getFullYear() + units);  break;
      case 'quarter':  ret.setMonth(ret.getMonth() + 3*units);  break;
      case 'month'  :  ret.setMonth(ret.getMonth() + units);  break;
      case 'week'   :  ret.setDate(ret.getDate() + 7*units);  break;
      case 'day'    :  ret.setDate(ret.getDate() + units);  break;
      case 'hour'   :  ret.setTime(ret.getTime() + units*3600000);  break;
      case 'minute' :  ret.setTime(ret.getTime() + units*60000);  break;
      case 'second' :  ret.setTime(ret.getTime() + units*1000);  break;
      default       :  ret = undefined;  break;
    }
    return Date.parse(ret);
  }
  
};
this.exports = Utils;