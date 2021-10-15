const { entryExitChannel } = global.client.guildSettings;
const registers = require('../schemas/registers.js');

module.exports = async (member) => {

    let channel = member.guild.channels.cache.get(entryExitChannel);

    if(channel) channel.send(`**${member.user.tag}** (\`${member.id}\`) adlı kullanıcı sunucudan ayrıldı üye sayısı **${member.guild.memberCount}** kişiye indi!`);

    let datas = await registers.find({ guildID: member.guild.id, userID: member.id }).sort({ row: -1 });

    if(datas.length) {

        let firstData = datas[0];
        let options = firstData.options;

        if(options && options.leaveGuild) return;

        options.leaveGuild = true;
        options.leaveGuildDate = Date.now();
        await registers.findOneAndUpdate({ row: firstData.row, guildID: member.guild.id, userID: member.id }, { $set: { completed: true, options: options } });

    };

};

module.exports.conf = {
    name: 'Guild Member Remove',
    event: 'guildMemberRemove',
}