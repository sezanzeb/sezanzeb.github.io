window.addEventListener("load", function(e) {
    //expand listener
    var elems = document.querySelectorAll(".clicktoexpand")
    for(var i = 0;i < elems.length; i++)
    {
    	elems[i].addEventListener("click",function() {
    		toggleClass(this, "open") // function of hippo gallery
    	})
    }
})
