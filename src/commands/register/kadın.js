const { Owners, Footer } = global.client.settings;
const { guildTags, guildDiscriminator, guildChat, botYt, registration, unregister, quarantine } = global.client.guildSettings;
const { staffs, limit, requireTag, penalBlockLimit, penalPointBlockLimit, log, woman, man, vip } = registration;
const { quarantineDateLimit } = quarantine;
const { womanRole, otherWomanRoles } = woman;
const { unregisterRole } = unregister;
const { manRole } = man;
const { vipRole } = vip;
const penals = require('../../schemas/penals.js');
const registers = require('../../schemas/registers.js');
const penalPoints = require('../../schemas/penalPoints.js');
const moment = require('moment');
require('moment-duration-format');
moment.locale('tr');

module.exports = {
    name: 'kadın',
    aliases: ['k'],
    category: 'Kayıt',
    usage: '<@Üye/ID>',
    staff: true,
    guildOnly: true,
    cooldown: 3,

    /**
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args 
     * @param { MessageEmbed } Embed 
     */

    async execute(client, message, args, Embed) {

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let chat = message.guild.channels.cache.get(guildChat);
        let channel = message.guild.channels.cache.get(log);
        
        if(!womanRole) return message.channel.error(message, Embed.setDescription(`Kayıt rolleri ayarlanmamış, lütfen botun yapımcısıyla iletişime geçin!`), { timeout: 15000, react: true });
        if(!args[0]) return message.channel.error(message, Embed.setDescription(`Kadın olarak kayıt edilecek üyeyi belirtmelisin!`), { timeout: 8000, react: true });
        if(!user) return message.channel.error(message, Embed.setDescription(`Geçerli bir üye belirtmelisin!`), { timeout: 8000, react: true });
        if(user.user.bot) return message.channel.error(message, Embed.setDescription(`Bu işlem botlar üzerinde uygulanamaz!`), { timeout: 8000, react: true });
        if(user.id == message.author.id) return message.channel.error(message, Embed.setDescription(`Bu işlemi kendine uygulayamazsın!`), { timeout: 8000, react: true });
        if(staffs.some(role => user.roles.cache.has(role)) || user.roles.cache.has(botYt) || user.hasPermission('MANAGE_ROLES')) return message.channel.error(message, Embed.setDescription(`Yetkili birine bu işlemi uygulayamazsın!`), { timeout: 8000, react: true });
        if(user.roles.highest.position >= message.member.roles.highest.position) return message.channel.error(message, Embed.setDescription(`Seninle aynı veya daha yüksek rolde olan birine bu işlemi uygulayamazsın!`), { react: true });
        if(user.roles.cache.has(womanRole) || user.roles.cache.has(manRole)) return message.channel.error(message, Embed.setDescription(`Belirttiğin üye zaten kayıtlı!`), { timeout: 8000, react: true });
        
        let security = await client.checkSecurity(user.user, quarantineDateLimit);
        let userPenals = await penals.find({ guildID: message.guild.id, userID: user.id });
        let userPoint = await penalPoints.findOne({ guildID: message.guild.id, userID: user.id });
        let staffDatas = await registers.find({ guildID: message.guild.id, staffID: message.author.id });
        staffDatas = staffDatas.filter(staffData => staffData.date && (Date.now() - staffData.date) < 600 * 1000);
        
        if(!Owners.includes(message.author.id) && !message.member.hasPermission(8) && !security) return message.channel.error(message, Embed.setDescription(`Belirtilen üyenin hesabı yakın bir zamanda açıldığı için kayıt olmaya uygun değildir, lütfen \`Yönetici\` yetkisine sahip yetkililere ulaş!`), { timeout: 10000 , react: true });
        if(!Owners.includes(message.author.id) && !message.member.hasPermission(8) && userPenals.length && userPenals.length >= penalBlockLimit) return message.channel.error(message, Embed.setDescription(`Belirttiğin üye **${userPenals.length}** ceza kaydına sahip. Sunucu güvenliği için içeri alınamaz, lütfen \`Yönetici\` yetkisine sahip yetkililere ulaş!`), { timeout: 10000, react: true });
        if(!Owners.includes(message.author.id) && !message.member.hasPermission(8) && userPoint && penalPointBlockLimit && userPoint.penalPoint >= penalPointBlockLimit) return message.channel.error(message, Embed.setDescription(`Belirttiğin üye **${userPoint.penalPoint}** ceza puanına sahip. Sunucu güvenliği için içeri alınamaz, lütfen \`Yönetici\` yetkisine sahip yetkililere ulaş!`), { timeout: 10000, react: true });
        if(!Owners.includes(message.author.id) && !message.member.hasPermission(8) && message.member.roles.cache.has(botYt) && limit > 0 && staffDatas.length >= limit) return message.channel.error(message, Embed.setDescription(`Üyeleri çok hızlı kayıt ediyorsun, biraz sonra tekrar dene!`), { timeout: 10000, react: true });
        if(!user.manageable) return message.channel.error(message, Embed.setDescription(`Belirttiğin üyeyi kayıt edemiyorum!`), { timeout: 8000, react: true });
        if(requireTag && (!vipRole || !user.roles.cache.has(vipRole)) && ((!guildTags.length || !guildTags.some(tag => user.user.username.includes(tag))) && (!guildDiscriminator || user.user.discriminator !== guildDiscriminator))) return message.channel.error(message, Embed.setDescription(`Sunucumuz şuanda taglı alımdadır. Bu yüzden kayıt için üyenin tag alması veya vip alınması gerekiyor!`), { timeout: 10000, react: true });
        
	    otherWomanRoles.push(womanRole);
        await user.roles.add(otherWomanRoles);

        if(unregisterRole && user.roles.cache.has(unregisterRole)) await user.roles.remove(unregisterRole);

        let data = await registers.findOne({ completed: false, guildID: message.guild.id, userID: user.id, });
        
        if(data) {

            if(data.nameArray.length) {

                let options = data.options;
                options.role = womanRole;
                data = await registers.findOneAndUpdate({ completed: false, guildID: message.guild.id, userID: user.id }, { $set: { gender: 'WOMAN', completed: true, staffID: message.author.id, date: Date.now(), options: options } });

            };

        } else data = await client.newRegister(false, 'WOMAN', message.guild.id, user.id, message.author.id, Date.now(), undefined, { role: womanRole });
        
        staffDatas = await registers.find({ guildID: message.guild.id, staffID: message.author.id });
        message.channel.success(message, Embed.setFooter(`${Footer} • Toplam kayıt sayınız : ${staffDatas.length}`).setDescription(`${user.toString()} adlı üye ${message.guild.roles.cache.get(womanRole).toString()} olarak kayıt edildi!`), { react: true });

        if(chat && chat.type == 'text') chat.send(`${user.toString()} kullanıcısı kayıt olarak aramıza katıldı!`);
        if(channel && channel.type == 'text') channel.send(Embed.setFooter(Footer).setDescription(`
${user.toString()} üyesi **kadın** olarak kayıt edildi :

**Kayıt Sırası :** \`${data.row}\`
**Kayıt Edilen Üye :** \`${user.user.tag} (${user.user.id})\`
**Kayıt Eden Yetkili :** \`${message.author.tag} (${message.author.id})\`${data.nameArray.length ? `\n**Kayıt Edildiği İsim :** \`${data.nameArray[data.nameArray.length-1].name}\`` : ``}
**Kayıt Edilme Tarihi :** \`${moment(Date.now()).format('DD MMMM YYYY (HH:mm)')}\`
        `));

    },
};
