const { Prefix } = global.client.settings;
const { unregisterRole, unregisterName } = global.client.guildSettings.unregister;
const { mark, loading, success } = require('../../configs/emojis.json');
const roleLog = require('../../schemas/roleLog.js');

module.exports = {
    name: 'rolsüz',
    aliases: ['rolsüz'],
    category: 'Admin',
    usage: `ver`,
    guildOwner: true,
    guildOnly: true,

    /**
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args 
     * @param { MessageEmbed } Embed 
     */

    async execute(client, message, args, Embed) {

        let members = message.guild.members.cache.filter(member => member.roles.cache.filter(role => role.id !== message.guild.id).size == 0);
        
        if(!args[0]) {

            message.channel.success(message, Embed.setDescription(`Sunucuda herhangi bir role sahip olmayan ${members.size !== 0 ? `toplam **${members.size}** üye var, \`${Prefix}rolsüz ver\` komutuyla onları kayıtsıza ata bilirsiniz!` : `üye bulunmuyor!`}`));

        } else if(['ver', 'dağıt'].some(arg => args[0].toLowerCase() == arg)) {

            let role = message.guild.roles.cache.get(unregisterRole);
            let size = members.size;
            let index = 0;
    
            if(!unregisterRole || !role) return message.channel.error(message, Embed.setDescription(`Kayıtsız rolü ayarlanmamış, lütfen botun yapımcısıyla iletişime geçin!`), { timeout: 15000, react: true });
            if(!members.size) return message.channel.error(message, Embed.setDescription(`Sunucuda herhangi bir role sahip olmayan üye bulunmuyor!`), { timeout: 8000, react: true });

            if(mark) message.react(mark);
            message.channel.send(Embed.setDescription(`Sunucuda herhangi bir role sahip olmayan üyelere ${role.toString()} rolü **veriliyor** ${loading ? loading : ``}`)).then(async msg => {
            
                await new Promise(async (resolve) => {

                    members.forEach(async member => {

                        index += 1;
                        await client.wait(index * 300);
                        await member.roles.set([unregisterRole]);
                        await member.setNickname(unregisterName);
                        await new roleLog({ guildID: message.guild.id, staffID: message.author.id, userID: member.id, roleID: unregisterRole, date: Date.now(), type: 'ROLE-ADD' }).save();

                    });

                    await client.wait(size * 300).then(resolve);

                });

                msg.edit(Embed.setDescription(`${success ? success : ``} Sunucuda herhangi bir role sahip olmayan **${size}** üyeye ${role.toString()} rolü **verildi!**`))

            });

        };


    },
};
