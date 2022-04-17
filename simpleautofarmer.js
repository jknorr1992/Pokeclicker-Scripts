// ==UserScript==
// @name        [Pokeclicker] Simple Auto Farmer
// @namespace   Pokeclicker Scripts
// @match       https://www.pokeclicker.com/
// @grant       none
// @version     1.4
// @author      Ephenia
// @description Adds buttons to automatically plant and harvest all of any specific berry. Make sure to have the berry selected that you want to auto plant & harvest before enabling it. This includes an auto Mulcher as well.
// ==/UserScript==

var farmState;
var mulchState;
let replantState;
var farmColor;
var mulchColor;
let replantColor;
var autoFarmTimer;
var awaitAutoFarm;
var newSave;
var trainerCards;
var shovelList = document.getElementById('shovelList');

function initAutoFarm() {
    if (farmState == "ON") {
        autoFarmTimer = setInterval(function () {
            doPlantHarvest();
        }, 1000);
    }
    if (farmState == "OFF") {
        farmColor = "danger"
    } else {
        farmColor = "success"
    }
    if (mulchState == "OFF") {
        mulchColor = "danger"
    } else {
        mulchColor = "success"
    }

    if(replantState == "OFF")
    {
        replantColor = "danger";
    }
    else
    {
        replantColor = "success";
    }

    var elemAF = document.createElement("div");
    elemAF.className = "row justify-content-center py-0"

    const autoFarmDiv = document.createElement("div");
    autoFarmDiv.className = "col-6 pr-0";
    elemAF.appendChild(autoFarmDiv);

    const autoFarmButton = document.createElement("button");
    autoFarmButton.id = "auto-farm-start";
    autoFarmButton.className = `btn btn-${farmColor} btn-block`;
    autoFarmButton.innerText = `Auto Farm [${farmState}]`;
    autoFarmButton.style = "font-size:9pt;";
    autoFarmDiv.appendChild(autoFarmButton);

    const autoMulchDiv = document.createElement("div");
    autoMulchDiv.className = "col-6 pl-0";
    autoFarmDiv.after(autoMulchDiv);

    const autoMulchButton = document.createElement("button");
    autoMulchButton.id = "auto-mulch-start";
    autoMulchButton.className = `btn btn-${mulchColor} btn-block`;
    autoMulchButton.innerText = `Auto Mulch [${mulchState}]`;
    autoMulchButton.style = "font-size:9pt;";
    autoMulchDiv.appendChild(autoMulchButton);

    const elemAR = document.createElement("div");
    elemAR.className = "row justify-content-center py-0"

    const autoReplantDiv = document.createElement("div");
    autoReplantDiv.className = "col-12 pl-3";
    elemAR.appendChild(autoReplantDiv);

    const autoReplantButton = document.createElement("button");
    autoReplantButton.id = "auto-replant-start";
    autoReplantButton.className = `btn btn-${replantColor} btn-block`;
    autoReplantButton.innerText = `Pattern Mode [${replantState}]`;
    autoReplantButton.style = "font-size:9pt;";
    autoReplantDiv.appendChild(autoReplantButton);

    shovelList.before(elemAF)
    elemAF.after(elemAR);

    $("#auto-farm-start").click(startAutoFarm);
    $("#auto-mulch-start").click(autoMulch);
    $("#auto-replant-start").click(autoReplant);

    function startAutoFarm() {
        if (farmState == "OFF") {
            localStorage.setItem("autoFarmState", "ON");
            farmState = "ON"
            autoFarmTimer = setInterval(function () {
                doPlantHarvest();
            }, 1000); // Happens every 1 second
            document.getElementById('auto-farm-start').innerText = `Auto Farm [` + farmState + `]`
            document.getElementById("auto-farm-start").classList.remove('btn-danger');
            document.getElementById("auto-farm-start").classList.add('btn-success');
        } else {
            endAutoFarm();
        }
    }

    function doPlantHarvest() {
        if(replantState == "OFF")
        {
            App.game.farming.plantAll(FarmController.selectedBerry());
        }
        else
        {
            App.game.farming.plotList.forEach((plot, index) => 
            {
                
                if(plot.isUnlocked && !plot.isEmpty())
                {
                    const plotBerry = plot.berry;
                    App.game.farming.harvest(index); //TODO: Add an adjustable input to delay harvest for berry mutations
                    App.game.farming.plant(index, plotBerry);
                }
                
            });
        }
        if (mulchState == "ON") {
            FarmController.mulchAll()
        }
        if(replantState == "OFF")
        {
            App.game.farming.harvestAll()
        }
        
    }

    function autoMulch() {
        if (mulchState == "OFF") {
            localStorage.setItem("autoMulchState", "ON");
            mulchState = "ON"
            document.getElementById('auto-mulch-start').innerText = `Auto Mulch [` + mulchState + `]`
            document.getElementById("auto-mulch-start").classList.remove('btn-danger');
            document.getElementById("auto-mulch-start").classList.add('btn-success');
        } else {
            localStorage.setItem("autoMulchState", "OFF");
            mulchState = "OFF"
            document.getElementById('auto-mulch-start').innerText = `Auto Mulch [` + mulchState + `]`
            document.getElementById("auto-mulch-start").classList.remove('btn-success');
            document.getElementById("auto-mulch-start").classList.add('btn-danger');
        }
    }

    function autoReplant()
    {
        if (replantState == "OFF") 
        {
            localStorage.setItem("autoReplantState", "ON");
            replantState = "ON";
            autoReplantButton.classList.remove('btn-danger');
            autoReplantButton.classList.add('btn-success');
        }
        else
        {
            localStorage.setItem("autoReplantState", "OFF");
            replantState = "OFF"
            autoReplantButton.classList.remove('btn-success');
            autoReplantButton.classList.add('btn-danger');
        }
        autoReplantButton.innerText = `Pattern Mode [${replantState}]`;
    }

    function endAutoFarm() {
        localStorage.setItem("autoFarmState", "OFF");
        farmState = "OFF"
        document.getElementById('auto-farm-start').innerText = `Auto Farm [` + farmState + `]`
        document.getElementById("auto-farm-start").classList.remove('btn-success');
        document.getElementById("auto-farm-start").classList.add('btn-danger');
        clearInterval(autoFarmTimer)
    }
}

if (localStorage.getItem('autoFarmState') == null) {
    localStorage.setItem("autoFarmState", "OFF");
}
if (localStorage.getItem('autoMulchState') == null) {
    localStorage.setItem("autoMulchState", "OFF");
}
if (localStorage.getItem('autoReplantState') == null) 
{
    localStorage.setItem("autoReplantState", "OFF");
}
farmState = localStorage.getItem('autoFarmState');
mulchState = localStorage.getItem('autoMulchState');
replantState = localStorage.getItem("autoReplantState");

function loadScript(){
    var scriptLoad = setInterval(function () {
        try {
            newSave = document.querySelectorAll('label')[0];
            trainerCards = document.querySelectorAll('.trainer-card');
        } catch (err) { }
        if (typeof newSave != 'undefined') {
            for (var i = 0; i < trainerCards.length; i++) {
                trainerCards[i].addEventListener('click', checkAutoFarm, false);
            }
            newSave.addEventListener('click', checkAutoFarm, false);
            clearInterval(scriptLoad)
        }
    }, 50);
}

loadScript();

function checkAutoFarm() {
    awaitAutoFarm = setInterval(function () {
        var farmAccess;
        try {
            farmAccess = App.game.farming.canAccess();
        } catch (err) { }
        if (typeof farmAccess != 'undefined') {
            if (farmAccess == true) {
                initAutoFarm();
                clearInterval(awaitAutoFarm)
            } else {
                //console.log("Checking for access...")
            }
        }
    }, 1000);
}
