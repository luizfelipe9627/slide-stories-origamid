import Slide from "./modules/Slide.js"; // Importando a classe Slide para ser usada nesse arquivo.

// Puxando os elementos do HTML para as constantes criadas.
const container = document.getElementById("slide");
const elements = document.getElementById("slide-elements");
const controls = document.getElementById("slide-controls");

// Se o container, os elementos e os controles existirem e se os elementos tiverem filhos, então executa o if.
if (container && elements && controls && elements.children.length) {
  // Está criando um objeto chamado slide que é uma instância/refêrencia da classe Slide. Passando como parâmetros o container, os elementos(filhos) convertidos em array, os controles e o tempo para trocar de slide.
  new Slide(container, Array.from(elements.children), controls, 3000);
}
