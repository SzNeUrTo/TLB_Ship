var Ship = cc.Sprite.extend({

    ctor: function() {
    	this.go = false;
        this._super();
        this.initWithFile( 'images/ship.png' );
    },
    
    update: function( dt ) {
		var pos = this.getPosition();
		if (this.go) {
			this.setPosition( new cc.Point( pos.x, pos.y + 5 ) );
		};
		
	},


});