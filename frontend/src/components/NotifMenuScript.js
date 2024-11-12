export function openDropdown() {
	document.getElementById("drop").classList.toggle("show");
}

window.onclick = function(event) {
	if (!event.target.matches('.dropbtn') && !event.target.matches('.bell-icon')) {
		var dropdowns = document.getElementsByClassName("dropdown-content");
		var i;
		for (i = 0; i < dropdowns.length; i++) {
			var openDropdown = dropdowns[i];
			if (openDropdown.classList.contains('show')) {
				openDropdown.classList.remove('show');
			}
		}
	}
}
