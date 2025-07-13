function tamamlanmaOzelligiEkle(li) {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";

  checkbox.addEventListener("change", function () {
    if (checkbox.checked) {
      li.style.textDecoration = "line-through";
    } else {
      li.style.textDecoration = "none";
    }
  });

  // checkbox'ı listenin en başına eklemek için prepend
  li.prepend(checkbox);
}
