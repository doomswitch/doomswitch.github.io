var stats = {};
var progressBarMap = {};
var buttonMap = {};
var progressBarTimesInSeconds = {};
var timeSinceLastImprovement = {};
var skMaxMMR = 2500;

// globals
var skUnlockImprovements = 2;

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
    stats['personal']['skills'] = {};
    stats['personal']['skills']['lastHitting'] = 0;
    stats['personal']['skills']['skillshots'] = 0;
    
    // not implemented:
    stats['personal']['skills']['denying'] = 0;
    stats['personal']['championPool'] = 0;
    stats['personal']['itemBuilds'] = 0;
    stats['personal']['metagame'] = 0;
    // not implemented^

    stats['personal']['winRate'] = .5;

    stats['theGame'] = {};
    stats['theGame']['championPool'] = 10;

    progressBarMap['playGame'] = "playGameProgressBar";
    progressBarTimesInSeconds['playGame'] = 1;
    buttonMap['playGame'] = "playGameButton";

    timeSinceLastImprovement['lastHitting'] = 0;
    timeSinceLastImprovement['skillshots'] = 0;

    // load save stuff

    updateStats();
}

function getPersonalSkillRating()
{
    // currently represented by 5 stats, 2 of which are implemented
    // so total can't be > 1000

    // for now, each stat gives you from 0 to 500 points
    // todo: require stats to be normally distributed for full effect
    var ptsLasthitting = (500 * (stats['personal']['skills']['lastHitting'] / 100));
    var ptsSkillshots = (500 * (stats['personal']['skills']['skillshots'] / 100));

    var total = ptsLasthitting + ptsSkillshots;
    return total;
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
    elem.innerText = stats['personal']['skills']['lastHitting'];

    elem = document.getElementById('statsDisplaySkillshots');
    elem.innerText = stats['personal']['skills']['skillshots'];
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

function processImprovements()
{
    if(stats['misc']['totalGamesPlayed'] >= skUnlockImprovements && stats['personal']['improvementsEnabled'] == false)
    {
        stats['personal']['improvementsEnabled'] = true;
    }

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
                stats['personal']['skills']['lastHitting']++;
                if(stats['personal']['skills']['lastHitting'] >= 100) { stats['personal']['skills']['lastHitting'] = 100; }
                timeSinceLastImprovement['lastHitting'] = 0;
            }
            else if(selectedFocusValue == "skillshots")
            {
                stats['personal']['skills']['skillshots']++;
                if(stats['personal']['skills']['skillshots'] >= 100) { stats['personal']['skills']['skillshots'] = 100; }
                timeSinceLastImprovement['skillshots'] = 0;
            }
        }
    }
}

function processMMR(wonGame)
{
    if(wonGame)
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
}

function processWinrate()
{
    // calculate new win rate
    // win rate is a function of personal skill vs. mmr
    // for now it is simply
    // .5 + (.5 * (personal - mmr) / 500)
    // 500 represents the division checkpoints
    // todo: figure out if that's a correct number to use
    var newWinRate = .5;
    var diff = getPersonalSkillRating() - stats['account']['mmr'];
    if(diff == 0) { return; } // don't need to do anything if we're where we "should" be

    var diffPct = (diff / 500);
    newWinRate += (.5 * diffPct);
    stats['personal']['winRate'] = newWinRate;

    console.log("New win rate: " + stats['personal']['winRate']);
}

function processPlayGame()
{
    stats['account']['gamesPlayed']++;
    stats['misc']['totalGamesPlayed']++;

    // win or lose?
    var result = Math.random();
    var wonGame = false;
    if(result <= stats['personal']['winRate'])
    {
        wonGame = true;
    }

    // process match results
    processMMR(wonGame);
    processWinrate();

    // focus/improvements
    processImprovements();

    var button = document.getElementById(buttonMap['playGame']);
    button.disabled = false;
}

function passTime()
{
    // personal stat decay
    tickStatDecay();
}

function tickStatDecay()
{
    timeSinceLastImprovement['lastHitting']++;
    timeSinceLastImprovement['skillshots']++;

    if(timeSinceLastImprovement['lastHitting'] >= 4)
    {
        stats['personal']['skills']['lastHitting']--;
        if(stats['personal']['skills']['lastHitting'] <= 0) { stats['personal']['skills']['lastHitting'] = 0; }
    }

    if(timeSinceLastImprovement['skillshots'] >= 4)
    {
        stats['personal']['skills']['skillshots']--;
        if(stats['personal']['skills']['skillshots'] <= 0) { stats['personal']['skills']['skillshots'] = 0; }
    }
}

function procComplete(buttonName)
{
    // step 1 - process whatever just completed
    if(buttonName == "playGame")
    {
        processPlayGame();
    }

    // step 2 - pass time
    passTime();

    // step 3 - update stats
    updateStats();
}