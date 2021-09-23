const { success } = require('../../configs/emojis.json');

module.exports = {
    name: 'ortalamayaş',
    aliases: ['ortayaş', 'yaşortalaması', 'yaşorta', 'yaş'],
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

    async execute(client, message, args, Embed) {

        let age16 = message.guild.members.cache.filter(member => member.displayName.includes('16'));
        let age17 = message.guild.members.cache.filter(member => member.displayName.includes('17'));
        let age18 = message.guild.members.cache.filter(member => member.displayName.includes('18'));
        let age19 = message.guild.members.cache.filter(member => member.displayName.includes('19'));
        let age20 = message.guild.members.cache.filter(member => member.displayName.includes('20'));

        message.channel.success(message, Embed.setDescription(`
${success ? success : ``} Sunucudaki yaş ortalaması :

Sunucuda yaşı __16__ olan toplam **${age16.size}** kişi bulunuyor
Sunucuda yaşı __17__ olan toplam **${age17.size}** kişi bulunuyor
Sunucuda yaşı __18__ olan toplam **${age18.size}** kişi bulunuyor
Sunucuda yaşı __19__ olan toplam **${age19.size}** kişi bulunuyor
Sunucuda yaşı __20__ olan toplam **${age20.size}** kişi bulunuyor
        `), { react: true });

    },
};