const { Footer } = global.client.settings;
const { mark, success } = require('../../configs/emojis.json');
const registers = require('../../schemas/registers.js');
const moment = require('moment');
require('moment-duration-format');
moment.locale('tr');

module.exports = {
    name: 'isimler',
    aliases: ['isimgeçmişi'],
    category: 'Yetkili',
    usage: '<@Üye/ID>',
    staff: true,
    guildOnly: true,
    cooldown: 4,

    /**
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args 
     * @param { MessageEmbed } Embed 
     */

    async execute(client, message, args, Embed) {

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        
        if(!args[0]) return message.channel.error(message, Embed.setDescription(`İsim geçmişi gösterilicek üyeyi belirtmelisin!`), { timeout: 8000, react: true });
        if(!user || user.user.bot) return message.channel.error(message, Embed.setDescription(`Geçerli bir üye belirtmelisin!`), { timeout: 8000, react: true });
        
        let datas = await registers.find({ completed: true, guildID: message.guild.id, userID: user.id });
        let nameDatas = new Array();
        await new Promise((resolve) => {
            datas.filter(data => data.nameArray && data.nameArray.length).forEach(data => {
                
                let leaveGuild = false;
                data.nameArray.forEach(Object => {

                    nameDatas.push(`\`${Object.name}\` (${data.options.role ? message.guild.roles.cache.get(data.options.role).toString() : 'Veri Bulunamadı'})`);
                    if(!leaveGuild && data.options.leaveGuild) {
                        nameDatas.push(`\`${data.nameArray[data.nameArray.length-1].name}\` (Sunucudan Ayrılma)`);
                        leaveGuild = true;
                    };

                });

            });
            resolve();
        });


        let nameDatas2 = Array.from(nameDatas);
        let currentPage = 1;
        let firstPage = `
${success ? success : ``} ${user.toString()} kullanıcısının toplamda **${nameDatas.length}** isim kaydı bulunuyor :
        
${nameDatas.length < 30 ? nameDatas.join('\n') : nameDatas2.splice(0, 20).join('\n')}
        `;
        if(mark) message.react(mark);
        message.channel.send(Embed.setDescription(!nameDatas.length ? `Belirtilen üyenin herhangi bir isim kaydı bulunmuyor!` : firstPage).setFooter(nameDatas.length < 30 ? Footer : `${Footer} • Sayfa : ${currentPage}`)).then(async msg => {

            if(nameDatas.length < 30) return;

            let pages = nameDatas.chunk(20);
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
${success ? success : ``} ${user.toString()} kullanıcısının kayıtlı isimleri :

${pages[currentPage-1].join('\n')}
                `).setFooter(`${Footer} • Sayfa : ${currentPage}`)).catch(err => {});
                    
            });

            go.on("collect", async reaction => {

                await reaction.users.remove(message.author.id).catch(err => {});
                if (currentPage == pages.length) return;
                currentPage++;
                if (msg) msg.edit(Embed.setDescription(`
${success ? success : ``} ${user.toString()} kullanıcısının kayıtlı isimleri :

${pages[currentPage-1].join('\n')}
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

    },
};