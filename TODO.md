# code fixes

move a bunch of logic in combat page into Game

throw you back to battle prep on combat refresh
    (stuff breaks when you rerender combat)

# game fixes

true infinite first stike and feelfine/pierce

# game features

make different health items (which?)

store/restore game and log from file

change logs to be "Entity did action" and "Entity took damage", with the cause being implied
show player-only logs?

# inaccuracies

no rolling HP
death/res happens instantly; an enemy's multihit will hit you after being res'd
pirate ghost alternates coin/barrel attacks instead of being random
softener just removes defUP rather than causing defDOWN

# trotter notes:

defend 20% reduction works
defend always rounds down
minimize -2 does not work

for strategy it seems like 1 def isnt doing much. should have 0 or 1. firebrand deals same to def+half and sleep+half with 1 def or not