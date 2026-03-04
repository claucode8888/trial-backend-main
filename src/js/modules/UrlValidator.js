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
      this.invalidUrlFeedback();
      return;
    }

    // Making the resquest
    const response = await this.makeRequest(url);

    // Displaying results
    this.displayReponseResults(response);
  }

  displayReponseResults(response){
    if(!this.DOM.result) return;
    this.DOM.result.innerHTML = JSON.stringify(response);
  }

  async makeRequest(url){
    const options =
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( { url } ),
    };

    try {
      // Double click prevention up
      if(this.isLoading) return;
      this.preventDoubleClick(true);

      const response = await fetch('/api/check-url', options);
      const jsonResponse = await response.json();
      return jsonResponse;

    } catch (error) {
      console.log(error);
    }finally{
      // Double click prevention down
      this.preventDoubleClick(false);
    }
  }

  getEnteredInput(){
    const input = this.DOM.input;
    if(!input) return;
    const trimmedValue = input.value.trim();
    return trimmedValue;
  }

  // Helpers 

  preventDoubleClick(boolValue){
    this.setIsLoading(boolValue);
    this.disableButton(boolValue);
  }

  setIsLoading(boolValue){
    this.isLoading = boolValue;
  }
  
  disableButton(disabledValue){
    const submit = this.DOM.submit;
    if(!submit) return;
    submit.disabled = disabledValue;
    submit.style.cursor = disabledValue ? 'not-allowed' : 'pointer';
    submit.textContent = disabledValue ? 'Checking...' : 'Check URL';
  }

  isValidUrl(str){
    try {
      const url = new URL(str);
      return true;
    }catch{
      return false;
    }
  }

  invalidUrlFeedback(){
    setTimeout( () => alert('Url no valid.'), 1000 );
  }

}

export default UrlValidator;