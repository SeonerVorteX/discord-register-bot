const { success, crown2 } = require('../../configs/emojis.json');

module.exports = {
    name: 'girişbilgi',
    aliases: ['entryinfo', 'giriş', 'giris', 'girisbilgi'],
    category: 'Admin',
    usage: '',
    permission: 'ADMINISTRATOR',
    guildOnly: true, 
    cooldown: 5,

    /**
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args 
     * @param { MessageEmbed } Embed 
     */

    execute(client, message, args, Embed) {

        message.channel.success(message, Embed.setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true })).setDescription(`
${success ? success : ``} Sunucudaki üyelerin giriş bilgileri :

${crown2 ? crown2 : ``} Sunucuya son \`1 saatte\` toplam **${message.guild.members.cache.filter(member => (Date.now() - member.joinedTimestamp) < 3600000).size}** üye giriş yaptı
${crown2 ? crown2 : ``} Sunucuya son \`1 günde\` toplam **${message.guild.members.cache.filter(member => (Date.now() - member.joinedTimestamp) < 86400000).size}** üye giriş yaptı
${crown2 ? crown2 : ``} Sunucuya son \`1 haftada\` toplam **${message.guild.members.cache.filter(member => (Date.now() - member.joinedTimestamp) < 604800000).size}** üye giriş yaptı
${crown2 ? crown2 : ``} Sunucuya son \`1 ayda\` toplam **${message.guild.members.cache.filter(member => (Date.now() - member.joinedTimestamp) < 2592200000).size}** üye giriş yaptı
        `))

    },
};