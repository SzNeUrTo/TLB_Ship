var socket = io.connect('http://127.0.0.1:8080');

var GameLayer = cc.LayerColor.extend({
    init: function() {
        this._super( new cc.Color4B( 127, 127, 127, 255 ) );
        this.setPosition( new cc.Point( 0, 0 ) );
 
        var ship = new Ship();
        ship.setPosition( new cc.Point( 200, 220 ) );
        this.addChild( ship );

        ship.scheduleUpdate();

        socket.on('menu', function(pizza) {
            console.log('Recieve : ' + pizza.pizza);
            if (pizza.pizza == 'Go')
                ship.go = true;
        });
     
        return true;
    }
});

var StartScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        
        var layer = new GameLayer();
        layer.init();
        this.addChild( layer );
    }
});


socket.on('connect', function() {
    console.log('Connected');

});
