export function openDropdown() {
	document.getElementById("drop").classList.toggle("show");
}

window.onclick = function(event) {
	const dropdown = document.getElementById("drop");
	const dropbtn = document.querySelector('.dropbtn');
	const bellIcon = document.querySelector('.bell-icon');

	if (!dropdown.contains(event.target) && !dropbtn.contains(event.target) && !bellIcon.contains(event.target)) {
		if (dropdown.classList.contains('show')) {
			dropdown.classList.remove('show');
		}
	}
}
