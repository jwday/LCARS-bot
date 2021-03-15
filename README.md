# LCARS-bot
My very own Discord bot written in javaScript and using discord.js API.
Currently just does a few meaningless actions to test functionality.
Structure is being designed such that new commands can be added as their own .js file in the *commands* directory for organization and reduced clutter.

## Currently Supported Commands
`!join` Join your voice channel and play the default greeting.

`!join rand` Join your voice channel and play a randomly-selected greeting.

`!leave` Leave your voice channel after playing the default farewell.

`!leave rand` Leave your voice channel after playing a randomly-selected farewell.

`!yardsale` A sound effect. Will auto-join channel if not in already.

`!rockout` Another sound effect. Will auto-join channel if not in already.

## More Information
When `!join` and `!leave` are used without their `'rand'` argument(s), the join sound will default to a single sound. But when the `'rand'` argument is used, the join sound will be randomly selected from the *join_voice* / *leave_voice* directory(ies). If `!yardsale` and `!rockout` are used while the bot is not in a voice channel, it will first join then play the sound...but when it joins, it will go straight to the respective sound without playing a greeting as it otherwise would with `!join` and `!join rand`.

Sound files not included. Sorry. I got all of mine from Tribes 2.
