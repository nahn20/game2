function collisionCheck(pos, parameter){ //Requires x, y, width, height, xveloc, yveloc.
    pos.x1 = pos.x + pos.xveloc; //Note: looking into the future for everything
    pos.x2 = pos.x1 + pos.width;
    pos.y1 = pos.y + pos.yveloc;
    pos.y2 = pos.y1 + pos.height;
    //Parameter of 0: standard collision, created with player in mind
    //Parameter of 1: returns true or false, will collide or not
    if(parameter == 0){
        var position = {
            onGround : false,
            xf : pos.x1,
            yf : pos.y1,
            platformXVeloc : 0,
            collisionType : "null",
        }
        for(var i = 0; i < collisionObjects.rectX.length; i++){
            pos.x1o = pos.x; 
            pos.x2o = pos.x1o + pos.width;
            pos.y1o = pos.y;
            pos.y2o = pos.y1o + pos.height;
            pos.x2 = pos.x1 + pos.width;
            pos.y2 = pos.y1 + pos.height;
            var posObject = {
                x1 : collisionObjects.rectX[i],
                x2 : collisionObjects.rectX[i] + collisionObjects.rectWidth[i],
                y1 : collisionObjects.rectY[i],
                y2 : collisionObjects.rectY[i] + collisionObjects.rectHeight[i],
            }
            if(((pos.x2 >= posObject.x1 && pos.x2 <= posObject.x2) || (pos.x1 >= posObject.x1 && pos.x1 <= posObject.x2) || (posObject.x2 >= pos.x1 && posObject.x2 <= pos.x2) || (posObject.x1 >= pos.x1 && posObject.x2 <= pos.x2))
            && ((pos.y2 >= posObject.y1 && pos.y2 <= posObject.y2) || (pos.y1 >= posObject.y1 && pos.y1 <= posObject.y2) || (posObject.y2 >= pos.y1 && posObject.y2 <= pos.y2) || (posObject.y1 >= pos.y1 && posObject.y2 <= pos.y2))
            ){ //If the two objects are going to collide
                var currentCollide = {
                    x : false,
                    y : false,
                }
                if((pos.x2o > posObject.x1 && pos.x2o < posObject.x2) || (pos.x1o > posObject.x1 && pos.x1o < posObject.x2) || (posObject.x2 > pos.x1o && posObject.x2 < pos.x2o) || (posObject.x1 > pos.x1o && posObject.x2 < pos.x2o)
                || (pos.x1 == posObject.x1 && pos.x2 == posObject.x2)){ //If same width and inside each other
                    currentCollide.x = true;
                }
                if((pos.y2o > posObject.y1 && pos.y2o < posObject.y2) || (pos.y1o > posObject.y1 && pos.y1o < posObject.y2) || (posObject.y2 > pos.y1o && posObject.y2 < pos.y2o) || (posObject.y1 > pos.y1o && posObject.y2 < pos.y2o)
                || (pos.y1 == posObject.y1 && pos.y2 == posObject.y2)){ //If same height and inside each other
                    currentCollide.y = true;
                }
                if(pos.y1o >= posObject.y2 && currentCollide.x){
                    pos.y1 = posObject.y2;
                    position.collisionType = "hitCeiling";
                }
                if(pos.x2o <= posObject.x1 && currentCollide.y){
                    pos.x1 = posObject.x1 - pos.width;
                    position.collisionType = "hitRight";
                }
                if(pos.x1o >= posObject.x2 && currentCollide.y){
                    pos.x1 = posObject.x2;
                    position.collisionType = "hitLeft";
                }
                if(pos.y2o <= posObject.y1 && currentCollide.x){
                    pos.y1 = posObject.y1 - pos.height;
                    position.onGround = true;
                    position.platformXVeloc = collisionObjects.rectXVeloc[i];
                    position.collisionType = "onGround";
                }
                if(currentCollide.x && currentCollide.y){ //Dealing with stuck in block
                    if(pos.x1+(pos.x1+pos.x2)/2 > posObject.x1+(posObject.x1+posObject.x2)/2){
                        pos.x1 += 1;
                    }
                    else if(pos.x1+(pos.x1+pos.x2)/2 <= posObject.x1+(posObject.x1+posObject.x2)/2){
                        pos.x1 -= 1;
                    }
                }
            }
        }
        position.xf = pos.x1;
        position.yf = pos.y1;
        return position;
    }
    if(parameter == 1){
        for(i = 0; i < collisionObjects.rectX.length; i++){
            var posObject = {
                x1 : collisionObjects.rectX[i],
                x2 : collisionObjects.rectX[i] + collisionObjects.rectWidth[i],
                y1 : collisionObjects.rectY[i],
                y2 : collisionObjects.rectY[i] + collisionObjects.rectHeight[i],
            }
            if(((pos.x2 > posObject.x1 && pos.x2 < posObject.x2) || (pos.x1 > posObject.x1 && pos.x1 < posObject.x2) || (posObject.x2 > pos.x1 && posObject.x2 < pos.x2) || (posObject.x1 > pos.x1 && posObject.x2 < pos.x2))
            && ((pos.y2 > posObject.y1 && pos.y2 < posObject.y2) || (pos.y1 > posObject.y1 && pos.y1 < posObject.y2) || (posObject.y2 > pos.y1 && posObject.y2 < pos.y2) || (posObject.y1 > pos.y1 && posObject.y2 < pos.y2))
            ){ //If the two objects are going to collide
                return true;
            }
        }
        return false;
    }
}