var UI = require('ui');
var Vector2 = require('vector2');

var DaysItem =  {
  // One day : From 8am to 6PM, 1 hour = 4px;
  // 15 minutes = 1px
  height: 40,
  width:14,
  margin: 5,
  startHeight : 120,
  leftMargin: 8,
  mainWidow : null,
  dayStarAt : 800,
  eventsGraphic : [],

  init : function(mainWindow,  dayNumber, dominantColor) {
    var that = this;
    var rectPosition = new Vector2(that.leftMargin + (that.width + that.margin)  , that.startHeight);

    var dayText =  new UI.Text ({
      position: new Vector2(rectPosition.x-3, rectPosition.y-21),
      size: new Vector2(that.width+6, 20),
      font: 'gothic-14',
      textAlign : 'center',
      text: dayNumber,
      color : dominantColor
    });
    this.mainWindow.add(dayText);

    var rect = new UI.Rect({
      size: new Vector2(that.width, 0),
      backgroundColor : dominantColor,
      position: rectPosition
    });
    this.mainWindow.add(rect);
    rect.animate('size', new Vector2(that.width, that.height), 400);

    var dayRect = {
      rectPosition : rectPosition,
      id : id
    };
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
        var dayEventPosition = new Vector2(dayRect.rectPosition.x + (that.width + that.margin)  * i  , that.startHeight - 4);
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
      var eventPosition = new Vector2(dayRect.rectPosition.x, dayRect.rectPosition.y + startTimeToPixels);
      var eventEnd = durationToPixels + eventPosition.y;

      if( eventEnd > this.startHeight + this.height) { // tim end
        var leftOver = eventEnd - (this.startHeight + this.height);
        durationToPixels -= leftOver;
      }
    
      var rectEvent = new UI.Rect({
        //size: new Vector2(eventWidth,0),
        size: new Vector2(eventWidth,durationToPixels),
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
  
  setWidth : function(dayNumber) {
    this.width = Math.ceil((144-(this.leftMargin*2) - (this.margin*(dayNumber-1)) ) / dayNumber);
  }

};
this.exports = DaysItem;