let userName = prompt("Adınızı girin:");
let userAge = prompt("Yaşınızı girin:");
let userJob = prompt("Mesleğinizi girin:");

// Kullanıcı bilgilerini nesne olarak tut
let user = {
  name: userName,
  age: userAge,
  job: userJob
};

console.log("Kullanıcı Bilgileri:");
console.log(user);


let cart = []; //boş bir sepet oluşturduk.

// ürün ekleme 
function urunEkle() {
  let urunAdi = prompt("Ürün adı:");
  let urunFiyat = parseFloat(prompt("Ürün fiyatı:"));

  if (!isNaN(urunFiyat)) {
    let urun = {
      name: urunAdi,
      price: urunFiyat
    };
    cart.push(urun);
    console.log("Ürün eklendi:", urun);
  } else {
    console.log("Geçersiz fiyat girdiniz!");
  }
}

// Sepeti listeleme fonksiyonu
function sepetiGoster() {
  if (cart.length === 0) {
    console.log("Sepet boş.");
  } else {
    console.log("Sepetinizdeki ürünler:");
    for (let i = 0; i < cart.length; i++) {
      console.log((i + 1) + ". " + cart[i].name + " - " + cart[i].price + " TL");
    }
  }
}

//ürün silme 
function urunSil() {
  sepetiGoster();
  let silinecekIndex = parseInt(prompt("Silmek istediğiniz ürün numarası:")) - 1;

  if (silinecekIndex >= 0 && silinecekIndex < cart.length) {
    let silinen = cart.splice(silinecekIndex, 1);
    console.log("Ürün silindi:", silinen[0]);
  } else {
    console.log("Geçersiz numara.");
  }
}

// fiyatı hesaplama
function toplamFiyat() {
  let toplam = cart.reduce(function (acc, urun) {
    return acc + urun.price;
  }, 0);

  console.log("Sepet Toplamı: " + toplam.toFixed(2) + " TL");
}
