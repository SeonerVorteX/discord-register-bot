const { TextChannel, DMChannel, Collection } = require("discord.js");
const { guildSettings } = global.client;
const { mark, cross } = require('../configs/emojis.json');
const registers = require("../schemas/registers.js");
const moment = require('moment');
require('moment-duration-format');
moment.locale('tr');

module.exports = async (client) => {

    /**
     * @param { String } userID 
     */

    client.fetchUser = async (userID) => {

        try {
          return await client.users.fetch(userID).then(user => user);
        } catch (err) {
          return undefined;
        }

    };

    /**
     * @param { Boolean } completed 
     * @param { String } gender 
     * @param { String } guildID 
     * @param { String } userID 
     * @param { String } staff 
     * @param { Number } date 
     * @param { Array<Object> } nameArray 
     * @param { Object } options 
     */

    client.newRegister = async (completed = false, gender = undefined, guildID = guildSettings.guildID, userID, staffID, date = undefined, nameArray = new Array(), options = new Object()) => {

        if(!options) throw new ReferenceError('Options Is Not Defined');
        if(typeof(options) !== 'object') throw new TypeError('Invalid Argument : Options');

        let row = await registers.find({ guildID: guildID });
        row = row ? row.length + 1 : 1;

        return await new registers({ row: row, completed: completed, gender: gender, guildID: guildID, userID: userID, staffID: staffID, date: date, nameArray: nameArray, options: options }).save();

    };

    client.checkSecurity = (user, filter) => {

        if(!user) throw new ReferenceError('User Is Not Defined');
        if(!filter) throw new ReferenceError('Filter Is Not Defined');
        if(isNaN(filter) || filter.toLocaleString().includes('-')) throw new SyntaxError('Invalid Argument: Filter');

        let date = (Date.now() - user.createdTimestamp);

        if(date < filter) return false;
        else return true;

    };

    /**
     * @param { Number } ms 
     */

    client.wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    /**
     * @param { Number } time 
     */

    client.getTime = (time) => {

        if(!time) throw new ReferenceError("Time Is Not Defined");
        if(isNaN(time) || time.toLocaleString().includes('-')) throw new TypeError("Invalid Argument : Time");

        let date = moment.duration(time)._data;

        if(date.years) return `${date.years} yıl${date.months ? `, ${date.months} ay` : ``}`
        if(date.months) return `${date.months} ay${date.days ? `, ${date.days} gün` : ``}`
        if(date.days) return `${date.days} gün${date.hours ? `, ${date.hours} saat` : ``}`;
        if(date.hours) return `${date.hours} saat${date.minutes ? `, ${date.minutes} dakika` : ``}`;
        if(date.minutes) return date.minutes < 5 ? `birkaç dakika` : date.minutes > 45 ? `yaklaşık 1 saat` : `${date.minutes} dakika`;
        if(date.seconds) return date.seconds < 15 ? `birkaç saniye` : date.seconds > 45 ? `yaklaşık 1 dakika` : `${date.seconds} saniye`;
 
    };

    /**
     * @param { Number } time
     * @param { Object } options
     */

    client.duration = async (time, options) => {

        if(!time) throw new ReferenceError("Time Is Not Defined");
        if(isNaN(time) || time.toLocaleString().includes('-')) throw new TypeError("Invalid Argument : Time");
        if(options && typeof(options) !== "object") throw new TypeError('Invalid Argument: Options');

        if(options && options.comma) return (moment.duration(time).format(`D [gün,] H [saat,] m [dakika,] s [saniye]`));
        else return (moment.duration(time).format(`D [gün] H [saat] m [dakika] s [saniye]`));

    };

    /**
     * @param { String } duration 
     */

    client.replaceDuration = (duration) => {

        if(!duration) throw new ReferenceError(`Duration Is Not Defined`);

        duration = duration.trim().toLocaleString()
        .replace('minute', '')
        .replace('m', '')
        .replace('dk', '')
        .replace('dakika', '')

        .replace('day', '')
        .replace('d', '')
        .replace('gün', '')
        .replace('g', '')

        .replace('hour', '')
        .replace('h', '')
        .replace('st', '')
        .replace('saat', '')

        .replace('saniye', '')
        .replace('sn', '')
        .replace('s', '')
        
        return duration;

    };

    /**
     * @param { String } duration
     */

    client.ms = async (duration) => {

        if(!duration) throw new ReferenceError(`Duration Is Not Defined`);

        duration.trim();

        if(['m', 'minute', 'dk', 'dakika'].some(arg => duration.includes(arg))) {

            let arg;

            if(duration.includes('minute')) arg = 'minute'
            else if(duration.includes('m')) arg = 'm'
            else if(duration.includes('dakika')) arg = 'dakika'
            else if(duration.includes('dk')) arg = 'dk'

            duration = duration.replace(arg, 'm');

            return { duration: duration, durationMsg: await duration.replace('m', ' dakika')};

        } else if(['day', 'd', 'gün', 'g'].some(arg => duration.includes(arg))) {

            let arg;

            if(duration.includes('day')) arg = 'day'
            else if(duration.includes('d')) arg = 'd'
            else if(duration.includes('gün')) arg = 'gün'
            else if(duration.includes('g')) arg = 'g'

            duration = duration.replace(arg, 'd');

            return { duration: duration, durationMsg: await duration.replace('d', ' gün')};

        } else if(['h', 'hour', 'st', 'saat'].some(arg => duration.includes(arg))) {

            let arg;

            if(duration.includes('hour')) arg = 'hour'
            else if(duration.includes('h')) arg = 'h'
            else if(duration.includes('saat')) arg = 'saat'
            else if(duration.includes('st')) arg = 'st'

            duration = duration.replace(arg, 'h');

            return { duration: duration, durationMsg: await duration.replace('h', ' saat')};

        } else if(['s', 'sn', 'saniye'].some(arg => duration.includes(arg))) {

            let arg;

            if(duration.includes('saniye')) arg = 'saniye'
            else if(duration.includes('sn')) arg = 'sn'
            else if(duration.includes('s')) arg = 's'

            duration = duration.replace(arg, 's');

            return { duration: duration, durationMsg: await duration.replace('s', ' saniye')};

        };

    };

    /**
     * @param { String } dataName 
     * @param { Number } count 
     * @param { Object } options 
     */

    Collection.prototype.add = async function(dataName, count, options) {

        if(!dataName) throw new ReferenceError(`Collection Data Is Not Defined`);

        let data = await this.get(dataName);

        if(!data && !options) throw new ReferenceError(`Data Not Found`);
        if(!count) throw new ReferenceError(`Count Is Not Defined`);
        if(isNaN(count) || count == 0 || count.toLocaleString().includes('-')) throw new SyntaxError('Invalid Argument: Count')
        if(!options) {
            
            this.set(dataName, parseInt(data)+parseInt(count));
            return this;

        } else {

            let name = options.name;

            if(data[name] && (isNaN(data[name]) || data[name] == 0 || data[name].toLocaleString().includes('-'))) throw new Error('Data Is Not A Number');

            data[name] = parseInt(!data[name] ? 0 : data[name]) + parseInt(count);
            this.set(dataName, data);
            return this.get(dataName);

        };

    };

    /**
     * @param { Message } message 
     * @param { Object } options
     */

    TextChannel.prototype.wsend = async function (message, options) {

        if(!message) throw new ReferenceError('Message Is Not Defined');
        if(options && typeof(options) !== 'object') throw new SyntaxError('Invalid Argument: Options');

        if(options) {

            let name = options.name;
            let avatar = options.avatar;

            if(!name) name = client.user.username;
            if(!avatar) avatar = client.user.avatarURL();

            let hooks = await this.fetchWebhooks();
            let webhook = hooks.find(hook => hook.name == name && hook.owner.id == client.user.id);
            if (webhook) return webhook.send(message);
            else {
                webhook = await this.createWebhook(name, { avatar: avatar });
                return webhook.send(message);
            };

        } else {

            let hooks = await this.fetchWebhooks();
            let webhook = hooks.find(hook => hook.name === client.user.username && hook.owner.id === client.user.id);
            if (webhook) return webhook.send(message);
            else {
                webhook = await this.createWebhook(client.user.username, { avatar: client.user.avatarURL() });
                return webhook.send(message);
            };

        };

    };

    /**
     * @param { Message } message 
     * @param { String } text 
     * @param { Object } options 
     */

     TextChannel.prototype.success = function (message, text, options = new Object()) {

        if(!message) throw new ReferenceError('Message Is Not Defined');
        if(!text) throw new ReferenceError('Text Is Not Defined');
        if(typeof(options) !== 'object') throw new SyntaxError('Invalid Argument: Options')

        let reply = options.reply
        let time = options.timeout
        let react = options.react
        let deleteMsg = options.deleteMessage

        if(time && (isNaN(time) || time == 0 || time.toLocaleString().includes('-'))) throw new SyntaxError('Invalid Argument: Timeout');
        if(reply && typeof(reply) !== 'boolean') throw new SyntaxError('Invalid Argument: Author');
        if(react && typeof(react) !== 'boolean') throw new SyntaxError('Invalid Argument: React');
        if(deleteMsg && typeof(deleteMsg) !== 'boolean' && (isNaN(deleteMsg) || deleteMsg == 0 || deleteMsg.toLocaleString().includes('-'))) throw new SyntaxError('Invalid Argument: DeleteMessage');

        if(react && mark) message.react(mark);
        if(reply) {
            
            if(!message.author) throw new TypeError('Invalid Argument: Message');

            message.reply(text).then(msg => {
                if(time) msg.delete({ timeout: parseInt(time) }).catch(() => {});
            });

        } else {

            message.channel.send(text).then(msg => {
                if(time) msg.delete({ timeout: parseInt(time) }).catch(() => {});
            });

        };
        if(message && deleteMsg) {

            if(typeof(deleteMsg) == 'boolean') return message.delete().catch(() => {});
            else if(typeof(parseInt(deleteMsg)) !== 'boolean') return message.delete({ timeout: parseInt(deleteMsg) });

        };

    };

    /**
     * @param { Message } message 
     * @param { String } text 
     * @param { Object } options 
     */
  
    TextChannel.prototype.error =  function (message, text, options = new Object()) {

        if(!message) throw new ReferenceError('Error Message Is Not Defined');
        if(!text) throw new ReferenceError('Error Text Is Not Defined');
        if(typeof(options) !== 'object') throw new SyntaxError('Invalid Argument: Options');

        let time = options.timeout
        let reply = options.reply
        let react = options.react
        let keepMsg = options.keepMessage

        if(time && (isNaN(time) || time == 0 || time.toLocaleString().includes('-'))) throw new SyntaxError('Invalid Argument: Timeout');
        if(reply && typeof(reply) !== 'boolean') throw new SyntaxError('Invalid Argument: Author');
        if(react && typeof(react) !== 'boolean') throw new SyntaxError('Invalid Argument: React');
        if(keepMsg && typeof(keepMsg) !== 'boolean') throw new SyntaxError('Invalid Argument: KeepMessage');

        if(react && cross) message.react(cross);
        if(reply) {

            if(!message.author) throw new TypeError('Invalid Argument: Message');

            message.reply(text).then(msg => {
                if(time) msg.delete({ timeout: parseInt(time) }).catch(() => {});
            });

        } else {

            message.channel.send(text).then(msg => {
                if(time) msg.delete({ timeout: parseInt(time) }).catch(() => {});
            });

        };
        if(message && time && !keepMsg) return message.delete({ timeout: parseInt(time) }).catch(() => {});

    };

    /**
     * @param { Message } message 
     * @param { String } text 
     * @param { Object } options 
     */

     DMChannel.prototype.success = function (message, text, options = new Object()) {

        if(!message) throw new ReferenceError('Message Is Not Defined');
        if(!text) throw new ReferenceError('Text Is Not Defined');
        if(typeof(options) !== 'object') throw new SyntaxError('Invalid Argument: Options');

        let reply = options.reply;
        let react = options.react;

        if(reply && typeof(reply) !== 'boolean') throw new SyntaxError('Invalid Argument: Author');
        if(react && typeof(react) !== 'boolean') throw new SyntaxError('Invalid Argument: React');
        
        if(react && mark) message.react(mark);
        if(reply) {
            
            if(!message.author) throw new TypeError('Invalid Argument: Message');

            message.reply(text);

        } else message.channel.send(text);

    };

    /**
     * @param { Message } message 
     * @param { String } text 
     * @param { Object } options 
     */
  
    DMChannel.prototype.error =  function (message, text, options = new Object()) {

        if(!message) throw new ReferenceError('Error Message Is Not Defined');
        if(!text) throw new ReferenceError('Error Text Is Not Defined');
        if(typeof(options) !== 'object') throw new SyntaxError('Invalid Argument: Options');

        let reply = options.reply;
        let react = options.react;

        if(reply && typeof(reply) !== 'boolean') throw new SyntaxError('Invalid Argument: Author');
        if(react && typeof(react) !== 'boolean') throw new SyntaxError('Invalid Argument: React');
        
        if(react && cross) message.react(cross);
        if(reply) {

            if(!message.author) throw new TypeError('Invalid Argument: Message');

            message.reply(text);

        } else message.channel.send(text);

    };

    Array.prototype.random = function() {
    
        return this[Math.floor((Math.random() * this.length))];
        
    };

    /**
     * @param { String } element 
     */

    Array.prototype.has = function(element) {

        if(!element) throw new ReferenceError("Element Is Not Defined");
        if(this.some(arrayElement => arrayElement == element)) return true;
        else return false;

    };

    /**
     * @param { Number } chunk_size 
     */

    Array.prototype.chunk = function(chunkSize) {

        let array = new Array();

        for (let index = 0; index < this.length; index += chunkSize) {

            let chunk = this.slice(index, index + chunkSize);
            array.push(chunk);

        };

        return array;
        
    };

    client.adds = [
        "discord.gg",
        "discord.com/invite",
        "discordapp.com/invite",
        "https://",
        ".ml",
        "discord.gg",
        "discord.com/invite",
        "discordapp",
        "discordgg",
        ".gg/",
        "gg/",
        ".com",
        ".net",
        ".xyz",
        ".tk",
        ".pw",
        ".io",
        ".gg",
        "www.",
        "https",
        "http",
        ".gl",
        ".org",
        ".com.tr",
        ".biz",
        ".party",
        ".rf.gd",
        ".az",
        "glitch.me",
        "glitch.com"
    ];

    client.curses = [
        "allahoc",
        "allahoç",
        "allahamk",
        "allahaq",
        "0r0spuc0cu",
        "p1c",
        "@n@nı",
        "evladi",
        "orsb",
        "orsbcogu",
        "amnskm",
        "anaskm",
        "abaza",
        "abazan",
        "fuck",
        "shit",
        "ahmak",
        "seks",
        "sex",
        "ambiti",
        "am biti",
        "amcik",
        "amck",
        "amckl",
        "amcklama",
        "amcklaryla",
        "amckta",
        "amcktan",
        "amcuk",
        "amına",
        "amina",
        "aminako",
        "aminakoyarim",
        "aminakoyim",
        "aminda",
        "amindan",
        "amindayken",
        "amini",
        "aminoglu",
        "amiyum",
        "amk",
        "amkafa",
        "amlarnzn",
        "ammak",
        "ammna",
        "amn",
        "amna",
        "amnda",
        "amndaki",
        "amngtn",
        "amnn",
        "amona",
        "amq",
        "amsiz",
        "amsz",
        "amteri",
        "amugaa",
        "amuna",
        "anaaann",
        "anal",
        "analarn",
        "anan",
        "ananı",
        "anana",
        "anandan",
        "anani",
        "ananin",
        "ananisikerim",
        "anann",
        "ananz",
        "anasi",
        "anasinin",
        "anay",
        "anayin",
        "angut",
        "anneni",
        "annenin",
        "annesiz",
        "anuna",
        "aq",
        "a.q",
        "a.q.",
        "aq.",
        "attrrm",
        "auzlu",
        "avrat",
        "babani",
        "bacini",
        "bacn",
        "bacndan",
        "bacy",
        "bastard",
        "bitch",
        "biting",
        "boner",
        "bosalmak",
        "cif",
        "cikar",
        "cim",
        "dallama",
        "daltassak",
        "dalyarak",
        "dalyarrak",
        "dangalak",
        "dassagi",
        "diktim",
        "dildo",
        "dingil",
        "dingilini",
        "dinsiz",
        "dkerim",
        "domal",
        "domalan",
        "domalmak",
        "domalt",
        "domaltarak",
        "domaltip",
        "domaltmak",
        "eben",
        "ebeni",
        "ebenin",
        "ebeninki",
        "ebleh",
        "ecdadini",
        "embesil",
        "emi",
        "fahise",
        "ferre",
        "fuck",
        "fucker",
        "fuckin",
        "fucking",
        "gavad",
        "gavat",
        "giberim",
        "giberler",
        "gibis",
        "gibmek",
        "gibtiler",
        "goddamn",
        "godumun",
        "gotelek",
        "gotlalesi",
        "gotlu",
        "gotten",
        "gotundeki",
        "gotunden",
        "gotune",
        "gotunu",
        "gotveren",
        "goyiim",
        "goyum",
        "goyuyim",
        "goyyim",
        "gtelek",
        "gtn",
        "gtnde",
        "gtnden",
        "gtne",
        "gtten",
        "gtveren",
        "hasiktir",
        "hassikome",
        "hassiktir",
        "has siktir",
        "hassittir",
        "haysiyetsiz",
        "hayvan herif",
        "hsktr",
        "huur",
        "ibina",
        "ibine",
        "ibinenin",
        "ibne",
        "ibnedir",
        "ibneleri",
        "ibnelik",
        "ibnelri",
        "ibneni",
        "ibnenin",
        "ibnerator",
        "ibnesi",
        "idiot",
        "idiyot",
        "imansz",
        "ipne",
        "iserim",
        "kafasiz",
        "kahpe",
        "kahpenin",
        "kaka",
        "kaltak",
        "kancik",
        "kappe",
        "karhane",
        "kavat",
        "kavatn",
        "kaypak",
        "kayyum",
        "kerane",
        "kerhane",
        "kerhanelerde",
        "kevase",
        "kevvase",
        "kodumun",
        "kodumunun",
        "koduumun",
        "koyarm",
        "koyiim",
        "koyiiym",
        "koyim",
        "koyum",
        "koyyim",
        "krar",
        "kukudaym",
        "madafaka",
        "malafat",
        "malak",
        "mcik",
        "memelerini",
        "mezveleli",
        "mincikliyim",
        "mna",
        "monakkoluyum",
        "motherfucker",
        "mudik",
        "orosbucocuu",
        "orospu",
        "orospucocugu",
        "orospu cocugu",
        "orospudur",
        "orospular",
        "orospunun",
        "orospuydu",
        "orospuyuz",
        "orostoban",
        "orostopol",
        "orrospu",
        "oruspu",
        "osbir",
        "ossurduum",
        "ossurmak",
        "ossuruk",
        "osur",
        "osurduu",
        "osuruk",
        "osururum",
        "otuzbir",
        "penis",
        "pezevek",
        "pezeven",
        "pezeveng",
        "pezevengi",
        "pezevenk",
        "pezo",
        "piç",
        "pici",
        "picler",
        "pipi",
        "pisliktir",
        "porno",
        "pussy",
        "rahminde",
        "revizyonist",
        "s1kerim",
        "s1kerm",
        "s1krm",
        "sakso",
        "saksofon",
        "saxo",
        "sekis",
        "serefsiz",
        "sexs",
        "sicarsin",
        "sie",
        "sik",
        "sikdi",
        "sike",
        "sikecem",
        "sikem",
        "siken",
        "sikenin",
        "siker",
        "sikerim",
        "sikerler",
        "sikersin",
        "sikertir",
        "sikertmek",
        "sikesen",
        "sikesicenin",
        "sikey",
        "sikeydim",
        "sikeyim",
        "sikeym",
        "siki",
        "sikicem",
        "sikici",
        "sikien",
        "sikienler",
        "sikiiim",
        "sikiiimmm",
        "sikiim",
        "sikiir",
        "sikiirken",
        "sikik",
        "sikil",
        "sikildiini",
        "sikilesice",
        "sikilmi",
        "sikilmie",
        "sikilmis",
        "sikilsin",
        "sikim",
        "sikimde",
        "sikimden",
        "sikime",
        "sikimi",
        "sikimiin",
        "sikimin",
        "sikimle",
        "sikimsonik",
        "sikimtrak",
        "sikin",
        "sikinde",
        "sikinden",
        "sikine",
        "sikini",
        "sikip",
        "sikis",
        "sikisek",
        "sikisen",
        "sikish",
        "sikismis",
        "sikitiin",
        "sikiyim",
        "sikiym",
        "sikiyorum",
        "sikkim",
        "sikko",
        "sikleri",
        "sikleriii",
        "sikli",
        "sikm",
        "sikmek",
        "sikmem",
        "sikmiler",
        "sikmisligim",
        "siksem",
        "sikseydin",
        "sikseyidin",
        "siksin",
        "siksinbaya",
        "siksinler",
        "siksiz",
        "siksok",
        "siksz",
        "sikt",
        "sikti",
        "siktigimin",
        "siktigiminin",
        "siktii",
        "siktiim",
        "siktiimin",
        "siktiiminin",
        "siktiler",
        "siktim",
        "siktim",
        "siktimin",
        "siktiminin",
        "siktir",
        "siktirgit",
        "siktirir",
        "siktiririm",
        "siktiriyor",
        "siktirolgit",
        "sittimin",
        "sittir",
        "skcem",
        "skecem",
        "skem",
        "sker",
        "skerim",
        "skerm",
        "skeyim",
        "skiim",
        "skik",
        "skim",
        "skime",
        "skmek",
        "sksin",
        "sksn",
        "sksz",
        "sktiimin",
        "sktrr",
        "skyim",
        "slaleni",
        "sokam",
        "sokarim",
        "sokarm",
        "sokarmkoduumun",
        "sokaym",
        "sokiim",
        "sokuk",
        "sokum",
        "sokuyum",
        "soxum",
        "sulaleni",
        "taaklarn",
        "taaklarna",
        "tarrakimin",
        "tasak",
        "tassak",
        "tiyniyat",
        "toplarm",
        "topsun",
        "vajina",
        "veled",
        "veledizina",
        "verdiimin",
        "weled",
        "weledizina",
        "whore",
        "xikeyim",
        "yaaraaa",
        "yalama",
        "yalarun",
        "yaraaam",
        "yarak",
        "yaraktr",
        "yaram",
        "yaraminbasi",
        "yaramn",
        "yararmorospunun",
        "yarra",
        "yarraaaa",
        "yarraak",
        "yarraam",
        "yarragi",
        "yarragimi",
        "yarragina",
        "yarragindan",
        "yarragm",
        "yarraimin",
        "yarrak",
        "yarram",
        "yarramin",
        "yarramn",
        "yarran",
        "yarrana",
        "yarrrak",
        "yavak",
        "yilisik",
        "yogurtlayam",
        "yrrak",
        "zibidi",
        "zigsin",
        "zikeyim",
        "zikiiim",
        "zikiim",
        "zikik",
        "zikim",
        "ziksiiin",
        "ziksiin",
        "zulliyetini",
        "zviyetini",
    ];

};