/* global clearTimeout */
var UI = require('ui');
var Vector2 = require('vector2');
var Utils = require('./utils');

function DaysItem() {
  this.height           = 112;
  this.width            = 9;
  this.startX           = 125;
  this.startY           = 42;
  this.startHour        = null;
  this.endHour          = null;
  this.rowMargin        = 2;
  this.mainWidow        = null;
  this.pixelToMinute    = null;
  this.eventsGraphic    = [];
  this.alldayBoxBorder  = null;
  this.alldayBoxContent = null;
  this.timebar          = null;
  this.timebarTimeout   = null;
}

DaysItem.prototype.init = function(mainWindow,  backgroundColor, startHourDate, endHourDate) {
  this.startHour = startHourDate;
  this.endHour = endHourDate;
  this.pixelToMinute = Utils.differenceBetweenDates(endHourDate,startHourDate)/(this.height);
  if(this.timebarTimeout !== null) clearTimeout(this.timebarTimeout);
  
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
};

DaysItem.prototype.updateDays = function(startHourDate,endHourDate) {
  this.startHour = startHourDate;
  this.endHour = endHourDate;
};

DaysItem.prototype.displayAllDayBox = function()
{
  var that = this;
  if(this.alldayBoxBorder !== null) this.removeAllDayBox();
  
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

};

DaysItem.prototype.removeAllDayBox = function()
{
 if(this.alldayBoxBorder !== null) {
    this.alldayBoxContent.remove();
    this.alldayBoxBorder.remove();
    this.alldayBoxContent = null;
    this.alldayBoxBorder = null;
  }    
};

DaysItem.prototype.createEvent = function(dayRect, data, color) {
  var that = this;

  if(data.allDay === true) {
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
    var xPos = that.startX; 
    var durationToPixels = Math.round(data.duration / this.pixelToMinute); //always display at least 1px height
    var eventStartMinutes = Utils.differenceBetweenDates(this.startHour,new Date(data.startDate));
    var startTimeToPixels = Math.round(eventStartMinutes / this.pixelToMinute);
    var eventPosition = new Vector2(xPos, that.startY + startTimeToPixels);
    
    var rectEvent = new UI.Rect({
      size: new Vector2(this.width ,durationToPixels),
      backgroundColor : color,
      position: eventPosition
    });
    
    this.mainWindow.add(rectEvent);
    this.eventsGraphic.push(rectEvent);
  }
};


DaysItem.prototype.createEventOverlaping = function(dayRect, data, color, overlapingLayer, overlapingNumber) {
  var that = this;
  var eventWidth = this.width;
  var evtPosX = this.startX;

  if(overlapingNumber === 1) {
    eventWidth = 4;
    if(overlapingLayer === 0)  evtPosX = this.startX + 5;
  }
  if(overlapingNumber === 2) {
    eventWidth = 3;
    if(overlapingLayer === 0)  evtPosX = this.startX + 3;
    if(overlapingLayer === 1)  evtPosX = this.startX + 6;
  }

  //If the event is all the d == 0ay
  if(data.allDay === false) { 
    var durationToPixels = Math.round(data.duration / this.pixelToMinute); //always display at least 1px height
    var eventStartMinutes = Utils.differenceBetweenDates(this.startHour,new Date(data.startDate));
    var startTimeToPixels = Math.round(eventStartMinutes / this.pixelToMinute);
    var eventPosition = new Vector2(evtPosX, that.startY + startTimeToPixels);
    
    var rectEvent = new UI.Rect({
      size: new Vector2(eventWidth ,durationToPixels),
      backgroundColor : color,
      position: eventPosition
    });
    
    this.mainWindow.add(rectEvent);
    this.eventsGraphic.push(rectEvent);
  }
};




DaysItem.prototype.updateTimeBar = function() {
  var that = this;
  if(this.timebar !== null) {
    this.timebar.remove();
  }
  var now = new Date();
  if(now < this.startHour || now >= this.endHour ) {    
    if(this.timebar !== null) {
      this.timebar.remove();
    }
    this.timebarTimeout = setTimeout(function() { that.updateTimeBar(); },120 * 60000 );
    return;
  }
  
  var barStartMinute = Utils.differenceBetweenDates(this.startHour,now);
  var startTimeToPixels = Math.round(barStartMinute / this.pixelToMinute);
  var timebarposition = new Vector2(this.startX-2, this.startY + startTimeToPixels);
  this.timebar = new UI.Rect({
      size: new Vector2(this.width+4,2),
      backgroundColor : "red",
      position: timebarposition
  });
  this.mainWindow.add(this.timebar);
  
  this.timebarTimeout = setTimeout(function() { that.updateTimeBar(); },that.pixelToMinute * 60000 );
};

DaysItem.prototype.deleteEvents = function() {
  if(this.eventsGraphic.length !== 0) {
    for(var i = this.eventsGraphic.length; i >= 0 ;  i -- ) {
       try{
         this.mainWindow.remove(this.eventsGraphic[i]);

       //  this.eventsGraphic[i].remove();
      //   this.eventsGraphic.splice(i, 1);
       } catch(e) {
         console.log("Impossible to delete " + e);
       } 
    }
    console.log("Clear all events");
    this.eventsGraphic = [];
  }
};

DaysItem.prototype.setWindow = function(window) {
  this.mainWindow = window;
};

module.exports =  new DaysItem;