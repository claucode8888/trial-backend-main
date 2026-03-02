class LoadMore {
  constructor() {
    this.DOM = {
      taxonomySelect: document.querySelector('.js--taxonomy-select'),
      container: document.querySelector('.js--cards-container'),
      button: document.querySelector('.js--load-more'),
    };

    this.init();
    this.events();
  }

  async init(){
    await this.loadMainContent();
    await this.loadTaxonomies();
  }

  events() {
    this.DOM.button.addEventListener('click', () => this.loadItems(true));
    
    this.DOM.taxonomySelect?.addEventListener('change', () => {
    });
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
    try {
      const response = await fetch('https://www.sei.com/wp-json/wp/v2/insight');
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

  setHTMLContent(content, add){
    if(add){
      this.DOM.container.innerHTML += content;
      return;
    }
    this.DOM.container.innerHTML = content;
  }
}

export default LoadMore;