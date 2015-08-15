var UI = require('ui');
var Vector2 = require('vector2');
var Utils = require('utils');

var DaysItem =  {

  height: 112,
  width:9,
  startX: 125,
  startY : 42,
  startHour : null,
  endHour : null,
  rowMargin : 2,
  mainWidow : null,
  pixelToMinute : null,
  eventsGraphic : [],
  alldayBoxBorder : null,
  alldayBoxContent :null,
  timebar : null,
  timebarTimeout: null,
  
  init : function(mainWindow,  backgroundColor, startHourDate, endHourDate) {
    this.startHour = startHourDate;
    this.endHour = endHourDate;
    this.pixelToMinute = Utils.differenceBetweenDates(endHourDate,startHourDate)/(this.height);
    if(this.timebarTimeout !== null) this.clearTimeout(this.timebarTimeout);
    
    var that = this;
    var dayBorder = new UI.Rect({
      size: new Vector2(that.width+8, that.height+8),
      position: new Vector2(that.startX-4, that.startY-4),
      backgroundColor : 'black'
    });
    var dayRect = new UI.Rect({
      size: new Vector2(that.width+4, that.height+4),
      position: new Vector2(that.startX-2, that.startY-2),
      backgroundColor : backgroundColor
    });
    var calendarIcon = new UI.Image({
      size: new Vector2(21, 24),
      position: new Vector2(119, 6),
      image : 'images/calendar-icon.png',
      compositing : 'set'
    });
    this.mainWindow.add(dayBorder);
    this.mainWindow.add(dayRect);
    this.mainWindow.add(calendarIcon);
    
    return dayRect;
  },
  
  
  displayAllDayBox : function()
  {
    var that = this;
    this.alldayBoxBorder  = new UI.Rect({
      size: new Vector2(that.width+8, 4),
      position: new Vector2(that.startX-4, that.startY-8),
      backgroundColor : 'black'
    });
    
    this.alldayBoxContent = new UI.Rect({
      size: new Vector2(that.width+4, 2),
      position: new Vector2(that.startX-2, that.startY-6),
      backgroundColor : 'white'
    });
    
    this.mainWindow.add(this.alldayBoxBorder);
    this.mainWindow.add(this.alldayBoxContent);

  },
  
  removeAllDayBox : function()
  {
   if(this.alldayBoxBorder !== null) {
      this.alldayBoxContent.remove();
      this.alldayBoxBorder.remove();
     this.alldayBoxContent = null;
     this.alldayBoxBorder = null;
    }    
  },
  
  createEvent : function(dayRect, data, color, overlapingEvents) {
    var that = this;
    var overlapingDivision = overlapingEvents + 1 ;
    var eventWidth = Math.floor(this.width/overlapingDivision);

    //If the event is all the d == 0ay
    if(data.allDay === true) { // TODO : Visual cue for this function !!
      if(this.alldayBoxContent === null) this.displayAllDayBox();
      for(var i = 0,  j=data.duration; i < j ; i++) {
        var rectDayEvent = new UI.Rect({
          size: new Vector2(that.width+4, 2),
          position: new Vector2(that.startX-2, that.startY-6),
          backgroundColor : color
        });
        this.eventsGraphic.push(rectDayEvent);
        this.mainWindow.add(rectDayEvent);
      }
    }
    else { 
      var xPos = that.startX + (overlapingEvents * eventWidth /* / overlapingEvents */ ); // in case of overlaping events
      var durationToPixels = Math.round(data.duration / this.pixelToMinute); //always display at least 1px height
      var eventStartMinutes = Utils.differenceBetweenDates(this.startHour,new Date(data.startDate));
      var startTimeToPixels = Math.round(eventStartMinutes / this.pixelToMinute);
      var eventPosition = new Vector2(xPos, that.startY + startTimeToPixels);
      
      var rectEvent = new UI.Rect({
        size: new Vector2(eventWidth ,durationToPixels),
        backgroundColor : color,
        position: eventPosition
      });
      
      this.mainWindow.add(rectEvent);
      this.eventsGraphic.push(rectEvent);
    }
  },
  
  updateTimeBar : function(dayRect, color) {
    if(this.timebar !== null) {
      this.timebar.remove();
    }
    var now = new Date();
    if(now < this.startHour || now > this.endHour ) {    
      if(this.timebar !== null) {
        console.log(JSON.Stringify(this.timebar));
        this.timebar.remove();
      }
      console.log("return");
      return;
    }
    var that = this;
    var barStartMinute = Utils.differenceBetweenDates(this.startHour,now);
    var startTimeToPixels = Math.round(barStartMinute / this.pixelToMinute);
    var timebarposition = new Vector2(this.startX-2, this.startY + startTimeToPixels);
    this.timebar = new UI.Rect({
        size: new Vector2(this.width+4,2),
        backgroundColor : color,
        position: timebarposition
      });
     this.mainWindow.add(this.timebar);
    console.log("add timebar");
    
    this.timebarTimeout = setTimeout(function() { that.updateTimeBar(dayRect, color); },that.pixelToMinute * 60000 );
  },
  
  deleteEvents : function() {
    if(this.eventsGraphic.length !== 0) {
      for(var i = this.eventsGraphic.length; i >= 0 ;  i -- ) {
         try{
           this.eventsGraphic[i].remove();
           this.eventsGraphic.splice(i, 1);
         } catch(e) {
           console.log("Impossible to delete " + e);
         } 
      }
      console.log("Clear all events");
      this.eventsGraphic = [];
    }
  },

  setWindow : function(window) {
    this.mainWindow = window;
  },

};
this.exports = DaysItem;