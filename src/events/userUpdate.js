const { guildID, guildTags, guildDiscriminator, guildChat, tagLog, registration } = global.client.guildSettings;
const { familyRole } = registration;
const embed = require('../utils/Embed.js');

module.exports = async (oldUser, newUser) => {

    let guild = client.guilds.cache.get(guildID);

    if(!guild) return;
    if(newUser.bot) return;

    let Embed = embed(false, false, '', '');
    let member = guild.members.cache.get(newUser.id);
    let chat = guild.channels.cache.get(guildChat);
    let tLog = guild.channels.cache.get(tagLog);
    let role = guild.roles.cache.get(familyRole);
    let tags = Array.from(guildTags).filter(tag => !oldUser.username.includes(tag) && newUser.username.includes(tag));
    let discriminator = (guildDiscriminator && oldUser.discriminator !== guildDiscriminator && newUser.discriminator == guildDiscriminator);

    if(tags.length || discriminator) {

        if(role && !member.roles.cache.has(role.id)) member.roles.add(role.id).catch(() => {});
        if(chat) chat.send(`${newUser.toString()} kullanıcısı ${tags.length > 1 || (tags.length && discriminator) ? `(${tags.map(tag => `\`${tag}\``).join(' , ')}${discriminator ? `, \`#${guildDiscriminator}\`` : ``}) taglarımızı` : `(${guildTags.length ? `\`${guildTags[0]}\`` : `\`#${guildDiscriminator}\``}) tagımızı`} alarak aramıza katıldı!`);
        if(tLog) tLog.send(Embed.setDescription(`${newUser.toString()} kullanıcısı ${tags.length > 1 || (tags.length && discriminator) ? `(${tags.map(tag => `\`${tag}\``).join(' , ')}${discriminator ? `, \`#${guildDiscriminator}\`` : ``}) taglarımızı` : `${guildTags.length ? `\`${guildTags[0]}\`` : `\`#${guildDiscriminator}\``} tagımızı`} ${role && !member.roles.cache.has(role.id) ? `aldığı için ${member.guild.roles.cache.get(role.id).toString()} rolü verildi!` : `aldı!`}`));

        newUser.send(`${tags.length > 1 || (tags.length && discriminator) ? `(${tags.map(tag => `\`${tag}\``).join(' , ')}${discriminator ? `, \`#${guildDiscriminator}\`` : ``}) taglarımızı` : `${guildTags.length ? `\`${guildTags[0]}\`` : `\`#${guildDiscriminator}\``} tagımızı`} alıp bizi desteklediğin için teşekkür ederiz. Ekibimize Hoş Geldin!`).catch(() => {});

    };

    tags = Array.from(guildTags).filter(tag => oldUser.username.includes(tag) && !newUser.username.includes(tag));
    discriminator = (guildDiscriminator && oldUser.discriminator == guildDiscriminator && newUser.discriminator !== guildDiscriminator);

    if(tags.length || discriminator) {

        if((!guildTags.some(tag => newUser.username.includes(tag))) && (!guildDiscriminator || newUser.discriminator !== guildDiscriminator)) {

            if(role && member.roles.cache.has(role.id)) {
                member.roles.remove(role.id);
                member.roles.remove(member.roles.cache.filter(memberRole => memberRole.position >= guild.roles.cache.get(role.id).position)).catch(() => {});
            }
            if(chat) chat.send(`${newUser.toString()} kullanıcısı ${tags.length > 1 || (tags.length && discriminator) ? `(${tags.map(tag => `\`${tag}\``).join(' , ')}${discriminator ? `, \`#${guildDiscriminator}\`` : ``}) taglarımızı` : `(${guildTags.length ? `\`${guildTags[0]}\`` : `\`#${guildDiscriminator}\``}) tagımızı`} salarak aramızdan ayrıldı!`);
            if(tLog) tLog.send(Embed.setDescription(`${newUser.toString()} kullanıcısı ${tags.length > 1 || (tags.length && discriminator) ? `(${tags.map(tag => `\`${tag}\``).join(' , ')}${discriminator ? `, \`#${guildDiscriminator}\`` : ``}) taglarımızı` : `${guildTags.length ? `\`${guildTags[0]}\`` : `\`#${guildDiscriminator}\``} tagımızı`} ${role && member.roles.cache.has(role.id) ? `saldığı için ${member.guild.roles.cache.get(role.id).toString()} rolü ve yetkili rolleri alındı!` : `saldı!`}`));
            
            newUser.send(`${tags.length > 1 || (tags.length && discriminator) ? `(${tags.map(tag => `\`${tag}\``).join(' , ')}${discriminator ? `, \`#${guildDiscriminator}\`` : ``}) taglarımızı` : `${guildTags.length ? `\`${guildTags[0]}\`` : `\`#${guildDiscriminator}\``} tagımızı`} saldığın için ekip rolü ve yetkili rollerin alındı!`).catch(() => {});

        } else {

            if(chat) chat.send(`${newUser.toString()} kullanıcısı ${tags.length > 1 || (tags.length && discriminator) ? `(${tags.map(tag => `\`${tag}\``).join(' , ')}${discriminator ? `, \`#${guildDiscriminator}\`` : ``}) taglarımızı` : `(${guildTags.length ? `\`${guildTags[0]}\`` : `\`#${guildDiscriminator}\``}) tagımızı`} saldı!`);
            if(tLog) tLog.send(Embed.setDescription(`${newUser.toString()} kullanıcısı ${tags.length > 1 || (tags.length && discriminator) ? `(${tags.map(tag => `\`${tag}\``).join(' , ')}${discriminator ? `, \`#${guildDiscriminator}\`` : ``}) taglarımızı` : `${guildTags.length ? `\`${guildTags[0]}\`` : `\`#${guildDiscriminator}\``} tagımızı`} saldı!`));
            
        };

    };

};

module.exports.conf = {
    name: 'User Update',
    event: 'userUpdate',
};