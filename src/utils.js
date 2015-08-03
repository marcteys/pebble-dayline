var Utils =  {
  
  differenceBetweenDates : function(date1,date2) {
    var diff = Math.abs(date1 -date2);
    var minutes = Math.floor((diff/1000)/60);
    return minutes;
  }
  
};
this.exports = Utils;