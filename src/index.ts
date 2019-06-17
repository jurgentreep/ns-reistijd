const form = document.querySelector('form');
const input = document.querySelector('input');
import { parse } from 'papaparse';
import moment from 'moment';

// This format doesn't make much sense if you think about it
const dateFormat = 'HH:mm DD-MM-YYYY';

if (form) {
  form.addEventListener('submit', event => {
    event.preventDefault();

    if (input && input.files && input.files.length) {
      parse(input.files[0], {
        complete: ({ data }) => {
          const departureString = `${data[1][1]} ${data[1][0]}`
          const arrivalString = `${data[1][3]} ${data[1][0]}`
          const departure = moment(departureString, dateFormat);
          const arrival = moment(arrivalString, dateFormat);
          console.log(departure);
          console.log(departure.toISOString())
        }
      })
    }
  })
}