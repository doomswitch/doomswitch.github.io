var stats = {};
var progressBarMap = {};
var buttonMap = {};
var progressBarTimesInSeconds = {};

function initializeGame()
{
    stats['costs'] = {};
    stats['costs']['newAccount'] = 20;
    stats['costs']['living'] = 500;

    stats['misc'] = {};
    stats['misc']['cash'] = 20;
    stats['misc']['accountActive'] = false;
    stats['misc']['totalGamesPlayed'] = 0;
    stats['misc']['wage'] = 500;
    
    stats['account'] = {};
    stats['account']['gamesPlayed'] = 0;
    stats['account']['gamesWon'] = 0;
    stats['account']['gamesLost'] = 0;
    stats['account']['mmr'] = 0;

    stats['personal'] = {};
    stats['personal']['improvementsEnabled'] = false;
    stats['personal']['lastHitting'] = 0;
    stats['personal']['skillshots'] = 0;
    stats['personal']['denying'] = 0;
    stats['personal']['championPool'] = 0;
    stats['personal']['itemBuilds'] = 0;
    stats['personal']['metagame'] = 0;

    stats['theGame'] = {};
    stats['theGame']['championPool'] = 10;

    progressBarMap['playGame'] = "playGameProgressBar";
    progressBarTimesInSeconds['playGame'] = 1;
    buttonMap['playGame'] = "playGameButton";

    // load save stuff

    updateStats();
}

function updateStats()
{
    var cashDisplay = document.getElementById('statsDisplayCash');
    cashDisplay.innerText = "$" + stats['misc']['cash'];

    if(stats['misc']['accountActive'] === true)
    {
        updateAccountStats();
    }

    if(stats['personal']['improvementsEnabled'] === true)
    {
        updatePersonalStats();
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

    elem = document.getElementById('statsDisplayMMR');
    elem.innerText = stats['account']['mmr'];
}

function updatePersonalStats()
{
    var elem = document.getElementById('chooseFocusRow');
    elem.style.visibility = 'visible';

    elem = document.getElementById('personalStatsContainer');
    elem.style.visibility = 'visible';
    
    elem = document.getElementById('statsDisplayLastHitting');
    elem.innerText = stats['personal']['lastHitting'];

    elem = document.getElementById('statsDisplaySkillshots');
    elem.innerText = stats['personal']['skillshots'];
}

function buy(productId)
{
    if(productId == 0) { return; }
    switch(productId)
    {
        case 1: // new account
        {
            var cost = stats['costs']['newAccount'];
            if(stats['misc']['cash'] >= cost)
            {
                if(stats['misc']['accountActive'] === true)
                {
                    // dunno what we do here yet
                    return;
                }
                else
                {
                    stats['misc']['cash'] -= cost;
                    stats['misc']['accountActive'] = true;
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

function beginFill(buttonName)
{
    var button = document.getElementById(buttonMap[buttonName]);
    button.disabled = true;

	var progressBarElem = document.getElementById(progressBarMap[buttonName]);
    var width = 1;
    var interval = progressBarTimesInSeconds[buttonName] * 10; // *1000 for ms, /100 for 100 ticks
    var intervalId = setInterval(frame, interval);
    
    function frame()
    {
    	if(width >= 100) {
        	clearInterval(intervalId);
            width = 1;
            procComplete(buttonName);
        } else {
        	width++;
        }
        
        progressBarElem.style.width = width + '%';
    }
}

function procComplete(buttonName)
{
    if(buttonName == "playGame")
    {
        stats['account']['gamesPlayed']++;
        stats['misc']['totalGamesPlayed']++;

        // win or lose?
        var winRate = .8;
        var result = Math.random();
        if(result > winRate)
        {
            stats['account']['gamesWon']++;
            stats['account']['mmr'] += 1;
        }
        else
        {
            stats['account']['gamesLost']++;
            stats['account']['mmr'] -= 2;
            if(stats['account']['mmr'] < 0) { stats['account']['mmr'] = 0; }
        }

        if(stats['misc']['totalGamesPlayed'] >= 5 && stats['personal']['improvementsEnabled'] == false)
        {
            stats['personal']['improvementsEnabled'] = true;
        }

        // did we have a focus?
        var focusButtons = document.getElementsByName("playGameFocus");
        var selectedFocus = null;
        var selectedFocusValue = "";

        for(var i = 0; i < focusButtons.length; i++)
        {
            if(focusButtons[i].checked)
            {
                selectedFocus = focusButtons[i];
                selectedFocusValue = focusButtons[i].value;
            }
        }

        if(stats['personal']['improvementsEnabled'])
        {
            if(selectedFocus != null && selectedFocusValue != "")
            {
                if(selectedFocusValue == "lastHitting") 
                { 
                    stats['personal']['lastHitting']++;
                }
                else if(selectedFocusValue == "skillshots")
                {
                    stats['personal']['skillshots']++;
                }
            }
        }

        var button = document.getElementById(buttonMap[buttonName]);
        button.disabled = false;

        updateStats();
    }
}