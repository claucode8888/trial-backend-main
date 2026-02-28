class LoadMore {
  constructor(){
    this.DOM = {
      button: document.querySelector('.js--load-more'),
    };
    
    this.init();
    this.events();
  }

  init(){
    console.log('Init');
  }

  events(){
    this.DOM.button?.addEventListener('click', () => {
      this.loadItems();
    });
  }

  async loadItems(){
    try {
      const response = await fetch(
        `https://www.sei.com/wp-json/wp/v2/insight`
      );

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

    } catch (error) {
      console.error('API error:', error);
    }
  }
}

export default LoadMore;