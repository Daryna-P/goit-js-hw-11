import fetch from "./js/fetch";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { lightbox } from "./js/simpleLightBox";
import { scroller } from "./js/scroll";
import { cardMarkupCreator } from "./js/markup";

const refs = {
    searchForm: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
    endCollectionText: document.querySelector('.end-collection-text'),
};

const OBJS_PER_PAGE = 40;
let currentPage = 1;
let currentHits = 0;
let searchQuery = '';


refs.searchForm.addEventListener('submit', onFormSubmit);

async function onFormSubmit(evt) {
    evt.preventDefault();
    searchQuery = evt.currentTarget.searchQuery.value.trim();
    currentPage = 1;
  
    if (searchQuery === '') {
      return;
    }

    const response = await fetch(searchQuery, currentPage);
    currentHits = response.hits.length;

    if (response.totalHits > OBJS_PER_PAGE) {
        refs.loadMoreBtn.classList.remove('is-hidden');
        refs.endCollectionText.classList.add('is-hidden');
      } else {
        refs.loadMoreBtn.classList.add('is-hidden');
        refs.endCollectionText.classList.remove('is-hidden');
      }

      try {
        if (response.totalHits > 0) {
          Notify.success(`Hooray! We found ${response.totalHits} images.`);
          refs.gallery.innerHTML = '';
          cardMarkupCreator(response.hits, refs.gallery);
          scroller(-1000);
          lightbox.refresh();
        }
    
        if (response.totalHits === 0) {
          refs.gallery.innerHTML = '';
          Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
          refs.loadMoreBtn.classList.add('is-hidden');
          refs.endCollectionText.classList.add('is-hidden');
        }
      } catch (error) {
        console.error(error);
      }
}

refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

async function onLoadMoreBtnClick() {
    currentPage += 1;
    const response = await fetch(searchQuery, currentPage);
    cardMarkupCreator(response.hits, refs.gallery);
    lightbox.refresh();
    currentHits += response.hits.length;
  
    scroller(2);
  
    if (currentHits === response.totalHits) {
      refs.loadMoreBtn.classList.add('is-hidden');
      refs.endCollectionText.classList.remove('is-hidden');
    }
  }