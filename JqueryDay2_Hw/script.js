let postIlk = 0;
let postSon = 6;
let yuklemeDurumu= false; 

$(document).ready(function () {
  loadPosts();
});


// Kaydırma eventinin tetiklenmesi
$(window).on('scroll', function() {
  if ($(window).scrollTop() + $(window).height() >= $(document).height() - 100) {
    loadPosts();
  }
});

// Postları çeken fonksiyon ve yüklemenin başlaması
function loadPosts() {
    yuklemeDurumu = true;  
  $("#loading").show(); 

  $.get(`https://jsonplaceholder.typicode.com/posts?_start=${postIlk}&_limit=${postSon}`, function (data) {
    data.forEach(function (post) 
    {
      $("#postContainer").append
      (`
        <div class="post">
        <h3>${post.title}</h3>
        <p>${post.body}</p>
        </div>

      `);
    });

   //  +5 daha yüklenmesi icin 
    postIlk += postSon;
    yuklemeDurumu = false;
    $("#loading").hide(); 
  })

  .fail(function() {
    $("#loading").hide();
    alert("Post yuklemesi basarısız....");
    yuklemeDurumu = false;
  });
}
