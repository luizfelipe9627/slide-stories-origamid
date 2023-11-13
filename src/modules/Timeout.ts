class Timeout {
  // Para funcionar no this do construtor, a propriedade precisa ser criada fora do construtor, com o exato nome que será passado no construtor.
  id;
  handler;
  start;
  timeLeft;

  // O construtor deve receber o handler(uma função, seja ela anônima ou não) e o tempo para executar o handler(a função).
  constructor(handler: TimerHandler, time: number) {
    this.id = setTimeout(handler, time); // Armazena o valor do setTimeout em uma propriedade id, excutando o setTimeout passando o handler e o tempo como parâmetro.
    this.handler = handler;
    this.start = Date.now(); // Armazena o valor da data atual em uma propriedade start.
    this.timeLeft = time; // Armazena o valor do tempo passado como parâmetro em uma propriedade timeLeft.
  }

  // O método clear é responsável por limpar o setTimeout.
  clear() {
    clearTimeout(this.id); // Está limpando o setTimeout passando o id como parâmetro.
  }

  // O método pause é responsável por pausar o setTimeout.
  pause() {
    const timePassed = Date.now() - this.start; // Está armazenando o valor da data atual menos o valor da propriedade start em uma constante.
    this.timeLeft = this.timeLeft - timePassed; // Está armazenando o valor da propriedade timeLeft menos o valor da constante timePassed em uma propriedade timeLeft.
    this.clear(); // Está chamando o método clear responsável por limpar o setTimeout.
  }

  // O método continue é responsável por continuar o setTimeout.
  continue() {
    this.clear(); // Está chamando o método clear responsável por limpar o setTimeout.
    this.id = setTimeout(this.handler, this.timeLeft); // Armazena o valor do setTimeout em uma propriedade id, excutando o setTimeout passando o handler e o timeLeft(propriedade que armazena o tempo que falta para executar o setTimeout) como parâmetro.
    this.start = Date.now(); // Armazena o valor da data atual em uma propriedade start.
  }
}

export default Timeout;
