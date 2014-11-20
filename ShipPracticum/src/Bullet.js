var Bullet = cc.Sprite.extend({
    ctor: function() {
        this._super();
        this.cx = 2000;
        this.cy = 2000;
        this.initWithFile('images/bullet.png');
    },

    updatePositionXY : function(x, y) {
        this.cx = x + Bullet.SIZE / 2;
        this.cy = y + Bullet.SIZE / 2;
        this.setPosition(new cc.Point(this.cx + Ship.SIZE / 2, this.cy + Ship.SIZE / 2));
    }
});

Bullet.SIZE = 4;