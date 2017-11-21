var stats = {};
var costs = {};

function initializeGame()
{
    // product ids:
    // 0 = invalid
    // 1 = new account
    costs[0] = 0;
    costs[1] = 20;

    stats['cash'] = 20;
    stats['accountActive'] = false;

    // load save stuff

    if(stats['accountActive'] === true)
    {
        var playGameDiv = document.getElementById('playGameContainer');
        playGameDiv.style.visibility = 'visible';
    }
}

function updateStats()
{
    var cashDisplay = document.getElementById('statsDisplayCash');
    cashDisplay.innerText = "$" + stats['cash'];

    if(stats['accountActive'] === true)
    {
        var playGameDiv = document.getElementById('playGameContainer');
        playGameDiv.style.visibility = 'visible';
    }
}

function buy(productId)
{
    if(productId == 0) { return; }
    switch(productId)
    {
        case 1:
        {
            if(stats['cash'] >= 20)
            {
                if(stats['accountActive'] === true)
                {
                    // dunno what we do here yet
                    return;
                }
                else
                {
                    stats['cash'] -= 20;
                    stats['accountActive'] = true;
                }
            }
            break;
        }
        default:
            break;
    }

    // always update
    updateStats();
}

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