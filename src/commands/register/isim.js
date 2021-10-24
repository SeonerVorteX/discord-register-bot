const { adds, curses } = global.client;
const { Owners, Footer } = global.client.settings;
const { botYt, registration, quarantine } = global.client.guildSettings;
const { unifying, nameTag, staffs, minAge, maxAge, limit, penalBlockLimit, penalPointBlockLimit, log, man, woman } = registration;
const { quarantineDateLimit } = quarantine;
const { manRole } = man;
const { womanRole } = woman;
const penals = require('../../schemas/penals.js');
const registers = require('../../schemas/registers.js');
const penalPoints = require('../../schemas/penalPoints.js');
const moment = require('moment');
require('moment-duration-format');
moment.locale('tr');

module.exports = {
    name: 'isim',
    aliases: ['i'],
    category: 'Kayıt',
    usage: '<@Üye/ID> <İsim> <Yaş>',
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
        
        if(!args[0]) return message.channel.error(message, Embed.setDescription(`İsmi değiştirilecek üyeyi belirtmelisin!`), { timeout: 8000, react: true });
        if(!user) return message.channel.error(message, Embed.setDescription(`Geçerli bir üye belirtmelisin!`), { timeout: 8000, react: true });
        if(user.user.bot) return message.channel.error(message, Embed.setDescription(`Bu işlem botlar üzerinde uygulanamaz!`), { timeout: 8000, react: true });
        if(user.id == message.author.id) return message.channel.error(message, Embed.setDescription(`Bu işlemi kendine uygulayamazsın!`), { timeout: 8000, react: true });
        if(staffs.some(role => user.roles.cache.has(role)) || user.roles.cache.has(botYt) || user.hasPermission('MANAGE_ROLES')) return message.channel.error(message, Embed.setDescription(`Yetkili birine bu işlemi uygulayamazsın!`), { timeout: 8000, react: true });
        if(user.roles.highest.position >= message.member.roles.highest.position) return message.channel.error(message, Embed.setDescription(`Seninle aynı veya daha yüksek rolde olan birine bu işlemi uygulayamazsın!`), { react: true });
        
        let security = await client.checkSecurity(user.user, quarantineDateLimit);
        let userPenals = await penals.find({ guildID: message.guild.id, userID: user.id });
        let penalPoint = await penalPoints.findOne({ guildID: message.guild.id, userID: user.id });
        let staffDatas = await registers.find({ guildID: message.guild.id });
        let dataArray = new Array();
        
        await new Promise((resolve) => {
            
            staffDatas.filter(staffData => staffData.nameArray.length).map(staffData => {
                staffData.nameArray.filter(Object => Object.staffID == message.author.id && (Date.now() - Object.date) < 600 * 1000).forEach(Object => dataArray.push(Object));
            });
            resolve();
            
        });
        
        if(!Owners.includes(message.author.id) && !message.member.hasPermission(8) && !security) return message.channel.error(message, Embed.setDescription(`Belirtilen üyenin hesabı yakın bir zamanda açıldığı için ismi değiştirilmeye uygun değildir, lütfen \`Yönetici\` yetkisine sahip yetkililere ulaş!`), { timeout: 10000 , react: true });
        if(!Owners.includes(message.author.id) && !message.member.hasPermission(8) && userPenals.length && userPenals.length && userPenals.length >= penalBlockLimit) return message.channel.error(message, Embed.setDescription(`Belirttiğin üye **${userPenals.length}** ceza kaydına sahip. Sunucu güvenliği için bu işlem uygulanamaz, lütfen \`Yönetici\` yetkisine sahip yetkililere ulaş!`), { timeout: 8000, react: true });
        if(!Owners.includes(message.author.id) && !message.member.hasPermission(8) && penalPoint && penalPointBlockLimit && penalPoint.penalPoint >= penalPointBlockLimit) return message.channel.error(message, Embed.setDescription(`Belirttiğin üye **${penalPoint.penalPoint}** ceza puanına sahip. Sunucu güvenliği için bu işlem uygulanamaz, lütfen \`Yönetici\` yetkisine sahip yetkililere ulaş!`), { timeout: 10000, react: true });
        if(!Owners.includes(message.author.id) && !message.member.hasPermission(8) && message.member.roles.cache.has(botYt) && limit > 0 && dataArray.length >= limit) return message.channel.error(message, Embed.setDescription(`Üyelerin ismini çok hızlı değiştiriyorsun, biraz sonra tekrar dene!`), { timeout: 8000, react: true });
        if(!user.manageable) return message.channel.error(message, Embed.setDescription(`Belirttiğin üyeye bu işlemi uygulayamıyorum!`), { timeout: 8000, react: true });
        
        let name = args[1];
        let age = args[2];
        
        if(!name) return message.channel.error(message, Embed.setDescription(`Bir isim belirtmelisin!`), { timeout: 8000, react: true });
        if(name.length > 20) return message.channel.error(message, Embed.setDescription(`Belirtilen isim çok uzun!`), { timeout: 8000, react: true });
        if(adds.some(add => name.includes(add)) || curses.some(curse => name == curse)) return message.channel.error(message, Embed.setDescription(`Üyenin isminde reklam, küfür ve ya benzeri içerikler kullanamazsın!`), { timeout: 8000, react: true });
        if(!age) return message.channel.error(message, Embed.setDescription(`Bir yaş belirtmelisin!`), { timeout: 8000, react: true });
        if(isNaN(age) || age == 0 || age.includes('-')) return message.channel.error(message, Embed.setDescription(`Geçerli bir yaş belirtmelisin!`), { timeout: 8000, react: true });
        if(minAge && maxAge && (age >= maxAge || age <= minAge)) return message.channel.error(message, Embed.setDescription(`Üyenin yaşı kayıt olmaya uygun değildir!`), { timeout: 8000, react: true });
        
        let Name = name.toLocaleLowerCase()[0].toUpperCase() + name.toLocaleLowerCase().substring(1);

        if(user.displayName.replace(unifying.trim(), ' ').replace(nameTag, '').split(/ +/).join(' ') == `${Name} ${age}`) return message.channel.error(message, Embed.setDescription(`Belirtilen üyenin ismi zaten böyle`), { timeout: 8000, react: true });
        
        await user.setNickname(`${nameTag ? nameTag : ``} ${Name}${unifying ? unifying : ' '}${age}`);
        user = message.guild.members.cache.get(user.id);

        let data = await registers.findOne({ completed: false, guildID: message.guild.id, userID: user.id, });
        if(data) {
        
            if(data.gender) {

                data = await registers.findOneAndUpdate({ completed: false, guildID: message.guild.id, userID: user.id, }, { $set: { completed: true }, $push: { nameArray: { name: user.displayName, staffID: message.author.id, date: Date.now() } } });
            
            } else {

                data = await registers.findOneAndUpdate({ completed: false, guildID: message.guild.id, userID: user.id, }, { $push: { nameArray: { name: user.displayName, staffID: message.author.id, date: Date.now() } } });

            };

        } else if(!data && (user.roles.cache.has(manRole) || user.roles.cache.has(womanRole))) {

            let datas = await registers.find({ completed: true, guildID: message.guild.id, userID: user.id }).sort({ row: -1 });

            if(datas.length) {

                let firstData = datas[0];
                data = await registers.findOneAndUpdate({ row: firstData.row, guildID: message.guild.id, userID: user.id }, { $push: { nameArray: { name: user.displayName, staffID: message.author.id, date: Date.now() } } });

            } else {

                if(user.roles.cache.has(manRole)) data = await client.newRegister(true, 'MAN', message.guild.id, user.id, message.author.id, Date.now(), [{ name: user.displayName, staffID: message.author.id, date: Date.now() }], { role: manRole });
                else data = await client.newRegister(true, 'WOMAN', message.guild.id, user.id, message.author.id, Date.now(), [{ name: user.displayName, staffID: message.author.id, date: Date.now() }], { role: womanRole });
                
            };

        } else data = await client.newRegister(false, undefined, message.guild.id, user.id, undefined, undefined, [{ name: user.displayName, staffID: message.author.id, date: Date.now() }], undefined);
        
        message.channel.success(message, Embed.setFooter(`${Footer} • Üyenin ceza puanı : ${penalPoint ? penalPoint.penalPoint : 0}`).setDescription(`${user.toString()} adlı üyenin ismi \`${Name}${unifying ? unifying : ' '}${age}\` olarak değiştirildi!`), { react: true });
        let channel = message.guild.channels.cache.get(log);

        if(channel && channel.type == 'text') channel.send(Embed.setFooter(Footer).setDescription(`
${user.toString()} üyesinin ismi \`${Name}${unifying ? unifying : ' '}${age}\` olarak değiştirildi :

**Kayıt Sırası :** \`${data.row}\`
**İsmi Değiştirilen Üye :** \`${user.user.tag} (${user.user.id})\`
**İsmi Değiştiren Yetkili :** \`${message.author.tag} (${message.author.id})\`
**Değiştirilme Tarihi :** \`${moment(Date.now()).format('DD MMMM YYYY (HH:mm)')}\`
        `));

    },
};
