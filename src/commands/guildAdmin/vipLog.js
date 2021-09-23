const { Footer } = global.client.settings;
const { success, mark } = require('../../configs/emojis.json');
const registers = require('../../schemas/registers.js');
const moment = require('moment');
require('moment-duration-format');
moment.locale('tr');

module.exports = {
    name: 'viplog',
    aliases: [],
    category: 'Admin',
    usage: '<@Üye/ID>',
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

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        
        if(args[0] && !user) return message.channel.error(message, Embed.setDescription(`Geçerli bir üye belirtmelisin!`), { timeout: 8000, react: true });
    
        if(user) {

            let datas = await registers.find({ guildID: message.guild.id, userID: user.id });
            datas = datas.filter(data => data.options && data.options.vip).sort((a, b) => b.options.vipDate - a.options.vipDate);
            if(datas.length >= 25) datas.splice(0, 15);

            if(!datas.length) return message.channel.success(message, Embed.setDescription(`${user.toString()} kullanıcısına ait bir veri bulunamadı!`), { react: true });

            let currentPage = 1;
            let firstPage = `
${success ? success : ``} ${user.toString()} isimli kullanıcının **${datas.length}** vip bilgisi bulundu :

${datas.map(data => `**Yetkili :** ${message.guild.members.cache.has(data.options.vipStaff) ? message.guild.members.cache.get(data.options.vipStaff).toString() : `<@${data.options.vipStaff}>`}  **Tarih :** \`${moment(data.options.vipDate).format('DD MMMM YYYY (HH:mm)')}\``).join('\n')}      
            `;

            if(mark) message.react(mark)
            message.channel.send(Embed.setDescription(firstPage).setFooter(datas.length <= 7 ? Footer : `${Footer} • Sayfa : ${currentPage}`)).then(async msg => {

                datas = await registers.find({ guildID: message.guild.id, userID: user.id });
                datas = datas.filter(data => data.options && data.options.vip).sort((a, b) => b.options.vipDate - a.options.vipDate);

                if(datas.length < 25) return;

                let pages = datas.chunk(15);
                let reactions = ['◀', '❌', '▶'];
                for (let reaction of reactions) await msg.react(reaction);
                    
                const back = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "◀" && user.id == message.author.id, { time: 40000 });
                const x = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "❌" && user.id == message.author.id, { time: 40000 });
                const go = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "▶" && user.id == message.author.id, { time: 40000 });

                back.on("collect", async reaction => {

                    await reaction.users.remove(message.author.id).catch(err => {});
                    if (currentPage == 1) return;
                    currentPage--;
                    if(currentPage == 1 && msg) msg.edit(Embed.setDescription(firstPage).setFooter(`${Footer} • Sayfa : ${currentPage}`));
                    else if (currentPage > 1 && msg) msg.edit(Embed.setDescription(`
${success ? success : ``} ${user.toString()} kullanıcısının vip bilgileri :

${pages[currentPage-1].map(data => `**Yetkili :** ${message.guild.members.cache.has(data.options.vipStaff) ? message.guild.members.cache.get(data.options.vipStaff).toString() : `<@${data.options.vipStaff}>`} **Tarih :** \`${moment(data.options.vipDate).format('DD MMMM YYYY (HH:mm)')}\``).join('\n')}  
                    `).setFooter(`${Footer} • Sayfa : ${currentPage}`)).catch(err => {});
                        
                });

                go.on("collect", async reaction => {

                    await reaction.users.remove(message.author.id).catch(err => {});
                    if (currentPage == pages.length) return;
                    currentPage++;
                    if (msg) msg.edit(Embed.setDescription(`
${success ? success : ``} ${user.toString()} kullanıcısının vip bilgileri :

${pages[currentPage-1].map(data => `**Vip Alan Yetkili :** ${message.guild.members.cache.has(data.options.vipStaff) ? message.guild.members.cache.get(data.options.vipStaff).toString() : `<@${data.options.vipStaff}>`} **Vip Alınma Tarihi :** \`${moment(data.options.vipStaff).format('DD MMMM YYYY (HH:mm)')}\``).join('\n')}  
                    `).setFooter(`${Footer} • Sayfa : ${currentPage}`)).catch(err => {});

                });
                        
                x.on("collect", async reaction => {

                    await back.stop();
                    await go.stop();
                    await x.stop();
                    if (message) message.delete().catch(err => {});
                    if (msg) return msg.delete().catch(err => {});

                });

                back.on("end", async () => {

                    await back.stop();
                    await go.stop();
                    await x.stop();
                    await msg.reactions.removeAll();
                    //if (message) message.delete().catch(err => {});
                    //if (msg) return msg.delete().catch(err => {});
                            
                });


            });

        } else {

            let datas = await registers.find({ guildID: message.guild.id, userID: message.author.id });
            datas = datas.filter(data => data.options && data.options.vip).sort((a, b) => b.options.vipDate - a.options.vipDate);
            if(datas.length >= 25) datas.splice(0, 15);

            if(!datas.length) return message.channel.success(message, Embed.setDescription(`Size ait bir veri bulunamadı!`), { react: true });

            let currentPage = 1;
            let firstPage = `
${success ? success : ``} ${message.author.toString()} isimli kullanıcının **${datas.length}** vip bilgisi bulundu :

${datas.map(data => `**Yetkili :** ${message.guild.members.cache.has(data.options.vipStaff) ? message.guild.members.cache.get(data.options.vipStaff).toString() : `<@${data.options.vipStaff}>`} **Tarih :** \`${moment(data.options.vipDate).format('DD MMMM YYYY (HH:mm)')}\``).join('\n')}
            `;

            if(mark) message.react(mark)
            message.channel.send(Embed.setDescription(firstPage).setFooter(datas.length <= 7 ? Footer : `${Footer} • Sayfa : ${currentPage}`)).then(async msg => {

                datas = await roleLog.find({ guildID: message.guild.id, userID: message.author.id });
                datas = datas.filter(data => data.options && data.options.vip).sort((a, b) => b.options.vipDate - a.options.vipDate);

                if(datas.length < 25) return;

                let pages = datas.chunk(15);
                let reactions = ['◀', '❌', '▶'];
                for (let reaction of reactions) await msg.react(reaction);
                    
                const back = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "◀" && user.id == message.author.id, { time: 40000 });
                const x = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "❌" && user.id == message.author.id, { time: 40000 });
                const go = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "▶" && user.id == message.author.id, { time: 40000 });

                back.on("collect", async reaction => {

                    await reaction.users.remove(message.author.id).catch(err => {});
                    if (currentPage == 1) return;
                    currentPage--;
                    if(currentPage == 1 && msg) msg.edit(Embed.setDescription(firstPage).setFooter(`${Footer} • Sayfa : ${currentPage}`));
                    else if (currentPage > 1 && msg) msg.edit(Embed.setDescription(`
${success ? success : ``} ${user.toString()} kullanıcısının vip bilgileri :

${pages[currentPage-1].map(data => `**Yetkili :** ${message.guild.members.cache.has(data.options.vipStaff) ? message.guild.members.cache.get(data.options.vipStaff).toString() : `<@${data.options.vipStaff}>`} **Tarih :** \`${moment(data.options.vipDate).format('DD MMMM YYYY (HH:mm)')}\``).join('\n')}  
                    `).setFooter(`${Footer} • Sayfa : ${currentPage}`)).catch(err => {});
                        
                });

                go.on("collect", async reaction => {

                    await reaction.users.remove(message.author.id).catch(err => {});
                    if (currentPage == pages.length) return;
                    currentPage++;
                    if (msg) msg.edit(Embed.setDescription(`
${success ? success : ``} ${user.toString()} kullanıcısının kayıt bilgileri :

${pages[currentPage-1].map(data => `**Yetkili :** ${message.guild.members.cache.has(data.options.vipStaff) ? message.guild.members.cache.get(data.options.vipStaff).toString() : `<@${data.options.vipStaff}>`} **Tarih :** \`${moment(data.options.vipDate).format('DD MMMM YYYY (HH:mm)')}\``).join('\n')}  
                    `).setFooter(`${Footer} • Sayfa : ${currentPage}`)).catch(err => {});

                });
                        
                x.on("collect", async reaction => {

                    await back.stop();
                    await go.stop();
                    await x.stop();
                    if (message) message.delete().catch(err => {});
                    if (msg) return msg.delete().catch(err => {});

                });

                back.on("end", async () => {

                    await back.stop();
                    await go.stop();
                    await x.stop();
                    await msg.reactions.removeAll();
                    //if (message) message.delete().catch(err => {});
                    //if (msg) return msg.delete().catch(err => {});
                            
                });

            });

        };

    },
};