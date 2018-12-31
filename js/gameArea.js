//NOTE: Shading is 75% Licorice (most black)
function startGame(){
    gameArea.start();
    player1 = new player();
    player2 = new player();
    player1.initialSetup(1, "ninja");
    player2.initialSetup(2, "mage");
    arrow.initialSetup();
    dragoon.initialSetup();
    worlds.new();
    enemies.new();
    gameArea.tick = setInterval(loop, 20);
    gameArea.left.x = player1.x + player1.width/2 - gameArea.canvas.width/(4*gameArea.left.sizeMultiplier);
    gameArea.left.y = player1.y + player1.height - 10;
    gameArea.right.x = player2.x + player2.width/2 - gameArea.canvas.width/(4*gameArea.right.sizeMultiplier);
    gameArea.right.y = player2.y + player2.height - 10;
    for(i = 0; i < 222; i++){
        lastUpMap[i] = 0;
        lastUseMap[i] = 0;
        lastPressMap[i] = 0;
        toggleMap[i] = 0;
    }
    lastUseMap[1000] = 0;
    lastUseMap[1001] = 0;
    toggleMap[51] = true;
    toggleMap[52] = true;
}
function loop(){
    gameArea.loop();
    colors.invert();
    ui.escape();
    player1.loop();
    player2.loop();
    arrow.updatePos();
    worlds.loop();
    enemies.loop();
    drawAll();
}
function drawAll(){
    worlds.draw();
    enemies.draw();
    player1.draw();
    player2.draw();
    arrow.draw();
    ui.draw();
}
var gameArea = {
    canvas : document.createElement("canvas"),
    x : 0, 
    y : 0,
    verticalShift : 0,
    xveloc : 0,
    yveloc : 0,
    xaccel : 0,
    yaccel : 0,
    xvelocCtrl : 0, //Control variables are controlled by player input on the keyboard
    yvelocCtrl : 0, 
    xaccelCtrl : 0,
    yaccelCtrl : 0,
    lastHitValue : 20,
    sizeMultiplier : 3.6,
    time : 0,
    startTime : 0,
    mouseX : 0,
    mouseY : 0, 
    left : {
        x : 0,
        y : 0,
        verticalShift : 0,
        sizeMultiplier : 3.6,
    },
    right : {
        x : 0,
        y : 0,
        verticalShift : 0,
        sizeMultiplier : 3.6,
    },
    splitScreen : false,
    backgroundImage : "shell",
    autoSize : true,
    start : function(){
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        document.getElementById("hide").style.opacity = 0;
        this.ctx = this.canvas.getContext("2d");
        var backgroundImage = new Image();
        this.backgroundImage = backgroundImage;
        this.canvas.width = 1200;
        this.canvas.height = 600;
        this.updateTime();
        this.startTime = this.time;
        this.left.verticalShift = this.canvas.height/2;
        this.right.verticalShift = this.canvas.height/2;
    },
    loop : function(){
        this.canvas.style.backgroundColor = colors.white;
        this.clear();
        this.drawBackground();
        this.pvpToggle();
        this.updateTime();
        this.move();
        this.updateFrame();
    },
    clear : function(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }, 
    drawBackground : function(){
        if(this.backgroundImage.src != null){
            this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
        }
    },
    pvpToggle : function(){
        this.pvp = toggleMap[49]; //t
    },
    onScreen : function(x, y, width, height){
        var returnVar = {
            full : false,
            left : false,
            right : false,
        }
        if(this.splitScreen
        && x + width > this.left.x && x < this.left.x + (this.canvas.width/2)/this.left.sizeMultiplier
        && y + height > this.left.y - (this.canvas.height/2)/this.left.sizeMultiplier && y < this.left.y + (this.canvas.height/2)/this.left.sizeMultiplier){
            returnVar.left = true;
        }
        if(this.splitScreen
        && x + width > this.right.x && x < this.right.x + (this.canvas.width/2)/this.right.sizeMultiplier
        && y + height > this.right.y - (this.canvas.height/2)/this.right.sizeMultiplier && y < this.right.y + (this.canvas.height/2)/this.right.sizeMultiplier){
            returnVar.right = true;
        }
        if(!this.splitScreen
        && x + width > this.x && x < this.x + this.canvas.width/this.sizeMultiplier){
            returnVar.full = true;
        }
        return returnVar;
    },
    drawImage : function(image, animationFrameX, animationFrameY, modelWidth, modelHeight, x, y, width, height){ //Relative to frame
        var onScreen = this.onScreen(x, y, width, height);
        if(onScreen.left){
            this.ctx.save();
                this.ctx.beginPath();
                this.ctx.rect(0, 0, this.canvas.width/2, this.canvas.height);
                this.ctx.clip();
                this.ctx.beginPath();
                this.ctx.imageSmoothingEnabled = false;
                this.ctx.drawImage(image, animationFrameX, animationFrameY, modelWidth, modelHeight, this.left.sizeMultiplier*(x - this.left.x), this.left.sizeMultiplier*(y - this.left.y)+ this.left.verticalShift, this.left.sizeMultiplier*width, this.left.sizeMultiplier*height);
            this.ctx.restore();
        }
        if(onScreen.right){
            this.ctx.save();
                this.ctx.beginPath();
                this.ctx.rect(this.canvas.width/2, 0, this.canvas.width/2, this.canvas.height);
                this.ctx.clip();
                this.ctx.beginPath();
                this.ctx.imageSmoothingEnabled = false;
                this.ctx.drawImage(image, animationFrameX, animationFrameY, modelWidth, modelHeight, this.canvas.width/2 + this.right.sizeMultiplier*(x - this.right.x), this.right.sizeMultiplier*(y - this.right.y)+ this.right.verticalShift, this.right.sizeMultiplier*width, this.right.sizeMultiplier*height);
            this.ctx.restore();
        }
        if(onScreen.full){
            this.ctx.imageSmoothingEnabled = false;
            this.ctx.drawImage(image, animationFrameX, animationFrameY, modelWidth, modelHeight, this.sizeMultiplier*(x - this.x), this.sizeMultiplier*(y - this.y)+ this.verticalShift, this.sizeMultiplier*width, this.sizeMultiplier*height);
        }
    },
    drawLine : function(xstart, ystart, xend, yend, color){ //Relative to frame
        if(this.splitScreen){
            var onScreen = this.onScreen(xstart, ystart, xend-xstart, yend-ystart);
            if(onScreen.left){
                this.ctx.save();
                    this.ctx.beginPath();
                    this.ctx.rect(0, 0, this.canvas.width/2, this.canvas.height);
                    this.ctx.clip();
                    this.ctx.beginPath();
                    this.ctx.strokeStyle=color;
                    this.ctx.moveTo(this.left.sizeMultiplier*(xstart - this.left.x), this.left.sizeMultiplier*(ystart - this.left.y) + this.left.verticalShift);
                    this.ctx.lineTo(this.left.sizeMultiplier*(xend - this.left.x), this.left.sizeMultiplier*(yend - this.left.y) + this.left.verticalShift);
                    this.ctx.stroke();
                this.ctx.restore();
            }
            if(onScreen.right){
                this.ctx.save();
                    this.ctx.beginPath();
                    this.ctx.rect(this.canvas.width/2, 0, this.canvas.width/2, this.canvas.height);
                    this.ctx.clip();
                    this.ctx.beginPath();
                    this.ctx.strokeStyle=color;
                    this.ctx.moveTo(this.canvas.width/2 + this.right.sizeMultiplier*(xstart - this.right.x), this.right.sizeMultiplier*(ystart - this.right.y) + this.right.verticalShift);
                    this.ctx.lineTo(this.canvas.width/2 + this.right.sizeMultiplier*(xend - this.right.x), this.right.sizeMultiplier*(yend - this.right.y) + this.right.verticalShift);
                    this.ctx.stroke();
                this.ctx.restore();
            }
        }
        if(!this.splitScreen){
            this.ctx.beginPath();
            this.ctx.strokeStyle=color;
            this.ctx.moveTo(this.sizeMultiplier*(xstart - this.x), this.sizeMultiplier*(ystart - this.y)+ this.verticalShift);
            this.ctx.lineTo(this.sizeMultiplier*(xend - this.x), this.sizeMultiplier*(yend - this.y)+ this.verticalShift);
            this.ctx.stroke();
        }
    },
    drawRect : function(x, y, width, height, color){
        if(this.splitScreen){
            if(x + width > this.left.x && x < this.left.x + (this.canvas.width/2)/this.left.sizeMultiplier){
                this.ctx.save();
                    this.ctx.beginPath();
                    this.ctx.rect(0, 0, this.canvas.width/2, this.canvas.height);
                    this.ctx.clip();
                
                    this.ctx.beginPath();
                    this.ctx.strokeStyle=color;
                    this.ctx.rect(this.left.sizeMultiplier*(x - this.left.x), this.left.sizeMultiplier*(y - this.left.y) + this.left.verticalShift, this.left.sizeMultiplier*width, this.left.sizeMultiplier*height);
                    this.ctx.stroke();
                this.ctx.restore();
            }
            if(x + width > this.right.x && x < this.right.x + (this.canvas.width/2)/this.right.sizeMultiplier){
                this.ctx.save();
                    this.ctx.beginPath();
                    this.ctx.rect(this.canvas.width/2, 0, this.canvas.width/2, this.canvas.height);
                    this.ctx.clip();
                
                    this.ctx.beginPath();
                    this.ctx.strokeStyle=color;
                    this.ctx.rect(this.canvas.width/2 + this.right.sizeMultiplier*(x - this.right.x), this.right.sizeMultiplier*(y - this.right.y) + this.right.verticalShift, this.right.sizeMultiplier*width, this.right.sizeMultiplier*height);
                    this.ctx.stroke();
                this.ctx.restore();
            }
        }
        else{
            this.ctx.beginPath();
            this.ctx.strokeStyle=color;
            this.ctx.rect(this.sizeMultiplier*(x - this.x), this.sizeMultiplier*(y - this.y)+ this.verticalShift, this.sizeMultiplier*width, this.sizeMultiplier*height);
            this.ctx.stroke();
        }
    },
    drawTriangle : function(x1, y1, x2, y2, x3, y3, color){ //Bottom left is x1, bottom right is x2, middle is x3
        if(this.splitScreen){
            if(x2 > this.left.x && x1 < this.left.x + (this.canvas.width/2)/this.left.sizeMultiplier){
                this.ctx.save();
                    this.ctx.beginPath();
                    this.ctx.rect(0, 0, this.canvas.width/2, this.canvas.height);
                    this.ctx.clip();
                
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.left.sizeMultiplier*(x1-this.left.x), this.left.sizeMultiplier*(y1-this.left.y)+ this.left.verticalShift);
                    this.ctx.lineTo(this.left.sizeMultiplier*(x2-this.left.x), this.left.sizeMultiplier*(y2-this.left.y)+ this.left.verticalShift);
                    this.ctx.lineTo(this.left.sizeMultiplier*(x3-this.left.x), this.left.sizeMultiplier*(y3-this.left.y)+ this.left.verticalShift);
                    this.ctx.fillStyle = color;
                    this.ctx.fill();

                this.ctx.restore();
            }
            if(x2 > this.right.x && x1 < this.right.x + (this.canvas.width/2)/this.right.sizeMultiplier){
                this.ctx.save();
                    this.ctx.beginPath();
                    this.ctx.rect(this.canvas.width/2, 0, this.canvas.width/2, this.canvas.height);
                    this.ctx.clip();
                
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.canvas.width/2 + this.right.sizeMultiplier*(x1-this.right.x), this.right.sizeMultiplier*(y1-this.right.y)+ this.right.verticalShift);
                    this.ctx.lineTo(this.canvas.width/2 + this.right.sizeMultiplier*(x2-this.right.x), this.right.sizeMultiplier*(y2-this.right.y)+ this.right.verticalShift);
                    this.ctx.lineTo(this.canvas.width/2 + this.right.sizeMultiplier*(x3-this.right.x), this.right.sizeMultiplier*(y3-this.right.y)+ this.right.verticalShift);
                    this.ctx.fillStyle = color;
                    this.ctx.fill();
                this.ctx.restore();
            }
        }
        else{
            this.ctx.beginPath();
            this.ctx.beginPath();
            this.ctx.moveTo(this.sizeMultiplier*(x1-this.x), this.sizeMultiplier*(y1-this.y)+ this.verticalShift);
            this.ctx.lineTo(this.sizeMultiplier*(x2-this.x), this.sizeMultiplier*(y2-this.y)+ this.verticalShift);
            this.ctx.lineTo(this.sizeMultiplier*(x3-this.x), this.sizeMultiplier*(y3-this.y)+ this.verticalShift);
            this.ctx.fillStyle = color;
            this.ctx.fill();
        }
    },
    drawBlock : function(x, y, width, height, color){
        if(this.splitScreen){
            if(x + width > this.left.x && x < this.left.x + (this.canvas.width/2)/this.left.sizeMultiplier){
                this.ctx.save();
                    this.ctx.beginPath();
                    this.ctx.rect(0, 0, this.canvas.width/2, this.canvas.height);
                    this.ctx.clip();
                
                    this.ctx.fillStyle = color;
                    this.ctx.fillRect(this.left.sizeMultiplier*(x - this.left.x), this.left.sizeMultiplier*(y - this.left.y)+ this.left.verticalShift, this.left.sizeMultiplier*width, this.left.sizeMultiplier*height);
                this.ctx.restore();
            }
            if(x + width > this.right.x && x < this.right.x + (this.canvas.width/2)/this.right.sizeMultiplier){
                this.ctx.save();
                    this.ctx.beginPath();
                    this.ctx.rect(this.canvas.width/2, 0, this.canvas.width/2, this.canvas.height);
                    this.ctx.clip();
                
                    this.ctx.fillStyle = color;
                    this.ctx.fillRect(this.canvas.width/2 + this.right.sizeMultiplier*(x - this.right.x), this.right.sizeMultiplier*(y - this.right.y)+ this.right.verticalShift, this.right.sizeMultiplier*width, this.right.sizeMultiplier*height);
                this.ctx.restore();
            }
        }
        else{
            this.ctx.fillStyle = color;
            this.ctx.fillRect(this.sizeMultiplier*(x - this.x), this.sizeMultiplier*(y - this.y)+ this.verticalShift, this.sizeMultiplier*width, this.sizeMultiplier*height);
        }
    },
    drawCirc : function(x, y, radius, color){
        if(this.splitScreen){
            if(x + radius > this.left.x && x - radius < this.left.x + (this.canvas.width/2)/this.left.sizeMultiplier){
                this.ctx.save();
                    this.ctx.beginPath();
                    this.ctx.rect(0, 0, this.canvas.width/2, this.canvas.height);
                    this.ctx.clip();
                    this.ctx.beginPath();
                    this.ctx.strokeStyle=color;
                    this.ctx.arc(this.left.sizeMultiplier*(x - this.left.x), this.left.sizeMultiplier*(y - this.left.y)+ this.left.verticalShift, this.left.sizeMultiplier*radius, 0, 2*Math.PI);
                    this.ctx.stroke();
                this.ctx.restore();
            }
            if(x + radius > this.right.x && x - radius < this.right.x + (this.canvas.width/2)/this.right.sizeMultiplier){
                this.ctx.save();
                    this.ctx.beginPath();
                    this.ctx.rect(this.canvas.width/2, 0, this.canvas.width/2, this.canvas.height);
                    this.ctx.clip();
                    this.ctx.beginPath();
                    this.ctx.strokeStyle=color;
                    this.ctx.arc(this.canvas.width/2 + this.right.sizeMultiplier*(x - this.right.x), this.right.sizeMultiplier*(y - this.right.y)+ this.right.verticalShift, this.right.sizeMultiplier*radius, 0, 2*Math.PI);
                    this.ctx.stroke();
                this.ctx.restore();
            }
        }
        else{
            this.ctx.beginPath();
            this.ctx.strokeStyle=color;
            this.ctx.arc(this.sizeMultiplier*(x - this.x), this.sizeMultiplier*(y - this.y)+ this.verticalShift, this.sizeMultiplier*radius, 0, 2*Math.PI);
            this.ctx.stroke();
        }
    },
    updateFrame : function(){
        this.x += this.xveloc + this.xvelocCtrl;
        this.y += this.yveloc + this.yvelocCtrl;
        this.xveloc += this.xaccel + this.xaccelCtrl;
        this.yveloc += this.yaccel + this.yaccelCtrl;

        if(toggleMap[51]){//Math.abs((player2.x + player2.width/2) - (player1.x + player1.width/2)) < this.canvas.width/this.sizeMultiplier
            var dpx = 0; //Desired Position
            var dpy = 0;
            if(false){
                this.splitScreen = false;
                dpx = ((player1.x + player1.width/(2*this.sizeMultiplier) + player2.x + player2.width/(2*this.sizeMultiplier))/2 - this.canvas.width/(2*this.sizeMultiplier));
                this.x += 0.1*(dpx-this.x);
                this.verticalShift = (1-this.sizeMultiplier)*this.canvas.height;
            }
            else{
                this.splitScreen = true;

                dpx = 0;
                dpy = 0;
                var importantItems = player1.findNoteworthyItems();
                for(i = 0; i < importantItems.x.length; i++){
                    dpx += importantItems.x[i] * importantItems.weight[i];
                    dpy += importantItems.y[i] * importantItems.weight[i];
                }
                dpx -= this.canvas.width/(4*this.left.sizeMultiplier);
                this.left.x += 0.1*(dpx - this.left.x);
                dpy -= 10;
                this.left.y += 0.05*(dpy - this.left.y);
                if(keyMap[38] || keyMap[40]){ //Potato solution to moving screen while shrinking/widening problem
                    this.left.x = dpx;
                }

                dpx = 0;
                dpy = 0;
                var importantItems = player2.findNoteworthyItems();
                for(i = 0; i < importantItems.x.length; i++){
                    dpx += importantItems.x[i] * importantItems.weight[i];
                    dpy += importantItems.y[i] * importantItems.weight[i];
                }
                dpx -= this.canvas.width/(4*this.right.sizeMultiplier);
                this.right.x += 0.1*(dpx - this.right.x);
                dpy -= 10;
                this.right.y += 0.05*(dpy - this.right.y);
                if(keyMap[38] || keyMap[40]){ //Potato solution to moving screen while shrinking/widening problem
                    this.left.x = dpx;
                }
            }
        }
        if(this.splitScreen){
            this.ctx.beginPath();
            this.ctx.strokeStyle="black";
            this.ctx.moveTo(this.canvas.width/2, 0);
            this.ctx.lineTo(this.canvas.width/2, this.canvas.height);
            this.ctx.stroke();
        }
        if(this.autoSize){
            if(!this.splitScreen){
                if(Math.abs((player1.x+player1.width/2)-(player2.x+player2.width/2)) > 250){
                    if(this.sizeMultiplier > 0.5){
                        this.sizeMultiplier -= 0.01*this.sizeMultiplier;
                    }
                    if(this.sizeMultiplier < 0.49){
                        this.sizeMultiplier += 0.01*this.sizeMultiplier;
                    }
                }
                else{
                    if(this.sizeMultiplier < 1){
                        this.sizeMultiplier += 0.01*this.sizeMultiplier;
                    }
                    if(this.sizeMultiplier > 1.01){
                        this.sizeMultiplier -= 0.01*this.sizeMultiplier;
                    }
                }
            }
            if(this.splitScreen){
                if(Math.abs((player2.x + player2.width/2) - (player1.x + player1.width/2)) < this.canvas.width/.5){
                    if(this.sizeMultiplier > 0.5){
                        this.sizeMultiplier -= 0.01*this.sizeMultiplier;
                    }
                    if(this.sizeMultiplier < 0.49){
                        this.sizeMultiplier += 0.01*this.sizeMultiplier;
                    }
                }
                else{
                    if(this.sizeMultiplier < 1){
                        this.sizeMultiplier += 0.01*this.sizeMultiplier;
                    }
                    if(this.sizeMultiplier > 1.01){
                        this.sizeMultiplier -= 0.01*this.sizeMultiplier;
                    }
                }
            }
        }
    },
    move : function(){
        this.autoSize = toggleMap[52];
        if(keyMap[37]){
            this.xvelocCtrl = -0.5;
            this.xaccelCtrl = -0.05;
            if(this.xveloc > 5){
                this.xaccelCtrl = -1;
            }
        }  
        if(keyMap[39]){
            this.xvelocCtrl = 0.5;
            this.xaccelCtrl = 0.05;
            if(this.xveloc < -5){
                this.xaccelCtrl = 1;
            }
        }
        if(keyMap[38]){
            if(!this.splitScreen){
                if(this.sizeMultiplier < 12){
                    this.sizeMultiplier += 0.1;
                }
            }
            if(this.splitScreen){
                if(keyMap[81] && this.left.sizeMultiplier < 12){ //Q
                    this.left.sizeMultiplier += 0.1;
                }
                if(keyMap[85] && this.right.sizeMultiplier < 12){ //U
                    this.right.sizeMultiplier += 0.1;
                }
                if(keyMap[69]){ //E
                    this.left.verticalShift += 1;
                }
                if(keyMap[79]){ //O
                    this.right.verticalShift += 1;
                }
            }
            //this.x += 0.01*gameArea.canvas.width;
        }
        if(keyMap[40]){
            if(!this.splitScreen){
                if(this.sizeMultiplier > 0.3){
                    this.sizeMultiplier -= 0.1;
                }
            }
            if(this.splitScreen){
                if(keyMap[81] && this.left.sizeMultiplier > 0.3){
                    this.left.sizeMultiplier -= 0.1;
                }
                if(keyMap[85] && this.right.sizeMultiplier > 0.3){
                    this.right.sizeMultiplier -= 0.1;
                }
                if(keyMap[69]){ //E
                    this.left.verticalShift -= 1;
                }
                if(keyMap[79]){ //O
                    this.right.verticalShift -= 1;
                }
            }
            //this.x -= 0.01*gameArea.canvas.width;
        }
        if(!keyMap[37] && !keyMap[39]){
            this.xvelocCtrl = 0;
            this.xaccelCtrl = 0;
        }
        if(!keyMap[38] && !keyMap[40]){
            this.yvelocCtrl = 0;
            this.yaccelCtrl = 0;
        }
        if(keyMap[32]){
            this.x = player1.x + player1.width/2 - this.canvas.width/2;
            this.sizeMultiplier = 1;
            this.left.sizeMultiplier = 1;
            this.right.sizeMultiplier = 1;
        }
    },
    updateTime : function(){
        this.time = new Date();
    },
}
var ui = {
    testVariables : [],
    devMode : true,
    escape : function(){
        if(toggleMap[27]){
            clearInterval(gameArea.tick);
            ui.menuTick = setInterval(ui.menuLoop, 20);
        }
    },
    menuLoop : function(){ 
        gameArea.clear();
        drawAll();
        gameArea.updateTime();
        if(!toggleMap[27]){
            clearInterval(ui.menuTick);
            gameArea.tick = setInterval(loop, 20);
        }
        gameArea.ctx.fillText("Paused", 0, 140);
    },
    draw : function(){
        this.showUi = !toggleMap[53];
        this.devMode = !toggleMap[54];
        if(this.showUi){
            if(this.devMode){
                this.heldKeys();
                this.printVar();
            }
            this.bars();
            this.pvp();
        }
    },
    heldKeys : function(){
        var h = 0;
        for(i = 0; i < 222; i++){
            if(keyMap[i] == true){
                var key = String.fromCharCode(i);
                gameArea.ctx.fillText(key, (14/15)*gameArea.canvas.width, 50 + 10*h);
                h += 1;
            }
        }
        gameArea.ctx.fillText(h, (14/15)*gameArea.canvas.width, 40);
    },
    bars : function(){
        player1.healthBar();
        player1.manaBar();
        player2.healthBar();
        player2.manaBar();
        if(player1.health <= 0){
            this.drawVar("player 1 ded " + player1.health);
        }
        if(player2.health <= 0){
            this.drawVar("player 2 ded" + player2.health);
        }
    },
    drawVar : function(variable){
        gameArea.ctx.fillText(variable, (6/15)*gameArea.canvas.width, 10);
    },
    testVar : function(variable){
        this.testVariables.push(variable);
    },
    printVar : function(){
        for(i = 0; i < this.testVariables.length; i++){
            gameArea.ctx.fillText(this.testVariables[i], 5, 100 + 10*i);
        }
        this.testVariables = [];
    },
    pvp : function(){
        if(gameArea.pvp){
            gameArea.ctx.fillText("Pvp on", 150, 30);
        }
    },
}
var colors = {
    black : "black", 
    white : "white", 
    blue : "blue",
    red : "red",
    invert : function(){
        if(toggleMap[50]){
            this.black = "white";
            this.white = "black";
            this.blue = "red";
            this.red = "blue";
        }
        else{
            this.black = "black";
            this.white = "white";
            this.blue = "blue";
            this.red = "red";
        }
    },
    random : function(){
        var num = Math.random();
        var color = colors.black;
        if(num < .25){
            color = this.black;
        }
        if(num >= .25 && num < .55){
            color = this.white;
        }
        if(num >= .55 && num < .75){
            color = this.blue;
        }
        if(num >= .75){
            color = this.red;
        }
        return color;
    },
}
var keyMap = [];
var lastUseMap = [];
var lastUpMap = [];
var lastPressMap = [];
var toggleMap = [];
document.addEventListener('keydown', function(event) {
//    var key = String.fromCharCode(event.keyCode);
//    gameArea.ctx.fillText(key, 20, 60);
    if(keyMap[event.keyCode] != true){
        keyMap[event.keyCode] = true;
    }
    if(event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 32){
        event.preventDefault();
    }
    //Toggle stuff
    if(toggleMap[event.keyCode] && gameArea.time - lastPressMap[event.keyCode] >= 100){
        toggleMap[event.keyCode] = false;
        if(event.keyCode == 51){
            gameArea.xveloc = 0;
        }
    }
    else if(!toggleMap[event.keyCode] && gameArea.time - lastPressMap[event.keyCode] >= 100){
        toggleMap[event.keyCode] = true;
    }
    lastPressMap[event.keyCode] = gameArea.time;
    if(worlds.testyTest){
        toggleMap[52] = false;
    }
});
document.addEventListener('keyup', function(event) {
//    gameArea.ctx.fillText(event.keyCode, 20, 80);
    if(keyMap[event.keyCode] != false){
        keyMap[event.keyCode] = false;
    }
    lastUpMap[event.keyCode] = gameArea.time;
});
document.addEventListener("mousemove", function(event) {
    gameArea.mouseX = event.clientX + gameArea.x;
    gameArea.mouseY = event.clientY + gameArea.y;
});




var rectanglePlatform = {
    rectX : [],
    rectY : [],
    rectWidth : [],
    rectHeight : [],
    rectXVeloc : [],
    rectYVeloc : [],
    rectColor : [],
    rectTransparency : [], //
    arrayPosition : [],
    initialSetup : function(){
        for(i = 0; i < 200; i++){
            var x = 100 * i * (Math.random() - 0.5);
            var y = 2 * gameArea.canvas.height * Math.random();
            var width = 100 * Math.random();
            var height = 5;
            var xveloc = Math.random() - 0.5;
            var yveloc = 0;
            var color = colors.blue;
            var transparency = true;
            this.new(x, y, width, height, xveloc, yveloc, color, transparency);
        }
    },
    new : function(x, y, width, height, xveloc, yveloc, color, transparency){
        this.rectX.push(x);
        this.rectY.push(y);
        this.rectWidth.push(width);
        this.rectHeight.push(height);
        this.rectXVeloc.push(xveloc);
        this.rectYVeloc.push(yveloc);
        this.rectColor.push(color);
        this.rectTransparency.push(transparency);
        i = this.rectX.length-1;
        collisionObjects.rectX.push(this.rectX[i]);
        collisionObjects.rectY.push(this.rectY[i]);
        collisionObjects.rectWidth.push(this.rectWidth[i]);
        collisionObjects.rectHeight.push(this.rectHeight[i]);
        collisionObjects.rectXVeloc.push(this.rectXVeloc[i]);
        collisionObjects.rectTransparency.push(this.rectTransparency[i]);
        this.arrayPosition[i] = collisionObjects.rectX.length-1;
    },
    updatePos : function(){
        for(i = 0; i< this.rectX.length; i++){
            this.rectX[i] += this.rectXVeloc[i];
            this.rectY[i] += this.rectYVeloc[i];
            collisionObjects.rectX[this.arrayPosition[i]] = this.rectX[i];
            collisionObjects.rectY[this.arrayPosition[i]] = this.rectY[i];
            collisionObjects.rectWidth[this.arrayPosition[i]] = this.rectWidth[i];
            collisionObjects.rectHeight[this.arrayPosition[i]] = this.rectHeight[i];
            collisionObjects.rectXVeloc[this.arrayPosition[i]] = this.rectXVeloc[i];
            collisionObjects.rectTransparency[this.arrayPosition[i]] = this.rectTransparency[i];
        }
    },
    draw : function(){
        for(i = 0; i < this.rectX.length; i++){
            gameArea.drawRect(this.rectX[i], this.rectY[i], this.rectWidth[i], this.rectHeight[i], this.rectColor[i]);
        }
    },
}



