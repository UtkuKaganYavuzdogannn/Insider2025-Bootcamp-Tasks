function silmeButonuEkle(li) {
  try {
    const silBtn = document.createElement("button");
    silBtn.textContent = "Sil";
    silBtn.style.marginLeft = "10px";

    silBtn.addEventListener("click", function () {
      li.remove();
    });

    // sonuna eklemek için
    li.appendChild(silBtn);
  } catch (error) {
    console.error("Silme sırasında", error);
    alert("Silme butonu eklenirken bir hata oluştu. Lütfen tekrar deneyin.");
  }
}
