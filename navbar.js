
var createNav = document.getElementById("navigation-bar")

createNav.innerHTML = `
<nav class="navbar fixed-top navbar-expand-lg navbar-light py-0" style="background-color: #93B5C6; height: 70px">
<div class="container-fluid" style="background-color: #93B5C6;">
  <a class="navbar-brand" style="color: #FFE3E3;" href="#"> Sherry's Portfolio</a>
  <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target=".navbar-collapse" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbar">
    <ul class="navbar-nav" ></ul>
      <li class="nav-item" style="list-style-type: none;" >
        <a class="nav-link active" style="color: #FFE3E3;" aria-current="page" href="https://sherryboxall.github.io/">Home</a>
      </li>
      <li class="nav-item" style="list-style-type: none;" >
        <a class="nav-link" style="color: #FFE3E3;" href="https://sherryboxall.github.io/about_me.html">About Me</a>
      </li>
      <li class="nav-item" style="list-style-type: none;" >
        <a class="nav-link" style="color: #FFE3E3;" href="https://sherryboxall.github.io/portfolio.html">Projects</a>
      </li>
    </ul>
  </div>
</div>
</nav>
`
