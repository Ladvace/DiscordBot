
<p align="center">
    <img width="300" height="auto" src="https://i.imgur.com/1MrC4yt.png" alt="WiseMan" />
</p>

## WiseMan - Discord Bot 🤖 

This bot allow you to level up based on the time you spend in a vocal channel and how much you write in a text channel

## Commands 🎨
 You need to add the prefix `!` before the command e.g: `!rank`.
 - **par** - It adds you to the leaderboard (allow you to rank).
 - **trank** - It shows you your time-based score.
 - **rank** - It shows you your text-based score.
 - **wima** - It shows you your profile image.
 - **reset** - It reset the text-based score.
 - **timereset** - It reset the time-based score.
 - **github** - It shows you the github repo link.
 - **help** - It shows you all the commands.

 ## Steps ▶️

Install the dependencies
 ```
$ npm i
 ```
Create an ```.ENV``` file and replace ```*TOKEN*``` with the token.
You can take the token from [discord developers page](https://discordapp.com/developers/applications/) > Bot
 ```
$ TOKEN="*TOKEN*"
 ```

Start the bot
 ```
$ npm start
 ```

 ## Configuration ⚙️ 

 - The only configurations are the prefix and the minutes  in the ```config.json```.

   The ```minutes``` are the minutes for wich every time the bot level up you (i.g: by default the bot update your rank every hour for the time-based system). 

 ```
{
    "prefix": "!",
    "minutes": 60
}
 ```

 ## Authors ❤️
  
  - **Gianmarco Cavallo** (ladvace) - [Github Profile](https://github.com/Ladvace)

### If you have any problems or question/features feel free to contact me! 🔧😃