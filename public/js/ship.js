var Ship = function(options) {
  options = options || {};
  this.x = options.x || this.x;
  this.y = options.y || this.y;
  this.length = options.length || this.length;
  this.width = options.width || this.width;
  this.fill = options.fill || this.fill;
  this.stroke = options.stroke || this.stroke;
  this.strokeWidth = options.strokeWidth || this.strokeWidth;
  this.rotationRadius = options.rotationRadius || this.rotationRadius;
  this.kineticShape = this.generateKineticShape();
};

Ship.prototype = {
  x: 15,
  y: 15,
  length: 3,
  width: 3,
  fill: 'black',
  stroke: 'black',
  strokeWidth: 2,
  rotationRadius: 0,
  kineticShape: null,

  generateKineticShape: function() {
    var self = this;
    return new Kinetic.Shape({
      drawFunc: function(canvas) {
        var context = canvas.getContext();
        var attrs = this.getAttrs();
        x = attrs.rotationRadius;
        y = -4*attrs.length/5;

        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x-attrs.width/2, y+attrs.length);
        context.lineTo(x, y+4*attrs.length/5);
        context.lineTo(x+attrs.width/2, y+attrs.length);
        context.lineTo(x, y);
        context.closePath();
        canvas.fillStroke(this);
      },

      x: self.x,
      y: self.y,
      length: self.length,
      width: self.width,
      fill: self.fill,
      stroke: self.stroke,
      strokeWidth: self.strokeWidth,
      rotationRadius: self.rotationRadius
    });
  },

  moveTo: function(pt, options) {
    options.thetaDur = options.thetaDur || 1;
    options.moveDur  = options.moveDur  || 2;
    options.onFinish = options.onFinish || (function(){});
    options.easing   = options.easing   || 'ease-out';

    var shape = this.kineticShape,
        shipVector = {x: 0, y: -1},
        ptVector   = {x: pt.x-shape.getX(), y: pt.y-shape.getY()};

    var theta = Math.acos(
                  (shipVector.x*ptVector.x+shipVector.y*ptVector.y)/
                  (Math.sqrt(ptVector.x*ptVector.x+ptVector.y*ptVector.y))
                );

    if (pt.x <= this.kineticShape.getX()) {
      theta = -theta;
    }

    shape.transitionTo({
      rotation: theta,
      duration: options.thetaDur,

      callback: function(){
        shape.transitionTo({
          x: pt.x,
          y: pt.y,
          duration: options.moveDur,
          easing: options.easing,
          callback: options.onFinish
        });
      }
    });
  },

  infiniteRandomMove: function(options) {
    options = options || {};
    var self = this;
    self.stopInfiniteMove = false;

    var infiniteMove = function(){
      var x = Math.floor(Math.random()*self.kineticShape.getStage().getWidth()),
          y = Math.floor(Math.random()*self.kineticShape.getStage().getHeight());
      options.onFinish = infiniteMove;

      if (!self.stopInfiniteMove) {
        self.moveTo({x: x, y: y}, options);
      }
    };

    infiniteMove();
  },

  setStopInfiniteMove: function(){
    this.stopInfiniteMove = true;
  }
};