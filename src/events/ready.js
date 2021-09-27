const { client } = global;
const { statusMessages } = client;
const { Prefix, VoiceChannel, Activity, Status } = client.settings;
const { guildID } = client.guildSettings;
const { success } = require('../configs/emojis.json');
const commands = require('../schemas/commands.js');
const reload = require('../schemas/reload.js');
const moment = require('moment');
require('moment-duration-format');
moment.locale('tr');

module.exports = async () => {

    console.log(`[BOT] Connected To ${client.user.tag}`);
    
//Status
    client.user.setPresence({ activity: { type: Activity, name: statusMessages.random() }, status: Status });
    
    setInterval(() => {
    
        client.user.setPresence({ activity: { type: Activity, name: statusMessages.random() }, status: Status });
        console.log(`[STATUS] Status Has Been Updated`);
    
    }, 600000);

//Voice 
    let channel = client.channels.cache.get(VoiceChannel);
    
    if (!channel) console.log(`[VOICE] Voice Channel Not Found`);
    else channel.join().then(connection => console.log(`[VOICE] Connected To The Voice Channel`)).catch(err => console.log(`[VOICE] Could Not Connect To Voice Channel`));
    
    setInterval(() => {
        
        if(channel) channel.join().then(connection => console.log(`[VOICE] Connection On Voice Channel Has Been Refreshed`)).catch(err => console.log(`[VOICE] Could Not Refresh Connection On Voice Channel`));
        
    }, 600000);

//Reload
    let data = await reload.findOne({ type: "register" });

    if(data) {

        client.channels.cache.get(data.channelID).messages.fetch(data.messageID).then(async msg => {

            console.log('[BOT] Connection Reloaded');
            await msg.edit(`**Yeniden Başlatıldı** ${success ? success : ``}`);
            await reload.findOneAndDelete({ type: "register" });

        });

    };

//Saving Commands
    if(!guildID) return;

    let commandArray = new Array();
    client.commands.forEach(async command => {

        commandArray.push(Prefix+command.name);
        if(command.aliases) command.aliases.forEach(alias => commandArray.push(Prefix+alias));
            
    });

    await commands.findOneAndUpdate({ guildID: guildID }, { $set: { registerCommands: commandArray } }, { upsert: true });
    console.log(`[BOT] Commands Saved!`);

};

module.exports.conf = {
    name: "Ready",
    event: "ready"
};