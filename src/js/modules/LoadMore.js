class LoadMore {
  constructor() {
    this.DOM = {
      taxonomySelect: document.querySelector('.js--taxonomy-select'),
      container: document.querySelector('.js--cards-container'),
      button: document.querySelector('.js--load-more'),
    };
    this.baseUrl = 'https://www.sei.com/wp-json/wp/v2/insight';
    this.filterId = '';

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
    }
    );

    // On Change
    this.DOM.taxonomySelect.addEventListener('change', (e) => {
      const selectedTaxonomy = e.target.selectedOptions[0];
      this.filterId = selectedTaxonomy.value;
      this.loadItems();
    })
  }

  resolverItemsURL(){
    let url = this.baseUrl;
    if(this.filterId){
      url += `?insight-types=${this.filterId}`;
    }
    return url;
  }

  async loadTaxonomies() {
    const taxonomies = await this.fetchTaxonomies();
    if(!taxonomies) return;

    taxonomies.forEach(taxonomy => {
      const opt = document.createElement('option');
      opt.value = taxonomy.id;
      opt.textContent = taxonomy.name;
      this.DOM.taxonomySelect.appendChild(opt);
    });
  }

  async loadMainContent(){
    return await this.loadItems();
  }

  async loadItems(loadMore = false){
    // Fetching items
    const items = await this.fetchItems();
    if (!items) return;

    // Getting content to render
    const content = await this.getContentToRender(items, loadMore);
    if(content){
      this.setHTMLContent(content, loadMore);
      console.log(' Total children: ', this.DOM.container.children.length);
    }
  }

  async getContentToRender(items, loadMore){
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

    if (!response.ok) throw new Error('Failed render content API!');
    const contentData = await response.json();
    return contentData.contentData;
  }

  async fetchItems(){
    const url = this.resolverItemsURL();
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const items = await response.json();
      return items;

    } catch (error) {
      console.error('LoadMore error:', error);
    }
  }

  async fetchTaxonomies(){
    try {
      const response = await fetch('https://www.sei.com/wp-json/wp/v2/insight-types');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const taxonomies = await response.json();
      return taxonomies;
    } catch (error) {
      console.error('Taxonomy fetch error:', error);
    }
  }

  setHTMLContent(content, add = false){
    if(add){
      this.DOM.container.innerHTML += content;
      return;
    }
    this.DOM.container.innerHTML = content;
  }
}

export default LoadMore;