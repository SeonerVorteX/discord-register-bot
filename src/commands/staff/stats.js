const { Owners, Prefix } = global.client.settings;
const { botYt, registration } = global.client.guildSettings;
const { staffs } = registration;
const { mark } = require('../../configs/emojis.json');
const registers = require('../../schemas/registers.js');

module.exports = {
    name: 'stats',
    aliases: ['stat', 'me'],
    category: 'Yetkili',
    usage: '<@Üye/ID> [günlük / haftalık / aylık / tümzamanlar]', 
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

        if(!user || user.id == message.author.id) {

            if(!args[0] || (args[0] && ['haftalık', 'hafta', 'weekly', 'week'].some(arg => args[0].toLowerCase() == arg)) || (user && !args[1])) {

                let datas = await registers.find({ guildID: message.guild.id });
                let authorData = { man: datas.filter(data => data.gender == 'MAN' && (Date.now() - data.date) < 604800 * 1000 && data.staffID == message.author.id).length, woman: datas.filter(data => data.gender == 'WOMAN' && (Date.now() - data.date) < 604800 * 1000 && data.staffID == message.author.id).length, vip: datas.filter(data => data.options && data.options.vip && (Date.now() - data.options.vipDate) < 604800 * 1000 && data.options.vipStaff == message.author.id).length, unregister: datas.filter(data => data.options && data.options.unregister && (Date.now() - data.options.unregisterDate) < 604800 * 1000 && data.options.unregisterStaff == message.author.id).length };
                datas = datas.filter(data => (Date.now() - data.date) < 604800 * 1000);
                let Objects = new Object();
    
                datas.forEach(data => Objects[data.staffID] = Number());
                datas.forEach(data => Objects[data.staffID] += 1);
    
                let top = Object.keys(Objects).sort((a, b) => Objects[b] - Objects[a]);
                let rank = top.indexOf(message.author.id);

                message.channel.success(message, Embed.setDescription(`
**➤ Sıralamadaki Bilgilerin :**
Haftalık sıralamada siz ${rank+1 !== 0 ? `**${rank+1}.** sıradasınız :` : `yoksunuz!`}
${rank+1 !== 0 ? `${top[rank-1] ? `\n**[\`${rank}\`]** ${message.guild.members.cache.has(top[rank-1]) ? message.guild.members.cache.get(top[rank-1]).toString() : `<@${top[rank-1]}>`}: \`${Objects[top[rank-1]]} Kayıt\`` : ``}
**[\`${rank+1}\`]** ${message.author.toString()}: \`${Objects[top[rank]]} Kayıt\` **(Siz)**${top[rank+1] ? `\n**[\`${rank+2}\`]** ${message.guild.members.cache.has(top[rank+1]) ? message.guild.members.cache.get(top[rank+1]).toString() : `<@${top[rank+1]}>`}: \`${Objects[top[rank+1]]} Kayıt\`\n` : `\n`}`: ``}
**➤ Kayıt Bilgilerin :**
\`•>\` Bu Haftaki Toplam Erkek Kayıt Sayınız : **${authorData.man}**
\`•>\` Bu Haftaki Toplam Kadın Kayıt Sayınız : **${authorData.woman}**
\`•>\` Bu Haftaki Toplam Vip Alım Sayınız : **${authorData.vip}**
\`•>\` Bu Haftaki Toplam Kayıtsıza Atma Sayınız : **${authorData.unregister}**
                `), { react: true });
                

            } else if((user && args[1] && ['günlük', 'gün', 'daily', 'today', 'day'].some(arg => args[1].toLowerCase() == arg)) || ['günlük', 'gün', 'daily', 'today', 'day'].some(arg => args[0].toLowerCase() == arg)) {

                let datas = await registers.find({ guildID: message.guild.id });
                let authorData = { man: datas.filter(data => data.gender == 'MAN' && (Date.now() - data.date) < 86400 * 1000 && data.staffID == message.author.id).length, woman: datas.filter(data => data.gender == 'WOMAN' && (Date.now() - data.date) < 86400 * 1000 && data.staffID == message.author.id).length, vip: datas.filter(data => data.options && data.options.vip && (Date.now() - data.options.vipDate) < 86400 * 1000 && data.options.vipStaff == message.author.id).length, unregister: datas.filter(data => data.options && data.options.unregister && (Date.now() - data.options.unregisterDate) < 86400 * 1000 && data.options.unregisterStaff == message.author.id).length };
                datas = datas.filter(data => (Date.now() - data.date) < 86400 * 1000);
                let Objects = new Object();
    
                datas.forEach(data => Objects[data.staffID] = Number());
                datas.forEach(data => Objects[data.staffID] += 1);
    
                let top = Object.keys(Objects).sort((a, b) => Objects[b] - Objects[a]);
                let rank = top.indexOf(message.author.id);

                message.channel.success(message, Embed.setDescription(`
**➤ Sıralamadaki Bilgilerin :**
Günlük sıralamada siz ${rank+1 !== 0 ? `**${rank+1}.** sıradasınız :` : `yoksunuz!`}
${rank+1 !== 0 ? `${top[rank-1] ? `\n**[\`${rank}\`]** ${message.guild.members.cache.has(top[rank-1]) ? message.guild.members.cache.get(top[rank-1]).toString() : `<@${top[rank-1]}>`}: \`${Objects[top[rank-1]]} Kayıt\`` : ``}
**[\`${rank+1}\`]** ${message.author.toString()}: \`${Objects[top[rank]]} Kayıt\` **(Siz)**${top[rank+1] ? `\n**[\`${rank+2}\`]** ${message.guild.members.cache.has(top[rank+1]) ? message.guild.members.cache.get(top[rank+1]).toString() : `<@${top[rank+1]}>`}: \`${Objects[top[rank+1]]} Kayıt\`\n` : `\n`}`: ``}
**➤ Kayıt Bilgilerin :**
\`•>\` Bu Günki Toplam Erkek Kayıt Sayınız : **${authorData.man}**
\`•>\` Bu Günki Toplam Kadın Kayıt Sayınız : **${authorData.woman}**
\`•>\` Bu Günki Toplam Vip Alım Sayınız : **${authorData.vip}**
\`•>\` Bu Günki Toplam Kayıtsıza Atma Sayınız : **${authorData.unregister}**
                `), { react: true });

            } else if((user && args[1] && ['aylık', 'ay', 'monthly', 'month'].some(arg => args[1].toLowerCase() == arg)) || ['aylık', 'ay', 'monthly', 'month'].some(arg => args[0].toLowerCase() == arg)) {

                let datas = await registers.find({ guildID: message.guild.id });
                let authorData = { man: datas.filter(data => data.gender == 'MAN' && (Date.now() - data.date) < 2592000 * 1000 && data.staffID == message.author.id).length, woman: datas.filter(data => data.gender == 'WOMAN' && (Date.now() - data.date) < 2592000 * 1000 && data.staffID == message.author.id).length, vip: datas.filter(data => data.options && data.options.vip && (Date.now() - data.options.vipDate) < 2592000 * 1000 && data.options.vipStaff == message.author.id).length, unregister: datas.filter(data => data.options && data.options.unregister && (Date.now() - data.options.unregisterDate) < 2592000 * 1000 && data.options.unregisterStaff == message.author.id).length };
                datas = datas.filter(data => (Date.now() - data.date) < 2592000 * 1000);
                let Objects = new Object();
    
                datas.forEach(data => Objects[data.staffID] = Number());
                datas.forEach(data => Objects[data.staffID] += 1);
    
                let top = Object.keys(Objects).sort((a, b) => Objects[b] - Objects[a]);
                let rank = top.indexOf(message.author.id);

                message.channel.success(message, Embed.setDescription(`
**➤ Sıralamadaki Bilgilerin :**
Aylık sıralamada siz ${rank+1 !== 0 ? `**${rank+1}.** sıradasınız :` : `yoksunuz!`}
${rank+1 !== 0 ? `${top[rank-1] ? `\n**[\`${rank}\`]** ${message.guild.members.cache.has(top[rank-1]) ? message.guild.members.cache.get(top[rank-1]).toString() : `<@${top[rank-1]}>`}: \`${Objects[top[rank-1]]} Kayıt\`` : ``}
**[\`${rank+1}\`]** ${message.author.toString()}: \`${Objects[top[rank]]} Kayıt\` **(Siz)**${top[rank+1] ? `\n**[\`${rank+2}\`]** ${message.guild.members.cache.has(top[rank+1]) ? message.guild.members.cache.get(top[rank+1]).toString() : `<@${top[rank+1]}>`}: \`${Objects[top[rank+1]]} Kayıt\`\n` : `\n`}`: ``}
**➤ Kayıt Bilgilerin :**
\`•>\` Bu Ayki Toplam Erkek Kayıt Sayınız : **${authorData.man}**
\`•>\` Bu Ayki Toplam Kadın Kayıt Sayınız : **${authorData.woman}**
\`•>\` Bu Ayki Toplam Vip Alım Sayınız : **${authorData.vip}**
\`•>\` Bu Ayki Toplam Kayıtsıza Atma Sayınız : **${authorData.unregister}**
                `), { react: true });

            } else if((user && args[1] && ['tümzamanlar', 'tüm', 'hepsi', 'all'].some(arg => args[1].toLowerCase() == arg)) || ['tümzamanlar', 'tüm', 'hepsi', 'all'].some(arg => args[0].toLowerCase() == arg)) {

                let datas = await registers.find({ guildID: message.guild.id });
                let authorData = { man: datas.filter(data => data.gender == 'MAN' && data.staffID == message.author.id).length, woman: datas.filter(data => data.gender == 'WOMAN' && data.staffID == message.author.id).length, vip: datas.filter(data => data.options && data.options.vip && data.options.vipStaff == message.author.id).length, unregister: datas.filter(data => data.options && data.options.unregister && data.options.unregisterStaff == message.author.id).length };
                let Objects = new Object();
    
                datas.forEach(data => Objects[data.staffID] = Number());
                datas.forEach(data => Objects[data.staffID] += 1);
    
                let top = Object.keys(Objects).sort((a, b) => Objects[b] - Objects[a]);
                let rank = top.indexOf(message.author.id);

                message.channel.success(message, Embed.setDescription(`
**➤ Sıralamadaki Bilgilerin :**
Sıralamada siz ${rank+1 !== 0 ? `**${rank+1}.** sıradasınız :` : `yoksunuz!`}
${rank+1 !== 0 ? `${top[rank-1] ? `\n**[\`${rank}\`]** ${message.guild.members.cache.has(top[rank-1]) ? message.guild.members.cache.get(top[rank-1]).toString() : `<@${top[rank-1]}>`}: \`${Objects[top[rank-1]]} Kayıt\`` : ``}
**[\`${rank+1}\`]** ${message.author.toString()}: \`${Objects[top[rank]]} Kayıt\` **(Siz)**${top[rank+1] ? `\n**[\`${rank+2}\`]** ${message.guild.members.cache.has(top[rank+1]) ? message.guild.members.cache.get(top[rank+1]).toString() : `<@${top[rank+1]}>`}: \`${Objects[top[rank+1]]} Kayıt\`\n` : `\n`}`: ``}
**➤ Kayıt Bilgilerin :**
\`•>\` Şimdiye Kadar Toplam Erkek Kayıt Sayınız : **${authorData.man}**
\`•>\` Şimdiye Kadar Toplam Kadın Kayıt Sayınız : **${authorData.woman}**
\`•>\` Şimdiye Kadar Toplam Vip Alım Sayınız : **${authorData.vip}**
\`•>\` Şimdiye Kadar Toplam Kayıtsıza Atma Sayınız : **${authorData.unregister}**
                `), { react: true });

            } else return message.channel.error(message, Embed.setDescription(`${mark ? mark : ``} Doğru kullanım : \`${Prefix}stats günlük / haftalık / aylık / tümzamanlar\``), { timeout: 10000, react: true });

        } else {

            if(user.user.bot) return message.channel.error(message, Embed.setDescription(`Geçerli bir üye belirtmelisin`), { timeout: 8000, react: true });
            if(!Owners.includes(user.id) && !user.hasPermission('MANAGE_ROLES') && !user.roles.cache.has(botYt) && !staffs.some(role => user.roles.cache.has(role))) return message.channel.error(message, Embed.setDescription(`Belirttiğin üye yetkili değil!`), { timeout: 8000, react: true });
            if(!args[1] || ['haftalık', 'hafta', 'weekly', 'week'].some(arg => args[1].toLowerCase() == arg)) {

                let datas = await registers.find({ guildID: message.guild.id });
                let userData = { man: datas.filter(data => data.gender == 'MAN' && (Date.now() - data.date) < 604800 * 1000 && data.staffID == user.id).length, woman: datas.filter(data => data.gender == 'WOMAN' && (Date.now() - data.date) < 604800 * 1000 && data.staffID == user.id).length, vip: datas.filter(data => data.options && data.options.vip && (Date.now() - data.options.vipDate) < 604800 * 1000 && data.options.vipStaff == user.id).length, unregister: datas.filter(data => data.options && data.options.unregister && (Date.now() - data.options.unregisterDate) < 604800 * 1000 && data.options.unregisterStaff == user.id).length };
                datas = datas.filter(data => (Date.now() - data.date) < 604800 * 1000);
                let Objects = new Object();
    
                datas.forEach(data => Objects[data.staffID] = Number());
                datas.forEach(data => Objects[data.staffID] += 1);
    
                let top = Object.keys(Objects).sort((a, b) => Objects[b] - Objects[a]);
                let rank = top.indexOf(user.id);

                message.channel.success(message, Embed.setDescription(`
**➤ Sıralamadaki Bilgileri :**
Haftalık sıralamada \`${user.user.tag}\` üyesi ${rank+1 !== 0 ? `**${rank+1}.** sırada :` : `yok!`}
${rank+1 !== 0 ? `${top[rank-1] ? `\n**[\`${rank}\`]** ${message.guild.members.cache.has(top[rank-1]) ? message.guild.members.cache.get(top[rank-1]).toString() : `<@${top[rank-1]}>`}: \`${Objects[top[rank-1]]} Kayıt\` ${top[rank-1] == message.author.id ? `**(Siz)**` : ``}` : ``}
**[\`${rank+1}\`]** ${user.toString()}: \`${Objects[top[rank]]} Kayıt\` **(Üye)** ${top[rank+1] ? `\n**[\`${rank+2}\`]** ${message.guild.members.cache.has(top[rank+1]) ? message.guild.members.cache.get(top[rank+1]).toString() : `<@${top[rank+1]}>`}: \`${Objects[top[rank+1]]} Kayıt\` ${top[rank+1] == message.author.id ? `**(Siz)**` : ``}\n` : `\n`}`: ``}
**➤ Kayıt Bilgileri :**
\`•>\` Bu Haftaki Toplam Erkek Kayıt Sayı : **${userData.man}**
\`•>\` Bu Haftaki Toplam Kadın Kayıt Sayı : **${userData.woman}**
\`•>\` Bu Haftaki Toplam Vip Alım Sayı : **${userData.vip}**
\`•>\` Bu Haftaki Toplam Kayıtsıza Atma Sayı : **${userData.unregister}**
                `), { react: true });

            } else if(args[1] && ['günlük', 'gün', 'daily', 'today', 'day'].some(arg => args[1].toLowerCase() == arg)) {

                let datas = await registers.find({ guildID: message.guild.id });
                let userData = { man: datas.filter(data => data.gender == 'MAN' && (Date.now() - data.date) < 86400 * 1000 && data.staffID == user.id).length, woman: datas.filter(data => data.gender == 'WOMAN' && (Date.now() - data.date) < 86400 * 1000 && data.staffID == user.id).length, vip: datas.filter(data => data.options && data.options.vip && (Date.now() - data.options.vipDate) < 86400 * 1000 && data.options.vipStaff == user.id).length, unregister: datas.filter(data => data.options && data.options.unregister && (Date.now() - data.options.unregisterDate) < 86400 * 1000 && data.options.unregisterStaff == user.id).length };
                datas = datas.filter(data => (Date.now() - data.date) < 86400 * 1000);
                let Objects = new Object();
    
                datas.forEach(data => Objects[data.staffID] = Number());
                datas.forEach(data => Objects[data.staffID] += 1);
    
                let top = Object.keys(Objects).sort((a, b) => Objects[b] - Objects[a]);
                let rank = top.indexOf(user.id);

                message.channel.success(message, Embed.setDescription(`
**➤ Sıralamadaki Bilgileri :**
Günlük sıralamada \`${user.user.tag}\` üyesi ${rank+1 !== 0 ? `**${rank+1}.** sırada :` : `yok!`}
${rank+1 !== 0 ? `${top[rank-1] ? `\n**[\`${rank}\`]** ${message.guild.members.cache.has(top[rank-1]) ? message.guild.members.cache.get(top[rank-1]).toString() : `<@${top[rank-1]}>`}: \`${Objects[top[rank-1]]} Kayıt\` ${top[rank-1] == message.author.id ? `**(Siz)**` : ``}` : ``}
**[\`${rank+1}\`]** ${user.toString()}: \`${Objects[top[rank]]} Kayıt\` **(Üye)** ${top[rank+1] ? `\n**[\`${rank+2}\`]** ${message.guild.members.cache.has(top[rank+1]) ? message.guild.members.cache.get(top[rank+1]).toString() : `<@${top[rank+1]}>`}: \`${Objects[top[rank+1]]} Kayıt\` ${top[rank+1] == message.author.id ? `**(Siz)**` : ``}\n` : `\n`}`: ``}
**➤ Kayıt Bilgileri :**
\`•>\` Bu Günki Toplam Erkek Kayıt Sayı : **${userData.man}**
\`•>\` Bu Günki Toplam Kadın Kayıt Sayı : **${userData.woman}**
\`•>\` Bu Günki Toplam Vip Alım Sayı : **${userData.vip}**
\`•>\` Bu Günki Toplam Kayıtsıza Atma Sayı : **${userData.unregister}**
                `), { react: true });

            } else if(args[1] && ['aylık', 'ay', 'monthly', 'month'].some(arg => args[1].toLowerCase() == arg)) {

                let datas = await registers.find({ guildID: message.guild.id });
                let userData = { man: datas.filter(data => data.gender == 'MAN' && (Date.now() - data.date) < 2592000 * 1000 && data.staffID == user.id).length, woman: datas.filter(data => data.gender == 'WOMAN' && (Date.now() - data.date) < 2592000 * 1000 && data.staffID == user.id).length, vip: datas.filter(data => data.options && data.options.vip && (Date.now() - data.options.vipDate) < 2592000 * 1000 && data.options.vipStaff == user.id).length, unregister: datas.filter(data => data.options && data.options.unregister && (Date.now() - data.options.unregisterDate) < 2592000 * 1000 && data.options.unregisterStaff == user.id).length };
                datas = datas.filter(data => (Date.now() - data.date) < 2592000 * 1000);
                let Objects = new Object();
    
                datas.forEach(data => Objects[data.staffID] = Number());
                datas.forEach(data => Objects[data.staffID] += 1);
    
                let top = Object.keys(Objects).sort((a, b) => Objects[b] - Objects[a]);
                let rank = top.indexOf(user.id);

                message.channel.success(message, Embed.setDescription(`
**➤ Sıralamadaki Bilgileri :**
Aylık sıralamada \`${user.user.tag}\` üyesi ${rank+1 !== 0 ? `**${rank+1}.** sırada :` : `yok!`}
${rank+1 !== 0 ? `${top[rank-1] ? `\n**[\`${rank}\`]** ${message.guild.members.cache.has(top[rank-1]) ? message.guild.members.cache.get(top[rank-1]).toString() : `<@${top[rank-1]}>`}: \`${Objects[top[rank-1]]} Kayıt\` ${top[rank-1] == message.author.id ? `**(Siz)**` : ``}` : ``}
**[\`${rank+1}\`]** ${user.toString()}: \`${Objects[top[rank]]} Kayıt\` **(Üye)** ${top[rank+1] ? `\n**[\`${rank+2}\`]** ${message.guild.members.cache.has(top[rank+1]) ? message.guild.members.cache.get(top[rank+1]).toString() : `<@${top[rank+1]}>`}: \`${Objects[top[rank+1]]} Kayıt\` ${top[rank+1] == message.author.id ? `**(Siz)**` : ``}\n` : `\n`}`: ``}
**➤ Kayıt Bilgileri :**
\`•>\` Bu Ayki Toplam Erkek Kayıt Sayı : **${userData.man}**
\`•>\` Bu Ayki Toplam Kadın Kayıt Sayı : **${userData.woman}**
\`•>\` Bu Ayki Toplam Vip Alım Sayı : **${userData.vip}**
\`•>\` Bu Ayki Toplam Kayıtsıza Atma Sayı : **${userData.unregister}**
                `), { react: true });

            } else if(args[1] && ['tümzamanlar', 'tüm', 'hepsi', 'all'].some(arg => args[1].toLowerCase() == arg)) {

                let datas = await registers.find({ guildID: message.guild.id });
                let userData = { man: datas.filter(data => data.gender == 'MAN' && data.staffID == user.id).length, woman: datas.filter(data => data.gender == 'WOMAN' && data.staffID == user.id).length, vip: datas.filter(data => data.options && data.options.vip && data.options.vipStaff == user.id).length, unregister: datas.filter(data => data.options && data.options.unregister && data.options.unregisterStaff == user.id).length };
                let Objects = new Object();
    
                datas.forEach(data => Objects[data.staffID] = Number());
                datas.forEach(data => Objects[data.staffID] += 1);
    
                let top = Object.keys(Objects).sort((a, b) => Objects[b] - Objects[a]);
                let rank = top.indexOf(user.id);

                message.channel.success(message, Embed.setDescription(`
**➤ Sıralamadaki Bilgileri :**
Sıralamada \`${user.user.tag}\` üyesi ${rank+1 !== 0 ? `**${rank+1}.** sırada :` : `yok!`}
${rank+1 !== 0 ? `${top[rank-1] ? `\n**[\`${rank}\`]** ${message.guild.members.cache.has(top[rank-1]) ? message.guild.members.cache.get(top[rank-1]).toString() : `<@${top[rank-1]}>`}: \`${Objects[top[rank-1]]} Kayıt\` ${top[rank-1] == message.author.id ? `**(Siz)**` : ``}` : ``}
**[\`${rank+1}\`]** ${user.toString()}: \`${Objects[top[rank]]} Kayıt\` **(Üye)** ${top[rank+1] ? `\n**[\`${rank+2}\`]** ${message.guild.members.cache.has(top[rank+1]) ? message.guild.members.cache.get(top[rank+1]).toString() : `<@${top[rank+1]}>`}: \`${Objects[top[rank+1]]} Kayıt\` ${top[rank+1] == message.author.id ? `**(Siz)**` : ``}\n` : `\n`}`: ``}
**➤ Kayıt Bilgileri :**
\`•>\` Şimdiye Kadar Toplam Erkek Kayıt Sayı : **${userData.man}**
\`•>\` Şimdiye Kadar Toplam Kadın Kayıt Sayı : **${userData.woman}**
\`•>\` Şimdiye Kadar Toplam Vip Alım Sayı : **${userData.vip}**
\`•>\` Şimdiye Kadar Toplam Kayıtsıza Atma Sayı : **${userData.unregister}**
                `), { react: true });

            } else return message.channel.error(message, Embed.setDescription(`${mark ? mark : ``} Doğru kullanım : \`${Prefix}stats <@Üye/ID> [günlük / haftalık / aylık / tümzamanlar]\``), { timeout: 10000, react: true });

        };

    },
};