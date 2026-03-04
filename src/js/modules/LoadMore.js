class LoadMore {
  constructor() {
    this.DOM = {
      taxonomySelect: document.querySelector('.js--taxonomy-select'),
      container: document.querySelector('.js--cards-container'),
      button: document.querySelector('.js--load-more'),
    };
    this.baseUrl = 'https://www.sei.com/wp-json/wp/v2/insight';
    this.filterId = this.getTaxonomyFromUrl();
    this.currentPage = 1;
    this.totalPages = 1;
    this.isLoading = false;

    this.init();
    this.events();
  }

  async init(){
    await this.loadMainContent();
    await this.loadTaxonomies();
  }

  events() {
    // On Click
    this.DOM.button.addEventListener('click', (e) => {
      e.preventDefault();
      this.loadItems(true);
    });

    // On Change
    this.DOM.taxonomySelect.addEventListener('change', (e) => {
      this.filterId = e.target.value;
      this.updateURLParam(this.filterId);
      this.loadItems();
    })
  }

  async loadTaxonomies() {
    const taxonomies = await this.fetchTaxonomies();
    if(!taxonomies) return;

    taxonomies.forEach(taxonomy => {
      const opt = document.createElement('option');
      opt.value = taxonomy.id;
      opt.textContent = taxonomy.name + ' (' + taxonomy.id + ')';
      opt.selected = (this.filterId == taxonomy.id)
      this.DOM.taxonomySelect.appendChild(opt);
    });
  }

  async loadMainContent(){
    return await this.loadItems();
  }

  async loadItems(loadMore = false){
    try {
      // Preventing double click
      if(this.isLoading) return;
      this.setIsLoading(true);

      // Updating paginator before fetching
      this.updateCurrentPageCounter(loadMore);

      // Fetching items
      const items = await this.fetchItems();
      if (!items){
        // Revert paginator
        this.updateCurrentPageCounter(false, true);
        return;
      };

      // Getting content to render
      const content = await this.getContentToRender(items);

      // Setting content
      this.setHTMLContent(content, loadMore);

      // Show/Hide button
      this.toggleButton();

    }catch(error){
      this.updateCurrentPageCounter(false, true);
      this.handleError(error);
    }finally{
      this.setIsLoading(false);
    }
  }

  async getContentToRender(items){
    let options = 
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        { data: items,
          currentPage: this.currentPage,
        }
      ),
    };
    const response = await this.request('/api/v1/render-content', options);
    const contentData = await response.json();
    return contentData.contentData;
  }

  async fetchItems(){
    const url = this.resolverItemsURL();
    const response = await this.request(url);

    // Saving pagination info
    this.updatePaginationInfo(response);

    // Temporally debugging 
    console.log(`Current page: ${this.currentPage} | Total pages: ${this.totalPages}`);
    console.log(url);

    const items = await response.json();
    return items;
  }

  async fetchTaxonomies(){
    const response = await this.request('https://www.sei.com/wp-json/wp/v2/insight-types');
    const taxonomies = await response.json();
    return taxonomies;
  }

  resolverItemsURL(){
    let url = `${this.baseUrl}?page=${this.currentPage}`;
    if(this.filterId){
      url += `&insight-types=${this.filterId}`;
    }
    return url;
  }

  setHTMLContent(content, add = false){
    if(add){
      this.DOM.container.innerHTML += content;
      return;
    }
    this.DOM.container.innerHTML = content;
    console.log(`Total elements in container: ${this.DOM.container.children.length}`);
  }

  getTaxonomyFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('taxonomy') || '';
  }

  updateURLParam(taxonomyId){
    const url = new URL(window.location);
    if(taxonomyId){
      url.searchParams.set('taxonomy', taxonomyId);
    }else{
      url.searchParams.delete('taxonomy');
    }

    window.history.replaceState({}, '', url);
  }

  updatePaginationInfo(response){
    if(!response?.headers) return;
    this.totalPages = parseInt(response.headers.get('X-WP-TotalPages'));
  }

  updateCurrentPageCounter(loadMore, revert = false){
    this.currentPage = loadMore ? (this.currentPage + 1) : 1;

    if(revert && this.currentPage > 1){
      this.currentPage = this.currentPage - 1;
    }
  }

  toggleButton(){
    if(!this.DOM.button) return;
    const shouldBeHidden = this.currentPage >= this.totalPages;
    this.DOM.button.style.display = shouldBeHidden ? 'none' : 'inline';
    this.DOM.button.disabled = shouldBeHidden;
  }

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
    this.DOM.container.prepend(div);
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

  setIsLoading(boolValue){
    this.isLoading = boolValue;
  }
}

export default LoadMore ;