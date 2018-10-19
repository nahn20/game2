//NOTE: Shading is 75% Licorice (most black)
function startGame(){
    gameArea.start();
    player1 = new player();
    player2 = new player();
    player1.initialSetup(1, "ninja");
    player2.initialSetup(2, "mage");
    shurikens.initialSetup();
    fireball.initialSetup();
    arrow.initialSetup();
    dragoon.initialSetup();
    worlds.new();
    enemies.new();
    gameArea.tick = setInterval(loop, 20);
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
    shurikens.updatePos();
    fireball.updatePos();
    arrow.updatePos();
    worlds.loop();
    enemies.loop();

    drawAll();
}
function drawAll(){
    worlds.draw();
    enemies.draw();
    shurikens.draw();
    player1.draw();
    player2.draw();
    fireball.draw();
    arrow.draw();
    ui.draw();
}
var gameArea = {
    canvas : document.createElement("canvas"),
    x : 0, 
    y : 0,
    xveloc : 0,
    yveloc : 0,
    xaccel : 0,
    yaccel : 0,
    xvelocCtrl : 0, //Control variables are controlled by player input on the keyboard
    yvelocCtrl : 0, 
    xaccelCtrl : 0,
    yaccelCtrl : 0,
    lastHitValue : 20,
    sizeMultiplier : 1,
    time : 0,
    startTime : 0,
    mouseX : 0,
    mouseY : 0, 
    leftx : 0,
    lefty : 0,
    rightx : 0,
    righty : 0,
    splitScreen : false,
    backgroundImage : "shell",
    autoSize : true,
    start : function(){
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        document.getElementById("hide").style.opacity = 0;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;
        var backgroundImage = new Image();
        this.backgroundImage = backgroundImage;
        this.updateTime();
        this.startTime = this.time;
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
    drawImage : function(image, animationFrameX, animationFrameY, modelWidth, modelHeight, x, y, width, height){ //Relative to frame
        if(this.splitScreen){ 
            if(x + width > this.leftx && x < this.leftx + (this.canvas.width/2)/this.sizeMultiplier){
                this.ctx.save();
                    this.ctx.beginPath();
                    this.ctx.rect(0, 0, this.canvas.width/2, this.canvas.height);
                    this.ctx.clip();
                    this.ctx.beginPath();
                    this.ctx.drawImage(image, animationFrameX, animationFrameY, modelWidth, modelHeight, this.sizeMultiplier*(x - this.leftx), this.sizeMultiplier*(y - this.lefty)-(this.sizeMultiplier-1)*gameArea.canvas.height, this.sizeMultiplier*width, this.sizeMultiplier*height);
                this.ctx.restore();
            }
            if(x + width > this.rightx && x < this.rightx + (this.canvas.width/2)/this.sizeMultiplier){
                this.ctx.save();
                    this.ctx.beginPath();
                    this.ctx.rect(this.canvas.width/2, 0, this.canvas.width/2, this.canvas.height);
                    this.ctx.clip();
                    this.ctx.beginPath();
                    this.ctx.drawImage(image, animationFrameX, animationFrameY, modelWidth, modelHeight, this.canvas.width/2 + this.sizeMultiplier*(x - this.rightx), this.sizeMultiplier*(y - this.righty)-(this.sizeMultiplier-1)*gameArea.canvas.height, this.sizeMultiplier*width, this.sizeMultiplier*height);
                this.ctx.restore();
            }
        }
        else{
            this.ctx.drawImage(image, animationFrameX, animationFrameY, modelWidth, modelHeight, this.sizeMultiplier*(x - this.x), this.sizeMultiplier*(y - this.y)-(this.sizeMultiplier-1)*gameArea.canvas.height, this.sizeMultiplier*width, this.sizeMultiplier*height);
        }
    },
    drawLine : function(xstart, ystart, xend, yend, color){ //Relative to frame
        if(this.splitScreen){
            if(xend > this.leftx && xstart < this.leftx + (this.canvas.width/2)/this.sizeMultiplier){
                this.ctx.save();
                    this.ctx.beginPath();
                    this.ctx.rect(0, 0, this.canvas.width/2, this.canvas.height);
                    this.ctx.clip();
                    this.ctx.beginPath();
                    this.ctx.strokeStyle=color;
                    this.ctx.moveTo(this.sizeMultiplier*(xstart - this.leftx), this.sizeMultiplier*(ystart - this.lefty)-(this.sizeMultiplier-1)*gameArea.canvas.height);
                    this.ctx.lineTo(this.sizeMultiplier*(xend - this.leftx), this.sizeMultiplier*(yend - this.lefty)-(this.sizeMultiplier-1)*gameArea.canvas.height);
                    this.ctx.stroke();
                this.ctx.restore();
            }
            if(xend > this.rightx &&  xstart < this.rightx + (this.canvas.width/2)/this.sizeMultiplier){
                this.ctx.save();
                    this.ctx.beginPath();
                    this.ctx.rect(this.canvas.width/2, 0, this.canvas.width/2, this.canvas.height);
                    this.ctx.clip();
                    this.ctx.beginPath();
                    this.ctx.strokeStyle=color;
                    this.ctx.moveTo(this.canvas.width/2 + this.sizeMultiplier*(xstart - this.rightx), this.sizeMultiplier*(ystart - this.righty)-(this.sizeMultiplier-1)*gameArea.canvas.height);
                    this.ctx.lineTo(this.canvas.width/2 + this.sizeMultiplier*(xend - this.rightx), this.sizeMultiplier*(yend - this.righty)-(this.sizeMultiplier-1)*gameArea.canvas.height);
                    this.ctx.stroke();
                this.ctx.restore();
            }
        }
        else{
            this.ctx.beginPath();
            this.ctx.strokeStyle=color;
            this.ctx.moveTo(this.sizeMultiplier*(xstart - this.x), this.sizeMultiplier*(ystart - this.y)-(this.sizeMultiplier-1)*gameArea.canvas.height);
            this.ctx.lineTo(this.sizeMultiplier*(xend - this.x), this.sizeMultiplier*(yend - this.y)-(this.sizeMultiplier-1)*gameArea.canvas.height);
            this.ctx.stroke();
        }
    },
    drawRect : function(x, y, width, height, color){
        if(this.splitScreen){
            if(x + width > this.leftx && x < this.leftx + (this.canvas.width/2)/this.sizeMultiplier){
                this.ctx.save();
                    this.ctx.beginPath();
                    this.ctx.rect(0, 0, this.canvas.width/2, this.canvas.height);
                    this.ctx.clip();
                
                    this.ctx.beginPath();
                    this.ctx.strokeStyle=color;
                    this.ctx.rect(this.sizeMultiplier*(x - this.leftx), this.sizeMultiplier*(y - this.lefty)-(this.sizeMultiplier-1)*gameArea.canvas.height, this.sizeMultiplier*width, this.sizeMultiplier*height);
                    this.ctx.stroke();
                this.ctx.restore();
            }
            if(x + width > this.rightx && x < this.rightx + (this.canvas.width/2)/this.sizeMultiplier){
                this.ctx.save();
                    this.ctx.beginPath();
                    this.ctx.rect(this.canvas.width/2, 0, this.canvas.width/2, this.canvas.height);
                    this.ctx.clip();
                
                    this.ctx.beginPath();
                    this.ctx.strokeStyle=color;
                    this.ctx.rect(this.canvas.width/2 + this.sizeMultiplier*(x - this.rightx), this.sizeMultiplier*(y - this.righty)-(this.sizeMultiplier-1)*gameArea.canvas.height, this.sizeMultiplier*width, this.sizeMultiplier*height);
                    this.ctx.stroke();
                this.ctx.restore();
            }
        }
        else{
            this.ctx.beginPath();
            this.ctx.strokeStyle=color;
            this.ctx.rect(this.sizeMultiplier*(x - this.x), this.sizeMultiplier*(y - this.y)-(this.sizeMultiplier-1)*gameArea.canvas.height, this.sizeMultiplier*width, this.sizeMultiplier*height);
            this.ctx.stroke();
        }
    },
    drawTriangle : function(x1, y1, x2, y2, x3, y3, color){ //Bottom left is x1, bottom right is x2, middle is x3
        if(this.splitScreen){
            if(x2 > this.leftx && x1 < this.leftx + (this.canvas.width/2)/this.sizeMultiplier){
                this.ctx.save();
                    this.ctx.beginPath();
                    this.ctx.rect(0, 0, this.canvas.width/2, this.canvas.height);
                    this.ctx.clip();
                
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.sizeMultiplier*(x1-this.leftx), this.sizeMultiplier*(y1-this.lefty)-(this.sizeMultiplier-1)*gameArea.canvas.height);
                    this.ctx.lineTo(this.sizeMultiplier*(x2-this.leftx), this.sizeMultiplier*(y2-this.lefty)-(this.sizeMultiplier-1)*gameArea.canvas.height);
                    this.ctx.lineTo(this.sizeMultiplier*(x3-this.leftx), this.sizeMultiplier*(y3-this.lefty)-(this.sizeMultiplier-1)*gameArea.canvas.height);
                    this.ctx.fillStyle = color;
                    this.ctx.fill();

                this.ctx.restore();
            }
            if(x2 > this.rightx && x1 < this.rightx + (this.canvas.width/2)/this.sizeMultiplier){
                this.ctx.save();
                    this.ctx.beginPath();
                    this.ctx.rect(this.canvas.width/2, 0, this.canvas.width/2, this.canvas.height);
                    this.ctx.clip();
                
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.canvas.width/2 + this.sizeMultiplier*(x1-this.rightx), this.sizeMultiplier*(y1-this.righty)-(this.sizeMultiplier-1)*gameArea.canvas.height);
                    this.ctx.lineTo(this.canvas.width/2 + this.sizeMultiplier*(x2-this.rightx), this.sizeMultiplier*(y2-this.righty)-(this.sizeMultiplier-1)*gameArea.canvas.height);
                    this.ctx.lineTo(this.canvas.width/2 + this.sizeMultiplier*(x3-this.rightx), this.sizeMultiplier*(y3-this.righty)-(this.sizeMultiplier-1)*gameArea.canvas.height);
                    this.ctx.fillStyle = color;
                    this.ctx.fill();
                this.ctx.restore();
            }
        }
        else{
            this.ctx.beginPath();
            this.ctx.beginPath();
            this.ctx.moveTo(this.sizeMultiplier*(x1-this.x), this.sizeMultiplier*(y1-this.y)-(this.sizeMultiplier-1)*gameArea.canvas.height);
            this.ctx.lineTo(this.sizeMultiplier*(x2-this.x), this.sizeMultiplier*(y2-this.y)-(this.sizeMultiplier-1)*gameArea.canvas.height);
            this.ctx.lineTo(this.sizeMultiplier*(x3-this.x), this.sizeMultiplier*(y3-this.y)-(this.sizeMultiplier-1)*gameArea.canvas.height);
            this.ctx.fillStyle = color;
            this.ctx.fill();
        }
    },
    drawBlock : function(x, y, width, height, color){
        if(this.splitScreen){
            if(x + width > this.leftx && x < this.leftx + (this.canvas.width/2)/this.sizeMultiplier){
                this.ctx.save();
                    this.ctx.beginPath();
                    this.ctx.rect(0, 0, this.canvas.width/2, this.canvas.height);
                    this.ctx.clip();
                
                    this.ctx.fillStyle = color;
                    this.ctx.fillRect(this.sizeMultiplier*(x - this.leftx), this.sizeMultiplier*(y - this.lefty)-(this.sizeMultiplier-1)*gameArea.canvas.height, this.sizeMultiplier*width, this.sizeMultiplier*height);
                this.ctx.restore();
            }
            if(x + width > this.rightx && x < this.rightx + (this.canvas.width/2)/this.sizeMultiplier){
                this.ctx.save();
                    this.ctx.beginPath();
                    this.ctx.rect(this.canvas.width/2, 0, this.canvas.width/2, this.canvas.height);
                    this.ctx.clip();
                
                    this.ctx.fillStyle = color;
                    this.ctx.fillRect(this.canvas.width/2 + this.sizeMultiplier*(x - this.rightx), this.sizeMultiplier*(y - this.righty)-(this.sizeMultiplier-1)*gameArea.canvas.height, this.sizeMultiplier*width, this.sizeMultiplier*height);
                this.ctx.restore();
            }
        }
        else{
            this.ctx.fillStyle = color;
            this.ctx.fillRect(this.sizeMultiplier*(x - this.x), this.sizeMultiplier*(y - this.y)-(this.sizeMultiplier-1)*gameArea.canvas.height, this.sizeMultiplier*width, this.sizeMultiplier*height);
        }
    },
    drawCirc : function(x, y, radius, color){
        if(this.splitScreen){
            if(x + radius > this.leftx && x - radius < this.leftx + (this.canvas.width/2)/this.sizeMultiplier){
                this.ctx.save();
                    this.ctx.beginPath();
                    this.ctx.rect(0, 0, this.canvas.width/2, this.canvas.height);
                    this.ctx.clip();
                    this.ctx.beginPath();
                    this.ctx.strokeStyle=color;
                    this.ctx.arc(this.sizeMultiplier*(x - this.leftx), this.sizeMultiplier*(y - this.lefty)-(this.sizeMultiplier-1)*gameArea.canvas.height, this.sizeMultiplier*radius, 0, 2*Math.PI);
                    this.ctx.stroke();
                this.ctx.restore();
            }
            if(x + radius > this.rightx && x - radius < this.rightx + (this.canvas.width/2)/this.sizeMultiplier){
                this.ctx.save();
                    this.ctx.beginPath();
                    this.ctx.rect(this.canvas.width/2, 0, this.canvas.width/2, this.canvas.height);
                    this.ctx.clip();
                    this.ctx.beginPath();
                    this.ctx.strokeStyle=color;
                    this.ctx.arc(this.canvas.width/2 + this.sizeMultiplier*(x - this.rightx), this.sizeMultiplier*(y - this.righty)-(this.sizeMultiplier-1)*gameArea.canvas.height, this.sizeMultiplier*radius, 0, 2*Math.PI);
                    this.ctx.stroke();
                this.ctx.restore();
            }
        }
        else{
            this.ctx.beginPath();
            this.ctx.strokeStyle=color;
            this.ctx.arc(this.sizeMultiplier*(x - this.x), this.sizeMultiplier*(y - this.y)-(this.sizeMultiplier-1)*gameArea.canvas.height, this.sizeMultiplier*radius, 0, 2*Math.PI);
            this.ctx.stroke();
        }
    },
    updateFrame : function(){
        this.x += this.xveloc + this.xvelocCtrl;
        this.y += this.yveloc + this.yvelocCtrl;
        this.xveloc += this.xaccel + this.xaccelCtrl;
        this.yveloc += this.yaccel + this.yaccelCtrl;

        if(toggleMap[51]){
            if(Math.abs((player2.x + player2.width/2) - (player1.x + player1.width/2)) < this.canvas.width/this.sizeMultiplier){
                this.splitScreen = false;
                this.x = ((player1.x + player1.width/(2*this.sizeMultiplier) + player2.x + player2.width/(2*this.sizeMultiplier))/2 - this.canvas.width/(2*this.sizeMultiplier));
            }
            else{
                this.splitScreen = true; //Don't forget to set it to false later
                if(player1.x < player2.x){
                    this.leftx = player1.x - this.canvas.width/(4*this.sizeMultiplier);
                    this.rightx = player2.x  - this.canvas.width/(4*this.sizeMultiplier);
                }
                else{
                    this.leftx = player2.x - this.canvas.width/(4*this.sizeMultiplier);
                    this.rightx = player1.x  - this.canvas.width/(4*this.sizeMultiplier);
                }
                this.x = ((player1.x + player1.width/2 + player2.x + player2.width/2)/2 - this.canvas.width/2);
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
            else{
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
        if(keyMap[38] && this.sizeMultiplier < 1.5){
            this.sizeMultiplier += 0.02;
            //this.x += 0.01*gameArea.canvas.width;
        }
        if(keyMap[40] && this.sizeMultiplier > 0.06){
            this.sizeMultiplier -= 0.02;
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
                gameArea.ctx.fillText(key, 280, 50 + 10*h);
                h += 1;
            }
        }
        gameArea.ctx.fillText(h, 280, 40);
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
        gameArea.ctx.fillText(variable, 150, 10);
    },
    testVar : function(variable){
        this.testVariables.push(variable);
    },
    printVar : function(){
        for(i = 0; i < this.testVariables.length; i++){
            gameArea.ctx.fillText(this.testVariables[i], 5, 35 + 10*i);
        }
        this.testVariables = [];
    },
    pvp : function(){
        if(gameArea.pvp){
            gameArea.ctx.fillText("Pvp on", 150, 30);
        }
    },
}
function player(){
    this.health = 0;
    this.maxHealth = 20;
    this.mana = 0;
    this.maxMana = 100;
    this.lastHitTime = 0;
    this.character = "door";
    this.x = 200;
    this.y = 100;
    this.xvelocSum = 0;
    this.yvelocSum = 0;
    this.xveloc = 0;
    this.yveloc = 0;
    this.xaccelSum = 0;
    this.yaccelSum = 0;
    this.xaccel = 0;
    this.yaccel = 0;
    this.gravity = 0.18;
    this.platformpullxveloc = 0;
    this.xvelocCtrl = 0;
    this.yvelocCtrl = 0;
    this.xaccelCtrl = 0;
    this.yaccelCtrl = 0;
    this.xaccelBound = 0;
    this.xvelocBound = 0;
    this.direction = 1; //-1 left, 1 right
    this.width = 0;
    this.height = 0;
    this.widthveloc = 0;
    this.heightveloc = 0;
    this.modelWidth = 0; //Number of pixels in character sheet
    this.modelHeight = 0;
    this.headAnimationFrame = 0;
    this.bodyAnimationFrame = 0;
    this.legsAnimationFrame = 0;
    this.particleAnimationFrame = 0;
    this.lastHeadAnimation = 0;
    this.lastBodyAnimation = 0;
    this.lastLegsAnimation = 0;
    this.lastParticleAnimation = 0;
    this.headImage = "shell";
    this.bodyImage = "shell";
    this.legsImage = "shell";
    this.particleImage = "shell";
    this.onGround = false;
    this.onRectObj = false;
    this.slope = 0;
    this.controls = [];
    this.playerNumber = 0;
    this.state = "none";
    this.basicCooldown = "shell";
    this.specialCooldown = "shell";
    this.utilityCooldown = "shell";
    this.downCooldown = "shell";
    this.cooldownList = []; //Used for cooldown images
    this.cooldownNumberList = []; //Actually numbers for cooldowns
    this.pvpArrayPosition = 0;
    //NINJA STUFF\\
    this.jumpCount = 0;
    this.startSpecialAngle = 0;
    this.specialAngle = 0;
    //RANGER STUFF\\
    this.bowImage = "shell";
    this.bowAnimationFrame = 0;
    this.loop = function(){
        this.controlsSetup();
        this.basicAttack();
        this.specialAttack();
        this.utilityAttack();
        this.downAttack();
        this.move();
        this.updatePos();
        this.updateAnimations();
        this.cooldowns();
    }
    this.initialSetup = function(playerNumber, character){
        var image = new Image();
        var basicCooldownImage = new Image();
        var specialCooldownImage = new Image();
        var utilityCooldownImage = new Image();
        var downCooldownImage = new Image();
        this.playerNumber = playerNumber;
        this.character = character;
        switch(character){
            case "ninja":
                this.modelWidth = 8;
                this.modelHeight = 16;
                this.width = 8;
                this.height = 16;
                switch(playerNumber){
                    case 1:
                        image.src = "images/player1/ninjaAnimationSheet.png";
                        break;
                    case 2:
                        image.src = "images/player1/ninjaAnimationSheet.png";
                        break;
                }
                downCooldownImage.src = "images/backgrounds/mountain.png";
                basicCooldownImage.src = "images/attackIcons/shuriken.png";
                specialCooldownImage.src = "images/attackIcons/ninjaSpecial.png";
                this.cooldownNumberList[4] = 200;
                this.cooldownNumberList[3] = 3000;
                this.cooldownNumberList[999] = 2000;
                this.maxMana = 100;
                break;
            case "mage":
                this.modelWidth = 10;
                this.modelHeight = 20;
                this.width = 10;
                this.height = 20;
                switch(playerNumber){
                    case 1:
                        image.src = "images/player1/mageAnimationSheet.png";
                        break;
                    case 2:
                        image.src = "images/player1/mageAnimationSheet.png";
                        break;
                }
                basicCooldownImage.src = "images/attackIcons/fireball.png";
                specialCooldownImage.src = "images/fireball.png";
                utilityCooldownImage.src = "images/backgrounds/dragoon.png";
                downCooldownImage.src = "images/backgrounds/fire.png";
                this.cooldownNumberList[3] = 2000;
                this.cooldownNumberList[4] = 300;
                this.cooldownNumberList[6] = 0;
                this.cooldownNumberList[999] = 10000;
                this.maxMana = 100;
                break;
            case "archer":
                this.modelWidth = 10;
                this.modelHeight = 20;
                this.width = 10;
                this.height = 20;
                switch(playerNumber){
                    case 1:
                        image.src = "images/player1/archer.png";
                        break;
                    case 2:
                        image.src = "images/player1/archer.png";
                        break;
                }
                basicCooldownImage.src = "images/attackIcons/fireball.png";
                specialCooldownImage.src = "images/fireball.png";
                utilityCooldownImage.src = "images/backgrounds/dragoon.png";
                downCooldownImage.src = "images/backgrounds/fire.png";
                this.cooldownNumberList[3] = 2000;
                this.cooldownNumberList[4] = 300;
                this.cooldownNumberList[6] = 0;
                this.cooldownNumberList[999] = 10000;
                this.maxMana = 100;
                break;
            case "ranger":
                var bowImage = new Image();
                this.modelWidth = 6;
                this.modelHeight = 24;
                this.width = 6;
                this.height = 24;
                switch(playerNumber){
                    case 1:
                        image.src = "images/player1/ranger.png";
                        break;
                    case 2: 
                        image.src = "images/player1/ranger.png";
                        break;
                }
                bowImage.src = "images/attackIcons/arrow/bow.png";
                basicCooldownImage.src = "images/attackIcons/arrow.png";
                this.maxMana = 10;
                break;
        }
        this.lastHitTime = new Date();
        if(playerNumber == 1){
            this.x = 20;
        }
        if(playerNumber == 2){
            this.x = 40;
        }
        this.headImage = image;
        this.bodyImage = image;
        this.legsImage = image;
        this.particleImage = image;
        this.basicCooldown = basicCooldownImage;
        this.specialCooldown = specialCooldownImage;
        this.utilityCooldown = utilityCooldownImage;
        this.downCooldown = downCooldownImage;
        
        this.lastHeadAnimation = gameArea.time;
        this.lastBodyAnimation = gameArea.time;
        this.lastLegsAnimation = gameArea.time;
        
        this.health = this.maxHealth;
        this.mana = this.maxMana;
    }
    this.controlsSetup = function(){
        if(this.playerNumber == 1){
            this.controls[0] = 87; //W
            this.controls[1] = 65; //A
            this.controls[2] = 68; //D
            this.controls[3] = 83; //S
            this.controls[4] = 82; //R
            this.controls[5] = 84; //T
            this.controls[6] = 89; //Y
            this.controls[999] = 1000;
        }
        if(this.playerNumber == 2){
            this.controls[0] = 73; //I
            this.controls[1] = 74; //J
            this.controls[2] = 76; //L
            this.controls[3] = 75; //K
            this.controls[4] = 86; //V
            this.controls[5] = 66; //B
            this.controls[6] = 78; //N
            this.controls[999] = 1001;
        }
    }
    this.updateAnimations = function(){
        switch(this.character){
            case "ninja":
                if(!this.onGround && this.yvelocSum > 0){
                    if(gameArea.time - this.lastLegsAnimation > 80 * Math.abs(1/this.yvelocSum)){
                        switch(this.legsAnimationFrame){
                            case 0: 
                                this.legsAnimationFrame = 1;
                                break;
                            case 1: 
                                this.legsAnimationFrame = 0;
                                break;
                            default: 
                                this.legsAnimationFrame = 0;
                                break;
                        }
                        this.lastLegsAnimation = gameArea.time;
                    }
                }
                if(this.onGround){
                    if(this.direction == 1 && this.xvelocCtrl != 0 && gameArea.time - this.lastLegsAnimation > 80 * Math.abs(1/this.xvelocCtrl)){
                        switch(this.legsAnimationFrame){
                            case 2: 
                                this.legsAnimationFrame = 3;
                                break;
                            case 3: 
                                this.legsAnimationFrame = 2;
                                break;
                            default: 
                                this.legsAnimationFrame = 2;
                                break;
                        }
                        this.lastLegsAnimation = gameArea.time;
                    }
                    else if(this.direction == -1 && this.xvelocCtrl != 0 && gameArea.time - this.lastLegsAnimation > 80 * Math.abs(1/this.xvelocCtrl)){
                        switch(this.legsAnimationFrame){
                            case 4: 
                                this.legsAnimationFrame = 5;
                                break;
                            case 5: 
                                this.legsAnimationFrame = 4;
                                break;
                            default: 
                                this.legsAnimationFrame = 4;
                                break;
                        }
                        this.lastLegsAnimation = gameArea.time;
                    }
                    else if(gameArea.time - this.lastLegsAnimation > 200){
                        this.legsAnimationFrame = 0;
                    }
                }
                if(this.state == "charging"){
                    this.bodyAnimationFrame = Math.round(Math.random()*6);
                    this.legsAnimationFrame = Math.round(Math.random()*5);
                    this.lastLegsAnimation = gameArea.time;
                }
                break;
            case "mage":
                if(!this.onGround && this.yvelocSum > 0){
                    if(gameArea.time - this.lastLegsAnimation > 80 * Math.abs(1/this.yvelocSum)){
                        switch(this.legsAnimationFrame){
                            case 0: 
                                this.legsAnimationFrame = 1;
                                break;
                            case 1: 
                                this.legsAnimationFrame = 0;
                                break;
                            default: 
                                this.legsAnimationFrame = 0;
                                break;
                        }
                        this.lastLegsAnimation = gameArea.time;
                    }
                }
                else if(this.onGround){
                    if(this.direction == 1 && this.xvelocCtrl != 0 && gameArea.time - this.lastLegsAnimation > 80 * Math.abs(1/this.xvelocCtrl)){
                        switch(this.legsAnimationFrame){
                            case 2: 
                                this.legsAnimationFrame = 3;
                                break;
                            case 3: 
                                this.legsAnimationFrame = 2;
                                break;
                            default: 
                                this.legsAnimationFrame = 2;
                                break;
                        }
                        this.lastLegsAnimation = gameArea.time;
                    }
                    else if(this.direction == -1 && this.xvelocCtrl != 0 && gameArea.time - this.lastLegsAnimation > 80 * Math.abs(1/this.xvelocCtrl)){
                        switch(this.legsAnimationFrame){
                            case 4: 
                                this.legsAnimationFrame = 5;
                                break;
                            case 5: 
                                this.legsAnimationFrame = 4;
                                break;
                            default: 
                                this.legsAnimationFrame = 4;
                                break;
                        }
                        this.lastLegsAnimation = gameArea.time;
                    }
                    else if(gameArea.time - this.lastLegsAnimation > 200){
                        this.legsAnimationFrame = 0;
                    }
                }
                break;
            case "archer":
                if(this.direction == -1){
                    this.headAnimationFrame = 0;
                }
                else{
                    this.headAnimationFrame = 1;
                }
                break;
        }
    }
    this.draw = function(){
        gameArea.drawImage(this.headImage, this.headAnimationFrame * this.modelWidth, 0 * this.modelHeight, this.modelWidth, this.modelHeight, this.x, this.y, this.width, this.height); //Head, 8px * 5px
        gameArea.drawImage(this.bodyImage, this.bodyAnimationFrame * this.modelWidth, 1 * this.modelHeight, this.modelWidth, this.modelHeight, this.x, this.y, this.width, this.height); //Body + Arms, 8px * 6px
        gameArea.drawImage(this.legsImage, this.legsAnimationFrame * this.modelWidth, 2 * this.modelHeight, this.modelWidth, this.modelHeight, this.x, this.y, this.width, this.height); //Legs, 8px * 5px
        gameArea.drawImage(this.particleImage, this.particleAnimationFrame * this.modelWidth, 3 * this.modelHeight, this.modelWidth, this.modelHeight, this.x, this.y, this.width, this.height); //Particles
        if(this.character == "ranger"){

        }
    }
    this.updatePos = function(){
        if(this.x < mapBounds.leftx){
            this.xaccelBound = 0.01;
            if(this.xvelocBound == 0){
                this.xvelocBound = .5;
            }
            ui.drawVar("Player " + this.playerNumber + " is out of the game area!")
        }
        else if(this.x + this.width > mapBounds.rightx){
            this.xaccelBound = -0.01;
            if(this.xvelocBound == 0){
                this.xvelocBound = -.5;
            }
            ui.drawVar("Player " + this.playerNumber + " is out of the game area!")
        }
        else if(this.x > mapBounds.leftx + 10 && this.x + this.width < mapBounds.rightx - 10){
            this.xaccelBound = 0;
            this.xvelocBound = 0;
        }
        else{
            ui.drawVar("Player " + this.playerNumber + " is leaving the game area!")
        }
        if(this.x < mapBounds.lefthardx){
            this.x = mapBounds.lefthardx;
        }
        else if(this.x+this.width > mapBounds.righthardx){
            this.x = mapBounds.righthardx - this.width;
        }
        this.objectCollisionCheck();
        this.xaccelSum = this.xaccel + this.xaccelCtrl;
        this.yaccelSum = this.yaccel + this.yaccelCtrl + this.gravity;
        this.xvelocBound += this.xaccelBound;
        this.xveloc += this.xaccelSum;
        this.yveloc += this.yaccelSum;
        this.xvelocSum = this.xveloc + this.xvelocCtrl + this.platformpullxveloc;
        this.yvelocSum = this.yveloc + this.yvelocCtrl;
        this.x += this.xvelocSum + this.xvelocBound;
        this.y += this.yvelocSum;
        if(this.width > this.widthveloc){
            this.width += this.widthveloc;
            this.x -= this.widthveloc/2;
        }
        if(this.height > this.heightveloc){
            this.height += this.heightveloc;
            this.y += this.heightveloc/2;
        }
        if(this.xvelocCtrl != 0){
            this.direction = Math.sign(this.xvelocCtrl);
        }
//        this.objectStandingCheck();
//        this.objectWallCheck();
        switch(this.character){
            case "ninja":
                if(this.state != "charging" && this.state != "shrunk" && this.mana + 0.2 <= this.maxMana){
                    this.mana += 0.2;
                }
                break;
            case "mage":
                if(!keyMap[this.controls[5]] && !keyMap[this.controls[6]] && this.mana + 0.5 <= this.maxMana){
                    this.mana += 0.4;
                }
                break;
            case "archer":
                if(!keyMap[this.controls[5]] && !keyMap[this.controls[6]] && this.mana + 0.1 <= this.maxMana){
                    this.mana += 0.1;
                }
                break;
        }
        if(gameArea.pvp){
            //this.updatePvp();
        }
    }
    this.objectCollisionCheck = function(){
        var notOnGroundCount = 0;
        var posyVeloc = 0;
        if(this.yvelocSum > 0){
            posyVeloc = this.yvelocSum;
        }
        for(i = 0; i < collisionObjects.rectX.length; i++){
            //Wall Collision
            if(this.x + this.width > collisionObjects.rectX[i] && this.x < collisionObjects.rectX[i] + collisionObjects.rectWidth[i] && this.y + this.height > collisionObjects.rectY[i] + posyVeloc && this.y < collisionObjects.rectY[i] + collisionObjects.rectHeight[i] && !collisionObjects.rectTransparency[i]){ 
                if(this.x < collisionObjects.rectX[i] + (collisionObjects.rectWidth[i]/2)){
                    this.x = collisionObjects.rectX[i] - this.width;
                    if(this.xveloc > 0.2){
                        this.xveloc -= 1;
                    }
                    else if(this.xveloc > 1){
                        this.xveloc = 0;
                    }
                }
                else{
                    this.x = collisionObjects.rectX[i] + collisionObjects.rectWidth[i];
                    if(this.xveloc < -0.2){
                        this.xveloc += 1;
                    }
                    else if(this.xveloc < -1){
                        this.xveloc = 0;
                    }
                }
                notOnGroundCount++;
            }
            //If not on said wall, check if standing on object
            else if(this.x + this.width > collisionObjects.rectX[i] && this.x < collisionObjects.rectX[i] + collisionObjects.rectWidth[i] && this.y + this.height > collisionObjects.rectY[i] && this.y + this.height <= collisionObjects.rectY[i] + posyVeloc){
                this.y = collisionObjects.rectY[i] - this.height;
                this.onGround = true;
                this.jumpCount = 0;
                this.yveloc = 0;
                this.platformpullxveloc = collisionObjects.rectXVeloc[i];
            }
            else{
                notOnGroundCount++;
            }
        }
        for(i = 0; i < collisionObjects.triX1.length; i++){
            if(this.x + this.width/2 > collisionObjects.triX1[i] && this.x + this.width/2 < collisionObjects.triX3[i] && this.y + this.height > ((collisionObjects.triY3[i]-collisionObjects.triY1[i])/(collisionObjects.triX3[i]-collisionObjects.triX1[i]))*(this.x+this.width/2-collisionObjects.triX3[i]) + collisionObjects.triY3[i] && this.y + this.height <= collisionObjects.triY1[i] + posyVeloc){
                if(this.x + this.width/2 <= collisionObjects.triX3[i]){
                    this.y = ((collisionObjects.triY3[i]-collisionObjects.triY1[i])/(collisionObjects.triX3[i]-collisionObjects.triX1[i]))*(this.x+this.width/2-collisionObjects.triX3[i]) + collisionObjects.triY3[i] - this.height;
                }
                var deltaX = Math.abs(collisionObjects.triX3[i]-collisionObjects.triX1[i]);
                var deltaY = Math.abs(collisionObjects.triY3[i]-collisionObjects.triY1[i]);
                var hypot = Math.sqrt(Math.pow(deltaX, 2)+Math.pow(deltaY, 2));
                this.slope = deltaY/deltaX;
                this.onGround = true; 
                this.jumpCount = 0; 
                this.yveloc = 0; 
                this.platformpullxveloc = collisionObjects.triXVeloc[i]; 
                if(this.direction == 1){
                    this.x -= (this.xvelocCtrl+this.xvelocBound)*(1-deltaX/hypot);
                }
            }
            else if(this.x + this.width/2 > collisionObjects.triX3[i] && this.x + this.width/2 < collisionObjects.triX2[i] && this.y + this.height > ((collisionObjects.triY3[i]-collisionObjects.triY2[i])/(collisionObjects.triX3[i]-collisionObjects.triX2[i]))*(this.x+this.width/2-collisionObjects.triX2[i]) + collisionObjects.triY2[i] && this.y + this.height <= collisionObjects.triY1[i] + posyVeloc){
                if(this.x + this.width/2 > collisionObjects.triX3[i]){
                    this.y = ((collisionObjects.triY3[i]-collisionObjects.triY2[i])/(collisionObjects.triX3[i]-collisionObjects.triX2[i]))*(this.x+this.width/2-collisionObjects.triX2[i]) + collisionObjects.triY2[i] - this.height;
                }
                var deltaX = Math.abs(collisionObjects.triX3[i]-collisionObjects.triX2[i]);
                var deltaY = Math.abs(collisionObjects.triY3[i]-collisionObjects.triY2[i]);
                var hypot = Math.sqrt(Math.pow(deltaX, 2)+Math.pow(deltaY, 2));
                this.slope = deltaY/deltaX;
                this.onGround = true;
                this.jumpCount = 0;
                this.yveloc = 0;
                this.platformpullxveloc = collisionObjects.triXVeloc[i];
                if(this.direction == -1){
                    this.x -= (this.xvelocCtrl+this.xvelocBound)*(1-deltaX/hypot);
                }
            }
            else{
                notOnGroundCount++;
                this.slope = 0;
            }
        }
        if(notOnGroundCount == collisionObjects.rectX.length + collisionObjects.triX1.length){
            this.onGround = false;
        }
    }
    this.move = function(){
        if(keyMap[this.controls[1]]){
            switch(this.character){
                case "ninja":
                    this.xvelocCtrl = -1.5;
                    break;
                default:
                    this.xvelocCtrl = -1.2;
                    break;
            }
        }
        else if(keyMap[this.controls[2]]){
            switch(this.character){
                case "ninja":
                    this.xvelocCtrl = 1.5;
                    break;
                default:
                    this.xvelocCtrl = 1.2;
                    break;
            }
        }
        else if(!keyMap[this.controls[1]] && !keyMap[this.controls[2]] && this.onGround){
            if(Math.abs(this.xvelocCtrl) >= 0.001){
                this.xvelocCtrl -= this.xvelocCtrl/2;
            }
            else{
                this.xvelocCtrl = 0;
            }
        }
        switch(this.character){
            case "ninja":
                if(keyMap[this.controls[0]] && (this.onGround || (this.jumpCount <= 1 && gameArea.time - lastUseMap[this.controls[0]] >= 200))){
                    this.jump();
                    lastUseMap[this.controls[0]] = gameArea.time;
                }
                break;
            case "mage":
                if(keyMap[this.controls[0]]){
                    if(gameArea.time - lastUpMap[this.controls[0]] < 200 && this.mana >= 20/((gameArea.time - lastUseMap[this.controls[0]])/200)){
                        this.y -= 50;
                        this.mana -= 20/((gameArea.time - lastUseMap[this.controls[0]])/200);
                        lastUpMap[this.controls[0]] = gameArea.time + 200;
                        lastUseMap[this.controls[0]] = gameArea.time;
                        this.yveloc = -1.5;
                    }
                    else if(this.onGround){
                        this.jump();
                    }
                }
                if(keyMap[this.controls[1]] && gameArea.time - lastUpMap[this.controls[1]] < 200 && this.mana >= 10){
                    var q = true;
                    for(i = 0; i < collisionObjects.rectX.length && q == true; i++){
                        if(this.x - 50 + this.width > collisionObjects.rectX[i] && this.x - 50 < collisionObjects.rectX[i] + collisionObjects.rectWidth[i] + 1 && this.y + this.height > collisionObjects.rectY[i] && this.y < collisionObjects.rectY[i] + collisionObjects.rectHeight[i] && !collisionObjects.rectTransparency[i]){
                            q = false;
                            //this.x = collisionObjects.rectX[i] + collisionObjects.rectWidth[i]; //Doesn't work because each collision object of a large mass is independent. Maybe do another for loop inside of here?
                        }
                    }
                    if(q){
                        this.x -= 50;
                        this.mana -= 10;
                    }
                    lastUpMap[this.controls[1]] = gameArea.time + 200;
                }
                if(keyMap[this.controls[2]] && gameArea.time - lastUpMap[this.controls[2]] < 200 && this.mana >= 10){
                    var q = true;
                    for(i = 0; i < collisionObjects.rectX.length && q == true; i++){
                        if(this.x + 50 + this.width > collisionObjects.rectX[i] && this.x + 50 < collisionObjects.rectX[i] + collisionObjects.rectWidth[i] + 1 && this.y + this.height > collisionObjects.rectY[i] && this.y < collisionObjects.rectY[i] + collisionObjects.rectHeight[i] && !collisionObjects.rectTransparency[i]){
                            q = false;
                            //this.x = collisionObjects.rectX[i] - this.width; //Doesn't work because each collision object of a large mass is independent. Maybe do another for loop inside of here?
                        }
                    }
                    if(q){
                        this.x += 50;
                        this.mana -= 10;
                    }
                    lastUpMap[this.controls[2]] = gameArea.time + 200;
                }
                break;
            case "archer":
                if(keyMap[this.controls[0]]){
                    if(gameArea.time - lastUseMap[this.controls[0]] >= 100 && gameArea.time - lastUpMap[this.controls[0]] <= 400 && gameArea.time - lastUseMap[this.controls[0]] <= 400){
                        this.y -= 50;
                        lastUseMap[this.controls[0]] = gameArea.time;
                    }
                    else if(this.onGround){
                        this.jump();
                        lastUseMap[this.controls[0]] = gameArea.time;
                    }
                }
                if(keyMap[this.controls[1]] && gameArea.time - lastUseMap[this.controls[1]] >= 100 && gameArea.time - lastUpMap[this.controls[1]] <= 400 && gameArea.time - lastUseMap[this.controls[1]] <= 400){
                    this.x -= 50;
                    lastUseMap[this.controls[1]] = gameArea.time;
                }
                if(keyMap[this.controls[2]] && gameArea.time - lastUseMap[this.controls[2]] >= 100 && gameArea.time - lastUpMap[this.controls[2]] <= 400 && gameArea.time - lastUseMap[this.controls[2]] <= 400){
                    this.x += 50;
                    lastUseMap[this.controls[2]] = gameArea.time;
                }
                break;
            case "ranger":
                if(keyMap[this.controls[0]]){
                    if(this.onGround){
                        this.jump();
                    }
                }
                break;
        }
    }
    this.jump = function(){
        if(this.slope < 1){
            this.yveloc = 0; 
            this.yaccelCtrl = -.75;
            if(this.character == "ninja"){
                this.jumpCount += 1;
            }
            if(this.playerNumber == 1){
                setTimeout(function(){
                    player1.yaccelCtrl = 0;
                    player1.yvelocCtrl = 0;
                }, 100);
            }
            if(this.playerNumber == 2){
                setTimeout(function(){
                    player2.yaccelCtrl = 0;
                    player2.yvelocCtrl = 0;
                }, 100);
            }
        }
    }
    this.basicAttack = function(){
        switch(this.character){
            case "ninja":
                if(keyMap[this.controls[4]] && gameArea.time - lastUseMap[this.controls[4]] >= this.cooldownNumberList[4] && this.state != "charging"){
                    lastUseMap[this.controls[4]] = gameArea.time;
                    var width = 8;
                    var power = .25;
                    if(this.state == "shrunk"){
                        width = 2;
                        power = 0.2;
                    }
                    shurikens.new(this.x + this.width/2, this.y + this.height/2, this.direction * 10, 1.6, width, power, this.playerNumber, null, null);
                    shurikens.new(this.x + this.width/2, this.y + this.height/2, this.direction * 10, 0, width, power, this.playerNumber, null, null);
                    shurikens.new(this.x + this.width/2, this.y + this.height/2, this.direction * 10, -1.6, width, power, this.playerNumber, null, null);
                }
                break;
            case "mage":
                if(keyMap[this.controls[4]] && gameArea.time - lastUseMap[this.controls[4]] >= this.cooldownNumberList[4] && this.state != "charging" && !keyMap[this.controls[5]] && !keyMap[this.controls[6]]){
                    lastUseMap[this.controls[4]] = gameArea.time;
                    fireball.new(this.x+this.width/2, this.y + this.height/2, 6, 0, this.playerNumber, 3, 0.5, 10);
                    fireball.release(this.playerNumber, this.direction);
                }
                break;
            case "archer":
                if(keyMap[this.controls[4]] && gameArea.time - lastUseMap[this.controls[4]] >= this.cooldownNumberList[4] && this.state != "charging"){
                    lastUseMap[this.controls[4]] = gameArea.time;
                    fireball.new(this.x+this.width/2, this.y + this.height/2, 6, 0, this.playerNumber, 3, 1, 3);
                    fireball.release(this.playerNumber, this.direction);
                }
                break;
            case "ranger":
                if(keyMap[this.controls[4]]){
                    var angle = 0;
                    if(this.direction == -1){
                        angle = Math.PI;
                    }
                    angle = Math.PI*Math.random();
                    arrow.new(this.x+this.width/2, this.y+this.height/2, 10, angle, 0, "none", this.playerNumber, 1);
                }
                break;
        }
    }
    this.specialAttack = function(){
        switch(this.character){
            case "ninja":
                if(keyMap[this.controls[5]] && gameArea.time - lastUseMap[this.controls[999]] >= this.cooldownNumberList[999] && this.state != "charging" && this.state != "shrunk"){
                    this.state = "charging";
                    lastUseMap[this.controls[5]] = gameArea.time;
                    this.widthveloc = -0.15;
                    this.heightveloc = -0.3;
                }
                if(this.state == "charging"){
                    if(this.mana >= 2.5){
                        this.mana -= 2.5;
                    }
                }
                if(keyMap[this.controls[5]] && gameArea.time - lastUseMap[this.controls[5]] >= 800 && gameArea.time - lastUseMap[this.controls[5]] <= 1000 && this.state == "charging"){
                    this.widthveloc = 0;
                    this.heightveloc = 0;
                    this.width = 8;
                    this.height = 16;
                    this.x -= this.width/2;
                    this.y -= 4*this.height/5;
                    this.state = "spiral";
                    this.bodyAnimationFrame = 0;
                    this.legsAnimationFrame = 0;
                    switch(this.direction){
                        case 1:
                            this.startSpecialAngle = 0;
                            break;
                        case -1:
                            this.startSpecialAngle = Math.PI;
                            break;
                    }
                    this.specialAngle = this.startSpecialAngle;
                }
                if(this.state == "spiral" && gameArea.time - lastUseMap[this.controls[999]] > 10){
                    var multiplier = 0;

                    switch(this.startSpecialAngle){
                        case 0:
                            multiplier = -1;
                            break;
                        case Math.PI: 
                            multiplier = 1;
                            break;
                    }
                    lastUseMap[this.controls[999]] = gameArea.time;
                    for(i = 0; i < 2; i++){
                        shurikens.new(this.x + this.width/2, this.y + this.height/2, 10 * Math.cos(this.specialAngle), 10 * Math.sin(this.specialAngle), 8, .1, this.playerNumber, null, null);
                        this.specialAngle += multiplier * (Math.PI/24);
                        if(this.mana <= this.maxMana - 0.139){
                            this.mana += 1.93;
                        }
                    }
                    if(this.specialAngle <= this.startSpecialAngle - (2 * Math.PI) || this.specialAngle >= this.startSpecialAngle + (2 * Math.PI)){
                        this.state = "none";
                        this.specialAngle = 0;
                        //this.mana = this.maxMana;
                    }
                }
                if(!keyMap[this.controls[5]] && (this.widthveloc != 0 || this.heightveloc != 0) && this.state == "charging"){
                    this.x += this.width/2 - 4;
                    this.y -= 8;
                    this.widthveloc = 0;
                    this.heightveloc = 0;
                    this.width = 8;
                    this.height = 16;
                    this.bodyAnimationFrame = 0;
                    this.legsAnimationFrame = 0;
                    this.state = "none";
                }
                break;
            case "mage":
                if(keyMap[this.controls[5]] && gameArea.time - lastUseMap[this.controls[999]] >= this.cooldownNumberList[999] && this.state != "charging"){
                    this.bodyAnimationFrame = 1;
                    lastUseMap[this.controls[5]] = gameArea.time;
                    this.state = "charging";
                }
                if(keyMap[this.controls[5]] && gameArea.time - lastUseMap[this.controls[5]] >= 200 && this.state == "charging"){
                    this.bodyAnimationFrame = 2;
                }
                if(keyMap[this.controls[5]] && gameArea.time - lastUseMap[this.controls[5]] >= 400 && this.state == "charging"){ //Actual summon
                    this.bodyAnimationFrame = 3;
                }
                if(keyMap[this.controls[5]] && gameArea.time - lastUseMap[this.controls[5]] >= 450 && this.state == "charging" && this.mana >= 10){ //Actual summon
                    lastUseMap[this.controls[5]] = gameArea.time;
                    this.mana -= 10;
                    for(var i = 0; i < 50; i++){
                        fireball.new(this.x+this.width/2, this.y - this.height/6, 3+5*Math.random(), 5*(Math.random()-0.5), this.playerNumber, 0, .01, 0);
                    }
                }
                if(gameArea.time - lastUseMap[this.controls[999]] >= 50 && this.state == "falling"){
                    this.bodyAnimationFrame = 1;
                }
                if(gameArea.time - lastUseMap[this.controls[999]] >= 100 && this.state == "falling"){
                    this.bodyAnimationFrame = 0;
                    this.state = "none";
                }
                if(!keyMap[this.controls[5]] && this.state == "charging"){
                    fireball.release(this.playerNumber, this.direction);
                    lastUseMap[this.controls[999]] = gameArea.time;
                    this.bodyAnimationFrame = 2;
                    this.state = "falling";
                }
                break;
            case "archer":
                if(keyMap[this.controls[5]] && gameArea.time - lastUseMap[this.controls[999]] >= this.cooldownNumberList[999] && this.state != "charging"){
                    this.bodyAnimationFrame = 1;
                    lastUseMap[this.controls[5]] = gameArea.time;
                    this.state = "charging";
                }
                if(keyMap[this.controls[5]] && gameArea.time - lastUseMap[this.controls[5]] >= 200 && this.state == "charging"){
                    this.bodyAnimationFrame = 2;
                }
                if(keyMap[this.controls[5]] && gameArea.time - lastUseMap[this.controls[5]] >= 400 && this.state == "charging"){ //Actual summon
                    this.bodyAnimationFrame = 3;
                }
                if(keyMap[this.controls[5]] && gameArea.time - lastUseMap[this.controls[5]] >= 450 && this.state == "charging" && this.mana >= 10){ //Actual summon
                    lastUseMap[this.controls[5]] = gameArea.time;
                    this.mana -= 10;
                    for(var i = 0; i < 50; i++){
                        fireball.new(this.x+this.width/2, this.y + 5, 3+5*Math.random(), 5*(Math.random()-0.5), this.playerNumber, 0, .01, 0);
                    }
                }
                if(gameArea.time - lastUseMap[this.controls[999]] >= 50 && this.state == "falling"){
                    this.bodyAnimationFrame = 1;
                }
                if(gameArea.time - lastUseMap[this.controls[999]] >= 100 && this.state == "falling"){
                    this.bodyAnimationFrame = 0;
                    this.state = "none";
                }
                if(!keyMap[this.controls[5]] && this.state == "charging"){
                    fireball.release(this.playerNumber, this.direction);
                    lastUseMap[this.controls[999]] = gameArea.time;
                    this.bodyAnimationFrame = 2;
                    this.state = "falling";
                }
                break;
            }
    }
    this.utilityAttack = function(){
        switch(this.character){
            case "ninja":
                if(keyMap[this.controls[6]] && this.state != "charging" && this.mana >= 20){
                    this.state = "shrunk";
                }
                if(keyMap[this.controls[6]] && this.state == "shrunk" && this.mana >= 0){
                    if(this.width >= 2){
                        this.width -= .4;
                        this.x += .2;
                    }
                    if(this.height >= 4){
                        this.height -= .8;
                    }
                    if(keyMap[this.controls[1]] || keyMap[this.controls[2]]){
                        this.x += this.direction*this.width/2;
                        this.mana -= .15;
                    }
                    this.mana -= .05;
                }
                else if((!keyMap[this.controls[6]] || this.mana <= 0) && this.state == "shrunk"){
                    this.state = "none";
                    this.x += this.width/2 - 4;
                    this.width = 8;
                    this.height = 16;
                    this.y -= 16;
                }
                break;
            case "mage":
                if(keyMap[this.controls[6]] && this.state != "charging" && this.mana >= 1){
                    this.mana -= 1;
                    for(var i = 0; i < 5; i++){
                        fireball.new(this.x+this.width/2, this.y + this.height/4, 3+5*Math.random(), 5*(Math.random()-0.5), this.playerNumber, 4, 0.002, 0);
                        fireball.release(this.playerNumber, this.direction);
                    }
                    if(this.xvelocSum < 5 && this.direction == -1){
                        this.xaccelCtrl = -this.direction*0.2;
                    }
                    else if(this.xvelocSum > -5 && this.direction == 1){
                        this.xaccelCtrl = -this.direction*0.2;
                    }
                    else{
                        this.xaccelCtrl = -this.direction*0.01;
                    }
                }
                else{
                    if(this.xveloc > .5){
                        this.xaccelCtrl = -.1;
                    }
                    else if(this.xveloc < -.5){
                        this.xaccelCtrl = .1;
                    }
                    else{
                        this.xveloc = 0;
                        this.xaccelCtrl = 0;
                    }
                }
                break;
            case "archer":
                if(keyMap[this.controls[6]] && this.state != "charging" && this.mana >= 1){
                    this.mana -= 1;
                    for(var i = 0; i < 5; i++){
                        fireball.new(this.x+this.width/2, this.y + this.height/4, 3+5*Math.random(), 5*(Math.random()-0.5), this.playerNumber, 5, 0.002, 0);
                        fireball.release(this.playerNumber, this.direction);
                        if(this.xveloc < -1 && this.direction == -1){
                            this.xaccelCtrl = -this.direction*0.5;
                        }
                        else if(this.xveloc > 1 && this.direction == 1){
                            this.xaccelCtrl = -this.direction*0.5;
                        }
                        else{
                            this.xaccelCtrl = -this.direction*0.05;
                        }
                    }
                }
                else{
                    if(this.xveloc > .5){
                        this.xaccelCtrl = -.1;
                    }
                    else if(this.xveloc < -.5){
                        this.xaccelCtrl = .1;
                    }
                    else{
                        this.xveloc = 0;
                        this.xaccelCtrl = 0;
                    }
                }
                break;
        }
    }
    this.downAttack = function(){
        switch(this.character){
            case "ninja":
                if(keyMap[this.controls[3]] && gameArea.time - lastUseMap[this.controls[3]] >= this.cooldownNumberList[3] && this.state != "charging" && this.state != "shrunk"){
                    lastUseMap[this.controls[3]] = gameArea.time;
                    for(i = 0; i < this.mana / 3; i++){
                        shurikens.new(this.x + this.width/2, this.y + this.height/2, 2+45*Math.random(), 2+48*Math.random(), 10, .1, this.playerNumber, 2*Math.random()*Math.PI, Math.PI/(20+20*Math.random()));
                        shurikens.new(this.x + this.width/2, this.y + this.height/2, 50, 50, 10, .01, this.playerNumber, 2*Math.random()*Math.PI, Math.PI/(200+20*Math.random()));
                        shurikens.new(this.x + this.width/2, this.y + this.height/2, 50, 50, 10, .01, this.playerNumber, 2*Math.random()*Math.PI, Math.PI/(200+20*Math.random()));
                    }
                }
                if(gameArea.time - lastUseMap[this.controls[3]] < 2000){
                    if(gameArea.time - lastUseMap[this.controls[3]] < 1500){
                        for(i = 0; i < shurikens.x.length; i++){
                            if(shurikens.theta[i] != null && shurikens.owner[i] == this.playerNumber && shurikens.thetaVeloc[i] != 0){
                                shurikens.thetaVeloc[i] += Math.PI/800;
                            }
                        }
                    }
                    var activeRotateCount = 0;
                    for(i = 0; i < shurikens.x.length; i++){
                        if(shurikens.theta[i] != null && shurikens.owner[i] == this.playerNumber && shurikens.thetaVeloc[i] != 0){
                            activeRotateCount += 1;
                        }
                    }
                    this.mana -= activeRotateCount / 90;
                    if(this.mana < 0){
                        this.mana = 0;
                    }
                }
                if((gameArea.time - lastUseMap[this.controls[3]] > 2000 && gameArea.time - lastUseMap[this.controls[3]] < this.cooldownNumberList[3]) || (gameArea.time - lastUseMap[this.controls[3]] > 0 && gameArea.time - lastUseMap[this.controls[3]] < this.cooldownNumberList[3] && (!keyMap[this.controls[3]] || this.mana == 0))){
                    for(i = 0; i < shurikens.x.length; i++){
                        if(shurikens.theta[i] != null && shurikens.owner[i] == this.playerNumber && !(shurikens.xveloc[i] == 0 && shurikens.yveloc[i] == 0)){
                            shurikens.xveloc[i] += 25;
                            shurikens.yveloc[i] += 25;
                            shurikens.thetaVeloc[i] = 0;
                        }
                    }
                }
                if(gameArea.time - lastUseMap[this.controls[3]] > this.cooldownNumberList[3] - 200 && gameArea.time - lastUseMap[this.controls[3]] < this.cooldownNumberList[3]){
                    for(i = 0; i < shurikens.x.length; i++){
                        if(shurikens.theta[i] != null && shurikens.owner[i] == this.playerNumber){
                            shurikens.xveloc[i] = 0;
                            shurikens.yveloc[i] = 0;
                        }
                    }
                }
                break;
            case "mage": // && this.state != "charging"
                if(keyMap[this.controls[3]] && gameArea.time - lastUseMap[this.controls[3]] > this.cooldownNumberList[3]){
                    lastUseMap[this.controls[3]] = gameArea.time;
                    for(i = 0; i < fireball.x.length; i++){
                        if(fireball.owner[i] == this.playerNumber){
                            fireball.explode(i);
                        }
                    }
                }
                break;
            case "archer":
                if(keyMap[this.controls[3]] && this.state != "charging" && gameArea.time - lastUseMap[this.controls[3]] > this.cooldownNumberList[3]){
                    lastUseMap[this.controls[3]] = gameArea.time;
                    for(i = 0; i < fireball.x.length; i++){
                        fireball.explode(i);
                    }
                }
                break;
        }
    }
    this.cooldowns = function(){
        this.cooldownList = [];
        this.cooldownCountList = []; //I'M SORRY FOR STUPID VARIABLE NAME. IT SAYS THE CONTROLS FOR THE COOLDOWN
        switch(this.character){
            case "ninja":
                if(gameArea.time - lastUseMap[this.controls[4]] < this.cooldownNumberList[4]){
                    this.cooldownList.push(this.basicCooldown);
                    this.cooldownCountList.push(4);
                }
                if(gameArea.time - lastUseMap[this.controls[3]] < this.cooldownNumberList[3]){
                    this.cooldownList.push(this.downCooldown);
                    this.cooldownCountList.push(3);
                }
                if(gameArea.time - lastUseMap[this.controls[999]] > 10 && gameArea.time - lastUseMap[this.controls[999]] < this.cooldownNumberList[999]){
                    this.cooldownList.push(this.specialCooldown);
                    this.cooldownCountList.push(999);
                }
                break;
            case "mage":
                if(gameArea.time - lastUseMap[this.controls[4]] < this.cooldownNumberList[4]){
                    this.cooldownList.push(this.basicCooldown);
                    this.cooldownCountList.push(4);
                }
                if(gameArea.time - lastUseMap[this.controls[999]] < this.cooldownNumberList[999]){
                    this.cooldownList.push(this.specialCooldown);
                    this.cooldownCountList.push(999);
                }
                if(keyMap[this.controls[6]]){
                    this.cooldownList.push(this.utilityCooldown);
                    this.cooldownCountList.push(6);
                }
                if(gameArea.time - lastUseMap[this.controls[3]] < this.cooldownNumberList[3]){
                    this.cooldownList.push(this.downCooldown);
                    this.cooldownCountList.push(3);
                }
                break;
            case "archer":
                if(gameArea.time - lastUseMap[this.controls[4]] < this.cooldownNumberList[4]){
                    this.cooldownList.push(this.basicCooldown);
                    this.cooldownCountList.push(4);
                }
                if(gameArea.time - lastUseMap[this.controls[999]] < this.cooldownNumberList[999]){
                    this.cooldownList.push(this.specialCooldown);
                    this.cooldownCountList.push(999);
                }
                if(keyMap[this.controls[6]]){
                    this.cooldownList.push(this.utilityCooldown);
                    this.cooldownCountList.push(6);
                }
                if(gameArea.time - lastUseMap[this.controls[3]] < this.cooldownNumberList[3]){
                    this.cooldownList.push(this.downCooldown);
                    this.cooldownCountList.push(3);
                }
                break;
        }
        for(i = 0; i < this.cooldownList.length; i++){
            var image = this.cooldownList[i];
            //Should be 1, but 1.2 makes it so it lingers a bit longer and stays full for a bit longer too.
            gameArea.ctx.globalAlpha = 1.2-((gameArea.time - lastUseMap[this.controls[this.cooldownCountList[i]]])/this.cooldownNumberList[this.cooldownCountList[i]]);
            var y_displacement = 6;
            switch(this.character){
                case "ninja":
                    y_displacement = 10;
                    break;
                case "mage":
                    y_displacement = 10;
                    break;
                case "archer":
                    y_displacement = 10;
            }
            switch(this.playerNumber){
                case 1: 
                    gameArea.ctx.drawImage(image, 16*i + 2, y_displacement, 16, 16);
                    break;
                case 2:
                    gameArea.ctx.drawImage(image, gameArea.canvas.width - (16*i) - 16 - 2, y_displacement, 16, 16);
                    break;
            }
            gameArea.ctx.globalAlpha = 1;
            this.cooldownList[i] = null;
            this.cooldownCountList[i] = null;
        }
    }
    this.healthBar = function(){
        var x = 0;
        var ded = false;
        switch(this.playerNumber){
            case 1:
                x = 2;
                if(player1.health <= 0){
                    this.ded = true;
                }
                break;
            case 2:
                if(player2.health <= 0){
                    this.ded = true;
                }
                x = gameArea.canvas.width - 2 - 60;
                break;
        }
        gameArea.ctx.beginPath();
        gameArea.ctx.strokeStyle="maroon";
        gameArea.ctx.rect(x, 2, 60, 2);
        gameArea.ctx.stroke();
        if(!this.ded){
            gameArea.ctx.beginPath();
            gameArea.ctx.fillStyle="red";
            gameArea.ctx.fillRect(x, 2, (60/this.maxHealth)*this.health, 2);
            gameArea.ctx.stroke();
        }
        gameArea.ctx.fillStyle="black";
    }
    this.manaBar = function(){
        var x = 0;
        switch(this.playerNumber){
            case 1:
                x = 2;
                break;
            case 2:
                x = gameArea.canvas.width - 2 - 60;
                break;
        }
        switch(this.character){
            case "mage":
                gameArea.ctx.beginPath();
                gameArea.ctx.strokeStyle="deepskyblue";
                gameArea.ctx.rect(x, 6, 60, 2);
                gameArea.ctx.stroke();
                gameArea.ctx.beginPath();
                gameArea.ctx.fillStyle="aqua";
                gameArea.ctx.fillRect(x, 6, (60/this.maxMana)*this.mana, 2);
                gameArea.ctx.stroke();
                gameArea.ctx.fillStyle="black";
                break;
            case "ninja":
                gameArea.ctx.beginPath();
                gameArea.ctx.strokeStyle="orange";
                gameArea.ctx.rect(x, 6, 60, 2);
                gameArea.ctx.stroke();
                gameArea.ctx.beginPath();
                gameArea.ctx.fillStyle="yellow";
                gameArea.ctx.fillRect(x, 6, (60/this.maxMana)*this.mana, 2);
                gameArea.ctx.stroke();
                gameArea.ctx.fillStyle="black";
                break;
            case "archer":
                gameArea.ctx.beginPath();
                gameArea.ctx.strokeStyle="gray";
                gameArea.ctx.rect(x, 6, 60, 2);
                gameArea.ctx.stroke();
                gameArea.ctx.beginPath();
                gameArea.ctx.fillStyle="white";
                gameArea.ctx.fillRect(x, 6, (60/this.maxMana)*this.mana, 2);
                gameArea.ctx.stroke();
                gameArea.ctx.fillStyle="black";
                break;
        }
    }
}
var shurikens = {
    x : [],
    y : [],
    xveloc : [],
    yveloc : [],
    turnedDegrees : [],
    width : [],
    height : [], 
    image : "door", 
    owner : [],
    power : [],
    lastHitTime : [],
    theta : [],
    thetaVeloc : [],
    initialSetup : function(){
        this.image = new Image();
        this.image.src = "images/shuriken.png";
    },
    new : function(x, y, xveloc, yveloc, width, power, owner, theta, thetaVeloc){
        this.x[this.x.length] = x;
        this.y[this.y.length] = y;
        this.xveloc[this.xveloc.length] = xveloc;
        this.yveloc[this.yveloc.length] = yveloc;
        this.width[this.width.length] = width;
        this.height[this.height.length] = width;
        this.power[this.power.length] = power;
        this.owner[this.owner.length] = owner;
        this.theta[this.theta.length] = theta;
        this.thetaVeloc[this.thetaVeloc.length] = thetaVeloc;
        this.turnedDegrees[this.turnedDegrees.length] = 0;
        this.lastHitTime[this.lastHitTime.length] = gameArea.time;
    },
    updatePos : function(){
        this.damageCheck();
        for(i = 0; i < this.x.length; i++){
            if(this.theta[i] == null && !(this.xveloc[i] == 0 && this.yveloc[i] == 0)){
                this.x[i] += this.xveloc[i];
                this.y[i] += this.yveloc[i];
            }
            else if(!(this.xveloc[i] == 0 && this.yveloc[i] == 0)){
                var xOrigin = 0;
                var yOrigin = 0; 
                var extension = 0;
                if(this.owner[i] == 1){
                    xOrigin = player1.x + player1.width/2;
                    yOrigin = player1.y + player1.height/2;
                    extension = player1.width;
                }
                if(this.owner[i] == 2){
                    xOrigin = player2.x + player2.width/2;
                    yOrigin = player2.y + player2.height/2;
                    extension = player2.height;
                }
                this.x[i] = xOrigin + (extension + this.xveloc[i]) * Math.cos(this.theta[i]);
                this.y[i] = yOrigin + (extension + this.yveloc[i]) * Math.sin(this.theta[i]);
                this.theta[i] += this.thetaVeloc[i];
            }
        }
    },
    draw : function(){
        for(i = 0; i < this.x.length; i++){
            if(!(this.xveloc[i] == 0 && this.yveloc[i] == 0)){
                if(gameArea.splitScreen){
                    if(this.x[i] + this.width[i]/2 > gameArea.leftx && this.x[i] < gameArea.leftx + (gameArea.canvas.width/2)/gameArea.sizeMultiplier){
                        gameArea.ctx.save();
                            gameArea.ctx.translate(((this.x[i]-gameArea.sizeMultiplier*gameArea.leftx+1)-(gameArea.sizeMultiplier-1)), ((this.y[i]-gameArea.y+1)-(gameArea.sizeMultiplier-1)));
                            this.turnedDegrees[i] += Math.PI/3;
                            gameArea.ctx.translate(-((this.x[i]-gameArea.sizeMultiplier*gameArea.leftx+1)-(gameArea.sizeMultiplier-1)), -((this.y[i]-gameArea.y+1)-(gameArea.sizeMultiplier-1)));
                            gameArea.drawImage(this.image, 0, 0, 16, 16, this.x[i]-this.width[i]/2, this.y[i]-this.height[i]/2, this.width[i], this.height[i]);
                        gameArea.ctx.restore();
                    }
                    if(this.x[i] + this.width[i]/2 > gameArea.rightx && this.x[i] < gameArea.rightx + (gameArea.canvas.width/2)/gameArea.sizeMultiplier){
                        gameArea.ctx.save();
                            gameArea.ctx.translate(((this.x[i]-gameArea.sizeMultiplier*gameArea.rightx+1)-(gameArea.sizeMultiplier-1)), ((this.y[i]-gameArea.y+1)-(gameArea.sizeMultiplier-1)));
                            this.turnedDegrees[i] += Math.PI/3;
                            gameArea.ctx.translate(-((this.x[i]-gameArea.sizeMultiplier*gameArea.rightx+1)-(gameArea.sizeMultiplier-1)), -((this.y[i]-gameArea.y+1)-(gameArea.sizeMultiplier-1)));
                            gameArea.drawImage(this.image, 0, 0, 16, 16, this.x[i]-this.width[i]/2, this.y[i]-this.height[i]/2, this.width[i], this.height[i]);
                        gameArea.ctx.restore();

                    }
                }
                else{
                    gameArea.ctx.save();
                        gameArea.ctx.translate(((this.x[i]-gameArea.sizeMultiplier*gameArea.x+1)-(gameArea.sizeMultiplier-1)), ((this.y[i]-gameArea.y+1)-(gameArea.sizeMultiplier-1)));
                        this.turnedDegrees[i] += Math.PI/3;
                        gameArea.ctx.translate(-((this.x[i]-gameArea.sizeMultiplier*gameArea.x+1)-(gameArea.sizeMultiplier-1)), -((this.y[i]-gameArea.y+1)-(gameArea.sizeMultiplier-1)));
                        gameArea.drawImage(this.image, 0, 0, 16, 16, this.x[i]-this.width[i]/2, this.y[i]-this.height[i]/2, this.width[i], this.height[i]);
                    gameArea.ctx.restore();
                }
            }
        }
    },
    clear : function(){
        this.x.length = 0;
        this.y.length = 0;
        this.xveloc.length = 0;
        this.yveloc.length = 0;
        this.turnedDegrees.length = 0;
    },
    damageCheck : function(){
        for(i = 0; i < this.x.length; i++){ 
            if(this.xveloc[i] != 0 || this.yveloc[i] != 0){
                if(gameArea.time - this.lastHitTime[i] >= gameArea.lastHitValue){
                    for(h = 0; h < enemyCollision.x.length; h++){
                        if(enemyCollision.x[h] + enemyCollision.width[h] > this.x[i] && enemyCollision.x[h] < this.x[i] + this.width[i] && enemyCollision.y[h] + enemyCollision.height[h] > this.y[i] && enemyCollision.y[h] < this.y[i] + this.height[i] && enemyCollision.alive[h] == true){
                            enemyCollision.lastHitTime[h] = gameArea.time;
                            this.onDamageSelfEffect(i);
                            switch(enemyCollision.enemy[h]){
                                case "slime":
                                    slime.hurt(h, this.power[i]);
                                    break;
                                case "wakka":
                                    wakka.hurt(h, this.power[i]);
                                    break;
                                case "dragoon":
                                    dragoon.hurt(h, this.power[i]);
                                    break;
                                default:
                                    ui.testVar("DECLARE ENEMY TYPE REEEEEEE");
                                    break;
                            }
                        }
                    }
                    for(h = 0; h < fireball.x.length; h++){ //Firebal deletion
                        if(fireball.x[h] + fireball.radius[h] > this.x[i] && fireball.x[h] - fireball.radius[h] < this.x[i] + this.width[i] && fireball.y[h] + fireball.radius[h] > this.y[i] && fireball.y[h] - fireball.radius[h] < this.y[i] + this.height[i] && fireball.state[h] != "hold" && fireball.state[h] != "boom" && fireball.state[h] != "kapow"){
                            if(gameArea.pvp || fireball.owner[h] == 0){
                                fireball.state[h] = "kapow";
                                this.onDamageSelfEffect(i);
                            }
                            this.power[i] += fireball.power[h];
                        }
                    }
                    for(h = 0; h < collisionObjects.rectX.length; h++){
                        if(this.x[i] + this.width[i] > collisionObjects.rectX[h] && this.x[i] < collisionObjects.rectX[h] + collisionObjects.rectWidth[h] && this.y[i] + this.height[i] > collisionObjects.rectY[h] && this.y[i] < collisionObjects.rectY[h] + collisionObjects.rectHeight[h] && !collisionObjects.rectTransparency[h]){
                            this.xveloc[i] = 0;
                            this.yveloc[i] = 0;
                        }
                    }
                    if(gameArea.pvp){
                        switch(this.owner[i]){
                            case 1: 
                                if(player2.x + player2.width > this.x[i] && player2.x < this.x[i] + this.width[i] && player2.y + player2.height > this.y[i] && player2.y < this.y[i] + this.height[i]){
                                    this.onDamageSelfEffect(i);
                                    player2.lastHitTime = gameArea.time;
                                    player2.health -= this.power[i];
                                }
                                break;
                                break;
                            case 2: 
                                if(player1.x + player1.width > this.x[i] && player1.x < this.x[i] + this.width[i] && player1.y + player1.height > this.y[i] && player1.y < this.y[i] + this.height[i]){
                                    this.onDamageSelfEffect(i);
                                    player1.lastHitTime = gameArea.time;
                                    player1.health -= this.power[i];
                                }
                                break;
                        }
                    }
                    for(h = 0; h < collisionObjects.triX1.length; h++){ 
                        if(this.x[i] + this.width[i] > collisionObjects.triX1[h] && this.x[i] < collisionObjects.triX3[h] && this.y[i] + this.height[i] > ((collisionObjects.triY3[h]-collisionObjects.triY1[h])/(collisionObjects.triX3[h]-collisionObjects.triX1[h]))*(this.x[i]-collisionObjects.triX1[h]) + collisionObjects.triY1[h] && this.y[i] <= collisionObjects.triY1[h]){
                            this.xveloc[i] = 0;
                            this.yveloc[i] = 0;
                        }
                        else if(this.x[i] + this.width[i] > collisionObjects.triX3[h] && this.x[i] < collisionObjects.triX2[h] && this.y[i] + this.height[i] > ((collisionObjects.triY3[h]-collisionObjects.triY2[h])/(collisionObjects.triX3[h]-collisionObjects.triX2[h]))*(this.x[i]-collisionObjects.triX2[h]) + collisionObjects.triY2[h] && this.y[i] <= collisionObjects.triY2[h]){
                            this.xveloc[i] = 0;
                            this.yveloc[i] = 0;
                        }
                    }
                }
            }
        }
    },
    onDamageSelfEffect : function(i){
        if(this.theta[i] == null){
            if(this.xveloc[i] > 5){
                this.xveloc[i] -= 5;
            }
            else if(this.xveloc[i] > 0){
                this.xveloc[i] = 0;
                this.yveloc[i] = 0;
            }
        }
        else{
            if(this.xveloc[i] > 0){
                this.xveloc[i] -= 5;
            }
            if(this.yveloc[i] > 0){
                this.yveloc[i] -= 5;
            }
            if(this.xveloc[i] < 0){
                this.xveloc[i] = 0;
                this.yveloc[i] = 0;
            }
        }
        this.lastHitTime[i] = gameArea.time;
    },
}
var fireball = {
    x : [],
    y : [],
    xveloc : [],
    yveloc : [],
    radius : [],
    state : [],
    owner : [],
    animationFrame : [],
    lastAnimationTime : [],
    image1 : "shell",
    image2 : "shell",
    power : [],
    manaRegen : [],
    radiusVeloc : [],
    lastHitTime : [],
    initialSetup : function(){ 
        this.image1 = new Image();
        this.image1.src = "images/fireball.png";
        this.image2 = new Image();
        this.image2.src = "images/fooreball.png";
    },
    new : function(x, y, xveloc, yveloc, owner, radius, power, manaRegen){
        var notBoomCount = 0;
        var q = this.x.length
        var h = false;
        for(i = 0; i < q; i++){
            if(this.state[i] == "boom" && h == false){
                this.x[i] = x;
                this.y[i] = y;
                this.xveloc[i] = xveloc;
                this.yveloc[i] = yveloc;
                this.radius[i] = radius;
                this.state[i] = "hold";
                this.owner[i] = owner;
                this.animationFrame[i] = 0;
                this.lastAnimationTime[i] = gameArea.time;
                this.power[i] = power;
                this.manaRegen[i] = manaRegen;
                this.radiusVeloc[i] = 0;
                this.lastHitTime[i] = gameArea.time;
                h = true;
            }
            else{
                notBoomCount++;
            }
        }
        if(notBoomCount == q){
            this.x.push(x);
            this.y.push(y);
            this.xveloc.push(xveloc);
            this.yveloc.push(yveloc);
            this.radius.push(radius);
            this.state.push("hold");
            this.owner.push(owner);
            this.animationFrame.push(0);
            this.lastAnimationTime.push(gameArea.time);
            this.power.push(power);
            this.manaRegen.push(manaRegen);
            this.radiusVeloc.push(0);
            this.lastHitTime.push(gameArea.time);
        }
    },
    updatePos : function(){
        this.damageCheck();
        for(i = 0; i < this.x.length; i++){
            this.radius[i] += this.radiusVeloc[i];
            if(this.state[i] == "hold"){
                if(this.radius[i] < 5){
                    this.radius[i] += 0.1;
                }
                switch(this.owner[i]){
                    case 1:
                        this.x[i] = player1.x + player1.width/2;
                        switch(player1.character){
                            case "mage":
                                this.y[i] = player1.y - this.radius[i];
                                break;
                            case "archer":
                                this.y[i] = player1.y + 9;
                                break;
                        }
                        break;
                    case 2:
                        this.x[i] = player2.x + player2.width/2;
                        switch(player2.character){
                            case "mage":
                                this.y[i] = player2.y - this.radius[i]; 
                                break;
                            case "archer":
                                this.y[i] = player2.y + 9;
                                break;
                        }
                        break;
                }
            }
            if(this.state[i] == "none"){
                if(gameArea.time - this.lastHitTime[i] > 40000){
                    this.state[i] = "boom";
                }
            }
            if(this.state[i] != "boom" && this.state[i] != "hold" && this.state[i] != "kapow"){
                this.x[i] += this.xveloc[i];
                this.y[i] += this.yveloc[i];
            }
            if(gameArea.time - this.lastAnimationTime[i] > 20 + 200*Math.random()){
                switch(this.animationFrame[i]){
                    case 3:
                        this.animationFrame[i] = 0;
                        break;
                    default:
                        this.animationFrame[i]++;
                        break;
                }
                this.lastAnimationTime[i] = gameArea.time;
            }
            if(this.state[i] == "kapow"){
                if(this.power[i] > 0.2){
                    this.power[i] -= 0.05;
                }
                if(this.radius[i] > 0){
                    this.radiusVeloc[i] -= 0.008;
                }
                else{
                    this.state[i] = "boom";
                }
            }
        }
    },
    draw : function(){
        for(i = 0; i < this.x.length; i++){
            if(this.state[i] != "boom"){ //14*this.animationFrame[i]
                gameArea.drawImage(this.image1, 14*this.animationFrame[i], 0, 14, 14, this.x[i]-this.radius[i], this.y[i]-this.radius[i], 2*this.radius[i], 2*this.radius[i]);
            }
        }
    },
    release : function(owner, direction){
        for(i = 0; i < this.x.length; i++){
            if(this.owner[i] == owner && this.state[i] == "hold"){
                this.state[i] = "none";
                this.xveloc[i] = this.xveloc[i]*direction;
            }
        }
    },
    damageCheck : function(){ 
        for(i = 0; i < this.x.length; i++){ 
            if(this.state[i] != "hold" && this.state[i] != "boom"){
                if(gameArea.time - this.lastHitTime[i] >= gameArea.lastHitValue){
                    for(h = 0; h < enemyCollision.x.length && this.owner[i] != 0; h++){
                        if(enemyCollision.x[h] + enemyCollision.width[h] > this.x[i] - this.radius[i] && enemyCollision.x[h] < this.x[i] + this.radius[i] && enemyCollision.y[h] + enemyCollision.height[h] > this.y[i] - this.radius[i] && enemyCollision.y[h] < this.y[i] + this.radius[i] && enemyCollision.alive[h] == true){
                            enemyCollision.lastHitTime[h] = gameArea.time;
                            this.onDamageSelfEffect(i);
                            switch(enemyCollision.enemy[h]){
                                case "slime":
                                    slime.hurt(h, this.power[i]);
                                    break;
                                case "wakka":
                                    wakka.hurt(h, this.power[i]);
                                    break;
                                case "dragoon":
                                    dragoon.hurt(h, this.power[i]);
                                    break;
                                default:
                                    ui.testVar("DECLARE ENEMY TYPE REEEEEEE");
                                    break;
                            }
                        }
                    }
                    if(this.owner[i] == 1 && gameArea.pvp || this.owner[i] == 0){
                        if(player2.x + player2.width > this.x[i] - this.radius[i] && player2.x < this.x[i] + this.radius[i] && player2.y + player2.height > this.y[i] - this.radius[i] && player2.y < this.y[i] + this.radius[i]){
                            player2.lastHitTime = gameArea.time;
                            this.onDamageSelfEffect(i);
                            player2.health -= this.power[i];
                        }
                    }
                    if(this.owner[i] == 2 && gameArea.pvp || this.owner[i] == 0){
                        if(player1.x + player1.width > this.x[i] - this.radius[i] && player1.x < this.x[i] + this.radius[i] && player1.y + player1.height > this.y[i] - this.radius[i] && player1.y < this.y[i] + this.radius[i]){
                            player1.lastHitTime = gameArea.time;
                            this.onDamageSelfEffect(i);
                            player1.health -= this.power[i];
                        }
                    }
                }
                for(h = 0; h < collisionObjects.rectX.length; h++){
                    if(this.x[i] + this.radius[i] > collisionObjects.rectX[h] && this.x[i] - this.radius[i] < collisionObjects.rectX[h] + collisionObjects.rectWidth[h] && this.y[i] + this.radius[i] > collisionObjects.rectY[h] && this.y[i] - this.radius[i] < collisionObjects.rectY[h] + collisionObjects.rectHeight[h] && !collisionObjects.rectTransparency[h]){
                        this.state[i] = "kapow";
                        this.radius[i] = this.radius[i]/2;
                    }
                }
                for(h = 0; h < collisionObjects.triX1.length; h++){ //TODO: Fix reflection code
                    if(this.x[i] + this.radius[i] > collisionObjects.triX1[h] && this.x[i] - this.radius[i] < collisionObjects.triX3[h] && this.y[i] + this.radius[i] > ((collisionObjects.triY3[h]-collisionObjects.triY1[h])/(collisionObjects.triX3[h]-collisionObjects.triX1[h]))*(this.x[i]-collisionObjects.triX1[h]) + collisionObjects.triY1[h] && this.y[i] - this.radius[i] <= collisionObjects.triY1[h]){
                        if(collisionObjects.reflectivity[h]){
                            var deltaX = Math.abs(collisionObjects.triX3[h]-collisionObjects.triX1[h]);
                            var deltaY = Math.abs(collisionObjects.triY3[h]-collisionObjects.triY1[h]);
                            var hypot = Math.sqrt(Math.pow(deltaX, 2)+Math.pow(deltaY, 2));
                            var velocTot = Math.sqrt(Math.pow(this.xveloc[i], 2)+Math.pow(this.yveloc[i], 2));

                            this.xveloc[i] = -velocTot*Math.cos(Math.atan(deltaY/deltaX)+Math.atan(this.yveloc[i]/this.xveloc[i]));
                            this.yveloc[i] = -velocTot*Math.sin(Math.atan(deltaY/deltaX)+Math.atan(this.yveloc[i]/this.xveloc[i]));
                        }
                        else{
                            this.state[i] = "kapow";
                            this.radius[i] = this.radius[i]/2;
                        }
                    }
                    else if(this.x[i] + this.radius[i] > collisionObjects.triX3[h] && this.x[i] - this.radius[i] < collisionObjects.triX2[h] && this.y[i] + this.radius[i] > ((collisionObjects.triY3[h]-collisionObjects.triY2[h])/(collisionObjects.triX3[h]-collisionObjects.triX2[h]))*(this.x[i]-collisionObjects.triX2[h]) + collisionObjects.triY2[h] && this.y[i] - this.radius[i] <= collisionObjects.triY2[h]){
                        if(collisionObjects.reflectivity[h]){
                            var deltaX = Math.abs(collisionObjects.triX3[h]-collisionObjects.triX2[h]);
                            var deltaY = Math.abs(collisionObjects.triY3[h]-collisionObjects.triY2[h]);
                            var hypot = Math.sqrt(Math.pow(deltaX, 2)+Math.pow(deltaY, 2));
                            var velocTot = Math.sqrt(Math.pow(this.xveloc[i], 2)+Math.pow(this.yveloc[i], 2));
                            
                            this.xveloc[i] = -velocTot*Math.cos(Math.atan(deltaY/deltaX)+Math.atan(this.yveloc[i]/this.xveloc[i]));
                            this.yveloc[i] = -velocTot*Math.sin(Math.atan(deltaY/deltaX)+Math.atan(this.yveloc[i]/this.xveloc[i]));
                        }
                        else{
                            this.state[i] = "kapow";
                            this.radius[i] = this.radius[i]/2;
                        }
                    }
                }
            }
        }
    },
    onDamageSelfEffect : function(i){
        switch(this.owner[i]){
            case 1:
                if(player1.mana <= player1.maxMana - this.manaRegen[i]){
                    player1.mana += this.manaRegen[i];
                }
                break;
            case 2:
                if(player2.mana <= player2.maxMana - this.manaRegen[i]){
                    player2.mana += this.manaRegen[i];
                }
                break;
        }
        if(Math.random() > .7){
            this.state[i] = "kapow";
        }
        this.lastHitTime[i] = gameArea.time;
    },
    explode : function(i){
        if(fireball.state[i] != "boom" && fireball.state[i] != "kapow"){
            this.state[i] = "kapow";
            this.radius[i] += 5;
        }
    }
}
var arrow = { //16*7 odd number of pixels REEEE
    x : [], //For some fucking reason x doesn't work
    retardedx : [],
    y : [],
    veloc : [],
    theta : [],
    thetaVeloc : [],
    width : [],
    height : [],
    type : [],
    state : [],
    owner : [],
    image : "shell",
    power : [],
    lastHitTime : [],
    initialSetup : function(){
        this.image = new Image();
        this.image.src = "images/attackIcons/arrow/baseArrow.png";
    },
    new : function(x, y, veloc, theta, thetaVeloc, type, owner, power){
        
        var notDedCount = 0;
        var q = this.x.length
        var h = false;
        for(i = 0; i < q; i++){
            if(this.state[i] == "ded" && h == false){
                this.retardedx[i] = x - 8;
                this.y[i] = y - 3.5;
                this.veloc[i] = veloc;
                this.theta[i] = -theta;
                this.thetaVeloc[i] = thetaVeloc;
                this.width[i] = 16;
                this.height[i] = 7;
                this.state[i] = "none";
                this.type[i] = type;
                this.owner[i] = owner;
                this.power[i] = power;
                this.lastHitTime[i] = gameArea.time;
                h = true;
            }
            else{
                notBoomCount++;
            }
        }
        if(notDedCount == q){
            this.retardedx.push(x-8); 
            this.y.push(y-3.5);
            this.veloc.push(veloc);
            this.theta.push(-theta);
            this.thetaVeloc.push(thetaVeloc);
            this.width.push(16);
            this.height.push(7);
            this.state.push("none");
            this.type.push(type);
            this.owner.push(owner);
            this.power.push(power);
            this.lastHitTime.push(gameArea.time);
        }
    }, 
    updatePos : function(){
        for(i = 0; i < this.retardedx.length; i++){
            this.retardedx[i] += this.veloc[i] * Math.cos(this.theta[i]);
            this.y[i] += this.veloc[i] * Math.sin(this.theta[i]);
            if(Math.abs(this.retardedx[i]) > 3000 || this.y[i] > 1000){
                this.state[i] = "ded";
            }
        }
    },
    draw : function(){
        for(i = 0; i < this.retardedx.length; i++){
            if(this.state != "ded"){
                var transx = gameArea.sizeMultiplier*(this.retardedx[i] - gameArea.x + this.width[i]/2);
                var transy = gameArea.sizeMultiplier*(this.y[i] - gameArea.y + this.height[i]/2)-(gameArea.sizeMultiplier-1)*gameArea.canvas.height;

                if(gameArea.splitScreen){
                    if(this.retardedx[i] + this.width[i] > gameArea.leftx && this.retardedx[i] < gameArea.leftx + (gameArea.canvas.width/2)/gameArea.sizeMultiplier){
                        transx = gameArea.sizeMultiplier*(this.retardedx[i] - gameArea.leftx + this.width[i]/2);
                        gameArea.ctx.save();

                        gameArea.ctx.beginPath();
                        gameArea.ctx.rect(0, 0, gameArea.canvas.width/2, gameArea.canvas.height);
                        gameArea.ctx.clip();

                        gameArea.ctx.translate(transx, transy);
                        gameArea.ctx.rotate(this.theta[i]);
                        gameArea.ctx.translate(-transx, -transy);

                        gameArea.ctx.beginPath();
                        gameArea.ctx.drawImage(this.image, 0, 0, this.width[i], this.height[i], gameArea.sizeMultiplier*(this.retardedx[i] - gameArea.leftx), gameArea.sizeMultiplier*(this.y[i] - gameArea.lefty)-(gameArea.sizeMultiplier-1)*gameArea.canvas.height, gameArea.sizeMultiplier*this.width[i], gameArea.sizeMultiplier*this.height[i]);

                        gameArea.ctx.restore();
                    }
                    if(this.retardedx[i] + this.width[i] > gameArea.rightx && this.retardedx[i] < gameArea.rightx + (gameArea.canvas.width/2)/gameArea.sizeMultiplier){
                        transx = gameArea.sizeMultiplier*(this.retardedx[i] - gameArea.rightx + gameArea.canvas.width/2 + this.width[i]/2);
                        gameArea.ctx.save();

                        gameArea.ctx.beginPath();
                        gameArea.ctx.rect(gameArea.canvas.width/2, 0, gameArea.canvas.width/2, gameArea.canvas.height);
                        gameArea.ctx.clip();

                        gameArea.ctx.translate(transx, transy);
                        gameArea.ctx.rotate(this.theta[i]);
                        gameArea.ctx.translate(-transx, -transy);

                        gameArea.ctx.beginPath();
                        gameArea.ctx.drawImage(this.image, 0, 0, this.width[i], this.height[i], gameArea.canvas.width/2 + gameArea.sizeMultiplier*(this.retardedx[i] - gameArea.rightx), gameArea.sizeMultiplier*(this.y[i] - gameArea.righty)-(gameArea.sizeMultiplier-1)*gameArea.canvas.height, gameArea.sizeMultiplier*this.width[i], gameArea.sizeMultiplier*this.height[i]);

                        gameArea.ctx.restore();
                    }
                }
                else{
                    gameArea.ctx.save();
                    gameArea.ctx.translate(transx, transy);
                    gameArea.ctx.rotate(this.theta[i]);
                    gameArea.ctx.translate(-transx, -transy);
                    gameArea.ctx.drawImage(this.image, 0, 0, this.width[i], this.height[i], gameArea.sizeMultiplier*(this.retardedx[i] - gameArea.x), gameArea.sizeMultiplier*(this.y[i] - gameArea.y)-(gameArea.sizeMultiplier-1)*gameArea.canvas.height, gameArea.sizeMultiplier*this.width[i], gameArea.sizeMultiplier*this.height[i]);
                    gameArea.ctx.restore();
                }
            }
        }
        /*
        for(i = 0; i < this.retardedx.length; i++){
            if(this.state[i] != "ded"){ 
                gameArea.drawImage(this.image, 0, 0, 16, 7, this.retardedx[i], this.y[i], this.width[i], this.height[i]);
            }
        }
        */
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

///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//** M A P S **\\ //** M A P S **\\ //** M A P S **\\ //** M A P S **\\ //** M A P S **\\ //** M A P S **\\
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

var worlds = {
    new : function(){
        this.worldBuilder = document.getElementById("worldBuilderCheckbox").checked;
        this.fire = document.getElementById("fireCheckBox").checked;
        this.mountain = document.getElementById("mountainCheckBox").checked;
        this.arena1 = document.getElementById("arena1CheckBox").checked;
        this.arena2 = document.getElementById("arena2CheckBox").checked;
        this.testyTest = document.getElementById("testyTestCheckBox").checked;
        this.textWorldGen = document.getElementById("textWorldGenCheckBox").checked;
        this.flatGround = document.getElementById("flatGroundCheckBox").checked;
        this.circleWorld = document.getElementById("circleWorldCheckBox").checked;
        this.lineWorld = document.getElementById("lineWorldCheckBox").checked;
        this.rectanglePlatform = document.getElementById("platformCheckBox").checked;
        this.shop = document.getElementById("shopCheckBox").checked;
        this.flappyBird = document.getElementById("flappyCheckBox").checked;
        if(this.worldBuilder){
            worldBuilder.initialSetup();
        }
        if(this.fire){
            fire.initialSetup();
        }
        if(this.mountain){
            mountain.initialSetup();
            this.circleWorld = false;
            this.lineWorld = false;
            this.rectanglePlatform = false;
            this.shop = false;
        }
        if(this.arena1){
            arena1.initialSetup();
            this.circleWorld = false;
            this.lineWorld = false;
            this.rectanglePlatform = false;
            this.shop = false;
        }
        if(this.testyTest){
            testyTest.initialSetup();
            this.rectanglePlatform = false;
            this.shop = false;
        }
        if(this.textWorldGen){
            textWorldGen.initialSetup();
        }
        if(this.arena2){
            arena2.initialSetup();
            this.circleWorld = false;
            this.lineWorld = false;
            this.rectanglePlatform = false;
            this.shop = false;
        }
        if(this.flatGround){
            flatGround.initialSetup();
        }
        if(this.circleWorld){
            circleWorld.initialSetup();
        }
        if(this.lineWorld){
            lineWorld.initialSetup();
        }
        if(this.rectanglePlatform){
            rectanglePlatform.initialSetup();
        }
        if(this.shop){
            shop.initialSetup();
        }
        if(this.flappyBird){
            flappyBird.initialSetup();
        }
    },
    loop : function(){
        if(this.flatGround){
            flatGround.updatePos();
        }
        if(this.fire){
            fire.loop();
        }
        if(this.mountain){
            mountain.loop();
        }
        if(this.arena1){
            arena1.loop();
        }
        if(this.arena2){
            arena2.loop();
        }
        if(this.testyTest){
            testyTest.loop();
        }
        if(this.textWorldGen){
            textWorldGen.loop();
        }
        rectanglePlatform.updatePos();
        triangle.updatePos();
        block.updatePos();
        if(this.worldBuilder){
            worldBuilder.loop();
        }
        if(!this.flatGround && !this.circleWorld && !this.lineWorld && !this.worldBuilder){ //TODO: MAKE CHECKBOXES FOR CERTAIN MODES THAT DISABLE STUFFS
            ui.drawVar("RACE! Player 1: " + Math.round(player1.x) + " Player 2: " + Math.round(player2.x));
        }
    }, 
    draw : function(){
        if(this.worldBuilder){
            worldBuilder.draw();
        }
        if(this.fire){
            fire.draw();
        }
        if(this.mountain){
            mountain.draw();
        }
        if(this.flatGround){
            flatGround.draw();
        }
        if(this.circleWorld){
            circleWorld.draw();
        }
        if(this.lineWorld){
            lineWorld.draw();
        }
        rectanglePlatform.draw();
        triangle.draw();
        block.draw();
        if(this.shop){
            shop.draw();
        }
        if(this.flappyBird){
            flappyBird.draw();
        }
    },
}

var collisionObjects = {
    rectX : [0],
    rectY : [0],
    rectWidth : [0],
    rectHeight : [0],
    rectXVeloc : [0],
    rectTransparency : [false],
    
    triX1 : [], //Bottom left
    triY1 : [], //Bottom left
    triX2 : [], //Bottom right
    triY2 : [], //Bottom right
    triX3 : [], //Middle
    triY3 : [], //Middle
    triXVeloc : [],
    reflectivity : [],
}
var templateWorld = {
    initialSetup : function(){
        
    },
    loop : function(){
        
    },
    draw : function(){
    
    },
}
var worldBuilder = {
    initialSetup : function(){
        player1.x = -100;
        player2.x = -100;
    },
    loop : function(){
        //ui.drawVar(gameArea.mouseX + " " + gameArea.mouseY);
    },
    draw : function(){
        
    },
}
var fire = {
    initialSetup : function(){
        gameArea.backgroundImage.src = "images/backgrounds/idk.png";
    },
    loop : function(){
        
    },
    draw : function(){
    
    },
}
var mountain = {
    initialSetup : function(){ //Ground level is 140
        gameArea.backgroundImage.src = "images/backgrounds/mountain.png";
        mapBounds.initialSetup(-25, 10000000);
        rectanglePlatform.new(0, 50, 20, 0, 0, 0, colors.white, true);
        rectanglePlatform.new(50, 50, 20, 0, 0, 0, colors.white, true);
        player1.x = 10-player1.width/2;
        player2.x = 50+10-player2.width/2;
        player1.y = 50-player1.height;
        player2.y = 50-player2.height;
        block.pyramid(120, 100, 0, 10, colors.black);
        block.pyramid(400, 60, 0, 20, colors.black);
        

        var xveloc = .1;
        var yveloc = -0;
        block.new(0, 70, 5, 50, xveloc, yveloc, colors.black, false);
        block.new(95, 70, 5, 50, xveloc, yveloc, colors.black, false);
        block.new(0, 120, 100, 5, xveloc, yveloc, colors.black, false);
        block.new(5, 85, 90, 35, xveloc, yveloc, colors.white, false);
        block.new(10, 125, 15, 15, xveloc, yveloc, colors.black, false);
        block.new(75, 125, 15, 15, xveloc, yveloc, colors.black, false);
        block.new(15, 130, 5, 5, xveloc, yveloc, colors.white, false);
        block.new(80, 130, 5, 5, xveloc, yveloc, colors.white, false);

        
        wakka.new(240, 120, 20, 20, 30);
        slime.new(300, 20, 10);
        slime.new(340, 20, 30);
        slime.new(380, 20, 20);
        slime.new(420, 20, 50);
        slime.new(700, 20, 300);
    },
    loop : function(){

    },
    draw : function(){
    
    },
}
var arena1 = {
    initialSetup : function(){
        gameArea.backgroundImage.src = "images/backgrounds/woods.png";
        //toggleMap[52] = false;
        flatGround.shown = false;
        flatGround.y = 138;
        mapBounds.initialSetup(-250, 250);
        mapBounds.hardBoundsSetup(-300, 300)
        rectanglePlatform.new(-140, 0, 20, 0, 0, 1, colors.black, true);
        rectanglePlatform.new(120, 0, 20, 0, 0, 1, colors.black, true);
        player1.x = -130-player1.width/2;
        player2.x = 130-player2.width/2;
        player1.y = 0-player1.height;
        player2.y = 0-player2.height;
        
        block.pyramid(-52.5, 80, 0, 15, colors.black);
        
        block.pyramid(-131.25-300, 0, 0, 37.5, colors.black);
        block.pyramid(300-131.25, 0, 0, 37.5, colors.black);
        
        for(i = 0; i < 10; i++){
            var r = 10+Math.random()*10;
            slime.new(0-r/2, 50, r);
        }
    },
    loop : function(){
        if(gameArea.time-gameArea.startTime < 1500){
            toggleMap[49] = false;
            ui.drawVar(1500-parseInt(gameArea.time-gameArea.startTime));
        }
        else{
            toggleMap[49] = true;
        }
        //gameArea.sizeMultiplier = 1;
        
    },
}
var arena2 = {
    initialSetup : function(){
        gameArea.backgroundImage.src = "images/backgrounds/woods.png";
        //toggleMap[52] = false;
        flatGround.shown = false;
        flatGround.y = 138;
        mapBounds.initialSetup(-250, 250);
        mapBounds.hardBoundsSetup(-300, 300)
        rectanglePlatform.new(-140, 0, 20, 0, 0, 1, colors.black, true);
        rectanglePlatform.new(120, 0, 20, 0, 0, 1, colors.black, true);
        player1.x = -130-player1.width/2;
        player2.x = 130-player2.width/2;
        player1.y = 0-player1.height;
        player2.y = 0-player2.height;
        
        
        triangle.new(-100, 140, -60, 140, -80, 30, -1, 0, colors.black, false);
        triangle.new(60, 140, 100, 140, 80, 30, 1, 0, colors.black, false);
        
        block.pyramid(-131.25-300, 0, 0, 37.5, colors.black);
        block.pyramid(300-131.25, 0, 0, 37.5, colors.black);
        
        for(i = 0; i < 10; i++){
            var r = 10+Math.random()*10;
            slime.new(0-r/2, 50, r);
        }
    },
    loop : function(){
        if(gameArea.time-gameArea.startTime < 1500){
            toggleMap[49] = false;
            ui.drawVar(1500-parseInt(gameArea.time-gameArea.startTime));
        }
        else{
            toggleMap[49] = true;
        }
        if(Math.random() > .99){
            var x = -200;
            var y = 140; //basey
            var width = Math.random()*40;
            var height = Math.random()*30;
            triangle.new(x, y, x+width, y, x+width/2, y-height, .5+Math.random(), 0, colors.random(), false);
            
        }
        if(Math.random() > .99){
            var x = 200;
            var y = 140; //basey
            var width = Math.random()*40;
            var height = Math.random()*30;
            triangle.new(x, y, x+width, y, x+width/2, y-height, -(.5+Math.random()), 0, colors.random(), false);
            
        }

        //gameArea.sizeMultiplier = 1;
        
    },
}
var testyTest = {
    initialSetup : function(){
        dragoon.new(0, -1000, 100);
        gameArea.sizeMultiplier = 0.04;
        
    },
    loop : function(){
    },
}
var textWorldGen = {
    fileText : null,
    initialSetup : function(){
    },
    loop : function(){
        var worldFile = new XMLHttpRequest();
        worldFile.open("GET", "worldFiles/worldFileTest.txt", false);
        //worldFile.send();
//        ui.testVar(this.fileText);
//        ui.testVar("Not Broken");
    }
}
var flatGround = {
    x : 0,
    y : 140,
    width : 0,
    height : 100000,
    arrayPosition : 0,
    shown : true,
    initialSetup : function(){
        collisionObjects.rectX[0] = this.x;
        collisionObjects.rectY[0] = this.y;
        collisionObjects.rectWidth[0] = this.width;
        collisionObjects.rectHeight[0] = this.height;
        collisionObjects.rectXVeloc[0] = 0;
    },
    updatePos : function(){
        this.x = gameArea.x - 1000; //Sphaget
        this.width = gameArea.canvas.width/gameArea.sizeMultiplier + 100000;
        collisionObjects.rectX[0] = this.x;
        collisionObjects.rectY[0] = this.y;
        collisionObjects.rectWidth[0] = this.width;
        collisionObjects.rectHeight[0] = this.height;
        collisionObjects.rectTransparency[0] = true;
    },
    draw : function(){
        if(this.shown){
            gameArea.drawRect(this.x, this.y, this.width, this.height, colors.black);
        }
    },
}
var mapBounds = {
    leftx : -99999999,
    rightx : 99999999, 
    lefthardx : -99999999999,
    righthardx : 99999999999,
    initialSetup : function(leftx, rightx){
//        rectanglePlatform.new(leftx-30, -500, 30, gameArea.canvas.height+500, 0, 0, colors.black, false);
//        rectanglePlatform.new(rightx, -500, 30, gameArea.canvas.height+500, 0, 0, colors.black, false);
        this.leftx = leftx;
        this.rightx = rightx;
    },
    hardBoundsSetup : function(leftx, rightx){
        this.lefthardx = leftx;
        this.righthardx = rightx;
    }
    
}
var lineWorld = {
    initialSetup : function(){
        
    },
    draw : function(){
        for(i = 0; i < 1000; i++){
            gameArea.drawLine(i * 5, gameArea.canvas.height - 10, i * 6, gameArea.canvas.height, colors.black);
        }
    },
}
var circleWorld = {
    circlesX : [],
    initialSetup : function(){
        for(i = 0; i < 1000; i++){
            this.circlesX[i] = 100 * i * Math.random();
        }
    },
    draw : function(){
        for(i = 0; i < this.circlesX.length; i++){
            gameArea.drawCirc(this.circlesX[i], gameArea.canvas.height - 14, 3, colors.black);
        }
    },
}
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
var triangle = {
    x1 : [],
    y1 : [],
    x2 : [],
    y2 : [],
    x3 : [],
    y3 : [],
    xveloc : [],
    yveloc : [],
    color : [],
    reflectivity : [],
    arrayPosition : [],
    new : function(x1, y1, x2, y2, x3, y3, xveloc, yveloc, color, reflectivity){
        this.x1.push(x1);
        this.y1.push(y1);
        this.x2.push(x2);
        this.y2.push(y2);
        this.x3.push(x3);
        this.y3.push(y3);
        this.xveloc.push(xveloc);
        this.yveloc.push(yveloc);
        this.color.push(color);
        this.reflectivity.push(reflectivity);
        i = this.x1.length-1;
        collisionObjects.triX1.push(this.x1[i]);
        collisionObjects.triY1.push(this.y1[i]);
        collisionObjects.triX2.push(this.x2[i]);
        collisionObjects.triY2.push(this.y2[i]);
        collisionObjects.triX3.push(this.x3[i]);
        collisionObjects.triY3.push(this.y3[i]);
        collisionObjects.triXVeloc.push(this.xveloc[i]);
        collisionObjects.reflectivity.push(this.reflectivity[i]);
        this.arrayPosition[i] = collisionObjects.triX1.length-1;
    },
    updatePos : function(){
        for(i = 0; i< this.x1.length; i++){
            this.x1[i] += this.xveloc[i];
            this.y1[i] += this.yveloc[i];
            this.x2[i] += this.xveloc[i];
            this.y2[i] += this.yveloc[i];
            this.x3[i] += this.xveloc[i];
            this.y3[i] += this.yveloc[i];
            collisionObjects.triX1[this.arrayPosition[i]] = this.x1[i];
            collisionObjects.triY1[this.arrayPosition[i]] = this.y1[i];
            collisionObjects.triX2[this.arrayPosition[i]] = this.x2[i];
            collisionObjects.triY2[this.arrayPosition[i]] = this.y2[i];
            collisionObjects.triX3[this.arrayPosition[i]] = this.x3[i];
            collisionObjects.triY3[this.arrayPosition[i]] = this.y3[i];
            collisionObjects.triXVeloc[this.arrayPosition[i]] = this.xveloc[i];
            collisionObjects.reflectivity[this.arrayPosition[i]] = this.reflectivity[i];
        }
    },
    draw : function(){
        for(i = 0; i < this.x1.length; i++){
            gameArea.drawTriangle(this.x1[i], this.y1[i], this.x2[i], this.y2[i], this.x3[i], this.y3[i], this.color[i]);
        }
    },
}
var block = {
    x : [],
    y : [],
    width : [],
    height : [],
    xveloc : [],
    yveloc : [],
    color : [],
    transparency : [], //
    arrayPosition : [],
    new : function(x, y, width, height, xveloc, yveloc, color, transparency){
        this.x.push(x);
        this.y.push(y);
        this.width.push(width);
        this.height.push(height);
        this.xveloc.push(xveloc);
        this.yveloc.push(yveloc);
        this.color.push(color);
        this.transparency.push(transparency);
        i = this.x.length-1;
        collisionObjects.rectX.push(this.x[i]);
        collisionObjects.rectY.push(this.y[i]);
        collisionObjects.rectWidth.push(this.width[i]);
        collisionObjects.rectHeight.push(this.height[i]);
        collisionObjects.rectXVeloc.push(this.xveloc[i]);
        collisionObjects.rectTransparency.push(this.transparency[i]);
        this.arrayPosition[i] = collisionObjects.rectX.length-1;
    },
    updatePos : function(){
        for(i = 0; i < this.x.length; i++){
            this.x[i] += this.xveloc[i];
            this.y[i] += this.yveloc[i];
            collisionObjects.rectX[this.arrayPosition[i]] = this.x[i];
            collisionObjects.rectY[this.arrayPosition[i]] = this.y[i];
            collisionObjects.rectWidth[this.arrayPosition[i]] = this.width[i];
            collisionObjects.rectHeight[this.arrayPosition[i]] = this.height[i];
            collisionObjects.rectXVeloc[this.arrayPosition[i]] = this.xveloc[i];
            collisionObjects.rectTransparency[this.arrayPosition[i]] = this.transparency[i];
        }
    },
    draw : function(){
        for(i = 0; i < this.x.length; i++){
            gameArea.drawBlock(this.x[i], this.y[i], this.width[i], this.height[i], this.color[i]);
        }
    },
    pyramid : function(x, y, width, blocksize, color){
        this.new(x, y+3*blocksize, blocksize + 1, blocksize, 0, 0, color, false);
        this.new(x + blocksize, y+2*blocksize, blocksize + 1, 2*blocksize, 0, 0, color, false);
        this.new(x + 2*blocksize, y+blocksize, blocksize + 1, 3*blocksize, 0, 0, color, false);
        this.new(x + 3*blocksize, y, blocksize + 1, 4*blocksize, 0, 0, color, false);
        this.new(x + 4*blocksize, y+blocksize, blocksize + 1, 3*blocksize, 0, 0, color, false);
        this.new(x + 5*blocksize, y+2*blocksize, blocksize + 1, 2*blocksize, 0, 0, color, false);
        this.new(x + 6*blocksize, y+3*blocksize, blocksize, blocksize, 0, 0, color, false);
    }
}
var flappyBird = { //TODO: FIX COLLISIONOBJECTS HERE
    rectX : [],
    rectY : [],
    rectWidth : [],
    rectHeight : [],
    rectColor : [],
    initialSetup : function(){
        for(i = 0; i < 1000; i++){
            if(i % 2 == 0){
                this.rectX[i] = 100 * i + 50;
                this.rectY[i] = 0;
                this.rectWidth[i] = 20;
                this.rectHeight[i] = Math.random() * gameArea.canvas.height;
                this.rectColor[i] = colors.black;
                this.rectX[i+1] = 100 * i + 50;
                this.rectY[i+1] = this.rectY[i] + this.rectHeight[i] + 50;
                this.rectWidth[i+1] = 20;
                this.rectHeight[i+1] = gameArea.canvas.height - (this.rectY[i] + this.rectHeight[i] + 50);
                this.rectColor[i+1] = colors.black;
                collisionObjects.rectX.push(this.rectX[i]);
                collisionObjects.rectY.push(this.rectY[i]);
                collisionObjects.rectWidth.push(this.rectHeight[i]);
                collisionObjects.rectHeight.push(this.rectHeight[i]);
                collisionObjects.rectXVeloc.push(-1000);
                collisionObjects.rectTransparency.push(false);
                collisionObjects.rectX.push(this.rectX[i+1]);
                collisionObjects.rectY.push(this.rectY[i+1]);
                collisionObjects.rectWidth.push(this.rectHeight[i+1]);
                collisionObjects.rectHeight.push(this.rectHeight[i+1]);
                collisionObjects.rectXVeloc.push(-1000);
                collisionObjects.rectTransparency.push(false);
            }
        }
    },
    draw : function(){
        for(i = 0; i < this.rectX.length; i++){
            gameArea.drawRect(this.rectX[i], this.rectY[i], this.rectWidth[i], this.rectHeight[i], this.rectColor[i]);
        }
    },
}
var shop = {
    x : 0,
    y : 0,
    width : 0,
    height : 0,
    rectXVeloc : 0,
    animationFrame : 0,
    image : null,
    asdf : 0,
    initialSetup : function(){
        this.x = 60;
        this.y = flatGround.y - 64;
        this.width = 64;
        this.height = 64;
        var image = new Image();
        image.src = "images/shop/shop.png";
        this.image = image;
        collisionObjects.rectX.push(this.x);
        collisionObjects.rectY.push(this.y);
        collisionObjects.rectWidth.push(this.width);
        collisionObjects.rectHeight.push(this.height);
        collisionObjects.rectXVeloc.push(this.rectXVeloc);
        collisionObjects.rectTransparency.push(false);
    }, //20, 40
    draw : function(){
        gameArea.drawImage(this.image, this.animationFrame * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
        
        /*  //TILTED REEEEE
        var transx = gameArea.sizeMultiplier*(this.x - gameArea.x + this.width/2);
        var transy = gameArea.sizeMultiplier*(this.y - gameArea.y + this.height/2)-(gameArea.sizeMultiplier-1)*gameArea.canvas.height;

        if(gameArea.splitScreen){
            if(this.x + this.width > gameArea.leftx && this.x < gameArea.leftx + (gameArea.canvas.width/2)/gameArea.sizeMultiplier){
                transx = gameArea.sizeMultiplier*(this.x - gameArea.leftx + this.width/2);
                gameArea.ctx.save();
                
                gameArea.ctx.beginPath();
                gameArea.ctx.rect(0, 0, gameArea.canvas.width/2, gameArea.canvas.height);
                gameArea.ctx.clip();
                
                gameArea.ctx.translate(transx, transy);
                gameArea.ctx.rotate(Math.PI/8);
                gameArea.ctx.translate(-transx, -transy);
                
                gameArea.ctx.beginPath();
                gameArea.ctx.drawImage(this.image, 0, 0, this.width, this.height, gameArea.sizeMultiplier*(this.x - gameArea.leftx), gameArea.sizeMultiplier*(this.y - gameArea.lefty)-(gameArea.sizeMultiplier-1)*gameArea.canvas.height, gameArea.sizeMultiplier*this.width, gameArea.sizeMultiplier*this.height);
                
                gameArea.ctx.restore();
            }
            if(this.x + this.width > gameArea.rightx && this.x < gameArea.rightx + (gameArea.canvas.width/2)/gameArea.sizeMultiplier){
                transx = gameArea.sizeMultiplier*(this.x - gameArea.rightx + gameArea.canvas.width/2 + this.width/2);
                gameArea.ctx.save();
                
                gameArea.ctx.beginPath();
                gameArea.ctx.rect(gameArea.canvas.width/2, 0, gameArea.canvas.width/2, gameArea.canvas.height);
                gameArea.ctx.clip();
                
                gameArea.ctx.translate(transx, transy);
                gameArea.ctx.rotate(Math.PI/8);
                gameArea.ctx.translate(-transx, -transy);
                
                gameArea.ctx.beginPath();
                gameArea.ctx.drawImage(this.image, 0, 0, this.width, this.height, gameArea.canvas.width/2 + gameArea.sizeMultiplier*(this.x - gameArea.rightx), gameArea.sizeMultiplier*(this.y - gameArea.righty)-(gameArea.sizeMultiplier-1)*gameArea.canvas.height, gameArea.sizeMultiplier*this.width, gameArea.sizeMultiplier*this.height);
                
                gameArea.ctx.restore();
            }
        }
        else{
            gameArea.ctx.save();
            gameArea.ctx.translate(transx, transy);
            gameArea.ctx.rotate(Math.PI/8);
            gameArea.ctx.translate(-transx, -transy);
            gameArea.ctx.drawImage(this.image, 0, 0, this.width, this.height, gameArea.sizeMultiplier*(this.x - gameArea.x), gameArea.sizeMultiplier*(this.y - gameArea.y)-(gameArea.sizeMultiplier-1)*gameArea.canvas.height, gameArea.sizeMultiplier*this.width, gameArea.sizeMultiplier*this.height);
            gameArea.ctx.restore();
        }
        */
    },
}
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
//** E N E M I E S **\\ //** E N E M I E S **\\ //** E N E M I E S **\\ //** E N E M I E S **\\
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
var enemies = {
    slime : null,
    wakka : null,
    new : function(){
        this.slime = document.getElementById("slimeCheckBox").checked;
        this.wakka = document.getElementById("wakkaCheckBox").checked;
        if(this.slime){
            slime.initialSetup();
        }
        if(this.wakka){
            for(i = -100; i < 50; i++){
                wakka.new(i*50*(Math.random() + 1), 0, 50, 50, 20);
            }
        }
    },
    loop : function(){
        slime.updatePos();
        wakka.updatePos();
        dragoon.updatePos();
    },
    draw : function(){
        slime.draw();
        wakka.draw();
        dragoon.draw();
    },
}
function healthBar(x, y, health, maxHealth, maxWidth){
    if(ui.showUi){
        gameArea.drawLine(x - maxHealth/2, y-3, x - maxHealth/2 + health, y-3, "green");
        gameArea.drawLine(x - maxHealth/2 + health, y-3, x + maxHealth/2, y-3, "red");
    }
}
var enemyCollision = {
    x : [],
    y : [], 
    width : [],
    height : [],
    state : [],
    enemy : [],
    arrayPosition : [],
    lastHitTime : [],
    alive : [],
}
var template = {
    xveloc : [],
    health : [],
    maxHealth : [],
    x : [], 
    y : [], 
    xveloc : [], 
    yveloc : [], 
    width : [],
    height : [],
    gravity : 0.2, 
    animationFrame : [],
    onGround : [],
    platformpullxveloc : [],
    image : [],
    hurtImage : [],
    state : [],
    arrayPosition : [],
    new : function(x, y, width, height){
        
    },
    updatePos : function(){
        
    }, 
    draw : function(){
        
    },
    objectStandingCheck : function(){
        for(h = 0; h < this.x.length; h++){
            if(this.health[h] > 0){
                var notOnGroundCount = 0;
                for(i = 0; i < collisionObjects.rectX.length; i++){
                    if(this.x[h] + this.width[h] > collisionObjects.rectX[i] && this.x[h] < collisionObjects.rectX[i] + collisionObjects.rectWidth[i] && this.y[h] + this.height[h] > collisionObjects.rectY[i]){
                        if(this.yveloc[h] > 0 && this.y[h] + this.height[h] + this.yveloc[h] < collisionObjects.rectY[i] + collisionObjects.rectHeight[i] + 10){
                            this.y[h] = collisionObjects.rectY[i] - this.height[h];
                            this.onGround[h] = true;
                            this.yveloc[h] = 0;
                            this.platformpullxveloc[h] = collisionObjects.rectXVeloc[i];
                        }
                        else{
                            notOnGroundCount++;
                        }
                    }
                    else{
                        notOnGroundCount++;
                    }
                }
                if(notOnGroundCount == collisionObjects.rectX.length){
                    this.onGround[h] = false;
                }
            }
        }
    },
    hurt : function(h, damage){
        
    },
}
var slime = {
    health : [],
    maxHealth : [],
    x : [], 
    y : [], 
    xveloc : [], 
    yveloc : [], 
    width : [],
    height : [],
    gravity : [], 
    animationFrame : [],
    onGround : [],
    platformpullxveloc : [],
    image : [],
    hurtImage : [],
    state : [],
    killCount : 0,
    arrayPosition : [],
    initialSetup : function(){
        for(i = 0; i < 100; i++){
            this.new(Math.random() * gameArea.canvas.width, 10, 16*(Math.random() + 0.5))
        }
    },
    new : function(x, y, width){
        var image = new Image();
        image.src = "images/enemies/slime/slime.png"
        var hurtImage = new Image();
        hurtImage.src = "images/enemies/slime/hurtSlime.png";
        this.image.push(image); 
        this.hurtImage.push(hurtImage);
        this.x.push(x);
        this.y.push(y);
        this.xveloc.push(0);
        this.yveloc.push(0);
        this.width.push(width);
        this.height.push(this.width[this.width.length-1]);
        this.gravity.push(0.2);
        this.animationFrame.push(0);

        this.state.push(0);
        this.maxHealth.push(this.width[this.width.length-1]/2);
        this.health.push(this.width[this.width.length-1]/2);
        enemyCollision.arrayPosition.push(this.x.length - 1); 
        this.arrayPosition.push(enemyCollision.arrayPosition.length - 1);
        enemyCollision.state.push("none");
        enemyCollision.enemy.push("slime");
        enemyCollision.lastHitTime.push(gameArea.time);
        enemyCollision.alive.push(true);
    },
    updatePos : function(){
        this.slimeMovement();
        for(i = 0; i < this.x.length; i++){
            if(this.health[i] > 0){
                if(this.health[i] > 2*this.maxHealth[i]/3){
                    this.animationFrame[i] = 0;
                }
                else if(this.health[i] > this.maxHealth[i]/3){
                    this.animationFrame[i] = 1;
                }
                else{
                    this.animationFrame[i] = 2;
                }
                this.x[i] += this.xveloc[i];
                this.y[i] += this.yveloc[i]; 
                this.yveloc[i] += this.gravity[i]; 
                if(gameArea.time - enemyCollision.lastHitTime[this.arrayPosition[i]] >= 20 && this.state[i] == 1){
                    this.state[i] = 0;
                }
            }
            enemyCollision.x[this.arrayPosition[i]] = this.x[i];
            enemyCollision.y[this.arrayPosition[i]] = this.y[i];
            enemyCollision.width[this.arrayPosition[i]] = this.width[i];
            enemyCollision.height[this.arrayPosition[i]] = this.height[i];
        }

        this.objectStandingCheck();
    },
    draw : function(){
        for(i = 0; i < this.x.length; i++){
            if(this.health[i] >= 0){
                healthBar(this.x[i] + this.width[i]/2, this.y[i], this.health[i], this.maxHealth[i], this.width[i] + 4);
                switch(this.state[i]){
                    case 0:
                        gameArea.drawImage(this.image[i], 0, 0, 16, 16, this.x[i], this.y[i], this.width[i], this.height[i]);
                        break;
                    case 1:
                        gameArea.drawImage(this.hurtImage[i], 0, 0, 16, 16, this.x[i], this.y[i], this.width[i], this.height[i]);   
                        break;
                    case 2: 
                        gameArea.drawImage(this.hurtImage[i], this.animationFrame[i] * this.modelWidth, 0, this.modelWidth, this.modelHeight, this.x[i], this.y[i], this.width[i], this.height[i]);
                        break;
                }
            }
        }
    },
    objectStandingCheck : function(){
        for(h = 0; h < this.x.length; h++){
            if(this.health[h] > 0){
                var notOnGroundCount = 0;
                for(i = 0; i < collisionObjects.rectX.length; i++){
                    if(this.x[h] + this.width[h] > collisionObjects.rectX[i] && this.x[h] < collisionObjects.rectX[i] + collisionObjects.rectWidth[i] && this.y[h] + this.height[h] > collisionObjects.rectY[i]){
                        if(this.yveloc[h] > 0 && this.y[h] + this.height[h] + this.yveloc[h] < collisionObjects.rectY[i] + collisionObjects.rectHeight[i] + 10){
                            this.y[h] = collisionObjects.rectY[i] - this.height[h];
                            this.onGround[h] = true;
                            this.yveloc[h] = 0;
                            this.platformpullxveloc[h] = collisionObjects.rectXVeloc[i];
                        }
                        else{
                            notOnGroundCount++;
                        }
                    }
                    else{
                        notOnGroundCount++;
                    }
                }
                if(notOnGroundCount == collisionObjects.rectX.length){
                    this.onGround[h] = false;
                }
            }
        }
    },
    hurt : function(h, damage){
        var i = enemyCollision.arrayPosition[h];
        if(this.state[i] != 2){
            this.health[i] -= damage;
        }
        this.state[i] = 1;
        if(this.health[i] <= 0){
            this.state[i] = 2;
            enemyCollision.alive[this.arrayPosition[i]] = false;
        }
    },
    slimeMovement : function(){
        for(i = 0; i < this.x.length; i++){
            if(Math.random() > 0.6 && this.onGround[i]){
                this.xveloc[i] = 3 * (Math.random() - 0.5);
                this.yveloc[i] = 0; //Get rid of this for different style of jumping
                this.gravity[i] = Math.random() * -2.6;
                setTimeout(function(i){
                    slime.gravity[i] = 0.2;
                }, 20, i);
            }
            if(this.state[i] == 2){
                var deathAnimationTime = 200;
                this.width[i] -= this.width[i]/(deathAnimationTime / 20);
                this.x[i] += this.width[i]/(deathAnimationTime / 10);
                this.height[i] -= this.height[i]/(deathAnimationTime / 20);
                this.y[i] += this.height[i]/(deathAnimationTime / 20);
            }
        }
    }
}
var wakka = {
    health : [],
    maxHealth : [],
    x : [], 
    y : [], 
    xveloc : [], 
    yveloc : [], 
    platformpullxveloc : [],
    width : [],
    height : [],
    gravity : 0.2, 
    animationFrameHead : [],
    animationFrameLegs : [],
    onGround : [],
    platformpullxveloc : [],
    image : [],
    hurtImage : [],
    state : [],
    arrayPosition : [],
    arrayPositionCollision : [],
    new : function(x, y, width, height, health){ //TODO: Make a initialSetup and get rid of images
        var image = new Image();
        image.src = "images/enemies/wakka/wakka.png"
        var hurtImage = new Image();
        hurtImage.src = "images/enemies/wakka/wakka.png";
        this.image.push(image); 
        this.hurtImage.push(hurtImage);
        this.x.push(x);
        this.y.push(y);
        this.xveloc.push(0);
        this.yveloc.push(0);
        this.platformpullxveloc.push(0);
        this.width.push(width);
        this.height.push(height);
        this.animationFrameHead.push(0);
        this.animationFrameLegs.push(0);
        this.state.push("none");
        this.maxHealth.push(health);
        this.health.push(this.maxHealth[this.maxHealth.length-1]);
        enemyCollision.arrayPosition.push(this.x.length - 1); 
        this.arrayPosition.push(enemyCollision.arrayPosition.length - 1);
        enemyCollision.state.push("none");
        enemyCollision.enemy.push("wakka");
        enemyCollision.lastHitTime.push(gameArea.time);
        enemyCollision.alive.push(true);
        
        collisionObjects.rectX.push(this.x[i]);
        collisionObjects.rectY.push(this.y[i]);
        collisionObjects.rectWidth.push(this.width[i]);
        collisionObjects.rectHeight.push(this.height[i]);
        collisionObjects.rectXVeloc.push(this.xveloc[i]);
        collisionObjects.rectTransparency.push(false);
        this.arrayPositionCollision.push(collisionObjects.rectX.length - 1);
    },
    updatePos : function(){
        this.objectStandingCheck();
        this.updateAnimations();
        for(i = 0; i < this.x.length; i++){
            if(this.health[i] > 0){
                if(this.health[i] > 2*this.maxHealth[i]/3){
                    this.animationFrameHead[i] = 0;
                }
                else if(this.health[i] > this.maxHealth[i]/3){
                    this.animationFrameHead[i] = 1;
                }
                else{
                    this.animationFrameHead[i] = 2;
                }
                this.x[i] += this.xveloc[i] + this.platformpullxveloc[i];
                this.y[i] += this.yveloc[i]; 
                this.yveloc[i] += this.gravity; 
            }
            enemyCollision.x[this.arrayPosition[i]] = this.x[i];
            enemyCollision.y[this.arrayPosition[i]] = this.y[i];
            enemyCollision.width[this.arrayPosition[i]] = this.width[i];
            enemyCollision.height[this.arrayPosition[i]] = this.height[i];
            
            collisionObjects.rectX[this.arrayPositionCollision[i]] = this.x[i];
            collisionObjects.rectY[this.arrayPositionCollision[i]] = this.y[i];
            collisionObjects.rectWidth[this.arrayPositionCollision[i]] = this.width[i];
            collisionObjects.rectHeight[this.arrayPositionCollision[i]] = this.height[i];
            collisionObjects.rectXVeloc[this.arrayPositionCollision[i]] = this.xveloc[i];
            
            if(this.health[i] <= 0){
                collisionObjects.rectX[this.arrayPositionCollision[i]] = -100000;
                collisionObjects.rectY[this.arrayPositionCollision[i]] = 100000;
                collisionObjects.rectWidth[this.arrayPositionCollision[i]] = 0;
                collisionObjects.rectHeight[this.arrayPositionCollision[i]] = 0;
            }
        }
    }, 
    updateAnimations : function(){
        for(i = 0; i < this.x.length; i++){
            if(this.xveloc[i] != 0){
                this.animationFrameLegs[i] = Math.round(2*Math.random());
            }
        }
    },
    draw : function(){
        for(i = 0; i < this.x.length; i++){
            if(this.health[i] > 0){
                healthBar(this.x[i] + this.width[i]/2, this.y[i], this.health[i], this.maxHealth[i], this.width[i] + 4);
                switch(this.state[i]){
                    case "none":
                        gameArea.drawImage(this.image[i], this.animationFrameHead[i]*32, 0, 32, 32, this.x[i], this.y[i], this.width[i], this.height[i]);
                        gameArea.drawImage(this.image[i], this.animationFrameLegs[i]*32, 32, 32, 32, this.x[i], this.y[i], this.width[i], this.height[i]);
                        break;
                }
            }
        }
    },
    objectStandingCheck : function(){
        for(h = 0; h < this.x.length; h++){
            if(this.health[h] > 0){
                var notOnGroundCount = 0;
                for(i = 0; i < collisionObjects.rectX.length; i++){
                    if(this.x[h] + this.width[h] - this.width[h]*(7/32) > collisionObjects.rectX[i] && this.x[h] + this.width[h]*(7/32) < collisionObjects.rectX[i] + collisionObjects.rectWidth[i] && this.y[h] + this.height[h] > collisionObjects.rectY[i] && i != this.arrayPositionCollision[h]){
                        if(this.yveloc[h] > 0 && this.y[h] + this.height[h] + this.yveloc[h] < collisionObjects.rectY[i] + collisionObjects.rectHeight[i] + 10){
                            this.y[h] = collisionObjects.rectY[i] - this.height[h];
                            this.onGround[h] = true;
                            this.yveloc[h] = 0;
                            this.platformpullxveloc[h] = collisionObjects.rectXVeloc[i];
                        }
                        else{
                            notOnGroundCount++;
                        }
                    }
                    else{
                        notOnGroundCount++;
                    }
                }
                if(notOnGroundCount == collisionObjects.rectX.length){
                    this.onGround[h] = false;
                }
            }
        }
    },
    hurt : function(h, damage){
        var i = enemyCollision.arrayPosition[h];
        this.health[i] -= damage;
        if(this.health[i] <= 0){
            enemyCollision.alive[this.arrayPosition[i]] = false;
        }
    },
}
var dragoon = {
    health : [],
    maxHealth : [],
    headX : [], 
    headY : [], 
    headXVeloc : [], 
    headYVeloc : [], 
    headWidth : [],
    headHeight : [],
    headAnimationFrame : [],
    headDirection : [],
    headImage : [],
    headArrayPosition : [],
    headState : [],
    headAngle : [],
    headAngleVeloc : [],
    state : [],
    initialSetup : function(){
        var headImage = new Image();
        headImage.src = "images/enemies/dragoon/head.png";
        this.headImage = headImage;
    },
    new : function(x, y, health){
        this.health.push(health);
        this.maxHealth.push(health);
        this.headX.push(x);
        this.headY.push(y);
        this.headXVeloc.push(0);
        this.headYVeloc.push(0);
        this.headWidth.push(80);
        this.headHeight.push(75);
        this.headAnimationFrame.push(0);
        this.headDirection.push(-1);
        this.headState.push("none");
        this.headAngle.push(-Math.PI/8);
        this.headAngleVeloc.push(Math.PI/3+Math.PI/1000);
        this.state.push("none");
        
        enemyCollision.arrayPosition.push(this.health.length-1);
        this.headArrayPosition.push(enemyCollision.arrayPosition.length-1);
        enemyCollision.state.push("none");
        enemyCollision.enemy.push("dragoon");
        enemyCollision.lastHitTime.push(gameArea.time);
        enemyCollision.alive.push(true);
    },
    updatePos : function(){
        this.updateAnimations();
        this.flameBreath();
        for(i = 0; i < this.health.length; i++){
            if(this.health[i] > 0){
                this.headX[i] += this.headXVeloc[i];
                this.headY[i] += this.headYVeloc[i]; 
                this.headAngle[i] += this.headAngleVeloc[i];
            }        
            enemyCollision.x[this.headArrayPosition[i]] = this.headX[i]+this.headWidth[i]/2-36; //Make this a circular hitbox, and also make something to block behind
            enemyCollision.y[this.headArrayPosition[i]] = this.headY[i]+this.headHeight[i]/2-6;
            enemyCollision.width[this.headArrayPosition[i]] = 32;
            enemyCollision.height[this.headArrayPosition[i]] = 32;
            if(this.state[i] == "none"){
                var rngRoll = Math.random();
                if(rngRoll > .98){
                    this.headState[i] = "fireBreathing";
                }
                if(rngRoll <= .01){
                    //this.explode();
                }
            }
        }

    }, 
    updateAnimations : function(){
    },
    draw : function(){
        for(i = 0; i < this.health.length; i++){
            if(this.state[i] != "ded"){
                healthBar(this.headX[i] + this.headWidth[i]/2, this.headY[i], this.health[i], this.maxHealth[i], this.headWidth[i] + 4);
                if(this.headAnimationFrame[i] == 0 || this.headAnimationFrame[i] == 1){
                    if(this.headDirection[i] == 1){
                        this.headAnimationFrame[i] = 0;
                    }
                    if(this.headDirection[i] == -1){
                        this.headAnimationFrame[i] = 1;
                    }
                }
//                gameArea.drawImage(this.headImage, this.headAnimationFrame[i]*79, 0, 79, 71, this.headX[i], this.headY[i], this.headWidth[i], this.headHeight[i]);
                var transx = gameArea.sizeMultiplier*(this.headX[i] - gameArea.x + this.headWidth[i]/2-20);
                var transy = gameArea.sizeMultiplier*(this.headY[i] - gameArea.y + this.headHeight[i]/2+10)-(gameArea.sizeMultiplier-1)*gameArea.canvas.height;

                if(gameArea.splitScreen){ //TODO: Make this a general function
                    if(this.headX[i] + this.headWidth[i] > gameArea.leftx && this.headX[i] < gameArea.leftx + (gameArea.canvas.width/2)/gameArea.sizeMultiplier){
                        transx = gameArea.sizeMultiplier*(this.headX[i] - gameArea.leftx + this.headWidth[i]/2);
                        gameArea.ctx.save();

                        gameArea.ctx.beginPath();
                        gameArea.ctx.rect(0, 0, gameArea.canvas.width/2, gameArea.canvas.height);
                        gameArea.ctx.clip();

                        gameArea.ctx.translate(transx, transy);
                        gameArea.ctx.rotate(this.headAngle[i]);
                        gameArea.ctx.translate(-transx, -transy);

                        gameArea.ctx.beginPath();
                        gameArea.ctx.drawImage(this.headImage, this.headAnimationFrame[i]*79, 0, 79, 71, gameArea.sizeMultiplier*(this.headX[i] - gameArea.leftx), gameArea.sizeMultiplier*(this.headY[i] - gameArea.lefty)-(gameArea.sizeMultiplier-1)*gameArea.canvas.height, gameArea.sizeMultiplier*this.headWidth[i], gameArea.sizeMultiplier*this.headHeight[i]);

                        gameArea.ctx.restore();
                    }
                    if(this.headX[i] + this.headWidth[i] > gameArea.rightx && this.headX[i] < gameArea.rightx + (gameArea.canvas.width/2)/gameArea.sizeMultiplier){ //TODO: Fix broken zoom code on right side
                        transx = gameArea.sizeMultiplier*(this.headX[i] - gameArea.rightx + gameArea.canvas.width/2 + this.headWidth[i]/2);
                        gameArea.ctx.save();

                        gameArea.ctx.beginPath();
                        gameArea.ctx.rect(gameArea.canvas.width/2, 0, gameArea.canvas.width/2, gameArea.canvas.height);
                        gameArea.ctx.clip();

                        gameArea.ctx.translate(transx, transy);
                        gameArea.ctx.rotate(this.headAngle[i]);
                        gameArea.ctx.translate(-transx, -transy);

                        gameArea.ctx.beginPath();
                        gameArea.ctx.drawImage(this.headImage, this.headAnimationFrame[i]*79, 0, 79, 71, gameArea.canvas.width/2 + gameArea.sizeMultiplier*(this.headX[i] - gameArea.rightx), gameArea.sizeMultiplier*(this.headY[i] - gameArea.righty)-(gameArea.sizeMultiplier-1)*gameArea.canvas.height, gameArea.sizeMultiplier*this.headWidth[i], gameArea.sizeMultiplier*this.headHeight[i]);

                        gameArea.ctx.restore();
                    }
                }
                else{
                    gameArea.ctx.save();
                    gameArea.ctx.translate(transx, transy);
                    gameArea.ctx.rotate(this.headAngle[i]);
                    gameArea.ctx.translate(-transx, -transy);
                    gameArea.ctx.drawImage(this.headImage, this.headAnimationFrame[i]*79, 0, 79, 71, gameArea.sizeMultiplier*(this.headX[i] - gameArea.x), gameArea.sizeMultiplier*(this.headY[i] - gameArea.y)-(gameArea.sizeMultiplier-1)*gameArea.canvas.height, gameArea.sizeMultiplier*this.headWidth[i], gameArea.sizeMultiplier*this.headHeight[i]);
                    gameArea.ctx.restore();
                    
                    gameArea.drawCirc(this.headX[i] + this.headWidth[i]/2-20, this.headY[i]+10 + this.headHeight[i]/2, 1, colors.black)
                    gameArea.drawCirc(this.headX[i] + this.headWidth[i]/2-20, this.headY[i]+10 + this.headHeight[i]/2, 16, colors.black)
                }
            }
        }
    },
    hurt : function(h, damage){
        var i = enemyCollision.arrayPosition[h];
        this.health[i] -= damage;
        if(this.health[i] <= 0){
            enemyCollision.alive[this.headArrayPosition[i]] = false;
            this.state[i] = "ded";
        }
    },
    flameBreath : function(){
        for(var i = 0; i < this.health.length; i++){
            if(this.headState[i] == "fireBreathing" && this.state[i] != "ded"){
                for(var h = 0; h < 5; h++){
                    fireball.new(this.headX[i]+this.headWidth[i]/2-20, this.headY[i] + this.headHeight[i]/2+10, Math.cos(-this.headAngle[i])*(3+1*Math.random()), Math.sin(-this.headAngle[i])*(2+1*Math.random()), 0, 4, 0.05, 0);
                    //fireball.new(this.headX[i]+this.headWidth[i]/2-20, this.headY[i] + this.headHeight[i]/2+10, Math.cos(-this.headAngle[i])*3, Math.sin(-this.headAngle[i])*(2), 0, 4, 0.05, 0);
                    fireball.release(0, this.headDirection[i]);
                }
            }
        }
    }, 
    explode : function(){
        for(i = 0; i < this.health.length; i++){
            for(h = 0; h < fireball.x.length; h++){
                if(fireball.owner[h] == 0){
                    fireball.explode(h);
                }
            }
            if(this.headState[i] == "fireBreathing"){
                this.headState[i] = "none";
            }
        }
    }
}
