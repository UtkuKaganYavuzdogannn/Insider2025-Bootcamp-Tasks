let studentData = [
  { name: "Utku", class: "11A", number: "1012" },
  { name: "Aysel", class: "10B", number: "1032" },
  { name: "Yusuf", class: "9C", number: "5103" }
];

// Öğrencileri tabloya yazdırır
function renderTable() {
  let tbody = $("#students tbody");
  tbody.empty();

  for (let i = 0; i < studentData.length; i++) {
    let s = studentData[i];
    let row = "<tr data-index='" + i + "'>" +
                "<td>" + s.name + "</td>" +
                "<td>" + s.class + "</td>" +
                "<td>" + s.number + "</td>" +
                "<td><button class='deleteBtn'>Sil</button></td>" +
              "</tr>";
    tbody.append(row);
  }
}

// Sayfa açıldığında tabloyu göster
$(function () {
  renderTable();

  // Yeni öğrenci ekleme
  $("#addBtn").click(function () {
    let name = $("#name").val();
    let cls = $("#class").val();
    let num = $("#number").val();

    //Boş alana izin vermesin alert gösteriyoruz
      if (name === "" || cls === "" || num === "") {
    alert("Lütfen tüm alanları doldurun.");
    return;
      }

    studentData.push({ name: name, class: cls, number: num });
    renderTable();
  });

  // Öğrenci silme
  $(document).on("click", ".deleteBtn", function () {
    let index = $(this).closest("tr").data("index");
    studentData.splice(index, 1);
    renderTable();
  });
});
