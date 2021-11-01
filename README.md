# 📌 Görseller
<img src="https://media.discordapp.net/attachments/836467887928639498/892053937820147772/unknown.png">
<img src="https://media.discordapp.net/attachments/836467887928639498/892054616253014036/unknown.png">
<img src="https://media.discordapp.net/attachments/836467887928639498/892057281498329188/unknown.png">
<img src="https://media.discordapp.net/attachments/836467887928639498/892065116269457469/unknown.png">

# ✨ Kurulum
### Projeyi botunuzda kullanmak için bazı işlemler yapmanız gerekiyor. Aşağıdaki yönlendirmeleri takip ederek bunu yapabilirsiniz :
* Herkesin bildiği gibi ilk önce bilgisayarınıza [Node JS](https://nodejs.org/tr/) ve ayarları daha rahat yapa bilmek için bir editör *(Örneğin [Visual Studio Code](https://code.visualstudio.com/))* indirmeniz gerekiyor.
* Ve veritabanı için bir [MongoDB](https://mongodb.com/) bağlantı linkinizin olması gerekiyor.
    * Not: Eğer **MongoDB** hakkında bilginiz yoksa [Youtube](https://www.youtube.com/) gibi platformlardan ayrıntılı bilgi ala bilirsiniz.
* Projeyi zip dosyası halinde indirin ve herhangi bir klasöre zip dosyasını çıkarın.
* Sonra editörünüzde `src/configs/settings.js` dosyasına gelerek botunuzun ve sunucunuzun gerekli ayarlarını girin.
* Daha sonra editörünüzün terminalini yada klasörünuzun bulunduğu dizinde `cmd` veya `powershell` penceresini açın.
* Ve `npm i` yazarak otomatik olarak gerekli tüm modülleri indirin.
* Bu işlem de bittikten sonra pencerede `node .` veya `npm start` yazarak botunuzu çalıştırın!
## Glitch kullanıcıları için :
* Glitch platformunda `New Project` butonuna tıklayın, çıkan seçimler arasında en aşağıda bulunan `Import from GitHub` seçeneğine tıklayıp çıkan pencereye bu Altyapının linkini girin ve Tamam'a tıklayın!
* `package.json` dosyasını Glitch'e uygun olarak değiştirin!
* Ve bir kaç sistem hatası almamak için `package.json` dosyasına aşağıdaki kodu girin :
```json
"engines" : {
    "node": "12.x"
}
```

# ⚙️ Ayarlar
### Botunuzun doğru ve hatasız çalışması için `settings.js` dosyasını doğru bir şekilde doldurmanız gerekiyor. Aşağıdaki yönlendirmeleri takip ederek bazı ayarları yapabilirsiniz :

* `client.settings` ve `client.statusMessages` kısmı botunuzun, `client.systemEmojis` kısmı kullanılacak olan emojilerin ve `client.guildSettings` kısmı ise sunucunuzun gerekli ayarlarıdır.
* Botunuzun yapmış olduğum diğer altyapıları kullanan botlarınızla uyumlu olarak çalışması için tüm botlarda `client.settings.MongoURL` kısmına aynı bağlantı linkini girmelisiniz.
* Altyapıdaki komutların çoğunda yavaş mod mevcuttur ve bunu **Sunucu Yöneticisi** ve **Bot Altı Yönetici** yetkisine sahip yetkililere kapatmak için `client.settings.DisableCooldownsForAdmins` kısmını aktif hale getirebilirsiniz.
* `client.systemEmojis` dizini botunuzun kullanmak için sunucunuza kuracağı emoji bilgilerini gösteriyor. Dizine belirtilen şekilde yeni emoji bilgileri ekleyerek belirttiğiniz emojilerinde sunucunuza kurulmasını sağlaya bilirsiniz. Bu emojilerin kurulması için botunuzu aktifleşdirdikten sonra **Emojikur** komutunu kullanmanız gerekmektedir.
    * Bilgi: **Emojikur** komutunu kullandıktan sonra botunuz emojileri sunucuya kurar ve `src/configs/emojis.json` dosyasına kaydeder. Gerektiği zaman da bu dosyadan alıp kullanır ve sizde tüm emojileri `<:name:id>` şeklinde botunuza kaydetme zahmetinden kurtulursunuz.
    * Not: Bazı kullanıcılarda emojiler `src/configs/emojis.json` dosyasına kaydedilmeye bilir, bu durumda Emojikur komutunu kullandıktan sonra `eval JSON.stringify(emojis, null, 2)` komutunu çalıştırarak çıkan sonucu dosyaya yapıştırarak sorunu hall edebilirsiniz.
    * Not: `src/configs/emojis.json` dosyasında discordun birkaç varsayılan emojileride hazır bulunmaktadır.
* `client.guildSettings.guildTags` dizinine sunucunuzun taglarını, `client.guildSettings.guildDiscriminator` kısmına ise sunucunuzun etiket tagını *(#0000 gibi ve eğer varsa)*  **#** olmadan girmelisiniz.
    * Not: Sunucunuzda etiket tagı kullanmıyorsanız **guildDiscriminator** kısmını silmenize gerek yok. Boş bırakıp botunuza etiket tagınızın olmadığını belirtmelisiniz.
* `client.guildSettings.botYt` kısmına sunucunuzun **Bot Altı Yönetici** rolünün ID'sini girmelisiniz.
    * Bilgi: **Bot Altı Yönetici** rolü botunuzun %75'lik kısmına diğer roller ihtiyaç olmaksızın erişe bilmesini sağlar. Eğer sunucunuzda botunuzun çoğu komutuna erişip ama **Sunucu Yöneticisi** yetkisini vermek istemediğiniz üyeler varsa onlara bu rolü verebilirsiniz.
* `client.guildSettings.unAuthorizedMessages` kısmından sunucunuzda yeterli yetkisi olmayan üyelerin yetkili komutlarını kullandıkta alıcakları geridönüş mesajını açıp-kapata bilirsiniz.
* `client.guildSettings.registration.requireTag` kısmından sunucunuzdaki taglı alım zorunluluğunu açıp-kapata bilirsiniz.
* `client.guildSettings.registration.nameTag` kısmına sunucunuzdaki üyelerin sunucu isimlerinin başında bulunacak sembolü gire veya boş bıraka bilirsiniz.
* `client.guildSettings.registration.penalBlockLimit` kısmına üyenin kaç cezası oldukta, `client.guildSettings.registration.penalPointBlockLimit` kısmına ise üyenin kaç ceza puanı oldukta sunucuya kayıt olmasını engellemeyi belirte bilirsiniz.
* `client.guildSettings.registration.limit` kısmına bir yetkilinin 10 dakika içinde maksimum kaç kayıt işlemi yapabileceğini belirtmelisin.

📌 Diğer ayarlarıda doğru bir şekilde girerek bu kısmıda başarıyla tamamlaya bilirsiniz!

# ⚡ İletişim
### Eğer bir hatayla karşılaşıyor veya botunuzu kurmakta sorun yaşıyorsanız aşağıdaki bağlantılardan bana ulaşabilirsiniz :
* [Discord Sunucum](https://discord.gg/MTNkXHnX3b)
* [Ana Hesabım](https://discord.com/users/624914071984013313)
* [Yan Hesabım](https://discord.com/users/809325505304068096)

## Önemli: Proje MIT lisansına sahiptir ve projenin dosyalarının izin alınmadan paylaşılması, satılması  veya benzeri durumlar kesinlikle yasaktır. Böyle bir durumun yaşanması sonucunda bundan sorumlu şahıs(lar)a gerekli işlemler yapılacaktır!