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
    fireballs : [],
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
        for(i = 0; i < this.fireballs.length; i++){
            this.fireballs[i].loop();
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
        for(i = 0; i < this.health.length; i++){
            if(this.headState[i] == "fireBreathing" && this.state[i] != "ded"){
                for(h = 0; h < 5; h++){
                    this.fireballs[this.fireballs.length] = new fireball(this.headX[i]+this.headWidth[i]/2-20, this.headY[i] + this.headHeight[i]/2+10, Math.cos(-this.headAngle[i])*(3+1*Math.random()), Math.sin(-this.headAngle[i])*(2+1*Math.random()), 0, 4, 0.05, 0);
                    //this.fireballs[this.fireballs.length] = new fireball(this.headX[i]+this.headWidth[i]/2-20, this.headY[i] + this.headHeight[i]/2+10, Math.cos(-this.headAngle[i])*3, Math.sin(-this.headAngle[i])*(2), 0, 4, 0.05, 0);
                    this.fireballs[this.fireballs.length-1].release(this.headDirection[i]);
                }
            }
        }
    }, 
    explode : function(){
        for(i = 0; i < this.health.length; i++){
            for(h = 0; h < this.fireballs.length; h++){
                this.fireballs[h].explode();
            }
            if(this.headState[i] == "fireBreathing"){
                this.headState[i] = "none";
            }
        }
    }
}