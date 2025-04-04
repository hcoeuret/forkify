import View from './View.js'
import icons from 'url:../../img/icons.svg'

export default class previewView extends View{
  
  _generateMarkup(){
    return this._data.map(rec => this._generateMarkupPreview(rec)).join('');
  };

  _generateMarkupPreview(rec){
    const id = window.location.hash;
    return `
      <li class="preview">
        <a class="preview__link ${rec.id === id ? 'preview__link--active': ''}" href="${rec.id}">
          <figure class="preview__fig">
            <img src="${rec.image}" alt="Test" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${rec.title}</h4>
            <p class="preview__publisher">${rec.publisher}</p>
            <div class="preview__user-generated ${rec.key ? '': 'hidden'}">
              <svg>
                <use href="${icons}#icon-user"></use>
              </svg>
            </div>
          </div>
        </a>
      </li>
      `
  };
};