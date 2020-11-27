    $(document).ready(function() {        
        $("#thumbnaily img").hover(function(e){
        	alert('hi')
            $("#largey").css("top",(e.pageY+5)+"px")
                             .css("left",(e.pageX+5)+"px")                    
                             .html("<img src="+ $(this).attr("alt") +" alt='Large Image' /><br/>"+$(this).attr("rel"))
                             .fadeIn("slow");
        }, function(){
            $("#largey").fadeOut("fast");
        });        
        
    });