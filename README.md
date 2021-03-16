# SkyStats
> A discord.js bot written for [Skyblock Maniacs](https://discord.gg/hUp72YA5vW) to get key metrics of a player in Hypixel Skyblock.

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
- [ ] `GuildCheck` command (`gc`,`gcheck`, `guild`)
    - Check if user meets guild requirements
- [ ] Scale bot up to work in multiple servers
- [ ] More bot information
    - Uptime
    - Total commands used
    - Unique users
    - Servers
    - etc
- [x] Make sure it's entirely usable in DMs
- [ ] Do some stuff with `.env`
    - Persistant status
    - Customisable stuff:
        - Prefix
        - Rank requirements
        - Guild requirements
        - Api key
- [ ] Add `load` command to go with reload
- [ ] If no args are passed to `reload`, reload everything