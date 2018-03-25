# sift
i wanted a simple mail client that only does the 3 things i ever use email to do: snoozing, archiving, and replying. I also wanted vim-ish keybindings and the ability to leave it running in a term/tmux/whatever indefinitely.

You can't use this yet. I need to add some auth/cred system and publish the mailserver-side library.

Eventually this should work on any mailserver that uses the maildir format.

this was inspired by the polymail OSX desktop client, i just got kind of annoyed at relying on their server to provide advanced features (snooze) and don't feel like writing a native app per platform i need to use.

## install
- install transpo (an api for supporting this client that I haven't published yet) on your mailserver.
- install node, probably needs to be recent-ish (ie 8+)
- clone this repo
- cd sift
- npm install
- node index.js

## directions
- ctrl-r fetches new mail
- j/k on the main list navs down/up, respectively
- the enter key will archive the currently selected message
- from the mail list, l 'drills in' to the selected message
  - in this mode, j/k scrolls down/up in the selected message
  - in this mode h will 'drill out', refocusing the 'cursor' on the mail list

## todo
- [ ] cleanup transpo
- [ ] add auth to transpo
- [ ] publish transpo
- [ ] add reply/compose
  - [ ] modal editing, git style, esc or drops you back to main screen and saves  
- [ ] organize 'pages', ie main/compose/reply/folder/archive
- [ ] responsive 2 col vs 1 col layout
- [ ] use color to denote the currently focused window
- [ ] add ctrl-z to unachive (needs transpo endpoint?)