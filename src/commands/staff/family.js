const { guildTags, guildDiscriminator } = global.client.guildSettings;
const { staffs, familyRole } = global.client.guildSettings.registration;
const roleLog = require('../../schemas/roleLog.js');

module.exports = {
    name: 'family',
    aliases: ['crew'],
    category: 'Staff',
    usage: '<@Üye/ID>',
    staff: true, 
    guildOnly: true,
    cooldown: 3,

    /**
     * 
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args 
     * @param { MessageEmbed } Embed 
     */

    async execute(client, message, args, Embed) {

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if(!args[0]) return message.channel.error(message, Embed.setDescription(`Bir üye belirtmelisin!`), { timeout: 8000, react: true });
        if(!user) return message.channel.error(message, Embed.setDescription(`Geçerli bir üye belirtmelisin!`), { timeout: 8000, react: true });
        if(!familyRole || !message.guild.roles.cache.has(familyRole)) return message.channel.error(message, Embed.setDescription(`Family rolü ayarlanmamış. Lütfen botun yapımcısıyla iletişime geçin!`), { timeout: 15000, react: true });
        if(user.id == message.author.id) return message.channel.error(message, Embed.setDescription(`Bu işlemi kendine uygulayamazsın!`), { timeout: 8000, react: true });
        if(staffs.some(role => user.roles.cache.has(role))) return message.channel.error(message, Embed.setDescription(`Yetkili birine bu işlemi uygulayamazsın!`), { timeout: 8000, react: true });
        if(user.roles.highest.position >= message.member.roles.highest.position) return message.channel.error(message, Embed.setDescription(`Kendinle aynı veya daha yüksek rolde olan birine bu işlemi uygulayamazsın!`), { timeout: 8000, react: true });
        if(user.roles.cache.has(familyRole)) return message.channel.error(message, Embed.setDescription(`Bu üye zaten Family rolüne sahip!`), { timeout: 8000, react: true });
        if(((guildTags.length && !guildTags.some(tag => user.user.username.includes(tag))) && (guildDiscriminator && user.user.discriminator !== guildDiscriminator))) return message.channel.error(message, Embed.setDescription(`Belirtilen üye tagımıza sahip olmadığı için işlem durduruldu!`), { timeout: 10000, react: true });
        if(!user.manageable) return message.channel.error(message, Embed.setDescription(`Bu üyeye işlem yapamıyorum!`), { timeout: 8000, react: true });
        
        user.roles.add(familyRole).catch(() => {});
        message.channel.success(message, Embed.setDescription(`${user.toString()} üyesine ${message.guild.roles.cache.get(familyRole).toString()} rolü verildi!`));
        await new roleLog({ guildID: message.guild.id, staffID: message.author.id, userID: user.id, roleID: familyRole, date: Date.now(), type: 'ROLE-ADD' }).save();

    },
};