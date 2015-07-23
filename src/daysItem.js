var UI = require('ui');
var Vector2 = require('vector2');

var DaysItem =  {
  // One day : From 8am to 6PM, 1 hour = 4px;
  // 11 minutes = 1px
  height: 112,
  width:9,
  startX: 125,
  startY : 42,
  rowMargin : 2,
  mainWidow : null,
  pixelToMinute : null,
  eventsGraphic : [],

  init : function(mainWindow,  backgroundColor) {
    this.pixelToMinute = 600/(this.height);
    
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

  createEvent : function(dayRect, data, color) {
    var that = this;
    var eventWidth = this.width;
    //TODO : Conter le nombre de calendrier, le passer dans data. On divise la largeur par le nombre de calendriers et on le décale en fonction de quel calendrier on est. 
    //If the event is all the d == 0ay
    if(data.allDay === true && 1===0) { // TODO : Visual for this function !!
      if(data.duration + data.day > 7) data.duration = 7 - data.day;
      for(var i = 0,  j=data.duration; i < j ; i++) {
        var dayEventPosition = new Vector2(that.startX + (that.width + that.margin)   , that.startHeight - 4);
        var rectDayEvent = new UI.Rect({
          size: new Vector2(eventWidth,2),
          backgroundColor : color,
          position: dayEventPosition
        });
        this.eventsGraphic.push(rectDayEvent);
        this.mainWindow.add(rectDayEvent);
      }
    }
    else { // normal event case
      var durationToPixels = Math.floor(data.duration / this.pixelToMinute); //always display at least 1px height
      var startTimeToPixels = Math.floor(data.startTime / this.pixelToMinute);
      var eventPosition = new Vector2(that.startX, that.startY + startTimeToPixels);
      var eventEnd = durationToPixels + eventPosition.y;

      if( eventEnd > this.startY + this.height) { // tim end
        var leftOver = eventEnd - (this.startY + this.height) ;
       durationToPixels -= leftOver;
      }
    
      var rectEvent = new UI.Rect({
        //size: new Vector2(eventWidth,0),
        size: new Vector2(eventWidth ,durationToPixels),
        backgroundColor : color,
        position: eventPosition
      });
      this.eventsGraphic.push(rectEvent.id);
      this.mainWindow.add(rectEvent);
      
      //rectEvent.animate('size', new Vector2(eventWidth,durationToPixels), 0);
      // TODO : change the value  --------------------------------------- ^ 
    }
  },
  
  deleteEvents : function() {
    if(this.eventsGraphic.length !== 0) {
      for(var i = this.eventsGraphic.length; i > 0 ;  i -- ) {
         try{
           this.eventsGraphic[i].remove();
         } catch(e) { } 
      }
      this.eventsGraphic = [];
    }
  },

  setWindow : function(window) {
    this.mainWindow = window;
  },
  

};
this.exports = DaysItem;