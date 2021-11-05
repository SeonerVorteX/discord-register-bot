const { guildTags, guildDiscriminator, registration } = global.client.guildSettings;
const { familyRole } = registration;
const { mark, crown, success, loading } = require('../../configs/emojis.json');
const roleLog = require('../../schemas/roleLog.js');

module.exports = {
    name: 'taglı',
    aliases: [],
    category: 'Admin',
    usage: '[ver / al]',
    permission: 'ADMINISTRATOR',
    guildOnly: true,
    cooldown: 3,

    /**
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args 
     * @param { MessageEmbed } Embed 
     */

    async execute(client, message, args, Embed) {

        if(!guildTags.length && !guildDiscriminator) return message.channel.error(message, Embed.setDescription(`Bu sunucu için herhangi bir tag ayarlanmamış, lütfen botun yapımcısıyla iletişime geçin!`), { timeout: 15000, react: true });

        if(!args[0]) {

            message.channel.success(message, Embed.setDescription(`
${guildTags.length ? guildTags.map(tag => {
    let members = message.guild.members.cache.filter(member => member.user.username.includes(tag));
    return `${crown ? crown : ``} Sunucumuzda \`${tag}\` tagına sahip ${members.size ? `toplam **${members.size}** üye bulunuyor!` : `herhangi bir üye bulunmuyor!`}`;
}).join(`\n`) : ``}
${guildDiscriminator ? function() {
    let members = message.guild.members.cache.filter(member => member.user.discriminator == guildDiscriminator);
    return `${crown ? crown : ``} Sunucumuzda \`#${guildDiscriminator}\` etiketimize sahip ${members.size ? `toplam **${members.size}** üye bulunuyor!` : `herhangi bir üye bulunmuyor!`}`
}() : ``}
        `), { react: true });

        } else if (['ver', 'dağıt'].some(arg => args[0].toLowerCase() == arg)) {

            let role = message.guild.roles.cache.get(familyRole);

            if(!familyRole || !role) return message.channel.error(message, Embed.setDescription(`Ekip rolü ayarlanmamış, lütfen botun yapımcısıyla iletişime geçin!`), { timeout: 15000, react: true });

            let members = message.guild.members.cache.filter(member => !member.roles.cache.has(familyRole) && (guildTags.some(tag => member.user.username.includes(tag)) || member.user.discriminator == guildDiscriminator));
            let size = members.size;
            let index = 0;

            if(!members.size) return message.channel.error(message, Embed.setDescription(`Sunucuda tagı olup ekip rolü olmayan bir üye bulunmuyor!`), { timeout: 8000, react: true });
            
            if(mark) message.react(mark);
            message.channel.send(Embed.setDescription(`Sunucudaki tagı olup ekip rolü olmayan üyelere ${role.toString()} rolü **veriliyor** ${loading ? loading : ``}`)).then(async msg => {

                await new Promise(async (resolve) => {

                    members.forEach(async member => {

                        index += 1;
                        await client.wait(index * 250);
                        member.roles.add(familyRole);
                        await new roleLog({ guildID: message.guild.id, staffID: message.author.id, userID: member.id, roleID: familyRole, date: Date.now(), type: 'ROLE-ADD' }).save();

                    });
                    await client.wait(size * 250).then(resolve);

                });

                msg.edit(Embed.setDescription(`${success ? success : ``} Sunucudaki tagı olup ekip rolü olmayan **${size}** üyeye ${role.toString()} rolü **verildi!**`));

            });

        } else if (['al'].some(arg => args[0].toLowerCase() == arg)) {

            let role = message.guild.roles.cache.get(familyRole);

            if(!familyRole || !role) return message.channel.error(message, Embed.setDescription(`Ekip rolü ayarlanmamış, lütfen botun yapımcısıyla iletişime geçin!`), { timeout: 15000, react: true });

            let members = message.guild.members.cache.filter(member => member.roles.cache.has(familyRole) && !guildTags.some(tag => member.user.username.includes(tag)) && member.user.discriminator !== guildDiscriminator);
            let size = members.size;
            let index = 0;

            if(!members.size) return message.channel.error(message, Embed.setDescription(`Sunucuda tagı olmadığı halde ekip rolü olan bir üye bulunmuyor!`), { timeout: 8000, react: true });
            
            if(mark) message.react(mark);
            message.channel.send(Embed.setDescription(`Sunucudaki tagı olmadığı halde ekip rolü olan üyelerden ${role.toString()} rolü **alınıyor** ${loading ? loading : ``}`)).then(async msg => {

                await new Promise(async (resolve) => {

                    members.forEach(async member => {

                        index += 1;
                        await client.wait(index * 250);
                        member.roles.remove(familyRole);
                        await new roleLog({ guildID: message.guild.id, staffID: message.author.id, userID: member.id, roleID: familyRole, date: Date.now(), type: 'ROLE-REMOVE' }).save();

                    });
                    await client.wait(size * 250).then(resolve);

                });

                msg.edit(Embed.setDescription(`${success ? success : ``} Sunucudaki tagı olmadığı halde ekip rolü olan **${size}** üyeden ${role.toString()} rolü **alındı!**`));

            });

        };

    },
};