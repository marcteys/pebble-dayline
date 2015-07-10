var UI = require('ui');
var Vector2 = require('vector2');

var DaysItem =  {
  // One day : From 8am to 6PM, 1 hour = 4px;
  // 15 minutes = 1px
  height: 116,
  width:13,
  startX: 123,
  startY : 40,
  rowMargin : 2,
  mainWidow : null,
  eventsGraphic : [],

  init : function(mainWindow,  backgroundColor) {
    var that = this;
    var dayBorder = new UI.Rect({
      size: new Vector2(that.width+4, that.height+4),
      position: new Vector2(that.startX-2, that.startY-2),
      backgroundColor : 'black'
    });
    var dayRect = new UI.Rect({
      size: new Vector2(that.width, that.height),
      position: new Vector2(that.startX, that.startY),
      backgroundColor : backgroundColor
    });
    this.mainWindow.add(dayBorder);
    this.mainWindow.add(dayRect);
    return dayRect;
  },

  createEvent : function(dayRect, data, color) {
    var that = this;
    var eventWidth = this.width;
    //TODO : Conter le nombre de calendrier, le passer dans data. On divise la largeur par le nombre de calendriers et on le décale en fonction de quel calendrier on est. 
    //If the event is all the day
    if(data.allDay === true) {
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
      var durationToPixels = Math.ceil(data.duration / 15); //always display at least 1px height
      var startTimeToPixels = Math.ceil(data.startTime / 15);
      var eventPosition = new Vector2(that.startX + that.rowMargin, that.startY + startTimeToPixels + that.rowMargin);
      var eventEnd = durationToPixels + eventPosition.y;

      if( eventEnd > this.startHeight + this.height) { // tim end
        var leftOver = eventEnd - (this.startHeight + this.height);
        durationToPixels -= leftOver;
      }
    
      var rectEvent = new UI.Rect({
        //size: new Vector2(eventWidth,0),
        size: new Vector2(eventWidth - that.rowMargin *2 ,durationToPixels),
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