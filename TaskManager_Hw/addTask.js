const form = document.getElementById("gorevForm");
const baslikInput = document.getElementById("baslik");
const aciklamaInput = document.getElementById("aciklama");
const gorevListesi = document.getElementById("gorevListesi");

form.addEventListener("submit", function(event) {
  event.preventDefault();

try {

  if (baslikInput.value.trim() === "") {
    alert("Lütfen görev başlığı girin.");
    return;
  }

  const oncelik = document.querySelector("input[name='oncelik']:checked");
  const oncelikDegeri = oncelik ? oncelik.value : "belirtilmedi";

  const li = document.createElement("li");
  li.innerHTML = `
    <strong>${baslikInput.value}</strong> - 
    ${aciklamaInput.value || "Açıklama yok"} 
    (${oncelikDegeri} öncelik)
  `;

  // diğer fonksiyonlar
  tamamlanmaOzelligiEkle(li);
  silmeButonuEkle(li);

  gorevListesi.appendChild(li);
  form.reset();
  } 
  catch (error) {
    console.error("Eklenme esnasında hata oluştu:", error);
    alert(error.message);
  }
});
