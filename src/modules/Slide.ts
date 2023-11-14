import Timeout from "./Timeout.js"; // Importa a classe Timeout do arquivo Timeout.js.

// Criado uma classe chamada Slide.
class Slide {
  // Para funcionar no this do construtor, a propriedade precisa ser criada fora do construtor, com o exato nome e tipo que será passado no construtor.
  container: Element;
  slides: Element[];
  controls: Element;
  time: number;
  index: number;
  slide: Element;
  timeout: Timeout | null;
  pausedTimeout: Timeout | null;
  paused: boolean;
  thumbItems: HTMLElement[] | null;
  thumb: HTMLElement | null;
  volume: HTMLElement | null;
  volumeImage: HTMLImageElement | null;

  // O construtor deve receber o container do slide, os elementos do slide e os controles do slide e o tempo para trocar de slide, se não for passado o tempo, o padrão será 5000ms.
  constructor(
    container: Element,
    slides: Element[],
    controls: Element,
    time: number = 5000,
  ) {
    // Está atribuindo os valores dos parâmetros para as propriedades da classe pai.
    this.container = container;
    this.slides = slides;
    this.controls = controls;
    this.time = time;

    this.timeout = null; // Está atribuindo o valor null para a propriedade timeout como padrão.
    this.pausedTimeout = null; // Está atribuindo o valor null para a propriedade pausedTimeout como padrão.

    // Está fazendo que quando o usuário sair da página, o slide volte para aonde ele estava.
    this.index = 0;
    this.slide = this.slides[this.index]; // Está atribuindo o valor do slide que está no index para a propriedade slide.

    this.paused = false; // Está atribuindo o valor false para a propriedade paused como padrão.

    this.thumbItems = null; // Está atribuindo o valor null para a propriedade thumbItems como padrão.
    this.thumb = null; // Está atribuindo o valor null para a propriedade thumb como padrão.

    this.volume = null; // Está atribuindo o valor null para a propriedade volume como padrão.
    this.volumeImage = null; // Está atribuindo o valor null para a propriedade volumeImage como padrão.

    this.init(); // Está chamando o método init responsável por iniciar o slide e seus controles.
  }

  // Criado um método chamado hide que recebe um elemento do tipo Element, é responsável por fazer o slide desaparecer.
  hide(element: Element) {
    element.classList.remove("active"); // Está removendo a classe active do elemento passado como parâmetro.

    // Se o elemento for um elemento do tipo HTMLVideoElement executa o if que é uma type guard.
    if (element instanceof HTMLVideoElement) {
      element.currentTime = 0; // Está atribuindo o valor 0 para a propriedade currentTime do elemento video, fazendo o vídeo voltar para o início.
      element.pause(); // Está pausando o vídeo.
    }
  }

  // Criado um método chamado show que recebe um index do tipo number, é responsável por fazer o slide aparecer.
  show(index: number) {
    this.index = index; // Está atribuindo o valor do index passado como parâmetro para a propriedade index da classe pai.
    this.slide = this.slides[this.index]; // Está atribuindo  o valor do slide que está no index passado como parâmetro para a propriedade slide da classe pai.

    if (this.thumbItems) {
      this.thumb = this.thumbItems[this.index]; // Está atribuindo o valor do elemento que está no index(equivalente ao slide atual) para a propriedade thumb.
      this.thumbItems.forEach((thumb) => thumb.classList.remove("active")); // O forEach está percorrendo o array de thumbItems e para cada thumb está removendo a classe active.
      this.thumb.classList.add("active"); // Está adicionando a classe active para o elemento que está no index(equivalente ao slide atual).
    }

    this.slides.forEach((slide) => this.hide(slide)); // O forEach está percorrendo o array de slides e para cada slide está chamando o método hide passando o slide como parâmetro.
    this.slide.classList.add("active"); // Está adicionando a classe active para o slide que está na propriedade slide da classe pai.

    // Se o slide for um elemento do tipo HTMLVideoElement executa o if que é uma type guard, se não for executa o else.
    if (this.slide instanceof HTMLVideoElement) {
      this.autoVideo(this.slide); // Está chamando/executando o método autoVideo passando o slide como parâmetro.

      if (this.volumeImage) {
        this.volumeImage.src = "./src/assets/volume-off.svg";
      }
    } else {
      this.auto(this.time); // Está chamando/executando o método auto passando o tempo de troca de slide como parâmetro.

      if (this.volume) {
        this.volume.id = "slide-volume-muted"; // Está adicionando a classe volume para o elemento controls.
      }
    }
  }

  // Criado um método chamado autoVideo que recebe um vídeo do tipo HTMLVideoElement, é responsável por fazer o slide de vídeo ir para o próximo slide quando o vídeo acabar.
  autoVideo(video: HTMLVideoElement) {
    video.muted = true; // Está atribuindo o valor true para a propriedade muted do elemento video, fazendo o vídeo ficar mudo quando começar a ser executado.

    // Se o elemento volume existir executa o if.
    if (this.volume) {
      this.volume.id = "slide-volume"; // Está adicionando a classe volume para o elemento controls.
    }

    video.play(); // Está executando o método play do elemento video, fazendo o vídeo começar a ser executado.

    let firstPlay = true; // Está atribuindo o valor true para a variável firstPlay como padrão.

    // Adiciona um evento do tipo playing(é disparado quando o vídeo começa a ser executado) para o elemento video e quando acionado executa a função anônima.
    video.addEventListener("playing", () => {
      // Para ocorrer somente uma vez, o if verifica se a variável firstPlay é true, se for executa o if.
      if (firstPlay) {
        this.auto(video.duration * 1000); // Está chamando/executando o método auto responsável por fazer o slide trocar automaticamente após um tempo, passando o tempo de duração do vídeo como parâmetro para ele só trocar de slide quando o vídeo acabar.

        firstPlay = false; // Está atribuindo o valor false para a variável firstPlay.
      }
    });
  }

  // Adiciona um método privado chamado volumeVideo, responsável por mutar e desmutar o vídeo.
  volumeVideo() {
    if (this.slide instanceof HTMLVideoElement) {
      if (this.slide.muted) {
        this.slide.muted = false; // Está atribuindo o valor false para a propriedade muted do elemento video, fazendo o vídeo ficar com som.

        // Se o elemento volumeImage existir executa o if.
        if (this.volumeImage) {
          this.volumeImage.src = "./src/assets/volume-on.svg"; // Está atribuindo o caminho da imagem para a propriedade src do elemento volumeImage.
        }
      } else {
        this.slide.muted = true; // Está atribuindo o valor true para a propriedade muted do elemento video, fazendo o vídeo ficar mudo.

        // Se o elemento volumeImage existir executa o if.
        if (this.volumeImage) {
          this.volumeImage.src = "./src/assets/volume-off.svg"; // Está atribuindo o caminho da imagem para a propriedade src do elemento volumeImage.
        }
      }
    }
  }

  // Criado um método chamado auto que recebe um time do tipo number, é responsável por fazer o slide trocar automaticamente após um tempo.
  auto(time: number) {
    this.timeout?.clear(); // Está limpando o setTimeout se ele existir.
    // Está instanciando a classe Timeout e atribuindo as propriedades handler(uma função, seja ela anônima ou não) e o tempo para executar o handler(a função).
    this.timeout = new Timeout(() => this.next(), time); // Executa o método next após o tempo passado como parâmetro.

    // Se o elemento thumb existir executa o if.
    if (this.thumb) {
      this.thumb.style.animationDuration = `${time}ms`; // Está atribuindo o valor do tempo passado em milissegundos de cada slide para a propriedade animationDuration do elemento thumb.
    }
  }

  // Criado um método chamado prev, é responsável por fazer o slide voltar para o anterior.
  prev() {
    if (this.paused) return; // Se a propriedade paused for true, o método é interrompido, não executando o código abaixo.

    const prev = this.index > 0 ? this.index - 1 : this.slides.length - 1; // Está atribuindo o valor do index - 1 para a constante prev se o index for maior que 0, se não for maior, atribui o valor do tamanho do array de slides - 1, fazendo o slide voltar para o último.

    this.show(prev); // Está chamando/executando o método show passando o resultado da constante prev como parâmetro fazendo o slide voltar para o anterior.
  }

  // Criado um método chamado next, é responsável por fazer o slide avançar.
  next() {
    if (this.paused) return; // Se a propriedade paused for true, o método é interrompido, não executando o código abaixo.

    const next = this.index + 1 < this.slides.length ? this.index + 1 : 0; // Está atribuindo o valor do index + 1 para a constante next se o index + 1 for menor que o tamanho do array de slides, se não for menor, atribui o valor 0, fazendo o slide voltar para o primeiro.

    this.show(next); // Está chamando/executando o método show passando o index + 1 como parâmetro fazendo o slide avançar.
  }

  // Criado um método chamado pause, é responsável por pausar o slide.
  pause() {
    // Está instanciando a classe Timeout e atribuindo as propriedades handler(a função anônima) e o tempo para executar o handler(a função), no caso 300ms e atribuindo para a propriedade pausedTimeout.
    this.pausedTimeout = new Timeout(() => {
      this.timeout?.pause(); // Está pausando o setTimeout se ele existir.
      this.paused = true; // Está atribuindo o valor true para a propriedade paused da classe pai fazendo o slide pausar.
      this.thumb?.classList.add("paused"); // Está adicionando a classe paused para o elemento thumb se ele existir.

      // Se o slide for um elemento do tipo HTMLVideoElement executa o if que é uma type guard.
      if (this.slide instanceof HTMLVideoElement) {
        this.slide.pause(); // Está pausando o vídeo.
      }
    }, 100);
  }

  // Criado um método chamado continue, é responsável por continuar o slide.
  continue() {
    document.body.classList.remove("paused"); // Está removendo a classe paused para o elemento body.

    this.pausedTimeout?.clear(); // Está limpando o setTimeout do método pause se ele existir.

    // Se a propriedade paused for false, o método é interrompido, não executando o código abaixo.
    if (this.paused) {
      this.paused = false; // Está atribuindo o valor false para a propriedade paused da classe pai fazendo o slide continuar.
      this.timeout?.continue(); // Está continuando o setTimeout se ele existir.
      this.thumb?.classList.remove("paused"); // Está adicionando a classe paused para o elemento thumb se ele existir.

      // Se o slide for um elemento do tipo HTMLVideoElement executa o if que é uma type guard.
      if (this.slide instanceof HTMLVideoElement) {
        this.slide.play(); // Está executando o método play do elemento video, fazendo o vídeo continuar.
      }
    }
  }

  // Criado um método privado(ou seja, só pode ser chamado/executado dentro da classe) chamado addControlsSlide, é responsável por adicionar os controles do slide.
  private addControlsSlide() {
    const prevButton = document.createElement("button"); // Está criando um elemento button e atribuindo para a constante prevButton.
    prevButton.innerText = "Slide anterior"; // Está atribuindo um texto para o elemento prevButton.
    this.controls.appendChild(prevButton); // Está adicionando o elemento prevButton como filho do elemento controls.

    const nextButton = document.createElement("button"); // Está criando um elemento button e atribuindo para a constante nextButton.
    nextButton.innerText = "Próximo slide"; // Está atribuindo um texto para o elemento nextButton.
    this.controls.appendChild(nextButton); // Está adicionando o elemento nextButton como filho do elemento controls.

    this.volume = document.createElement("button"); // Está criando um elemento button e atribuindo para a constante volumeButton.
    this.controls.appendChild(this.volume); // Está adicionando o elemento volumeButton como filho do elemento controls.
    this.volume.addEventListener("click", () => this.volumeVideo()); // Adiciona um evento de clique para o elemento volumeButton e quando acionado executa a função volumeVideo.

    this.volumeImage = document.createElement("img"); // Está criando um elemento img e atribuindo para a constante image.
    this.volume.appendChild(this.volumeImage); // Está adicionando o elemento image como filho do elemento volumeButton se ele existir.
    this.volumeImage.src = "./src/assets/volume-off.svg"; // Está atribuindo o caminho da imagem para a propriedade src do elemento image se ele existir.

    this.controls.addEventListener("pointerdown", () => this.pause()); // Está criando um evento do tipo pointerdown(é disparado quando o mouse ou o dedo é pressionado no elemento) para o elemento controls e quando acionado executa a função pause.
    document.addEventListener("pointerup", () => this.continue()); // Está criando um evento do tipo pointerup(é disparado quando o mouse ou o dedo é removido do elemento) para o documento(body) e quando acionado executa a função continue.
    document.addEventListener("touchend", () => this.continue()); // Está criando um evento do tipo touchend(é disparado quando o dedo é removido do elemento) para o documento(body) e quando acionado executa a função continue.

    // Está criando um evento do tipo pointerup(é disparado quando o mouse ou o dedo é removido do elemento) para os elementos e quando acionados executam uma função.
    prevButton.addEventListener("pointerup", () => this.prev());
    nextButton.addEventListener("pointerup", () => this.next());
  }

  // Criado um método privado(ou seja, só pode ser chamado/executado dentro da classe) chamado addFile, é responsável por adicionar um novo arquivo ao slide.
  private addFile() {
    const inputFile = document.getElementById("file-input") as HTMLInputElement; // Está atribuindo o elemento que tem o id file para a constante inputFile.
    const buttonFile = document.getElementById(
      "file-button",
    ) as HTMLButtonElement; // Está atribuindo o elemento que tem o id file para a constante buttonFile.
    const slideContainer = document.getElementById(
      "slide-elements",
    ) as HTMLDivElement; // Está atribuindo todos os elementos que tem a classe slide para a constante slideElements.

    const fileInfo = document.getElementById("file-info") as HTMLDivElement; // Está atribuindo o elemento que tem o id file-info para a constante fileInfo.

    // Criado uma função chamada createAndAppendElement que recebe um elemento do tipo HTMLElement, é responsável por adicionar o elemento passado como parâmetro para o slide.
    const createAndAppendElement = (element: HTMLElement) => {
      slideContainer.appendChild(element);
      this.slides.push(element);
      this.addThumbItemsNew();
    };

    // Criado uma função chamada buttonClick, é responsável por adicionar o novo elemento ao slide.
    const buttonClick = () => {
      // Se o elemento inputFile possuir files, executa o if abaixo.
      if (inputFile.files?.length) {
        const file = inputFile.files[0]; // Está atribuindo o primeiro arquivo do elemento inputFile para a constante file.

        // Se o tipo do arquivo incluir a palavra video executa o if abaixo.
        if (file.type.includes("video")) {
          const video = document.createElement("video"); // Está criando um elemento video e atribuindo para a constante video.
          video.playsInline = true; // Está atribuindo o valor true para a propriedade playsInline do elemento video, que é responsável por fazer o vídeo ser executado no iOS.
          video.src = URL.createObjectURL(file); // Está atribuindo o caminho do file do input para a propriedade src do elemento video.

          createAndAppendElement(video); // Está chamando/executando a função createAndAppendElement responsável por adicionar o elemento video para o slide e passando o elemento video como parâmetro.
        }
        // Se não, se o tipo do arquivo incluir a palavra image executa o else if abaixo.
        else if (file.type.includes("image")) {
          const image = document.createElement("img"); // Está criando um elemento img e atribuindo para a constante image.
          image.src = URL.createObjectURL(file); // Está atribuindo o caminho do file do input para a propriedade src do elemento image.

          createAndAppendElement(image); // Está chamando/executando a função createAndAppendElement responsável por adicionar o elemento image para o slide e passando o elemento image como parâmetro.
        }
        // Se não, se não for um arquivo de imagem ou vídeo executa o else.
        else {
          buttonFile.setAttribute("disabled", "disabled"); // Está adicionando o atributo disabled para o elemento buttonFile.
        }

        buttonFile.setAttribute("disabled", "disabled"); // Está adicionando o atributo disabled para o elemento buttonFile.
        fileInfo.style.display = "none"; // Está atribuindo o valor none para a propriedade display do elemento fileInfo.
      }
    };

    // Criado uma função chamada inputClick, é responsável por pausar o slide.
    const inputClick = () => {
      this.pause(); // Está chamando/executando o método pause responsável por pausar o slide.

      // Adiciona um evento de change(é disparado quando o valor do elemento é alterado) para o elemento inputFile e quando acionado executa a função anônima.
      inputFile.addEventListener("change", () => {
        this.continue(); // Está chamando/executando o método continue responsável por continuar o slide.

        // Se o elemento inputFile possuir files, executa o if abaixo.
        if (inputFile.files?.length) {
          const file = inputFile.files[0]; // Está atribuindo o primeiro arquivo do elemento inputFile para a constante file.
          fileInfo.style.display = "flex"; // Está atribuindo o valor flex para a propriedade display do elemento fileInfo.

          // Se o tipo do arquivo não incluir a palavra image ou vídeo executa o if abaixo.
          if (!file.type.includes("image") && !file.type.includes("video")) {
            // Está criando uma estrutura HTML e colocando dentro do elemento fileText.
            fileInfo.innerHTML = `
              <p id="file-text">❌ Formato inválido: <span id="file-name">Selecione um arquivo no formato de imagem ou vídeo.</span></p>
            `;

            buttonFile.setAttribute("disabled", "disabled"); // Está adicionando o atributo disabled para o elemento buttonFile.
          } else {
            buttonFile.removeAttribute("disabled"); // Está removendo o atributo disabled do elemento buttonFile.
            // Está atribuindo o valor do nome do arquivo para a propriedade innerHTML do elemento fileName.
            fileInfo.innerHTML = `
              <p id="file-text">✔️ Arquivo selecionado: <span id="file-name">${inputFile.files[0].name}</span></p>
            `;
          }
        }
      });
    };

    // Adiciona um evento de clique para o elemento buttonFile e quando acionado executa a função handleClick.
    buttonFile.addEventListener("click", () => buttonClick());
    inputFile.addEventListener("click", () => inputClick());
  }

  // Criado um método privado(ou seja, só pode ser chamado/executado dentro da classe) chamado addControlsFile, é responsável por adicionar os controles do input file.
  private addControlsFile() {
    const fileMedia = document.getElementById("file-media") as HTMLDivElement; // Está atribuindo o elemento que tem o id file-media para a constante fileMedia atribuido o tipo HTMLDivElement.

    const labelFile = document.createElement("label"); // Está criando um elemento label e atribuindo para a constante labelFile.
    labelFile.setAttribute("for", "file-input"); // Está adicionando o atributo for com o valor file-input para o elemento labelFile.
    labelFile.id = "file-label"; // Está atribuindo o valor file-button para a propriedade id do elemento labelFile.
    labelFile.innerText = "Escolher arquivo"; // Está atribuindo um texto para o elemento labelFile.

    const inputFile = document.createElement("input"); // Está criando um elemento input e atribuindo para a constante inputFile.
    inputFile.type = "file"; // Está atribuindo o valor file para a propriedade type do elemento inputFile.
    inputFile.id = "file-input"; // Está atribuindo o valor file-input para a propriedade id do elemento inputFile.
    inputFile.accept = "image/*, video/*"; // Está atribuindo o valor image/*, video/* para a propriedade accept do elemento inputFile.

    const buttonFile = document.createElement("button"); // Está criando um elemento button e atribuindo para a constante buttonFile.
    buttonFile.id = "file-button"; // Está atribuindo o valor file-button para a propriedade id do elemento buttonFile.
    buttonFile.setAttribute("disabled", "disabled"); // Está adicionando o atributo disabled para o elemento buttonFile.
    buttonFile.innerText = "Enviar"; // Está atribuindo um texto para o elemento buttonFile.

    fileMedia.appendChild(labelFile); // Está adicionando o elemento labelFile como filho do elemento fileMedia.
    fileMedia.appendChild(inputFile); // Está adicionando o elemento inputFile como filho do elemento fileMedia.
    fileMedia.appendChild(buttonFile); // Está adicionando o elemento buttonFile como filho do elemento fileMedia.
  }

  // Método privado(ou seja, só pode ser chamado/executado dentro da classe) chamado addThumbItems, é responsável por adicionar os thumbs do slide.
  private addThumbItems() {
    const thumbContainer = document.createElement("div"); // Está criando um elemento div e atribuindo para a constante thumbContainer.
    thumbContainer.id = "slide-thumb"; // Está atribuindo o valor slide-thumb para a propriedade id do elemento thumbContainer.

    // Cria um loop for que vai de 0 até o tamanho do array de slides, começando do 0 e incrementando de 1 em 1.
    for (let i = 0; i < this.slides.length; i++) {
      // Está adicionando a estrutura HTML do elemento thumbContainer.
      thumbContainer.innerHTML += `
        <span>
          <span class="thumb-item"></span>
        </span>
      `;
    }

    this.controls.appendChild(thumbContainer); // Está adicionando o elemento thumbContainer como filho do elemento controls.
    this.thumbItems = Array.from(document.querySelectorAll(".thumb-item")); // Está atribuindo o valor de um array com todos os elementos que tem a classe thumb-item para a propriedade thumbItems.
  }

  // Criado um método privado(ou seja, só pode ser chamado/executado dentro da classe) chamado addThumbItemsNew, é responsável por adicionar o novo thumb do slide.
  private addThumbItemsNew() {
    const thumContainer = document.getElementById("slide-thumb"); // Está atribuindo o elemento que tem o id slide-thumb para a constante thumContainer.

    // Se o elemento thumContainer não existir, o método é interrompido, não executando o código abaixo.
    if (!thumContainer) {
      return; // Está retornando o método, interrompendo a execução.
    }

    // Cria uma estrutura HTML sem afetar o que já existe no elemento thumContainer, o insertAdjacentHTML recebe dois parâmetros, o primeiro é a posição que o HTML será inserido(beeforend é antes do fechamento da tag) e o segundo é o HTML que será inserido.
    thumContainer.insertAdjacentHTML(
      "beforeend",
      `
        <span>
          <span class="thumb-item"></span>
        </span>
      `,
    );

    this.thumbItems = Array.from(document.querySelectorAll(".thumb-item")); // Está atribuindo o valor de um array com todos os elementos que tem a classe thumb-item para a propriedade thumbItems.
  }

  // Criado um método privado(ou seja, só pode ser chamado/executado dentro da classe) chamado init, é responsável por iniciar os métodos do slide e seus controles.
  private init() {
    this.addControlsSlide(); // Está chamando/executando o método addControlsSlide.
    this.addControlsFile(); // Está chamando/executando o método addControlsFile.
    this.addThumbItems(); // Está chamando/executando o método addThumbItems.
    this.show(this.index); // Está chamando/executando o método show passando o index como parâmetro.
    this.addFile();
  }
}

export default Slide; // Está exportando a classe Slide para ser usada em outro arquivo.
