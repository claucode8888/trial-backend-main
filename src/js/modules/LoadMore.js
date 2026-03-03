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
      this.isLoading = true;

      // Updating paginator before fetching
      this.updateCurrentPageCounter(loadMore);

      // Fetching items
      const items = await this.fetchItems();
      if (!items) return;

      // Getting content to render
      const content = await this.getContentToRender(items, loadMore);
      if (!content) return;

      // Setting content
      this.setHTMLContent(content, loadMore);
      console.log(' Total children: ', this.DOM.container.children.length);

      // Show/Hide button
      this.toggleButton();

    }catch(error){
      this.handleError(error);
    }finally{
      this.isLoading = false;
    }
  }

  async getContentToRender(items, loadMore){
    try {
      const response = await fetch('/api/v1/render-content',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            { data: items,
              loadMore: loadMore,
            }
          ),
        }
      );

      if (!response.ok) throw new Error(`Render content API failed ${response.status}`);
      const contentData = await response.json();
      return contentData.contentData;

    } catch (error) {
      this.handleError(error);
    }
  }

  async fetchItems(){
    const url = this.resolverItemsURL();
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Items fetch error HTTP ${response.status}`);

      // Saving pagination info
      this.updatePaginationInfo(response);

      const items = await response.json();
      return items;

    } catch (error){
      this.handleError(error);
    }
  }

  async fetchTaxonomies(){
    try {
      const response = await fetch('https://www.sei.com/wp-json/wp/v2/insight-types');
      if (!response.ok) throw new Error(`Taxonomies fetch error. HTTP ${response.status}`);
      const taxonomies = await response.json();
      return taxonomies;
    } catch (error) {
      this.handleError(error);
    }
  }

  resolverItemsURL(){
    let url = `${this.baseUrl}?page=${this.currentPage}`;
    if(this.filterId){
      url += `&insight-types=${this.filterId}`;
    }
    console.log(url);
    return url;
  }

  setHTMLContent(content, add = false){
    if(add){
      this.DOM.container.innerHTML += content;
      return;
    }
    this.DOM.container.innerHTML = content;
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

  updateCurrentPageCounter(loadMore){
    this.currentPage = loadMore ? (this.currentPage + 1) : 1;
    console.log(`Current page: ${this.currentPage} | Total pages: ${this.totalPages}`);
  }

  toggleButton(){
    if(!this.DOM.button) return;
    const shouldBeHidden = this.currentPage >= this.totalPages;
    this.DOM.button.style.display = shouldBeHidden ? 'none' : 'block';
    this.DOM.button.disabled = shouldBeHidden;
  }

  handleError(error, userMessage = 'Something went wrong') {
    console.error(error);
    const message = error?.message || userMessage;

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
    setTimeout(() => div.remove(), 5000);
  }
}

export default LoadMore ;