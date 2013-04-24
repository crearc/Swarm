$$(document).ready(function(){
  var moveShip, env, stage, layer, shipLayer, planet, planet2, planet3, planet4, layer2, layer3, layer4;
  env = $$.environment();

  stage = new Kinetic.Stage({
    container: 'container',
    width: env.screen.width-100,
    height: env.screen.height-100
  });

  layer = new Kinetic.Layer();
  layer2 = new Kinetic.Layer();
  layer3 = new Kinetic.Layer();
  layer4 = new Kinetic.Layer();
  shipLayer = new Kinetic.Layer();

  planet = new Planet({
    x: stage.getWidth()/2,
    y: stage.getHeight()/2,
    numShips: 5,
    layer: layer
  });

  planet2 = new Planet({
    x: 150,
    y: 150,
    numShips: 5,
    layer: layer2
  });

  planet3 = new Planet({
    x: 350,
    y: 350,
    numShips: 5,
    layer: layer3
  });

  planet4 = new Planet({
    x: 350,
    y: 100,
    numShips: 5,
    layer: layer4
  });

  moveShip = new Ship();
  shipLayer.add(moveShip.kineticShape);
  stage.add(layer);
  stage.add(layer2);
  stage.add(layer3);
  stage.add(layer4);
  stage.add(shipLayer);

  moveShip.infiniteRandomMove();

  // setInterval(function(){
  //   planet.removeShip();
  // }, 1000);

  setTimeout(function(){
    var ship = planet.ships.pop();
    var ship2 = planet2.ships.pop();
    ship.kineticShape.setPosition(ship.x, ship.y);
    ship.setRotationRadius(0);

    ship2.kineticShape.setPosition(ship2.x, ship2.y);
    ship2.setRotationRadius(0);

    var ptToGo = {
      x: ship.x + 0.75*(ship2.x - ship.x),
      y: ship.y + 0.75*(ship2.y - ship.y)
    };

    ship2.moveTo(ptToGo);
    ship.moveTo(ptToGo, {
      onFinish: function(){
        this.explode();
        ship2.explode();
      }
    });
  }, 1000);

});