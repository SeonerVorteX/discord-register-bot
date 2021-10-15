const { Prefix, Footer } = global.client.settings;
const { mark } = require('../../configs/emojis.json');
const registers = require('../../schemas/registers.js');

module.exports = {
    name: 'top',
    aliases: ['topteyit', 'sıralama'],
    category: 'Yetkili',
    usage: '[günlük / haftalık / aylık / tümzamanlar] <Rank Sayı>',
    staff: true,
    guildOnly: true,
    cooldown: 5,

    /**
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args 
     * @param { MessageEmbed } Embed 
     */

    async execute(client, message, args, Embed) {

        if(!args[0] || ['haftalık', 'hafta', 'weekly', 'week'].some(arg => args[0].toLowerCase() == arg) || (!isNaN(args[0]) && !args[0].includes('-'))) {

            if(args[0] && ['haftalık', 'hafta', 'weekly', 'week'].some(arg => args[0].toLowerCase() == arg)) {

                let datas = await registers.find({ completed: true, guildID: message.guild.id });
                datas = datas.filter(data => (Date.now() - data.date) < 604800 * 1000);
                let Objects = new Object();
    
                datas.forEach(data => Objects[data.staffID] = Number());
                datas.forEach(data => Objects[data.staffID] += 1);
    
                let authorRank = Object.keys(Objects).sort((a, b) => Objects[b] - Objects[a]).indexOf(message.author.id);
                let rank;

                if(!args[1]) rank = 20;
                else if(isNaN(args[1]) || args[1].includes('-')) return message.channel.error(message, Embed.setDescription(`Lütfen geçerli bir rank sayısı belirtin!`), { timeout: 8000, react: true });
                else if(args[1] < 10) rank = 10;
                else rank = args[1];

                let top = Object.keys(Objects).sort((a, b) => Objects[b] - Objects[a]).splice(0, rank);
                let dataArray = Array.from(top);
                let currentPage = 1;

                if(dataArray.length >= 30) dataArray.splice(0, 20);

                let firstPage = `
Bu hafta ${datas.length ? `toplam **${datas.length}** kayıt işlemi gerçekleştirildi ${authorRank+1 !== 0 ? ` ve Siz **${authorRank+1}.** sıradasınız` : ``}` : `hiçbir kayıt işlemi gerçekleştirilmemiş`} 
${datas.length ? `Top ${rank} kayıt sıralaması aşağıda belirtilmiştir :` : ``}
                    
${dataArray.map((data, index) => `**[\`${index+1}\`]** ${message.guild.members.cache.has(data) ? message.guild.members.cache.get(data).toString() : `<@${data}>`}: \`${Objects[data]} Kayıt\` ${data == message.author.id ? `**(Siz)**` : ``}`).join('\n')}
                `;

                if(mark) message.react(mark);
                message.channel.send(Embed.setDescription(firstPage).setFooter(top.length < 30 ? Footer : `${Footer} • Sayfa : ${currentPage}`)).then(async msg => {

                    if(top.length < 30) return;

                    let pages = top.chunk(20);
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
Haftalık Top ${rank} kayıt sıralaması :
                    
${pages[currentPage-1].map((data) => `**[\`${top.indexOf(data)+1}\`]** ${message.guild.members.cache.has(data) ? message.guild.members.cache.get(data).toString() : `<@${data}>`}: \`${Objects[data]} Kayıt\` ${data == message.author.id ? `**(Siz)**` : ``}`).join('\n')}
                        `).setFooter(`${Footer} • Sayfa : ${currentPage}`)).catch(err => {});
                            
                    });

                    go.on("collect", async reaction => {

                        await reaction.users.remove(message.author.id).catch(err => {});
                        if (currentPage == pages.length) return;
                        currentPage++;
                        if (msg) msg.edit(Embed.setDescription(`
Haftalık Top ${rank} kayıt sıralaması :
                    
${pages[currentPage-1].map((data) => `**[\`${top.indexOf(data)+1}\`]** ${message.guild.members.cache.has(data) ? message.guild.members.cache.get(data).toString() : `<@${data}>`}: \`${Objects[data]} Kayıt\` ${data == message.author.id ? `**(Siz)**` : ``}`).join('\n')}
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

            } else if(!args[0] || (!isNaN(args[0]) && !args[0].includes('-'))) {

                let datas = await registers.find({ completed: true, guildID: message.guild.id });
                datas = datas.filter(data => (Date.now() - data.date) < 604800 * 1000);
                let Objects = new Object();
    
                datas.forEach(data => Objects[data.staffID] = Number());
                datas.forEach(data => Objects[data.staffID] += 1);
    
                let authorRank = Object.keys(Objects).sort((a, b) => Objects[b] - Objects[a]).indexOf(message.author.id);
                let rank;

                if(!args[0]) rank = 20;
                else if(args[0] < 10) rank = 10;
                else rank = args[0];

                let top = Object.keys(Objects).sort((a, b) => Objects[b] - Objects[a]).splice(0, rank);
                let dataArray = Array.from(top);
                let currentPage = 1;

                if(dataArray.length >= 30) dataArray.splice(0, 20);

                let firstPage = `
Bu hafta ${datas.length ? `toplam **${datas.length}** kayıt işlemi gerçekleştirildi ${authorRank+1 !== 0 ? ` ve Siz **${authorRank+1}.** sıradasınız` : ``}` : `hiçbir kayıt işlemi gerçekleştirilmemiş`} 
${datas.length ? `Top ${rank} kayıt sıralaması aşağıda belirtilmiştir :` : ``}
                    
${dataArray.map((data, index) => `**[\`${index+1}\`]** ${message.guild.members.cache.has(data) ? message.guild.members.cache.get(data).toString() : `<@${data}>`}: \`${Objects[data]} Kayıt\` ${data == message.author.id ? `**(Siz)**` : ``}`).join('\n')}
                `;

                if(mark) message.react(mark);
                message.channel.send(Embed.setDescription(firstPage).setFooter(top.length < 30 ? Footer : `${Footer} • Sayfa : ${currentPage}`)).then(async msg => {

                    if(top.length < 30) return;

                    let pages = top.chunk(20);
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
Haftalık Top ${rank} kayıt sıralaması :
                    
${pages[currentPage-1].map((data) => `**[\`${top.indexOf(data)+1}\`]** ${message.guild.members.cache.has(data) ? message.guild.members.cache.get(data).toString() : `<@${data}>`}: \`${Objects[data]} Kayıt\` ${data == message.author.id ? `**(Siz)**` : ``}`).join('\n')}
                        `).setFooter(`${Footer} • Sayfa : ${currentPage}`)).catch(err => {});
                            
                    });

                    go.on("collect", async reaction => {

                        await reaction.users.remove(message.author.id).catch(err => {});
                        if (currentPage == pages.length) return;
                        currentPage++;
                        if (msg) msg.edit(Embed.setDescription(`
Haftalık Top ${rank} kayıt sıralaması :
                    
${pages[currentPage-1].map((data) => `**[\`${top.indexOf(data)+1}\`]** ${message.guild.members.cache.has(data) ? message.guild.members.cache.get(data).toString() : `<@${data}>`}: \`${Objects[data]} Kayıt\` ${data == message.author.id ? `**(Siz)**` : ``}`).join('\n')}
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
            
        } else if(['günlük', 'gün', 'daily', 'today', 'day'].some(arg => args[0].toLowerCase() == arg)) {

            let datas = await registers.find({ completed: true, guildID: message.guild.id });
            datas = datas.filter(data => (Date.now() - data.date) < 86400 * 1000);
            let Objects = new Object();

            datas.forEach(data => Objects[data.staffID] = Number());
            datas.forEach(data => Objects[data.staffID] += 1);

            let authorRank = Object.keys(Objects).sort((a, b) => Objects[b] - Objects[a]).indexOf(message.author.id);
            let rank;

            if(!args[1]) rank = 20;
            else if(isNaN(args[1]) || args[1].includes('-')) return message.channel.error(message, Embed.setDescription(`Lütfen geçerli bir rank sayısı belirtin!`), { timeout: 8000, react: true });
            else if(args[1] < 10) rank = 10;
            else rank = args[1];

            let top = Object.keys(Objects).sort((a, b) => Objects[b] - Objects[a]).splice(0, rank);
            let dataArray = Array.from(top);
            let currentPage = 1;

            if(dataArray.length >= 30) dataArray.splice(0, 20);

            let firstPage = `
Bu gün ${datas.length ? `toplam **${datas.length}** kayıt işlemi gerçekleştirildi ${authorRank+1 !== 0 ? ` ve Siz **${authorRank+1}.** sıradasınız` : ``}` : `hiçbir kayıt işlemi gerçekleştirilmemiş`} 
${datas.length ? `Top ${rank} kayıt sıralaması aşağıda belirtilmiştir :` : ``}
                    
${dataArray.map((data, index) => `**[\`${index+1}\`]** ${message.guild.members.cache.has(data) ? message.guild.members.cache.get(data).toString() : `<@${data}>`}: \`${Objects[data]} Kayıt\` ${data == message.author.id ? `**(Siz)**` : ``}`).join('\n')}
            `;

            if(mark) message.react(mark);
            message.channel.send(Embed.setDescription(firstPage).setFooter(top.length < 30 ? Footer : `${Footer} • Sayfa : ${currentPage}`)).then(async msg => {

                if(top.length < 30) return;

                let pages = top.chunk(20);
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
Günlük Top ${rank} kayıt sıralaması :
                    
${pages[currentPage-1].map((data) => `**[\`${top.indexOf(data)+1}\`]** ${message.guild.members.cache.has(data) ? message.guild.members.cache.get(data).toString() : `<@${data}>`}: \`${Objects[data]} Kayıt\` ${data == message.author.id ? `**(Siz)**` : ``}`).join('\n')}
                    `).setFooter(`${Footer} • Sayfa : ${currentPage}`)).catch(err => {});
                            
                });

                go.on("collect", async reaction => {

                    await reaction.users.remove(message.author.id).catch(err => {});
                    if (currentPage == pages.length) return;
                    currentPage++;
                    if (msg) msg.edit(Embed.setDescription(`
Günlük Top ${rank} kayıt sıralaması :
                    
${pages[currentPage-1].map((data) => `**[\`${top.indexOf(data)+1}\`]** ${message.guild.members.cache.has(data) ? message.guild.members.cache.get(data).toString() : `<@${data}>`}: \`${Objects[data]} Kayıt\` ${data == message.author.id ? `**(Siz)**` : ``}`).join('\n')}
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

        } else if(['aylık', 'ay', 'monthly', 'month'].some(arg => args[0].toLowerCase() == arg)) {

            let datas = await registers.find({ completed: true, guildID: message.guild.id });
            datas = datas.filter(data => (Date.now() - data.date) < 2592000 * 1000);
            let Objects = new Object();

            datas.forEach(data => Objects[data.staffID] = Number());
            datas.forEach(data => Objects[data.staffID] += 1);

            let authorRank = Object.keys(Objects).sort((a, b) => Objects[b] - Objects[a]).indexOf(message.author.id);
            let rank;

            if(!args[1]) rank = 20;
            else if(isNaN(args[1]) || args[1].includes('-')) return message.channel.error(message, Embed.setDescription(`Lütfen geçerli bir rank sayısı belirtin!`), { timeout: 8000, react: true });
            else if(args[1] < 10) rank = 10;
            else rank = args[1];

            let top = Object.keys(Objects).sort((a, b) => Objects[b] - Objects[a]).splice(0, rank);
            let dataArray = Array.from(top);
            let currentPage = 1;

            if(dataArray.length >= 30) dataArray.splice(0, 20);

            let firstPage = `
Bu ay ${datas.length ? `toplam **${datas.length}** kayıt işlemi gerçekleştirildi ${authorRank+1 !== 0 ? ` ve Siz **${authorRank+1}.** sıradasınız` : ``}` : `hiçbir kayıt işlemi gerçekleştirilmemiş`} 
${datas.length ? `Top ${rank} kayıt sıralaması aşağıda belirtilmiştir :` : ``}
                    
${dataArray.map((data, index) => `**[\`${index+1}\`]** ${message.guild.members.cache.has(data) ? message.guild.members.cache.get(data).toString() : `<@${data}>`}: \`${Objects[data]} Kayıt\` ${data == message.author.id ? `**(Siz)**` : ``}`).join('\n')}
            `;

            if(mark) message.react(mark);
            message.channel.send(Embed.setDescription(firstPage).setFooter(top.length < 30 ? Footer : `${Footer} • Sayfa : ${currentPage}`)).then(async msg => {

                if(top.length < 30) return;

                let pages = top.chunk(20);
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
Aylık Top ${rank} kayıt sıralaması :
                    
${pages[currentPage-1].map((data) => `**[\`${top.indexOf(data)+1}\`]** ${message.guild.members.cache.has(data) ? message.guild.members.cache.get(data).toString() : `<@${data}>`}: \`${Objects[data]} Kayıt\` ${data == message.author.id ? `**(Siz)**` : ``}`).join('\n')}
                    `).setFooter(`${Footer} • Sayfa : ${currentPage}`)).catch(err => {});
                            
                });

                go.on("collect", async reaction => {

                    await reaction.users.remove(message.author.id).catch(err => {});
                    if (currentPage == pages.length) return;
                    currentPage++;
                    if (msg) msg.edit(Embed.setDescription(`
Aylık Top ${rank} kayıt sıralaması :
                    
${pages[currentPage-1].map((data) => `**[\`${top.indexOf(data)+1}\`]** ${message.guild.members.cache.has(data) ? message.guild.members.cache.get(data).toString() : `<@${data}>`}: \`${Objects[data]} Kayıt\` ${data == message.author.id ? `**(Siz)**` : ``}`).join('\n')}
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

        } else if(['tümzamanlar', 'tüm', 'hepsi', 'all'].some(arg => args[0].toLowerCase() == arg)) {

            let datas = await registers.find({ completed: true, guildID: message.guild.id });
            let Objects = new Object();

            datas.forEach(data => Objects[data.staffID] = Number());
            datas.forEach(data => Objects[data.staffID] += 1);

            let authorRank = Object.keys(Objects).sort((a, b) => Objects[b] - Objects[a]).indexOf(message.author.id);
            let rank;

            if(!args[1]) rank = 20;
            else if(isNaN(args[1]) || args[1].includes('-')) return message.channel.error(message, Embed.setDescription(`Lütfen geçerli bir rank sayısı belirtin!`), { timeout: 8000, react: true });
            else if(args[1] < 10) rank = 10;
            else rank = args[1];

            let top = Object.keys(Objects).sort((a, b) => Objects[b] - Objects[a]).splice(0, rank);
            let dataArray = Array.from(top);
            let currentPage = 1;

            if(dataArray.length >= 30) dataArray.splice(0, 20);

            let firstPage = `
Şimdiye kadar ${datas.length ? `toplam **${datas.length}** kayıt işlemi gerçekleştirildi ${authorRank+1 !== 0 ? ` ve Siz **${authorRank+1}.** sıradasınız` : ``}` : `hiçbir kayıt işlemi gerçekleştirilmemiş`} 
${datas.length ? `Top ${rank} kayıt sıralaması aşağıda belirtilmiştir :` : ``}
                    
${dataArray.map((data, index) => `**[\`${index+1}\`]** ${message.guild.members.cache.has(data) ? message.guild.members.cache.get(data).toString() : `<@${data}>`}: \`${Objects[data]} Kayıt\` ${data == message.author.id ? `**(Siz)**` : ``}`).join('\n')}
            `;

            if(mark) message.react(mark);
            message.channel.send(Embed.setDescription(firstPage).setFooter(top.length < 30 ? Footer : `${Footer} • Sayfa : ${currentPage}`)).then(async msg => {

                if(top.length < 30) return;

                let pages = top.chunk(20);
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
Top ${rank} kayıt sıralaması :
                    
${pages[currentPage-1].map((data) => `**[\`${top.indexOf(data)+1}\`]** ${message.guild.members.cache.has(data) ? message.guild.members.cache.get(data).toString() : `<@${data}>`}: \`${Objects[data]} Kayıt\` ${data == message.author.id ? `**(Siz)**` : ``}`).join('\n')}
                    `).setFooter(`${Footer} • Sayfa : ${currentPage}`)).catch(err => {});
                            
                });

                go.on("collect", async reaction => {

                    await reaction.users.remove(message.author.id).catch(err => {});
                    if (currentPage == pages.length) return;
                    currentPage++;
                    if (msg) msg.edit(Embed.setDescription(`
Top ${rank} kayıt sıralaması :
                    
${pages[currentPage-1].map((data) => `**[\`${top.indexOf(data)+1}\`]** ${message.guild.members.cache.has(data) ? message.guild.members.cache.get(data).toString() : `<@${data}>`}: \`${Objects[data]} Kayıt\` ${data == message.author.id ? `**(Siz)**` : ``}`).join('\n')}
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

        } else return message.channel.error(message, Embed.setDescription(`${mark ? mark : ``} Doğru kullanım : \`${Prefix}top [günlük / haftalık / aylık / tümzamanlar] <Rank Sayı>\``), { timeout: 8000, react: true });

    },
};