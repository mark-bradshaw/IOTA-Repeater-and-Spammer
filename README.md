# IOTA-Repeater-and-Spammer
An application to contribute to IOTA network efficiency

This application won't be needed any more when IOTA network is heavily used by true IOT devices.<br>As long as that the case, the IOT cloud topology and behaviour can be emulated to some degree by virtual tethering. It is realized by rebroadcasting transactions by existing nodes in a measured way.
<H3>INSTALLATION</H3>
You need nodejs and npm installed on your system.

This tool uses the official IOTA Javascript library. You can download it here:
https://github.com/iotaledger/iota.lib.js

Follow the instructions there, or simple create a new folder and execute:

npm install iota.lib.js

This tool need some additional packages, which are possibly already installed after you executed the command above. Otherwise they can be installed like this:

npm install httpxmlrequest<br>
npm install performance-now<br>

Now you are ready to install and configure this tool:

Get these files from this repository<br>
- repeater.js<br>
- repeater.sh<br> 

and copy them into the directory that you created.
<H3>CONFIGURATION</H3>
You can run the application 'out of the box', or you can take a choice:

1) Run repeater only without spammer (REPEATER_ON=true|false).<br>
2) Run spammer only without repeater (SPAM_ON=true|false).<br>
3) Set the spammers time interval (SPAM_FREQUENCY=90, seconds, deliberate delays between spams).<br>
4) Set your personal spam message and tag (recommended).<br>
5) Set the search depth for 'transactions to approve', default SPAM_DEPTH=5.<br>

You find those parameters declarations in the top section of repeater.js.

<H3>EXECUTION</H3>
nodejs repeater.js<br>
or<br>
./repeater.sh<br>

The 'repeater.sh' is a wrapper around the basic command call. It restarts nodejs automatically when an exception occurred and the repeater stopped working. This is likely to happen at some point, because the underlying iota.lib.js is work in progress, as well as the IRI ledger.
