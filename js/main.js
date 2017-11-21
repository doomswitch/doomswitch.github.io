var stats = {};
var costs = {};
var progressBarMap = {};
var progressBarTimesInSeconds = {};

function initializeGame()
{
    // product ids:
    // 0 = invalid
    // 1 = new account
    costs[0] = 0;
    costs[1] = 20;

    stats['cash'] = 20;
    stats['accountActive'] = false;
    stats['totalGamesPlayed'] = 0;
    
    stats['account'] = {};
    stats['account']['gamesPlayed'] = 0;
    stats['account']['gamesWon'] = 0;
    stats['account']['gamesLost'] = 0;

    progressBarMap[0] = "playGameProgressBar";
    progressBarTimesInSeconds[0] = 1;

    // load save stuff

    updateStats();
}

function updateStats()
{
    var cashDisplay = document.getElementById('statsDisplayCash');
    cashDisplay.innerText = "$" + stats['cash'];

    if(stats['accountActive'] === true)
    {
        updateAccountStats();
    }
}

function updateAccountStats()
{
    var elem = document.getElementById('playGameContainer');
    elem.style.visibility = 'visible';

    elem = document.getElementById('buyGameButton');
    elem.disabled = true;

    elem = document.getElementById('statsDisplayGamesPlayed');
    elem.innerText = stats['account']['gamesPlayed'];

    elem = document.getElementById('statsDisplayGamesWon');
    elem.innerText = stats['account']['gamesWon'];

    elem = document.getElementById('statsDisplayGamesLost');
    elem.innerText = stats['account']['gamesLost'];
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

function beginFill(buttonId)
{
	var progressBarElem = document.getElementById(progressBarMap[buttonId]);
    var width = 1;
    var interval = progressBarTimesInSeconds[buttonId] * 10; // *1000 for ms, /100 for 100 ticks
    var intervalId = setInterval(frame, interval);
    
    function frame()
    {
    	if(width >= 100) {
        	clearInterval(intervalId);
            width = 1;
            procComplete(buttonId);
        } else {
        	width++;
        }
        
        progressBarElem.style.width = width + '%';
    }
}

function procComplete(id)
{
    switch(id) {
        case 0:
        {
            // played a game
            stats['account']['gamesPlayed']++;
            stats['totalGamesPlayed']++;

            // win or lose?
            var winRate = .8;
            var result = Math.random();
            if(result > winRate)
            {
                stats['account']['gamesWon']++;
            }
            else
            {
                stats['account']['gamesLost']++;
            }

            updateStats();
            break;
        }
        default:
        {
            break;
        }
    }
}