var worlds = {
    new : function(){
        this.worldBuilder = document.getElementById("worldBuilderCheckbox").checked;
        this.worldFileTestCheckBox = document.getElementById("worldFileTestCheckBox").checked;
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
        if(this.worldFileTestCheckBox){
            worldFileTestCheckBox.initialSetup();
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
var worldFileTestCheckBox = {
    initialSetup : function(){
        worlds.flatGround = true;
        loadMap(testMap.map, testMap.width, testMap.height, testMap.blockSize);
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