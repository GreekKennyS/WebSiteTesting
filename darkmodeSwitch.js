//Kagkasidis
function darkModeSwitch(){
	const body = document.body;
	if(body.classList.contains("darkmode")){
		body.classList.remove("darkmode");
		body.classList.add("lightmode");
	}else if (body.classList.contains("lightmode")){
		body.classList.remove("lightmode");
		body.classList.add("darkmode");
	}else{
		const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		body.classList.add(isSystemDark ? 'lightmode' : 'darkmode');
	}
}
