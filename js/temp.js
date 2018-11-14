function fireball(x, y, xveloc, yveloc, owner, radius, power, manaRegen){
    this.x = 0;
    this.y = 0;
    this.xveloc = 0;
    this.yveloc = 0;
    this.radius = 0;
    this.state = 0;
    this.owner = 0;
    this.animationFrame = 0;
    this.lastAnimationTime = 0;
    this.power = 0;
    this.manaRegen = 0;
    this.radiusVeloc = 0;
    this.lastHitTime = 0;
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
    this.release = function(owner, direction){
        if(this.owner == owner && this.state == "hold"){
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
    this.explode = function(i){
        if(fireball.state != "boom" && fireball.state != "kapow"){
            this.state = "kapow";
            this.radius += 5;
        }
    }
}