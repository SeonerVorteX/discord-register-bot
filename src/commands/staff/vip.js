const { Owners, Footer } = global.client.settings;
const { unAuthorizedMessages, botYt, registration, quarantine } = global.client.guildSettings;
const { staffs, penalBlockLimit, log, vip, man, woman } = registration;
const { quarantineDateLimit } = quarantine;
const { vipRole, onlyAdmins, dailyVipLimit } = vip;
const { manRole } = man;
const { womanRole } = woman;
const penalPoints = require('../../schemas/penalPoints.js');
const registers = require('../../schemas/registers.js');
const penals = require('../../schemas/penals.js');
const moment = require('moment');
require('moment-duration-format');
moment.locale('tr');

module.exports = {
    name: 'vip',
    aliases: ['v'],
    category: 'Yetkili',
    usage: '<@Üye/ID>',
    guildOnly: true,
    cooldown: 4,

    /**
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args 
     * @param { MessageEmbed } Embed 
     */

    async execute(client, message, args, Embed) {

        if(onlyAdmins && (!Owners.includes(message.author.id) && !message.member.hasPermission(8) && !message.member.roles.cache.has(botYt) && !staffs.some(role => message.member.roles.cache.has(role)))) {
            if(unAuthorizedMessages) return message.channel.error(message, `Maalesef, bu komutu kullana bilmek için yeterli yetkiye sahip değilsin!`, { timeout: 10000 });
            else return;
        };;

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        
        if(!vipRole) return message.channel.error(message, Embed.setDescription(`Vip rolü ayarlanmamış, lütfen botun yapımcısıyla iletişime geçin!`), { timeout: 15000, react: true });
        if(!args[0]) return message.channel.error(message, Embed.setDescription(`Vip rolü verilecek üyeyi belirtmelisin!`), { timeout: 8000, react: true });
        if(!user) return message.channel.error(message, Embed.setDescription(`Geçerli bir üye belirtmelisin!`), { timeout: 8000, react: true });
        if(user.user.bot) return message.channel.error(message, Embed.setDescription(`Bu işlem botlar üzerinde uygulanamaz!`), { timeout: 8000, react: true });
        if(user.id == message.author.id) return message.channel.error(message, Embed.setDescription(`Bu işlemi kendine uygulayamazsın!`), { timeout: 8000, react: true });
        if(staffs.some(role => user.roles.cache.has(role)) || user.roles.cache.has(botYt) || user.hasPermission('MANAGE_ROLES')) return message.channel.error(message, Embed.setDescription(`Yetkili birine bu işlemi uygulayamazsın!`), { timeout: 8000, react: true });
        if(user.roles.highest.position >= message.member.roles.highest.position) return message.channel.error(message, Embed.setDescription(`Seninle aynı veya daha yüksek rolde olan birine bu işlemi uygulayamazsın!`), { react: true });
        if(user.roles.cache.has(vipRole)) return message.channel.error(message, Embed.setDescription(`Belirttiğin üye zaten vip rolüne sahip!`), { timeout: 8000, react: true });

        let security = await client.checkSecurity(user.user, quarantineDateLimit);
        let userPenals = await penals.find({ guildID: message.guild.id, userID: user.id });
        let userPoint = await penalPoints.findOne({ guildID: message.guild.id, userID: user.id });
        let staffDatas = await registers.find({ guildID: message.guild.id });
        staffDatas.filter(staffData => staffData.options && staffData.options.vip && staffData.options.vipStaff == message.author.id && (Date.now() - staffData.options.vipDate) < 24 * 3600 *1000 );
        
        if(!Owners.includes(message.author.id) && !message.member.hasPermission(8) && !security) return message.channel.error(message, Embed.setDescription(`Belirtilen üyenin hesabı yakın bir zamanda açıldığı için vip alınmaya uygun değildir, lütfen \`Yönetici\` yetkisine sahip yetkililere ulaş!`), { timeout: 10000 , react: true });
        if(!Owners.includes(message.author.id) && !message.member.hasPermission(8) && userPenals.length && userPenals.length >= penalBlockLimit) return message.channel.error(message, Embed.setDescription(`Belirttiğin üye **${userPenals.length}** ceza kaydına sahip. Sunucu güvenliği için vip alınamaz, lütfen \`Yönetici\` yetkisine sahip yetkililere ulaş!`), { timeout: 8000, react: true });
        if(!Owners.includes(message.author.id) && !message.member.hasPermission(8) && userPoint && penalPointBlockLimit && userPoint.penalPoint >= penalPointBlockLimit) return message.channel.error(message, Embed.setDescription(`Belirttiğin üye **${userPoint.penalPoint}** ceza puanına sahip. Sunucu güvenliği için vip alınamaz, lütfen \`Yönetici\` yetkisine sahip yetkililere ulaş!`), { timeout: 10000, react: true });
        if(!Owners.includes(message.author.id) && !message.member.hasPermission(8) && dailyVipLimit > 0 && staffDatas.length && staffDatas.length >= dailyVipLimit) return message.channel.error(message, Embed.setDescription(`Günlük vip sınırına ulaştın!`), { timeout: 8000, react: true });
        if(!user.manageable) return message.channel.error(message, Embed.setDescription(`Belirttiğin üyeye işlem yapamıyorum!`), { timeout: 8000, react: true });

        user.roles.add(vipRole);
        let data = await registers.findOne({ completed: false, guildID: message.guild.id, userID: user.id });

        if(data) {

            let options = data.options;
            options.vip = true;
            options.vipRole = vipRole;
            options.vipStaff = message.author.id;
            options.vipDate = Date.now();
            data = await registers.findOneAndUpdate({ completed: false, guildID: message.guild.id, userID: user.id, }, { $set: { options: options } });

        } else if(!data && (user.roles.cache.has(manRole) || user.roles.cache.has(womanRole))) {

            let datas = await registers.find({ completed: true, guildID: message.guild.id, userID: user.id }).sort({ row: -1 });

            if(datas.length) {

                let firstData = datas[0];
                let options = firstData.options;
                options.vip = true;
                options.vipRole = vipRole;
                options.vipStaff = message.author.id;
                options.vipDate = Date.now();
                data = await registers.findOneAndUpdate({ row: firstData.row, guildID: message.guild.id, userID: user.id }, { $set: { options: options } });

            } else {

                if(user.roles.cache.has(manRole)) data = await client.newRegister(true, 'MAN', message.guild.id, user.id, message.author.id, Date.now(), [{ name: user.displayName, staffID: message.author.id, date: Date.now()}], { role: manRole, vip: true, vipRole: vipRole, vipStaff: message.author.id, vipDate: Date.now() });
                else if(user.roles.cache.has(womanRole)) data = await client.newRegister(true, 'WOMAN', message.guild.id, user.id, message.author.id, Date.now(), [{ name: user.displayName, staffID: message.author.id, date: Date.now()}], { role: womanRole, vip: true, vipRole: vipRole, vipStaff: message.author.id, vipDate: Date.now() });
            
            };

        } else data = await client.newRegister(false, undefined, message.guild.id, user.id, undefined, undefined, undefined, { vip: true, vipRole: vipRole, vipStaff: message.author.id, vipDate: Date.now() });
        
        staffDatas = await registers.find({ guildID: message.guild.id });
        staffDatas = staffDatas.filter(data => data.options.vip && data.options.vipStaff == message.author.id);

        message.channel.success(message, Embed.setFooter(`${Footer} • Toplam vip alım sayınız : ${staffDatas.length}`).setDescription(`${user.toString()} adlı üyeye ${message.guild.roles.cache.get(vipRole).toString()} rolü verildi!`), { react: true });
        let channel = message.guild.channels.cache.get(log);

        if(channel && channel.type == 'text') channel.send(Embed.setFooter(Footer).setDescription(`
${user.toString()} üyesi **vip** olarak alındı :

**Vip Alınan Üye :** \`${user.user.tag} (${user.user.id})\`
**Vip Alan Yetkili :** \`${message.author.tag} (${message.author.id})\`
**Vip Alım Tarihi :** \`${moment(Date.now()).format('DD MMMM YYYY (HH:mm)')}\`
        `));

    },
};