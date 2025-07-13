function tamamlanmaOzelligiEkle(li) {

    try {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";

  checkbox.addEventListener("change", function () {
      if (checkbox.checked) {
      li.style.backgroundColor = "#e8f5e9"; // Yeşil renk
      li.style.color = "#2e7d32"; // Yeşil renk
    } else {
      li.style.backgroundColor = ""; 
      li.style.color = ""; 
    }
  });

  // checkbox'ı listenin en başına eklemek için prepend
  li.prepend(checkbox);

        } 
  catch (error) {
    console.error("Görev tamamlanırken hata oluştu:", error);
    alert("Lütfen tekrar deneyin.");
                }
}
