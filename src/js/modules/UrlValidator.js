class UrlValidator {
  constructor() {
    this.DOM = {
      input: document.querySelector('.js--url-input'),
      submit: document.querySelector('.js--url-submit'),
      resultsContainer: document.querySelector('.js--url-result'),
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
    if(url === '') return;

    if(!this.isValidUrl(url)){
      this.invalidUrlFeedback();
      return;
    }

    try {
      // Double click prevention up
      if(this.isLoading) return;
      this.preventDoubleClick(true);

      const checkedResults = await this.checkUrl(url);

      // Renderize
      this.renderResults(checkedResults);

    } catch (error) {
      this.handleError(error);
    }finally{
      this.preventDoubleClick(false);
    }
  }

  async checkUrl(url){
    const options =
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( { url } ),
    };

    const response = await this.request('/api/check-url', options);
    const jsonResponse = await response.json();
    return jsonResponse;
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
      new URL(str);
      return true;
    }catch{
      return false;
    }
  }

  invalidUrlFeedback(){
    setTimeout( () => alert('Url no valid.'), 1000 );
  }


  // HTTP and UI error methods

  handleError(error, userMessage = 'Something went wrong') {
    console.error(error);
    let message = error?.message || userMessage;

    if(error?.status){
      message += ` (${error?.status})`;
    }

    const existing = document.querySelector('.error-message');
    if (existing) existing.remove();

    const div = document.createElement('div');
    div.className = 'error-message';
    div.textContent = message;
    div.classList = 'f--col-12';
    div.style.cssText = `
      background: #fee2e2;
      border: 1px solid #ef4444;
      color: #dc2626;
      padding: 12px;
      border-radius: 6px;
      font-size: 14px;
      text-align: center;
    `;
    this.DOM.resultsContainer.prepend(div);
    setTimeout(() => div.remove(), 6000);
  }

  buildHttpError(response) {
    const status = response.status;
    let message = 'Unexpected error occurred';

    if (status >= 400 && status < 500) {
      message = 'Invalid request. Please refresh the page.';
    }

    if (status >= 500) {
      message = 'Server error. Please try again later.';
    }

    const error = new Error(message);
    error.status = status;
    return error;
  }

  async request(url, options = {}, timeout = 8000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) throw this.buildHttpError(response);
      return response;

    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        const timeoutError = new Error('Request timeout. Please try again.');
        timeoutError.status = 408;
        throw timeoutError;
      }
      throw error;
    }
  }
  
  getColor(status){
    if (status === 200) return 'green';
    if (status === 301) return 'blue';
    if (status === 302) return 'orange';
    if (status >= 400) return 'red';
    return 'gray';
  };

  renderResults(datas){
    if(!datas) return;

    const data = datas.result
    // Main description
    let html = `<p>
      <strong>URL: ${data.inputUrl} </strong>
      (
        <span style="color: orange; font-size: 14px;">Redirections: ${data.redirectCount}</span> 
        <span style="color: orange; font-size: 14px;">MaxReached: ${data.maxHopsReached ? 'yes' : 'no'}</span>
        <span style="color: orange; font-size: 14px;">Loop: ${data.redirectLoopDetected ? 'yes' : 'no'}</span>
      )
      </p>`;

    html += '</br>'

    // Hops
    html += `<ul>`;
    data.chain.forEach(hop => {
      html += `<li style="color:${this.getColor(hop.status)};">`;
      html += `#${hop.hop} ${hop.url} | Status code: <${hop.status}> | ${hop.statusText} `;

      if(hop.redirectTo){
        html += `<li style="color:${this.getColor(hop.status)};"> => ${hop.redirectTo}<li>`;
      }

      // Headers
      if(hop.headers){
        html += `<ul style="color:${this.getColor(hop.status)};">`;
          html += '</br>'
          html += `<p>Headers</p>`;
          html += '</br>'
          Object.entries(hop.headers).forEach(head => {
            html += `<li>${head}<li>`;
          });
        html += `<ul>`;
      }
      html += `</li>`;
      html += '</br>'
    });
    html += `</ul>`;

    // Final description
    html += `
    <p><strong>Final:</strong> ${data.final?.url || '-'}
      <span style="color:${this.getColor(data.final?.status)};">
        (${data.final?.status})
      </span>
    </p>`;
    html += '</br>'

    this.DOM.resultsContainer.innerHTML = html;
  }

}

export default UrlValidator;