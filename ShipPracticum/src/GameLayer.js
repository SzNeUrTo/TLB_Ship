var socket = io.connect('http://127.0.0.1:8080');

var GameLayer = cc.LayerColor.extend({
    init: function() {
        this.showText = 'Waiting For Host';
        this._super(new cc.Color4B(127, 127, 127, 255));
        this.textField = cc.LabelTTF.create(this.showText, GameLayer.FONT,30 );
        this.setPosition(new cc.Point(0, 0));
        this.IOSocket();
        this.setTextRemaining();
        this.ships = [];
        this.bullets = [];
        // this.bulletsRemover = [];

        // var ships = [];
        // console.log(ships.length);
        // ships.push(new Ship());
        // ships.push(new Ship());
        // ships[0].setPosition(new cc.Point(500,500));
        // ships[1].setPosition(new cc.Point(200,500));
        // this.addChild(ships[0]);
        // this.addChild(ships[1]);
        // this.removeChild(this.removeArrayAtIndex(ships, 0));
        // // this.removeChild(ships.splice(0,1)[0]);
        // // this.removeChild(ships.splice(0,1)[0]);
        // console.log(ships.length);

        // var ship = new Ship();
        // ship.setPosition(new cc.Point(500,500));
        // this.addChild( ship );
        // ship.scheduleUpdate();

        // var bullet = new Bullet();
        // bullet.setPosition( new cc.Point( 400,200));
        // this.addChild( bullet);
        // bullet.scheduleUpdate();
        return true;
    },

    removeArrayAtIndex : function (arr, index) {
        return arr.splice(index, 1)[0];
    },

    updateTimer : function(timeRemaining) {
        if(timeRemaining > 0)
            this.showText = 'RemainingTime : ' + timeRemaining;
        else 
            this.showText = '========= GAME OVER =========';
        this.setTextRemaining();
    },

    createPlayers : function (players, index) {
        for (var i = 0; i < players.length; i++) {
            this.ships[i] = new Ship();
            this.updatePlayers(players, index, i);
            this.addChild(this.ships[i]);
        }    
    },

    updatePlayers : function () {
        this.ships[i].sid = players[index[i]].sid;
        this.ships[i].lifepoint = players[index[i]].lifepoint;
        this.ships[i].updatePositionRotation(players[index[i]].x, players[index[i]].y, players[index[i]].angle)
    },

    createBullets : function (dataBullet) {
        lastIndex = this.bullets.length;
        this.bullets.push(new Bullet());
        this.bullets[lastIndex].updatePositionXY(dataBullet.x, dataBullet.y);
        this.bullets[lastIndex].owner = dataBullet.owner;
        this.addChild(this.bullets[lastIndex]);
    },

    updateBullets : function (dataBullets) {
        for (var i = 0; i < dataBullets.length; i++) {
            this.bullets[i].x = dataBullets[i].x;
            this.bullets[i].y = dataBullets[i].y;
        }
    },

    removeBullets : function (bulletsRemover) {
        for (var i = 0; i < bulletsRemover.length; i++) {
            indexBullet = bulletsRemover[i];
            this.removeChild(removeArrayAtIndex(this.bullets, indexBullet - i));
        };
    },

    IOSocket: function () {
        var self = this; // important

        socket.on('updateTimer', function(timeRemaining) {
            self.updateTimer(timeRemaining);
        });

        socket.on('createPlayers', function(players, index) {
            self.createPlayers(players, index);
        });

        socket.on('updatePlayers', function(players, index) {
            self.updatePlayers(players, index);
        });
        //rw
        socket.on('createBullets', function(dataBullet) {
            self.createBullets(dataBullet);
        });

        socket.on('updateBullets', function(dataBullets) {
            self.updateBullets(dataBullets);
        });

        socket.on('removeBullets', function(bulletsRemover) {
            self.removeBullets(bulletsRemover);
        });
        //rw
    },

    setTextRemaining: function() {
        this.removeChild(this.textField);
        this.textField = cc.LabelTTF.create(this.showText, GameLayer.FONT,30 );
        this.textField.setPosition(cc.p(800/2, 600 - 25));
        this.addChild(this.textField);
    },
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