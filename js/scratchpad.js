function beginFill(barName, fillTimeInSeconds)
{
	var elem = document.getElementById(barName);
    var width = 1;
    var interval = fillTimeInSeconds * 10; // *1000 for ms, /100 for 100 ticks
    var intervalId = setInterval(frame, interval);
    
    function frame()
    {
    	if(width >= 100) {
        	clearInterval(intervalId);
            width = 1;
        } else {
        	width++;
        }
        
        elem.style.width = width + '%';
    }
}