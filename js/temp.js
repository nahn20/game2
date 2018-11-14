for(h = 0; h < player1.fireballs.length; h++){
    if(player1.fireballs[h].x + player1.fireballs[h].radius > this.x && player1.fireballs[h].x - player1.fireballs[h].radius < this.x + this.width && player1.fireballs[h].y + player1.fireballs[h].radius > this.y && player1.fireballs[h].y - player1.fireballs[h].radius < this.y + this.height && player1.fireballs[h].state != "hold" && player1.fireballs[h].state != "boom" && player1.fireballs[h].state != "kapow"){
        this.yveloc = 0;
    }
}