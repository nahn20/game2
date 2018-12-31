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
    this.shurikens = [];
    //MAGE STUFF\\
    this.fireballs = [];
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
        for(i = 0; i < this.shurikens.length; i++){
            this.shurikens[i].loop();
        }
        for(i = 0; i < this.fireballs.length; i++){
            this.fireballs[i].loop();
        }
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
        //this.objectCollisionCheck();
        this.xaccelSum = this.xaccel + this.xaccelCtrl;
        this.yaccelSum = this.yaccel + this.yaccelCtrl + this.gravity;
        this.xvelocBound += this.xaccelBound;
        this.xveloc += this.xaccelSum;
        this.yveloc += this.yaccelSum;
        this.xvelocSum = this.xveloc + this.xvelocCtrl + this.platformpullxveloc + this.xvelocBound;
        this.yvelocSum = this.yveloc + this.yvelocCtrl;
        // this.x += this.xvelocSum + this.xvelocBound;
        // this.y += this.yvelocSum;

        position = {
            x : this.x,
            y : this.y,
            width : this.width,
            height : this.height,
            xveloc : this.xvelocSum,
            yveloc : this.yvelocSum,
        }
        position = collisionCheck(position, 0);
        this.x = position.xf;
        this.y = position.yf;
        this.platformpullxveloc = position.platformXVeloc;
        this.onGround = position.onGround;
        if(this.onGround){
            this.jumpCount = 0;
            this.yveloc = 0;
        }
        switch(position.collisionType){
            case "hitCeiling":
                if(this.yveloc < 0){
                    this.yveloc = 0;
                }
                break;
            case "hitRight":
                if(this.xveloc > 0){
                    this.xveloc = 0;
                }
                if(this.xvelocCtrl > 0){
                    this.xvelocCtrl = 0;
                }
                break;
            case "hitLeft":
                if(this.xveloc < 0){
                    this.xveloc = 0;
                }
                if(this.xvelocCtrl < 0){
                    this.xvelocCtrl = 0;
                }
                break;
        }


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
        }
        if(gameArea.pvp){
            //this.updatePvp();
        }
    }
    this.objectCollisionCheck = function(){ //No longer in use
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
    this.findNoteworthyItems = function(){ //Generates an array of coordinates with weights for camera follow to use when adjusting size and position.
        ui.testVar(this.x)
        var objects = {
            x : [this.x + this.width/2],
            y : [this.y + this.height/2],
            weight : [1],
            screenSize : 3.6,
        }
        var idealSizeCounters = [0, 0, 0, 0, 0]; //In order from largest to smallest

        // if(this.playerNumber == 1){
        //     if(Math.abs((player2.x + player2.width/2)-(this.x + this.width/2)) < 100 && Math.abs((player2.y + player2.height/2)-(this.y + this.height/2)) < 50){
        //         objects.x[1] = player2.x + player2.width/2;
        //         objects.y[1] = player2.y + player2.height/2;
        //         objects.weight[1] = 0.2;
        //     }
        // }
        // if(this.playerNumber == 2){
        //     if(Math.abs((player1.x + player1.width/2)-(this.x + this.width/2)) < 100 && Math.abs((player1.y + player1.height/2)-(this.y + this.height/2)) < 50){
        //         objects.x[1] = player1.x + player1.width/2;
        //         objects.y[1] = player1.y + player1.height/2;
        //         objects.weight[1] = 0.2;
        //     }
        // }
        for(i = -1; i < enemyCollision.x.length; i++){
            var weightCount = 1;
            if(i == -1){
                if(this.playerNumber == 1){
                    var enemy = {deltaX : Math.abs(player2.x + player2.width/2 - (this.x + this.width/2)), deltaY : Math.abs(player2.y + player2.height/2 - (this.y + this.height/2))};
                }
                if(this.playerNumber == 2){
                    var enemy = {deltaX : Math.abs(player1.x + player1.width/2 - (this.x + this.width/2)), deltaY : Math.abs(player1.y + player1.height/2 - (this.y + this.height/2))};
                }
                weightCount = 1;
            }
            else{
                var enemy = {deltaX : Math.abs(enemyCollision.x[i] + enemyCollision.width[i]/2 - (this.x + this.width/2)), deltaY : Math.abs(enemyCollision.y[i] + enemyCollision.height[i]/2 - (this.y + this.height/2))}
            }
            if(enemy.deltaX < 950){
                if(enemy.deltaX > 600 || enemy.deltaY > 300){
                    idealSizeCounters[0] += weightCount;
                }
                else if(enemy.deltaX > 330 || enemy.deltaY > 165){
                    idealSizeCounters[1] += weightCount;
                }
                else if(enemy.deltaX > 220 || enemy.deltaY > 110){
                    idealSizeCounters[2] += weightCount;
                }
                else if(enemy.deltaX > 60 || enemy.deltaY > 30){
                    idealSizeCounters[3] += weightCount;
                }
                else{
                    idealSizeCounters[4] += weightCount;
                }
                
            }
        }
        var weightedHighest = 4;
        var totalEnemiesInRange = idealSizeCounters.reduce(function(a, b){return a + b;}, 0);
        for(i = weightedHighest-1; i >= 0; i--){
            if(idealSizeCounters[i] > idealSizeCounters[weightedHighest] + totalEnemiesInRange/8){
                weightedHighest = i;
            }
        }
        ui.testVar(weightedHighest)
        //var screenSizeTable = [0.3, 0.48, 0.85, 1.2, 3.6];
        var screenSizeTable = [1.2, 1.2, 1.2, 1.2, 3.6]
        objects.screenSize = screenSizeTable[weightedHighest];
        return objects;
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
                        var position = {
                            x : this.x,
                            y : this.y - 50,
                            width : this.width,
                            height : this.height,
                            xveloc : 0,
                            yveloc : 0,
                        }
                        if(!collisionCheck(position, 1)){
                            this.y -= 50;
                            this.mana -= 20/((gameArea.time - lastUseMap[this.controls[0]])/200);
                            lastUpMap[this.controls[0]] = gameArea.time + 200;
                            lastUseMap[this.controls[0]] = gameArea.time;
                            this.yveloc = -1.5;
                        }
                    }
                    else if(this.onGround){
                        this.jump();
                    }
                }
                if(keyMap[this.controls[1]] && gameArea.time - lastUpMap[this.controls[1]] < 200 && this.mana >= 10){
                    var position = {
                        x : this.x - 50,
                        y : this.y,
                        width : this.width,
                        height : this.height,
                        xveloc : 0,
                        yveloc : 0,
                    }
                    if(!collisionCheck(position, 1)){
                        this.x -= 50;
                        this.mana -= 10;
                    }
                    lastUpMap[this.controls[1]] = gameArea.time + 200;
                }
                if(keyMap[this.controls[2]] && gameArea.time - lastUpMap[this.controls[2]] < 200 && this.mana >= 10){
                    var position = {
                        x : this.x + 50,
                        y : this.y,
                        width : this.width,
                        height : this.height,
                        xveloc : 0,
                        yveloc : 0,
                    }
                    if(!collisionCheck(position, 1)){
                        this.x += 50;
                        this.mana -= 10;
                    }
                    lastUpMap[this.controls[2]] = gameArea.time + 200;
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
                    for(i = -1; i <= 1; i++){
                        this.shurikens[this.shurikens.length] = new shurikens(this.x + this.width/2, this.y + this.height/2, this.direction * 10, 1.6*i, width, power, this.playerNumber, null, null);
                    }
                }
                break;
            case "mage":
                if(keyMap[this.controls[4]] && gameArea.time - lastUseMap[this.controls[4]] >= this.cooldownNumberList[4] && this.state != "charging" && !keyMap[this.controls[5]] && !keyMap[this.controls[6]]){
                    lastUseMap[this.controls[4]] = gameArea.time;
                    this.fireballs[this.fireballs.length] = new fireball(this.x+this.width/2, this.y + this.height/2, 6, 0, this.playerNumber, 3, 0.5, 10);
                    this.fireballs[this.fireballs.length-1].release(this.direction);
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
                        this.shurikens[this.shurikens.length] = new shurikens(this.x + this.width/2, this.y + this.height/2, 10 * Math.cos(this.specialAngle), 10 * Math.sin(this.specialAngle), 8, .1, this.playerNumber, null, null);
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
                    for(i = 0; i < 50; i++){
                        this.fireballs[this.fireballs.length] = new fireball(this.x+this.width/2, this.y - this.height/6, 3+5*Math.random(), 5*(Math.random()-0.5), this.playerNumber, 0, .01, 0);
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
                    for(i = 0; i < this.fireballs.length; i++){
                        this.fireballs[i].release(this.direction);
                    }
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
                    for(i = 0; i < 5; i++){
                        this.fireballs[this.fireballs.length] = new fireball(this.x+this.width/2, this.y + this.height/4, 3+5*Math.random(), 5*(Math.random()-0.5), this.playerNumber, 4, 0.002, 0);
                        this.fireballs[this.fireballs.length-1].release(this.direction);
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
        }
    }
    this.downAttack = function(){
        switch(this.character){
            case "ninja":
                if(keyMap[this.controls[3]] && gameArea.time - lastUseMap[this.controls[3]] >= this.cooldownNumberList[3] && this.state != "charging" && this.state != "shrunk"){
                    lastUseMap[this.controls[3]] = gameArea.time;
                    for(i = 0; i < this.mana / 3; i++){
                        this.shurikens[this.shurikens.length] = new shurikens(this.x + this.width/2, this.y + this.height/2, 2+45*Math.random(), 2+48*Math.random(), 10, .1, this.playerNumber, 2*Math.random()*Math.PI, Math.PI/(20+20*Math.random()));
                        this.shurikens[this.shurikens.length] = new shurikens(this.x + this.width/2, this.y + this.height/2, 50, 50, 10, .01, this.playerNumber, 2*Math.random()*Math.PI, Math.PI/(200+20*Math.random()));
                        this.shurikens[this.shurikens.length] = new shurikens(this.x + this.width/2, this.y + this.height/2, 50, 50, 10, .01, this.playerNumber, 2*Math.random()*Math.PI, Math.PI/(200+20*Math.random()));
                    }
                }
                if(gameArea.time - lastUseMap[this.controls[3]] < 2000){
                    if(gameArea.time - lastUseMap[this.controls[3]] < 1500){
                        for(i = 0; i < this.shurikens.length; i++){
                            if(this.shurikens[i].theta != null && this.shurikens[i].owner == this.playerNumber && this.shurikens[i].thetaVeloc != 0){
                                this.shurikens[i].thetaVeloc += Math.PI/800;
                            }
                        }
                    }
                    var activeRotateCount = 0;
                    for(i = 0; i < this.shurikens.length; i++){
                        if(this.shurikens[i].theta != null && this.shurikens[i].owner == this.playerNumber && this.shurikens[i].thetaVeloc != 0){
                            activeRotateCount += 1;
                        }
                    }
                    this.mana -= activeRotateCount / 90;
                    if(this.mana < 0){
                        this.mana = 0;
                    }
                }
                if((gameArea.time - lastUseMap[this.controls[3]] > 2000 && gameArea.time - lastUseMap[this.controls[3]] < this.cooldownNumberList[3]) || (gameArea.time - lastUseMap[this.controls[3]] > 0 && gameArea.time - lastUseMap[this.controls[3]] < this.cooldownNumberList[3] && (!keyMap[this.controls[3]] || this.mana == 0))){
                    for(i = 0; i < this.shurikens.length; i++){
                        if(this.shurikens[i].theta != null && this.shurikens[i].owner == this.playerNumber && !(this.shurikens[i].xveloc == 0 && this.shurikens[i].yveloc == 0)){
                            this.shurikens[i].xveloc += 25;
                            this.shurikens[i].yveloc += 25;
                            this.shurikens[i].thetaVeloc = 0;
                        }
                    }
                }
                if(gameArea.time - lastUseMap[this.controls[3]] > this.cooldownNumberList[3] - 200 && gameArea.time - lastUseMap[this.controls[3]] < this.cooldownNumberList[3]){
                    for(i = 0; i < this.shurikens.length; i++){
                        if(this.shurikens[i].theta != null && this.shurikens[i].owner == this.playerNumber){
                            this.shurikens[i].xveloc = 0;
                            this.shurikens[i].yveloc = 0;
                        }
                    }
                }
                break;
            case "mage": // && this.state != "charging"
                if(keyMap[this.controls[3]] && gameArea.time - lastUseMap[this.controls[3]] > this.cooldownNumberList[3]){
                    lastUseMap[this.controls[3]] = gameArea.time;
                    for(i = 0; i < this.fireballs.length; i++){
                        this.fireballs[i].explode();
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
        }
    }
}