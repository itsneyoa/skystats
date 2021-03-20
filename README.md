# SkyStats

> A discord.js bot written for [Skyblock Maniacs](https://discord.gg/maniacs) to get key metrics of a player in Hypixel Skyblock.

### Table of Content

- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [Roadmap](#roadmap)


### Prerequisites
- Git
- NodeJS >= 14
- Yarn >= 1.2


### Installation & Setup

Firstly clone the repository using:
```
git clone https://github.com/itsneyoa/skystats.git
```
Then go into the `Guild-Requirement-Check` folder:
```
cd skystats
```
Install all the dependencies using Yarn:
```
yarn
```
While the dependencies are being installed you can copy the configuration file.
```
cp config.example.json config.json
```
Configure the config file with all the details:
```
nano config.json
```
Finally you can run the program:
```
node index.js
```

### Configuration


- `Discord` contains all the keys, tokens, IDs etc
    - `Token` is the token for the discord bot.
        - If you don't already have a Discord App, you can [create a new app](https://discord.com/developers), then convert the app to a Discord bot, and then get your Discord bot token on the "Bot" page.
    - `apiKey` is your hypixel api key
        - If you don't already have one run `/api new` ingame
    - `prefix` is the prefix the bot will respond to
    - `ownerId` is the discord ID of the bot owner
        - This gives permission to reload all commands
- `Requirements` contains the levels required for any requirements you want to check
    - `Dungeons` catacombs level for carrier roles
    - `Skills` respective skill level required for skill based roles


### Roadmap

- [ ] Setup MongoDB for unique stuff in every guild:
    - Prefix
    - Rank requirements
    - Guild requirements
- [ ] Add the rest of the metrics for `player`
    - This requires the normal Hypixel API instead of the facade
- [ ] Make a `stats` command
    - Uptime
    - Total commands used
    - Unique users
    - Servers
    - etc
- [ ] Add verification / name updating
    - Likewise, this requires the normal Hypixel API instead of the facade
- [ ] Write a `CHANGELOG.md`
- [ ] Add logging to a discord channel given in config
