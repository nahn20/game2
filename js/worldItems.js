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