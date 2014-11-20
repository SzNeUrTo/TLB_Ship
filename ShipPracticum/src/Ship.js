var screenWidth = 800;
var screenHeight = 600;
var Ship = cc.Sprite.extend({
    ctor: function() {
        this._super();
        this.cx = -1000;
        this.cy = -1000;
        this.angle = 0;
        this.sid = 'eiei';
        this.lifepoint = -100;
        this.initWithFile( 'images/ship.png' );
    },

    updatePositionRotation : function(x, y, angle) {
        this.cx = x + Ship.SIZE / 2;
        this.cy = y + Ship.SIZE / 2;
        this.angle = angle;
        this.setPosition(new cc.Point(this.cx, this.cy));
        this.setRotation(this.angle);
    },
});

Ship.SIZE = 64;

