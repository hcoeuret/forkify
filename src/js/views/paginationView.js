import View from './View.js'
import icons from 'url:../../img/icons.svg'

class PaginationView extends View{
  _parentElement = document.querySelector('.pagination')
  _errorMessage = "";
  _initMessage = ""

  _generateMarkup(){
    
    const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
    const currentPage = this._data.page

    const prevMarkup = `
    <button data-goto="${currentPage - 1}" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${currentPage - 1}</span>
    </button>
    `;

    const nextMarkup = `
    <button data-goto="${currentPage + 1}"  class="btn--inline pagination__btn--next">
      <span>Page ${currentPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
    `;

    // Page 1 and there are other pages
    if(currentPage === 1 && numPages > 1){
      return nextMarkup;
    }
    // Last page
    if( currentPage === numPages && numPages > 1){
      return prevMarkup;
    }
    // Other page
    if( currentPage < numPages){
      return prevMarkup+nextMarkup;
    }
    // Page 1 and no other pages
    return '';
  }

  addHandlerClick(handler){
    this._parentElement.addEventListener('click',function(e){
      const btn = e.target.closest('.btn--inline');
      if(!btn) return;
      const goToPage = +btn.dataset.goto
      handler(goToPage);
    })
  }

};


export default new PaginationView