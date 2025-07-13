function silmeButonuEkle(li) {
  const silBtn = document.createElement("button");
  silBtn.textContent = "Sil";
  silBtn.style.marginLeft = "10px";

  silBtn.addEventListener("click", function () {
    li.remove();
  });

  
  // sonuna eklemek için
  li.appendChild(silBtn);
}
