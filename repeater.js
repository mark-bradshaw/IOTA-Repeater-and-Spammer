var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var performance = require("performance-now");
var IOTA = require("iota.lib.js");

// ---------------------------------------
// Configure your spammer properties here:
// ---------------------------------------
var REPEATER_ON = true;   // REPEATER_ON = false:  You don't want the repeater functionality.
var SPAM_ON = true;       // SPAMER_ON = false: You don't want the spammer functionality (no PoW!). 
                          // ^^^^^^^^^^^ One of the 2 options should be true, 
                          //             otherwise it aint doing nothing!
var SPAM_MESSAGE = "SPAMWITHREPEATER";    // only A-Z and 9 allowed!
var SPAM_TAG = "RSPAM"    // only A-Z and 9 allowed!
var SPAM_FREQUENCY = 90   // minimum spam interval in seconds.
var SPAM_DEPTH = 5        // how deep to search for transactions to approve.
// -------- end of configrable part ------

// -------- javascript code --------------
// -------- Do not modify!! --------------
var allnine = '999999999999999999999999999999999999999999999999999999999999999999999999999999999';
var ignore_tips = null;
var new_tips = [];
var new_tips_step = [] 
var previous_milestone_idx = 0;
var current_milestone_idx = 0;
var lock = false;
var lock_spam = false;
var next_spam_time = 0;
var spam_count = 0;
var spam_timesum = 0;
var spam_starttime = 0;
var trunk_tx;
var branch_tx;

var iota = new IOTA({
    'host': 'http://localhost',
    'port': 14265
});

var transfers = [{
    'address': allnine,
    'value': 0,
    'message': SPAM_MESSAGE,
    'tag': SPAM_TAG
}];

function collect_tips_at_startup() {
    ignore_tips = new Set();
    iota.api.getNodeInfo(function(e,s) {
        var solidMilestone = s.latestSolidSubtangleMilestoneIndex;
        var milestone = s.latestMilestoneIndex;
        if ((solidMilestone == 0) || (solidMilestone != milestone)) {
            console.log("*INFO:  waiting for synced with network.");
            lock = false;
            return;
        }
        iota.api.getTips(function(e,s) {
            if (e != null) {
                console.log("*ERROR:  cannot get tips at startup");
                console.log(" iota.lib.js returns this error:");
                console.log(e);
                process.exit(1);
            }
            var tips = s['hashes'];
            for (var i=0;i<tips.length;i++) {
                var key = tips[i].slice(0,12);
                ignore_tips.add(key);
            }
            lock = false;
            return;
        });
    });
}

function collect_fresh_arrived() {
    // collect the new tips since startup or the last milestone 
    iota.api.getTips(function(e,s) {
        if (e != null) {
            console.log("*ERROR:  cannot get tips");
            console.log(" iota.lib.js returns this error:");
            console.log(e);
            process.exit(1);
        }
        var tips = s['hashes'];
        for (var i=0;i<tips.length;i++) {
            var key = tips[i].slice(0,12);
            if (ignore_tips.has(key)==false) {
                ignore_tips.add(key);
                new_tips.push(tips[i]);
                new_tips_step.push(tips[i]);
                console.log("*INFO  New tip: "+tips[i]);
            }
        }
        // if milestone has changed, then re-broadcast the newcomers
        if (previous_milestone_idx != current_milestone_idx) {
            previous_milestone_idx = current_milestone_idx;
            broadcast_fresh_arrived();
        }
        else {
            if (new_tips_step.length > 9) {
                broadcast_intermediate(); 
            }
            else {
                lock = false
                return;
            }
        }
    });
}

function broadcast_fresh_arrived() {
    if (new_tips.length > 0) {
        console.log("*INFO  --- Milestone has changed, rebroadcasting the "+new_tips.length+" most recent txs");
        iota.api.getTrytes(new_tips, function(e,s) {
            if (e != null) {
                console.log("*ERROR  cannot get trytes");
                console.log(" iota.lib.js returns this error:");
                console.log(e);
                process.exit(1);
            }
            var trytes = s['trytes'];
            iota.api.broadcastTransactions(trytes, function(e,s) {
                if (e != null) {
                    console.log("*ERROR  cannot broadcast");
                    console.log(" iota.lib.js returns this error:");
                    console.log(e);
                    process.exit(1);
                }
                new_tips = [];
                new_tips_step = [];
                lock = false;
            });
        });
    }
    else {
        lock = false;
    }
}

function broadcast_intermediate() {
    if (new_tips_step.length > 0) {
        console.log("*INFO  --- rebroadcasting the "+new_tips_step.length+" most recent txs (intermediate step)");
        iota.api.getTrytes(new_tips_step, function(e,s) {
            if (e != null) {
                console.log("*ERROR  cannot get trytes");
                console.log(" iota.lib.js returns this error:");
                console.log(e);
                process.exit(1);
            }
            var trytes = s['trytes'];
            iota.api.broadcastTransactions(trytes, function(e,s) {
                if (e != null) {
                    console.log("*ERROR  cannot broadcast");
                    console.log(" iota.lib.js returns this error:");
                    console.log(e);
                    process.exit(1);
                }
                new_tips_step = [];
                lock = false;
            });
        });
    }
    else {
        lock = false;
    }
}

function spam_spam_spam() {
    spam_starttime = performance();
    var seed = allnine;
    iota.api.sendTransfer(allnine,SPAM_DEPTH,18,transfers,function(e,s) {
        if (e != null) {
            console.log("*ERROR  sendTransfer() failed");
            console.log(" iota.lib.js returns this error:");
            console.log(e);
            process.exit(1);
        }
        spam_count++;
        var ellapsed = performance()-spam_starttime;
        spam_timesum += ellapsed; 
        console.log("*INFO  Spam count: "+spam_count+", last spam took "+Math.floor(ellapsed/1000)+" seconds.");
        console.log("*INFO  Average spam duration: "+Math.floor(spam_timesum/1000)/spam_count+" seconds (deliberate delays not included.)"); 
        lock_spam = false;
    });
}


function onMyTimer() {
    if (lock) return;
    lock = true;

    // First, check if synced 
    iota.api.getNodeInfo(function(e,s) {
         var milestone = s.latestMilestone;
         var solidMilestone = s.latestSolidSubtangleMilestone;
         current_milestone_idx = s.latestMilestoneIndex;
         if (milestone == allnine || solidMilestone == allnine) {
             console.log("*INFO  Waiting for synchronization with network.");
             lock = false;
             return;
         } 
         // synced is true
         if (REPEATER_ON==true) {
             if (ignore_tips == null) {
                 // at startup
                 collect_tips_at_startup();
             }
             else {
                 // when running
                 collect_fresh_arrived();
             }
         }
         else {
             lock = false;
         }
    });

    if (lock_spam == false) {
        lock_spam = true;
        var now = performance();
        if (SPAM_ON==true && now>next_spam_time) {
            next_spam_time = now+SPAM_FREQUENCY*1000;
            spam_spam_spam();
        }
        else {
            lock_spam = false;
        }
    }
}
console.log("RUNNING REPEATER: "+REPEATER_ON+", RUNNING SPAMMER: "+SPAM_ON);
onMyTimer();
setInterval(onMyTimer, 3000);

