const { Owners } = global.client.settings;
const { guildTags, guildDiscriminator, registration, unregister } = global.client.guildSettings;
const { familyRole, log } = registration;
const { unregisterRole, dailyUnregisterLimit, unregisterName } = unregister;
const registers = require('../../schemas/registers.js');
const moment = require('moment');
require('moment-duration-format');
moment.locale('tr');

module.exports = {
    name: 'kayıtsız',
    aliases: ['unregister', 'unreg'],
    category: 'Kayıt',
    usage: '<@Üye/ID>',
    permission: 'ADMINISTRATOR',
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
        let reason = args.slice(1).join(' ');
        
        if(!unregisterRole) return message.channel.error(message, Embed.setDescription(`Kayıtsız rolleri ayarlanmamış, lütfen botun yapımcısıyla iletişime geçin!`), { timeout: 15000, react: true });
        if(!args[0]) return message.channel.error(message, Embed.setDescription(`Kayıtsıza atılacak üyeyi belirtmelisin!`), { timeout: 8000, react: true });
        if(!user) return message.channel.error(message, Embed.setDescription(`Geçerli bir üye belirtmelisin!`), { timeout: 8000, react: true });
        if(user.id == message.author.id) return message.channel.error(message, Embed.setDescription(`Bu işlemi kendine uygulayamazsın!`), { timeout: 8000, react: true });
        if(user.user.bot) return message.channel.error(message, Embed.setDescription(`Bu işlem botlar üzerinde uygulanamaz!`), { timeout: 8000, react: true });
        if(Owners.includes(user.user.id) || user.hasPermission(8)) return message.channel.error(message, Embed.setDescription(`Yetkili birine bu işlemi uygulayamazsın!`), { timeout: 8000, react: true });
        if(user.roles.highest.position >= message.member.roles.highest.position) return message.channel.error(message, Embed.setDescription(`Seninle aynı veya daha yüksek yetkide olan birine bu işlemi uygulayamazsın!`), { react: true });
        if(user.roles.cache.has(unregisterRole)) return message.channel.error(message, Embed.setDescription(`Belirttiğin üye zaten kayıtsızda!`), { timeout: 8000, react: true });
        
        let staffDatas = await registers.find({ guildID: message.guild.id, staffID: message.author.id });
        staffDatas = staffDatas.filter(staffData => staffData.options && staffData.options.unregister && staffData.options.unregisterStaff == message.author.id && (Date.now() - staffData.options.unregisterDate) < 24 * 3600 *1000 );

        if(!Owners.includes(user.user.id) && !user.hasPermission(8) && dailyUnregisterLimit > 0 && staffDatas.length && staffDatas.length >= dailyUnregisterLimit) return message.channel.error(message, Embed.setDescription(`Günlük kayıtsız sınırına ulaştın!`), { timeout: 8000, react: true });
        if(!user.manageable) return message.channel.error(message, Embed.setDescription(`Belirttiğin üyeye işlem yapamıyorum!`), { timeout: 8000, react: true });

        user.roles.set([unregisterRole]);
        if(familyRole && ((guildTags.length && guildTags.some(tag => user.user.username.includes(tag))) || (guildDiscriminator && user.user.discriminator == guildDiscriminator))) user.roles.add(familyRole);
        if(unregisterName) user.setNickname(unregisterName);
        let datas = await registers.find({ guildID: message.guild.id, userID: user.id, }).sort({ row: -1 });

        if(datas.length) {

            let firstData = datas[0];
            
            if(firstData.completed) {

                let options = firstData.options;
                options.unregister = true;
                options.unregisterRole = unregisterRole;
                options.unregisterStaff = message.author.id;
                options.unregisterDate = Date.now();
                await registers.findOneAndUpdate({ row: firstData.row, guildID: message.guild.id, userID: user.id }, { $set: { options: options } });

            } else {

                let options = firstData.options;
                options.unregister  = true;
                options.unregisterRole = unregisterRole;
                options.unregisterStaff = message.author.id;
                options.unregisterDate = Date.now();
                await registers.findOneAndUpdate({ row: firstData.row, guildID: message.guild.id, userID: user.id }, { $set: { completed: true, options: options } });

            };

        };

        message.channel.success(message, Embed.setDescription(`${user.toString()} adlı üye${reason ? ` \`${reason}\` nedeniyle` : ``} kayıtsıza atıldı!`), { react: true });
        let channel = message.guild.channels.cache.get(log);

        if(channel && channel.type == 'text') channel.send(Embed.setDescription(`
${user.toString()} üyesi kayıtsıza atıldı :

**Kayıtsıza Atılan Üye :** \`${user.user.tag} (${user.user.id})\`
**Kayıtsıza Atan Yetkili :** \`${message.author.tag} (${message.author.id}),\`
**Kayıtsıza Atılma Tarihi :** \`${moment(Date.now()).format('DD MMMM YYYY (HH:mm)')}\`
**Kayıtsıza Atılma Sebebi :** \`${!reason ? 'Belirtilmedi!' : reason}\`
        `));

    },
};