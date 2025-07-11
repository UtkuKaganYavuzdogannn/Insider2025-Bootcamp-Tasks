let sayac; // Zamanlayıcıyı saklar
let kalanSure = 0; // Kullanıcının girdiği süre

function baslat() {
  const input = document.getElementById("saniyeInput");
  kalanSure = parseInt(input.value);

  if (isNaN(kalanSure) || kalanSure <= 0) {
    alert("Lütfen geçerli bir süre giriniz.");
    return;
  }

  clearInterval(sayac); // Daha önce başlatılmışsa onu durdur

  sayac = setInterval(() => {
    document.getElementById("time").innerText = kalanSure + " saniye kaldı";

    if (kalanSure <= 0) {
      clearInterval(sayac);
      document.getElementById("time").innerText = "Zaman Doldu!";
    }

    kalanSure--;
  }, 1000);
}

function sifirla() {
  clearInterval(sayac);
  kalanSure = 0;
  document.getElementById("time").innerText = "Süre sıfırlandı.";
  document.getElementById("saniyeInput").value = "";
}
