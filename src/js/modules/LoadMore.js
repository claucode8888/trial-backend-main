class LoadMore {
  constructor() {
    this.DOM = {
      button: document.querySelector('.js--load-more'),
      container: document.querySelector('.js--cards-container'),
      taxonomySelect: document.querySelector('.js--taxonomy-select'),
    };

    this.init();
    this.events();
  }

  async init(){
    await this.loadItems();
    await this.loadTaxonomies();
  }

  events() {
    this.DOM.button.addEventListener('click', () => this.loadItems(false));
    
    this.DOM.taxonomySelect?.addEventListener('change', () => {
      this.DOM.container.innerHTML = '';
      this.loadItems();
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

  async loadItems(ctab = true){
    // Fetching items
    const items = await this.fetchItems();
    if (!items) return;

    // Getting content to render
    const contentByRow = await this.getContentToRender(items, ctab);
    if(contentByRow){
      // this.DOM.container.innerHTML = '';
      Object.values(contentByRow).forEach((row) => {
        this.DOM.container.innerHTML += row;
      })
    }
  }

  async getContentToRender(items, ctab){
    const response = await fetch('/api/v1/render-content',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( 
          { data: items,
            ctab: ctab,
          }
        ),
      }
    );

    if (!response.ok) throw new Error('Failed render content API!');
    const contentData = await response.json();
      console.log('Click: ', ctab);
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
}

export default LoadMore;