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

  async validateUrl(){
    const url = this.getEnteredInput();
    if(!this.isValidUrl(url)){
      alert('Invalid url');
      return;
    }

    // Making the resquest
    const response = await makeRequest(url);

    // Displaying results
  }

  async makeRequest(url){
    const options =
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( { url } ),
    };

    try {
      const response = await fetch('/api/check-url', options);
      const jsonResponse = await response.json();
      console.log(jsonResponse);
    } catch (error) {
      console.log(error, error?.message);
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