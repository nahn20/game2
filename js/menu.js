document.addEventListener('keydown', function(event) {
    if(gameArea.time == 0){
        if(event.keyCode == 13){
            startGame();
        } 
        if(event.keyCode == 32){
            startMapBuilder();
        }
    }
});
function worldBuilderCheck(){
    document.getElementById("slimeCheckBox").checked = false;
    document.getElementById("flatGroundCheckBox").checked = false;
    document.getElementById("circleWorldCheckBox").checked = false;
    document.getElementById("lineWorldCheckBox").checked = false;
    document.getElementById("platformCheckBox").checked = false;
    document.getElementById("shopCheckBox").checked = false;
    document.getElementById("flappyCheckBox").checked = false;
}
function flappyCheck(){
    document.getElementById("worldBuilderCheckbox").checked = false;
    document.getElementById("slimeCheckBox").checked = false;
    document.getElementById("flatGroundCheckBox").checked = false;
    document.getElementById("circleWorldCheckBox").checked = false;
    document.getElementById("lineWorldCheckBox").checked = false;
    document.getElementById("platformCheckBox").checked = false;
    document.getElementById("shopCheckBox").checked = false;
}