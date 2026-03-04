class UrlValidator {
  constructor() {
    this.DOM = {
      input: document.querySelector('.js--url-input'),
      submit: document.querySelector('.js--url-submit'),
      result: document.querySelector('.js--url-result'),
    };
    this.isLoading = false;
    
    this.init();
    this.events();
  }

  init() {
  }

  events() {
    this.DOM.submit.addEventListener('click', (e) => {
      e.preventDefault();
      this.validateUrl();
    });

    this.DOM.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.validateUrl();
      }
    });
    
  }

  validateUrl(){
    const enteredData = this.getEnteredInput();
    if(this.isValidUrl(enteredData)){
    }
  }

  getEnteredInput(){
    const input = this.DOM.input;
    if(!input) return;
    const trimmedValue = input.value.trim();
    return trimmedValue;
  }

  isValidUrl(str){
    try {
      const url = new URL(str);
      return true;
    }catch{
      return false;
    }
  }
}

export default UrlValidator;