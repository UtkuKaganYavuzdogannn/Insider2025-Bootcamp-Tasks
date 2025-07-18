$(document).ready(function()
{
  $("#kullanicilariYukle").click(function(){
    $.get("https://randomuser.me/api/?results=5", function(data) {
      data.results.forEach(function(user) 
      {
        // Fancybox
        let captionText = `${user.name.first} ${user.name.last} - ${user.email} - ${user.location.country}`;

        // Kart HTML yapısı 
        let kart = $(`
          <a href="${user.picture.large}" data-fancybox="galeri" data-caption="${captionText}">
            <div class="kullanici-karti" style="display:none;">
              <img src="${user.picture.large}" alt="Profil Resmi">
              <h3>${user.name.first} ${user.name.last}</h3>
              <p>${user.email}</p>
              <p>${user.location.country}</p>
            </div>
          </a>
        `);

      
        $("#kullaniciAlani").append(kart);
        kart.find(".kullanici-karti").fadeIn(800);

        // Animasyon
        applyCardAnimations(kart);
      });
    });
  });
});
