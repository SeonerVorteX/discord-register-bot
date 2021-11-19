/**
 * Client Settings
 * @param { Client } client 
 */

 module.exports = (client) => {

    //General Settings
    client.settings = {

        Prefix: ".",
        Token: "",
        Owners: [],
        VoiceChannel: "",
        Activity: "WATCHING",
        Status: "dnd",
        MongoURL: "",
        Footer: "SeonerVorteX",
        DisableCooldownsForAdmins: true,

    };

    //Activity Messages
    client.statusMessages = [

        "Only VorteX!",
        "Created By VorteX!",
        "discord.gg/MTNkXHnX3b"

    ];

    //Emojis
    client.systemEmojis = [

        ///System
        { emojiName: 'developer', emojiUrl: 'https://cdn.discordapp.com/emojis/853642013332865035.gif?v=1' },
        { emojiName: 'loading', emojiUrl: 'https://cdn.discordapp.com/emojis/857935194203226118.gif?v=1' },
        { emojiName: 'crown', emojiUrl: 'https://cdn.discordapp.com/emojis/876942324909871114.gif?v=1' },
        { emojiName: 'crown2', emojiUrl: 'https://cdn.discordapp.com/emojis/876929331572662323.gif?v=1' },
        { emojiName: 'mark', emojiUrl: 'https://cdn.discordapp.com/emojis/876153262796079115.gif?v=1' },
        { emojiName: 'cross', emojiUrl: 'https://cdn.discordapp.com/emojis/876153078863253514.gif?v=1' },
        { emojiName: 'success', emojiUrl: 'https://cdn.discordapp.com/emojis/793774156067373066.gif?v=1' }

    ];

    //Guild Settings     
    client.guildSettings = {

        ///General
        guildID: "",
        guildTags: [], 
        guildDiscriminator: "",
        guildRulesChannel: "",
        entryExitChannel: "",
        guildChat: "",
        tagLog: "",
        botYt: "",
        unAuthorizedMessages: true,

        //Registration
        registration: {

            staffs: [],
            familyRole: "",
            requireTag: false,
            penalBlockLimit: 10,
            penalPointBlockLimit: 150,
            unifying: " | ",
            nameTag: "•",
            maxAge: 50,
            minAge: 10,
            limit: 15,
            log: "",

            //Man
            man: {
                manRole: "",
                otherManRoles: [],
            },
            
            //Woman
            woman: {
                womanRole: "",
                otherWomanRoles: [],
            },

            //Vip
            vip: {
                vipRole: "",
                onlyAdmins: true,
                dailyVipLimit: 5,
            },

        },
        
        //Unregister
        unregister: {
            unregisterChannel: "",
            unregisterRole: "",
            unregisterName: "İsim | Yaş",
            dailyUnregisterLimit: 10,
        },

        //Quarantine
        quarantine: {
            quarantineRole: "",
            quarantineName: "Şüpheli Hesap",
            quarantineLog: "",
            quarantineDateLimit: 604800000,
        },

    };

};