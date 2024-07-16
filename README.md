# LCARS: A Star Trek-Inspired Discord Bot
My very own Discord bot written in javaScript and using discord.js API.
Currently just does a few meaningless actions as I learn how to build functionality.
Structure is being designed such that new commands can be added as their own .js file in the *commands* directory for organization and reduced clutter.
Future intention is to stylize the resultant text and embed objects in an LCARS-like them inspired by Star Trek's computer interfaces.
Still in work, some code still needs generalization to make this a turn-key bot option.

**Required Libraries**
```
- node
- npm
   |-- google-it
   |-- discord
   |-- ytdl-core
```

## Currently Supported Commands (OUT OF DATE AS OF 7/16/2024)
### General
---
`!help [command]`

Display all available commands. Optionally include a command name as an argument to get more detailed help on that command, including syntax and available arguments.

![image](https://user-images.githubusercontent.com/30991421/112048623-d76bcf00-8b0b-11eb-84af-3079f4a2a890.png)

---
`!join [-r | -rand] [-v | -vol] [-c | -chat]`

Join your voice channel and play a greeting. Optional arguments to use randomly-selected greeting, change volume, and display in chat.

---
`!leave  [-r | -rand] [-v | -vol] [-c | -chat]`

Leave your voice channel after playing a farewell. Optional arguments to use randomly-selected greeting, change volume, and display in chat.

---
`!google {query} [-n | -num]`

Make a Google search and return the result(s) in chat. Optional argument to change number of returned results (1-3).

![image](https://user-images.githubusercontent.com/30991421/112043109-8ce75400-8b05-11eb-91e0-4e9ea9fec800.png)

---
`!play {YouTube URL} [-v | -vol]`

Play audio from a given YouTube video URL. Optional argument to change volume. Future plans to include timestamp optional argument.

![image](https://user-images.githubusercontent.com/30991421/112049252-9a540c80-8b0c-11eb-82b3-920fabee1809.png)

---
`!riskyplay {query} [-v | -vol]`

Combines functionality of `!google` and `!play` into one. Will search YouTube for query and play the first result. Could be good, but will probably be terrible.

![image](https://user-images.githubusercontent.com/30991421/112049489-eef78780-8b0c-11eb-8641-38808952ec5a.png)

---
`!soundboard [-v | -vol]`

The first of hopefully many fun features of LCARS. Creates an embedded message object and populates it with pre-selected emoji reactions. LCARS will play a sound associated with each emoji whenever a user reacts to the message with said emoji. Stylized with a randomly-selected LCARS-themed logo inspired by Star Trek.

![image](https://user-images.githubusercontent.com/30991421/112051510-3f6fe480-8b0f-11eb-94ca-1f9410a913f5.png)



### Sound Effects
---
`!greet [-r | -rand] [-v | -vol] [-c | -chat]`

Similar to `!join` but just to say hello. Will auto-join channel if not in already. Optional arguments to randomize, change volume, and display in chat.

![image](https://user-images.githubusercontent.com/30991421/112042773-25310900-8b05-11eb-9eb2-5d619706d078.png)

---
`!farewell [-r | -rand] [-v | -vol] [-c | -chat]`
Similar to `!leave` but just to say goodbye. Will auto-join channel if not in already. Optional arguments to randomize, change volume, and display in chat.

![image](https://user-images.githubusercontent.com/30991421/112042801-2e21da80-8b05-11eb-887c-338b901f2b36.png)

---
`!yardsale [-v | -vol] [-c | -chat]`

A sound effect. Will auto-join channel if not in already. Optional arguments to change volume and display in chat.

![image](https://user-images.githubusercontent.com/30991421/112042881-47c32200-8b05-11eb-85ec-a8b440e2578a.png)

---
`!rockout [-v | -vol] [-c | -chat]`

Another sound effect. Will auto-join channel if not in already. Optional arguments to change volume and display in chat.

![image](https://user-images.githubusercontent.com/30991421/112042933-527db700-8b05-11eb-9b69-30fae3fc4ffe.png)

---
`!shazbot [-r | -rand] [-v | -vol] [-c | -chat]`

Another sound effect. Will auto-join channel if not in already. Optional arguments to randomize, change volume, and display in chat.

![image](https://user-images.githubusercontent.com/30991421/112042966-5c071f00-8b05-11eb-9fd3-aa1e675ec1cb.png)

---
`!johncena [-v | -vol] [-c | -chat]`

Another sound effect. Will auto-join channel if not in already. Optional arguments to randomize, change volume, and display in chat.

![image](https://user-images.githubusercontent.com/30991421/112043018-6aedd180-8b05-11eb-8aa5-22d30cd3002f.png)



## More Information
When `!join` and `!leave` are used without their `'rand'` argument(s), the join sound will default to a single sound. But when the `'rand'` argument is used, the join sound will be randomly selected from the *join_voice* / *leave_voice* directory(ies). If `!yardsale` and `!rockout` are used while the bot is not in a voice channel, it will first join then play the sound...but when it joins, it will go straight to the respective sound without playing a greeting as it otherwise would with `!join` and `!join rand`.

Sound files not included yet. Currently working on reducing bitrate and sample rates to reduce sound file size. *\*.ogg* filetype preferred.
