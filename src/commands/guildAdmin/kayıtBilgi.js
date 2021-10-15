const { success } = require('../../configs/emojis.json');
const registers = require('../../schemas/registers.js');
const moment = require('moment');
require('moment-duration-format');
moment.locale('tr');

module.exports = {
    name: 'kayıtbilgi',
    aliases: ['kayıtsorgu'],
    category: 'Admin',
    usage: '<Sıra>',
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

        if(!args[0]) return message.channel.error(message, Embed.setDescription(`Bir kayıt sırası belirtmelisin!`), { timeout: 8000, react: true });

        let row = args[0];

        if(isNaN(row) || row.includes('-')) return message.channel.error(message, Embed.setDescription(`Geçerli bir kayıt sırası belirtmelisin!`), { timeout: 8000, react: true });

        let register = await registers.findOne({ row: row, guildID: message.guild.id });

        if(!register) return message.channel.error(message, Embed.setDescription(`Veritabanında sırası \`${row}\` olan bir kayıt verisi bulunamadı!`), { timeout: 8000, react: true });

        let user = await client.fetchUser(register.userID);
        let staff = await client.fetchUser(register.staffID);

        message.channel.success(message, Embed.setThumbnail(user.avatarURL({ dynamic: true })).setDescription(`
${success ? success : ``} \`${row}\` sıralı${register.gender && register.gender == 'MAN' ? ` **erkek**` : register.gender && register.gender == 'WOMAN' ? ` **kadın**` : ``} kaydın bilgileri :

**Kayıt Edilen Üye :** ${user.toString()}
**Kayıt Eden Yetkili :** ${staff.toString()} ${register.nameArray.length ? `\n**Kayıt Edildiği Son İsim :** \`${register.nameArray[register.nameArray.length-1].name}\`` : ``}
**Kayıt Edilme Tarihi :** \`${moment(register.date).format('DD MMMM YYYY (HH:mm)')}\`
        `), { react: true });

    },
};