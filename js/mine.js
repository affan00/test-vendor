///////////////////////////////////////
//HOME PAGE Code Box
///////////////////////////////////////

 
function admSelectCheck(nameSelect){
    if(nameSelect.value){
        var preElements = document.getElementsByClassName('prettyprint');
        for(var i=0; i < preElements.length; i++){
            //if the class contains the selected value, then show it, else hide it
            preElements[i].style.display = preElements[i].classList.contains(nameSelect.value)?'block':'none';
        }
    }
}
window.onload = function (){
    document.getElementById('getFname').onchange();
}

///////////////////////////////////////
// 
///////////////////////////////////////


