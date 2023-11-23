const imprimirButton = document.getElementById('imprimir');
imprimirButton.addEventListener('click', imprimir);
const nav = document.getElementById('nav');

function imprimir(){
    nav.style.display ="none";
    imprimirButton.style.display = "none";
    window.print();
    nav.style.display ="block";
    imprimirButton.style.display = "inline-block";
}
