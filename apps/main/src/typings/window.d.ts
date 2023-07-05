import TinyMce from 'tinymce';

declare global {
  interface Window {
    tinymce: typeof TinyMce;
    dataLayer: DataLayer;
  }
}

window.tinymce = window.tinymce ?? {};
