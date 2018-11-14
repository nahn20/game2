function shurikens(x, y, xveloc, yveloc, width, power, owner, theta, thetaVeloc){
    this.x = x;
    this.y = y;
    this.xveloc = xveloc;
    this.yveloc = yveloc;
    this.turnedDegrees = 0;
    this.width = width;
    this.height = width;
    this.power = power;
    this.owner = owner;
    this.lastHitTime = gameArea.time;
    this.theta = theta;
    this.thetaVeloc = thetaVeloc;
    this.image = new Image();
    this.image.src = "images/shuriken.png";
    this.loop = function(){
        this.updatePos();
        this.draw();
        this.damageCheck();
    }
    this.updatePos = function(){
        this.damageCheck();
        if(this.theta == null && !(this.xveloc == 0 && this.yveloc == 0)){
            this.x += this.xveloc;
            this.y += this.yveloc;
        }
        else if(!(this.xveloc == 0 && this.yveloc == 0)){
            var xOrigin = 0;
            var yOrigin = 0; 
            var extension = 0;
            if(this.owner == 1){
                xOrigin = player1.x + player1.width/2;
                yOrigin = player1.y + player1.height/2;
                extension = player1.width;
            }
            if(this.owner == 2){
                xOrigin = player2.x + player2.width/2;
                yOrigin = player2.y + player2.height/2;
                extension = player2.height;
            }
            this.x = xOrigin + (extension + this.xveloc) * Math.cos(this.theta);
            this.y = yOrigin + (extension + this.yveloc) * Math.sin(this.theta);
            this.theta += this.thetaVeloc;
        }
    }
    this.draw = function(){
        if(!(this.xveloc == 0 && this.yveloc == 0)){
            if(gameArea.splitScreen){
                if(this.x + this.width/2 > gameArea.leftx && this.x < gameArea.leftx + (gameArea.canvas.width/2)/gameArea.sizeMultiplier){
                    gameArea.ctx.save();
                        gameArea.ctx.translate(((this.x-gameArea.sizeMultiplier*gameArea.leftx+1)-(gameArea.sizeMultiplier-1)), ((this.y-gameArea.y+1)-(gameArea.sizeMultiplier-1)));
                        this.turnedDegrees += Math.PI/3;
                        gameArea.ctx.translate(-((this.x-gameArea.sizeMultiplier*gameArea.leftx+1)-(gameArea.sizeMultiplier-1)), -((this.y-gameArea.y+1)-(gameArea.sizeMultiplier-1)));
                        gameArea.drawImage(this.image, 0, 0, 16, 16, this.x-this.width/2, this.y-this.height/2, this.width, this.height);
                    gameArea.ctx.restore();
                }
                if(this.x + this.width/2 > gameArea.rightx && this.x < gameArea.rightx + (gameArea.canvas.width/2)/gameArea.sizeMultiplier){
                    gameArea.ctx.save();
                        gameArea.ctx.translate(((this.x-gameArea.sizeMultiplier*gameArea.rightx+1)-(gameArea.sizeMultiplier-1)), ((this.y-gameArea.y+1)-(gameArea.sizeMultiplier-1)));
                        this.turnedDegrees += Math.PI/3;
                        gameArea.ctx.translate(-((this.x-gameArea.sizeMultiplier*gameArea.rightx+1)-(gameArea.sizeMultiplier-1)), -((this.y-gameArea.y+1)-(gameArea.sizeMultiplier-1)));
                        gameArea.drawImage(this.image, 0, 0, 16, 16, this.x-this.width/2, this.y-this.height/2, this.width, this.height);
                    gameArea.ctx.restore();

                }
            }
            else{
                gameArea.ctx.save();
                    gameArea.ctx.translate(((this.x-gameArea.sizeMultiplier*gameArea.x+1)-(gameArea.sizeMultiplier-1)), ((this.y-gameArea.y+1)-(gameArea.sizeMultiplier-1)));
                    this.turnedDegrees += Math.PI/3;
                    gameArea.ctx.translate(-((this.x-gameArea.sizeMultiplier*gameArea.x+1)-(gameArea.sizeMultiplier-1)), -((this.y-gameArea.y+1)-(gameArea.sizeMultiplier-1)));
                    gameArea.drawImage(this.image, 0, 0, 16, 16, this.x-this.width/2, this.y-this.height/2, this.width, this.height);
                gameArea.ctx.restore();
            }
        }
    }
    this.damageCheck = function(){
        if(this.xveloc != 0 || this.yveloc != 0){
            if(gameArea.time - this.lastHitTime >= gameArea.lastHitValue){
                for(h = 0; h < enemyCollision.x.length; h++){
                    if(enemyCollision.x[h] + enemyCollision.width[h] > this.x && enemyCollision.x[h] < this.x + this.width && enemyCollision.y[h] + enemyCollision.height[h] > this.y && enemyCollision.y[h] < this.y + this.height && enemyCollision.alive[h] == true){
                        enemyCollision.lastHitTime[h] = gameArea.time;
                        this.onDamageSelfEffect(i);
                        switch(enemyCollision.enemy[h]){
                            case "slime":
                                slime.hurt(h, this.power);
                                break;
                            case "wakka":
                                wakka.hurt(h, this.power);
                                break;
                            case "dragoon":
                                dragoon.hurt(h, this.power);
                                break;
                            default:
                                ui.testVar("DECLARE ENEMY TYPE REEEEEEE");
                                break;
                        }
                    }
                }
                // for(h = 0; h < fireball.x.length; h++){ //Fireabll detection
                //     if(fireball.x[h] + fireball.radius[h] > this.x && fireball.x[h] - fireball.radius[h] < this.x + this.width && fireball.y[h] + fireball.radius[h] > this.y && fireball.y[h] - fireball.radius[h] < this.y + this.height && fireball.state[h] != "hold" && fireball.state[h] != "boom" && fireball.state[h] != "kapow"){
                //         if(gameArea.pvp || fireball.owner[h] == 0){
                //             fireball.state[h] = "kapow";
                //             this.onDamageSelfEffect(i);
                //         }
                //         this.power += fireball.power[h];
                //     }
                // }
                for(h = 0; h < collisionObjects.rectX.length; h++){
                    if(this.x + this.width > collisionObjects.rectX[h] && this.x < collisionObjects.rectX[h] + collisionObjects.rectWidth[h] && this.y + this.height > collisionObjects.rectY[h] && this.y < collisionObjects.rectY[h] + collisionObjects.rectHeight[h] && !collisionObjects.rectTransparency[h]){
                        this.xveloc = 0;
                        this.yveloc = 0;
                    }
                }
                if(gameArea.pvp){
                    switch(this.owner){
                        case 1: 
                            if(player2.x + player2.width > this.x && player2.x < this.x + this.width && player2.y + player2.height > this.y && player2.y < this.y + this.height){
                                this.onDamageSelfEffect(i);
                                player2.lastHitTime = gameArea.time;
                                player2.health -= this.power;
                            }
                            for(h = 0; h < player2.fireballs.length; h++){
                                if(player2.fireballs[h].x + player2.fireballs[h].radius > this.x && player2.fireballs[h].x - player2.fireballs[h].radius < this.x + this.width && player2.fireballs[h].y + player2.fireballs[h].radius > this.y && player2.fireballs[h].y - player2.fireballs[h].radius < this.y + this.height && player2.fireballs[h].state != "hold" && player2.fireballs[h].state != "boom" && player2.fireballs[h].state != "kapow"){
                                    player2.fireballs[h].state = "kapow";
                                    this.onDamageSelfEffect();
                                }
                            }
                            break;
                        case 2: 
                            if(player1.x + player1.width > this.x && player1.x < this.x + this.width && player1.y + player1.height > this.y && player1.y < this.y + this.height){
                                this.onDamageSelfEffect(i);
                                player1.lastHitTime = gameArea.time;
                                player1.health -= this.power;
                            }
                            for(h = 0; h < player1.fireballs.length; h++){
                                if(player1.fireballs[h].x + player1.fireballs[h].radius > this.x && player1.fireballs[h].x - player1.fireballs[h].radius < this.x + this.width && player1.fireballs[h].y + player1.fireballs[h].radius > this.y && player1.fireballs[h].y - player1.fireballs[h].radius < this.y + this.height && player1.fireballs[h].state != "hold" && player1.fireballs[h].state != "boom" && player1.fireballs[h].state != "kapow"){
                                    player2.fireballs[h].state = "kapow";
                                    this.onDamageSelfEffect();
                                }
                            }
                            break;
                    }
                }
                for(h = 0; h < collisionObjects.triX1.length; h++){ 
                    if(this.x + this.width > collisionObjects.triX1[h] && this.x < collisionObjects.triX3[h] && this.y + this.height > ((collisionObjects.triY3[h]-collisionObjects.triY1[h])/(collisionObjects.triX3[h]-collisionObjects.triX1[h]))*(this.x-collisionObjects.triX1[h]) + collisionObjects.triY1[h] && this.y <= collisionObjects.triY1[h]){
                        this.xveloc = 0;
                        this.yveloc = 0;
                    }
                    else if(this.x + this.width > collisionObjects.triX3[h] && this.x < collisionObjects.triX2[h] && this.y + this.height > ((collisionObjects.triY3[h]-collisionObjects.triY2[h])/(collisionObjects.triX3[h]-collisionObjects.triX2[h]))*(this.x-collisionObjects.triX2[h]) + collisionObjects.triY2[h] && this.y <= collisionObjects.triY2[h]){
                        this.xveloc = 0;
                        this.yveloc = 0;
                    }
                }
            }
        }
    }
    this.onDamageSelfEffect = function(i){
        if(this.theta == null){
            if(this.xveloc > 5){
                this.xveloc -= 5;
            }
            else if(this.xveloc > 0){
                this.xveloc = 0;
                this.yveloc = 0;
            }
        }
        else{
            if(this.xveloc > 0){
                this.xveloc -= 5;
            }
            if(this.yveloc > 0){
                this.yveloc -= 5;
            }
            if(this.xveloc < 0){
                this.xveloc = 0;
                this.yveloc = 0;
            }
        }
        this.lastHitTime = gameArea.time;
    }
}
function fireball(x, y, xveloc, yveloc, owner, radius, power, manaRegen){
    this.x = x;
    this.y = y;
    this.xveloc = xveloc;
    this.yveloc = yveloc;
    this.radius = radius;
    this.state = "hold";
    this.owner = owner;
    this.animationFrame = 0;
    this.lastAnimationTime = gameArea.time;
    this.power = power;
    this.manaRegen = manaRegen;
    this.radiusVeloc = 0;
    this.lastHitTime = gameArea.time;
    this.image = new Image();
    this.image.src="images/fireball.png";
    // this.new = function(x, y, xveloc, yveloc, owner, radius, power, manaRegen){
    //     var notBoomCount = 0;
    //     var q = this.x.length
    //     var h = false;
    //     for(i = 0; i < q; i++){
    //         if(this.state == "boom" && h == false){
    //             this.x = x;
    //             this.y = y;
    //             this.xveloc = xveloc;
    //             this.yveloc = yveloc;
    //             this.radius = radius;
    //             this.state = "hold";
    //             this.owner = owner;
    //             this.animationFrame = 0;
    //             this.lastAnimationTime = gameArea.time;
    //             this.power = power;
    //             this.manaRegen = manaRegen;
    //             this.radiusVeloc = 0;
    //             this.lastHitTime = gameArea.time;
    //             h = true;
    //         }
    //         else{
    //             notBoomCount++;
    //         }
    //     }
    //     if(notBoomCount == q){
    //         this.x.push(x);
    //         this.y.push(y);
    //         this.xveloc.push(xveloc);
    //         this.yveloc.push(yveloc);
    //         this.radius.push(radius);
    //         this.state.push("hold");
    //         this.owner.push(owner);
    //         this.animationFrame.push(0);
    //         this.lastAnimationTime.push(gameArea.time);
    //         this.power.push(power);
    //         this.manaRegen.push(manaRegen);
    //         this.radiusVeloc.push(0);
    //         this.lastHitTime.push(gameArea.time);
    //     }
    // }
    this.loop = function(){
        this.updatePos();
        this.draw();
        this.damageCheck();
    }
    this.updatePos = function(){
        this.damageCheck();
        this.radius += this.radiusVeloc;
        if(this.state == "hold"){
            if(this.radius < 5){
                this.radius += 0.1;
            }
            switch(this.owner){
                case 1:
                    this.x = player1.x + player1.width/2;
                    switch(player1.character){
                        case "mage":
                            this.y = player1.y - this.radius;
                            break;
                        case "archer":
                            this.y = player1.y + 9;
                            break;
                    }
                    break;
                case 2:
                    this.x = player2.x + player2.width/2;
                    switch(player2.character){
                        case "mage":
                            this.y = player2.y - this.radius; 
                            break;
                        case "archer":
                            this.y = player2.y + 9;
                            break;
                    }
                    break;
            }
        }
        if(this.state == "none"){
            if(gameArea.time - this.lastHitTime > 40000){
                this.state = "boom";
            }
        }
        if(this.state != "boom" && this.state != "hold" && this.state != "kapow"){
            this.x += this.xveloc;
            this.y += this.yveloc;
        }
        if(gameArea.time - this.lastAnimationTime > 20 + 200*Math.random()){
            switch(this.animationFrame){
                case 3:
                    this.animationFrame = 0;
                    break;
                default:
                    this.animationFrame++;
                    break;
            }
            this.lastAnimationTime = gameArea.time;
        }
        if(this.state == "kapow"){
            if(this.power > 0.2){
                this.power -= 0.05;
            }
            if(this.radius > 0){
                this.radiusVeloc -= 0.008;
            }
            else{
                this.state = "boom";
            }
        }
    }
    this.draw = function(){
        if(this.state != "boom"){ //14*this.animationFrame
            gameArea.drawImage(this.image, 14*this.animationFrame, 0, 14, 14, this.x-this.radius, this.y-this.radius, 2*this.radius, 2*this.radius);
        }
    }
    this.release = function(direction){
        if(this.state == "hold"){
            this.state = "none";
            this.xveloc = this.xveloc*direction;
        }
    }
    this.damageCheck = function(){
        if(this.state != "hold" && this.state != "boom"){
            if(gameArea.time - this.lastHitTime >= gameArea.lastHitValue){
                for(h = 0; h < enemyCollision.x.length && this.owner != 0; h++){
                    if(enemyCollision.x[h] + enemyCollision.width[h] > this.x - this.radius && enemyCollision.x[h] < this.x + this.radius && enemyCollision.y[h] + enemyCollision.height[h] > this.y - this.radius && enemyCollision.y[h] < this.y + this.radius && enemyCollision.alive[h] == true){
                        enemyCollision.lastHitTime[h] = gameArea.time;
                        this.onDamageSelfEffect(i);
                        switch(enemyCollision.enemy[h]){
                            case "slime":
                                slime.hurt(h, this.power);
                                break;
                            case "wakka":
                                wakka.hurt(h, this.power);
                                break;
                            case "dragoon":
                                dragoon.hurt(h, this.power);
                                break;
                            default:
                                ui.testVar("DECLARE ENEMY TYPE REEEEEEE");
                                break;
                        }
                    }
                }
                if(this.owner == 1 && gameArea.pvp || this.owner == 0){
                    if(player2.x + player2.width > this.x - this.radius && player2.x < this.x + this.radius && player2.y + player2.height > this.y - this.radius && player2.y < this.y + this.radius){
                        player2.lastHitTime = gameArea.time;
                        this.onDamageSelfEffect(i);
                        player2.health -= this.power;
                    }
                }
                if(this.owner == 2 && gameArea.pvp || this.owner == 0){
                    if(player1.x + player1.width > this.x - this.radius && player1.x < this.x + this.radius && player1.y + player1.height > this.y - this.radius && player1.y < this.y + this.radius){
                        player1.lastHitTime = gameArea.time;
                        this.onDamageSelfEffect(i);
                        player1.health -= this.power;
                    }
                }
            }
            for(h = 0; h < collisionObjects.rectX.length; h++){
                if(this.x + this.radius > collisionObjects.rectX[h] && this.x - this.radius < collisionObjects.rectX[h] + collisionObjects.rectWidth[h] && this.y + this.radius > collisionObjects.rectY[h] && this.y - this.radius < collisionObjects.rectY[h] + collisionObjects.rectHeight[h] && !collisionObjects.rectTransparency[h]){
                    this.state = "kapow";
                    this.radius = this.radius/2;
                }
            }
            for(h = 0; h < collisionObjects.triX1.length; h++){ //TODO: Fix reflection code
                if(this.x + this.radius > collisionObjects.triX1[h] && this.x - this.radius < collisionObjects.triX3[h] && this.y + this.radius > ((collisionObjects.triY3[h]-collisionObjects.triY1[h])/(collisionObjects.triX3[h]-collisionObjects.triX1[h]))*(this.x-collisionObjects.triX1[h]) + collisionObjects.triY1[h] && this.y - this.radius <= collisionObjects.triY1[h]){
                    if(collisionObjects.reflectivity[h]){
                        var deltaX = Math.abs(collisionObjects.triX3[h]-collisionObjects.triX1[h]);
                        var deltaY = Math.abs(collisionObjects.triY3[h]-collisionObjects.triY1[h]);
                        var hypot = Math.sqrt(Math.pow(deltaX, 2)+Math.pow(deltaY, 2));
                        var velocTot = Math.sqrt(Math.pow(this.xveloc, 2)+Math.pow(this.yveloc, 2));

                        this.xveloc = -velocTot*Math.cos(Math.atan(deltaY/deltaX)+Math.atan(this.yveloc/this.xveloc));
                        this.yveloc = -velocTot*Math.sin(Math.atan(deltaY/deltaX)+Math.atan(this.yveloc/this.xveloc));
                    }
                    else{
                        this.state = "kapow";
                        this.radius = this.radius/2;
                    }
                }
                else if(this.x + this.radius > collisionObjects.triX3[h] && this.x - this.radius < collisionObjects.triX2[h] && this.y + this.radius > ((collisionObjects.triY3[h]-collisionObjects.triY2[h])/(collisionObjects.triX3[h]-collisionObjects.triX2[h]))*(this.x-collisionObjects.triX2[h]) + collisionObjects.triY2[h] && this.y - this.radius <= collisionObjects.triY2[h]){
                    if(collisionObjects.reflectivity[h]){
                        var deltaX = Math.abs(collisionObjects.triX3[h]-collisionObjects.triX2[h]);
                        var deltaY = Math.abs(collisionObjects.triY3[h]-collisionObjects.triY2[h]);
                        var hypot = Math.sqrt(Math.pow(deltaX, 2)+Math.pow(deltaY, 2));
                        var velocTot = Math.sqrt(Math.pow(this.xveloc, 2)+Math.pow(this.yveloc, 2));
                        
                        this.xveloc = -velocTot*Math.cos(Math.atan(deltaY/deltaX)+Math.atan(this.yveloc/this.xveloc));
                        this.yveloc = -velocTot*Math.sin(Math.atan(deltaY/deltaX)+Math.atan(this.yveloc/this.xveloc));
                    }
                    else{
                        this.state = "kapow";
                        this.radius = this.radius/2;
                    }
                }
            }
        }
    }
    this.onDamageSelfEffect = function(i){
        switch(this.owner){
            case 1:
                if(player1.mana <= player1.maxMana - this.manaRegen){
                    player1.mana += this.manaRegen;
                }
                break;
            case 2:
                if(player2.mana <= player2.maxMana - this.manaRegen){
                    player2.mana += this.manaRegen;
                }
                break;
        }
        if(Math.random() > .7){
            this.state = "kapow";
        }
        this.lastHitTime = gameArea.time;
    }
    this.explode = function(){
        if(this.state != "boom" && this.state != "kapow"){
            this.state = "kapow";
            this.radius += 5;
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