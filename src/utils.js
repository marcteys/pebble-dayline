var Utils =  {
  
  differenceBetweenDates : function(date1,date2) {
    var diff = Math.abs(date1 -date2);
    var minutes = Math.floor((diff/1000)/60);
    return minutes;
  },
  
  calculateOverlapingEvent : function(a_start, a_duration, b_start, b_duration) {
    var a_end = this.dateAdd(a_start,'minute', a_duration);
    var b_end = this.dateAdd(b_start,'minute', b_duration);
    var n_start = null;
    var n_end = null;

    //var newEnd = new Date(newBegin + oldEnd - oldBegin);
    var newEvent = false;

    if (a_start <= b_start && b_start <= a_end) {  // b starts in a
      n_start = b_start;
      n_end = b_start;
    }
    if (a_start <= b_end && b_end <= a_end) { // b ends in a
      n_start = b_start;
      n_end = b_end;
    }
    if (b_start <  a_start && a_end   <  b_end){ // a in b
      n_start = a_start;
      n_end = a_end ;
    }
    console.log("Utils.calculateOverlapingEvent : " +  a_start + a_end + b_start + b_end + n_start + n_end);
    if(n_start !== null && n_end !== null) newEvent = {start:n_start, end : n_end, duration : this.differenceBetweenDates(n_start,n_end)};
    
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
    return ret;
  }
  
};
this.exports = Utils;