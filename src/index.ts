const form = document.querySelector('form');
const input = document.querySelector('input');
import { parse } from 'papaparse';

if (form) {
  form.addEventListener('submit', event => {
    event.preventDefault();

    if (input && input.files && input.files.length) {
      parse(input.files[0], {
        complete: ({ data }) => {
          console.table(data);
        }
      })
    }
  })
}