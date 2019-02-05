function loadMap(map, width, height, blockSize){
    var y = 0;
    var n = false;
    do{
        for(x = 0; x < width && !n; x++){
            var key = map.charAt(x + y*width);
            if(key != " " && !(key <= 9 || key >= 1)){
                var xPos = x*blockSize;
                var yPos = 140 - blockSize*height + y*blockSize;
                switch(key){
                    case "x":
                        block.new(xPos, yPos, blockSize, blockSize, 0, 0, "black", false);
                        break;
                    case "o":
                        block.new(xPos, yPos, blockSize, blockSize, 0, 0, "#996600", false);
                        break;
                    case "s":
                        var nextKey = map.charAt(x+1 + y*width);
                        if(nextKey <= 9 && nextKey >= 1){
                            var size = nextKey * 10;
                        }
                        else{
                            size = 5;
                        }
                        slime.new(xPos, yPos, size);
                        break;
                    case "q":
                        var nextKey = map.charAt(x+1 + y*width);
                        if(nextKey == 1){
                            player1.x = xPos; //Fix position things
                            player1.y = yPos - player1.height;
                        }
                        if(nextKey == 2){
                            player2.x = xPos;
                            player2.y = yPos - player2.height;
                        }
                        break;
                    case "n":
                        n = true;
                        break;
                    default:
                        console.log("Unregistered Character " + key + " attempted to be read in textMapLoader.js at (" + x + ", " + y + ")");
                        break;
                }


            }
        }
        y++;
    }
    while(!n);
}