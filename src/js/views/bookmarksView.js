import previewView from './previewView.js';
import View from './View.js'
import icons from 'url:../../img/icons.svg'

class BookmarksView extends previewView{
  _parentElement = document.querySelector('.bookmarks__list')
  _errorMessage = "No bookmarks yet, find a recipe first";
  _initMessage = "";

  addHandlerRender(handler){
    window.addEventListener('load', handler);
  }

};


export default new BookmarksView