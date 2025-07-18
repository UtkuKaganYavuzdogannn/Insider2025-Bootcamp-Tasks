function applyCardAnimations(kart) {
  // Hover efekti (opaklık + çerçeve rengi)
  kart.find(".kullanici-karti").hover(
    function() {
      $(this).fadeTo(200, 0.7).toggleClass("hovered");
    },
    function() {
      $(this).fadeTo(200, 1).toggleClass("hovered");
    }
  );
}
