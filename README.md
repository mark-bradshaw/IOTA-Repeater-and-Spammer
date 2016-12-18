# IOTA-Repeater-and-Spammer
An application to contribute to IOTA network efficiency

This application won't be needed any more when IOTA network is heavily used by true IOT devices.
As long as that is not the case, the IOT cloud topology and behaviour can be emulated to some degree by virtual tethering. It is realized by rebroadcasting transactions by existing nodes in a measured way.


## INSTALLATION
To use this app you'll first need a working IOTA IRI node.  You need **node** and **npm** installed on your system.  Once you've cloned this repo, open a terminal to the directory of the cloned repo and type:

`npm install`

Now you are ready to configure this tool.

## CONFIGURATION
You can run the application 'out of the box' with a local IRI node, or you can take a choice:

1) Run repeater only, without spammer (REPEATER_ON=true|false).
2) Run spammer only, without repeater (SPAM_ON=true|false).
3) Set the spammers time interval (SPAM_FREQUENCY=90, seconds, deliberate delays between spams).
4) Set your personal spam message and tag (recommended).
5) Set the search depth for 'transactions to approve', default SPAM_DEPTH=5.

You find those parameters declarations in the top section of repeater.js.

## EXECUTION

node repeater.js
or
./repeater.sh        (make sure execution permission flag (`chmod +x ./repeater.sh`) is set!)

The 'repeater.sh' is a wrapper around the basic command call. It restarts node automatically if an exception occurs and the repeater stopped working. This is likely to happen at some point, because the underlying iota javascript lib and the IOTA ledger are still works in progress.
