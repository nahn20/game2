function loadMap(map, width, height, blockSize){
    var y = 0;
    var n = false;
    do{
        for(x = 0; x < width && !n; x++){
            var key = map.charAt(x + y*width);
            if(key != " "){
                var xPos = x*blockSize;
                var yPos = 140 - blockSize*height + y*blockSize;
                switch(key){
                    case "x":
                        block.new(xPos, yPos, blockSize, blockSize, 0, 0, "black", false);
                        break;
                    case "1":
                        player1.x = xPos; //Fix position things
                        player1.y = yPos - player1.height;
                        break;
                    case "2":
                        player2.x = xPos;
                        player2.y = yPos - player2.height;
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