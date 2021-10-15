const { client } = global.client;
const { guildTags, guildDiscriminator, guildRulesChannel, entryExitChannel, tagLog, registration, unregister, quarantine } = client.guildSettings;
const { familyRole, staffs } = registration;
const { unregisterChannel, unregisterRole, unregisterName } = unregister;
const { quarantineRole, quarantineName, quarantineLog, quarantineDateLimit } = quarantine;
const { mark, cross, success, rules, tada } = require('../configs/emojis.json');
const penals = require('../schemas/penals.js');
const embed = require('../utils/Embed.js');
const moment = require('moment');
require('moment-duration-format');
moment.locale('tr');

/**
 * @param { GuildMember } member
 */

module.exports = async (member) => {

	const Embed = embed(false, false);
	const penal = await penals.findOne({ guildID: member.guild.id, userID: member.id, type: 'JAIL', active: true }) || await penals.findOne({ guildID: member.guild.id, userID: member.id, type: 'TEMP-JAIL', active: true });
	const accountCreatedDate = moment(member.user.createdTimestamp).format('DD MMMM YYYY (HH:mm)');
	const accountCreatedDate2 = client.getTime(Date.now() - member.user.createdTimestamp);
	const security = await client.checkSecurity(member.user, quarantineDateLimit);
	const rulesChannel = member.guild.channels.cache.get(guildRulesChannel);
	const welcomeChannel = member.guild.channels.cache.get(unregisterChannel);
	const staffRole = member.guild.roles.cache.get(staffs[0]);
	const log = member.guild.channels.cache.get(entryExitChannel);
	const qLog = member.guild.channels.cache.get(quarantineLog);

	if(welcomeChannel) {
		welcomeChannel.wsend(`
${tada ? tada : ':tada:'} Sunucumuza Hoş Geldin ${member.toString()}

${security ? (mark ? `${mark} ` : '') : (cross ? `${cross} ` : '')}Hesabın **${accountCreatedDate}** tarihinde (\`${accountCreatedDate2} önce\`) oluşturulmuş!

${rules ? rules : ':scroll:'} Sunucu kurallarımız ${rulesChannel ? rulesChannel.toString() : '#kurallar'} kanalında belirtilmiştir. Sunucu içerisinde ki ceza işlemleri kuralları okuduğun varsayılarak gerçekleştirilecektir.

${success ? `${success} ` : ''} Sunucumuzun **${member.guild.memberCount}.** üyesisin. ${(guildTags.length && guildTags.length == 1 && !guildDiscriminator) || (guildDiscriminator && !guildTags.length) ? `Tagımızı (\`${guildTags.length ? guildTags[0] : `#${guildDiscriminator}`}\`)` : (guildTags.length && guildTags.length > 1) || (guildTags.length && guildDiscriminator) ? `Taglarımızdan (${guildTags.map(tag => `\`${tag}\``).join(' , ')}${guildDiscriminator ? ` , \`#${guildDiscriminator}\`` : ''}) birini` : 'Tagımızı'} alarak bizlere destek ola bilirsin!

${security ? `**➤ Soldaki ses teyit odalarından birine girerek, ${staffRole ? `${staffRole.toString()} rolüne sahip ` : ''}yetkililerimize teyit verip kayıt ola bilirsin!**` : '**➤ Maalesef, hesabın yakın bir zamanda açıldığı için sunucumuza kayıt olamazsın!**'}
    `, { name: 'Welcome To Server', avatar: client.user.avatarURL() });
	}

	if(log) log.send(`**${member.user.tag}** (\`${member.id}\`) adlı kullanıcı sunucuya katıldı ve üye sayısı **${member.guild.memberCount}** kişiye ulaştı!`);
	if((guildTags.length && guildTags.some(tag => member.user.username.includes(tag))) || (guildDiscriminator && member.user.discriminator == guildDiscriminator)) {

		const tLog = member.guild.channels.cache.get(tagLog);
		member.user.send(`**${member.guild.name}** adlı sunucumuzun tagını kullanıcı isminde bulundurarak bize destek olduğun için teşekkür ederiz. Sunucumuza Tekrar Hoş Geldin!`).catch(() => {});

		if(familyRole) member.roles.add(familyRole);
		if(tLog) tLog.send(Embed.setFooter('').setDescription(`${member.toString()} kullanıcısı sunucuya taglı olarak katıldı${familyRole && member.guild.roles.cache.has(familyRole) ? ` ve üyeye ${member.guild.roles.cache.get(familyRole).toString()} rolü verildi!` : '!'}`));

	}
	if(!penal && security && unregisterRole) member.roles.add(unregisterRole);
	if(security && unregisterName) {member.setNickname(unregisterName);}
	else if(!security) {

		if(quarantineRole) member.roles.add(quarantineRole);
		if(quarantineName) member.setNickname(quarantineName);
		if(qLog) qLog.send(`**${member.user.tag}** (\`${member.id}\`) adlı kullanıcı sunucuya katıldı ama hesabı yakın bir zamanda açıldığı için karantinaya alındı!`);
		member.user.send(`Merhaba ${member.toString()}, **${member.guild.name}** adlı sunucumuza hoş geldin. Görünüşe göre hesabın yakın bir zamanda açılmış, bu sebeple sunucu güvenliğini korumak için karantinaya alındın!`).catch(() => {});

	}

};

module.exports.conf = {
	name: 'Guild Member Add',
	event: 'guildMemberAdd',
};