import { parse } from 'papaparse';
import moment from 'moment';
import './style.css';

const form = document.querySelector('form');
const input = document.querySelector('input');
const resultsElement = document.querySelector('.results');
const dateFormat = 'DD-MM-YYYY HH:mm ';

if (form) {
  form.addEventListener('submit', event => {
    event.preventDefault();

    parseFile()
      .then(filterData)
      // .then(logRawData)
      .then(parseData)
      .then(calculateDifference)
      .then(displayResults)
      .then(console.log)
      .catch(console.error)
  })
}

enum CsvEntry {
  Date,
  DepartureTime,
  DepartureStation,
  ArrivalTime,
  ArrivalStation,
  Spent,
  Earned,
  Transaction,
  Class,
  Product,
  Private,
  Note
}

const parseFile: () => Promise<string[][]> = () => new Promise((resolve, reject) => {
  if (input && input.files && input.files.length) {
    parse(input.files[0], {
      complete: ({ data }: { data: string[][] }) => {
        // Remove first entry because it's not relevant for us
        data.splice(0, 1)

        resolve(data);
      }
    })
  } else {
    reject('Invalid input')
  }
})

const filterData: (data: string[][]) => Promise<string[][]> = (data) => new Promise((resolve, reject) => {
  // Remove all entries that don't have the things we need set
  resolve(
    data.filter(entry => entry[CsvEntry.Date] && entry[CsvEntry.DepartureTime] && entry[CsvEntry.ArrivalTime])
  )
})

const logRawData: (data: string[][]) => Promise<string[][]> = (data) => new Promise((resolve, reject) => {
  console.log(data);
  resolve(data)
})

const createMoment = (date: string, time: string) => {
  return moment(`${date} ${time}`, dateFormat);
}

interface Journey {
  departure: moment.Moment,
  arrival: moment.Moment,
  difference: number
}

const parseData: (data: string[][]) => Promise<Journey[]> = (data) => new Promise((resolve, reject) => {
  const journeys = data.map(entry => {
    const departure = createMoment(entry[CsvEntry.Date], entry[CsvEntry.DepartureTime]);
    const arrival = createMoment(entry[CsvEntry.Date], entry[CsvEntry.ArrivalTime]);

    // There's a chance you check in before 00:00 and check out after 00:00
    if (arrival.isBefore(departure)) {
      arrival.add(1, 'days');
    }

    return {
      departure,
      arrival,
      difference: 0
    }
  })

  resolve(journeys);
})

const calculateDifference: (journeys: Journey[]) => Promise<Journey[]> = (journeys) => new Promise((resolve, reject) => {
  resolve(
    journeys.map(({ departure, arrival }) => ({
      departure,
      arrival,
      difference: arrival.diff(departure, 'minutes')
    }))
  )
})

const displayResults: (journeys: Journey[]) => Promise<Journey[]> = (journeys) => new Promise((resolve, reject) => {
  const journeyTimes = journeys.map(journey => journey.difference);
  const totalMinutes = journeyTimes.reduce((acc, journeyTime) => acc + journeyTime);
  const averageMinutes = totalMinutes / journeys.length;
  const maxMinutes = Math.max(...journeyTimes);
  const minMinutes = Math.min(...journeyTimes);
  journeys.forEach((journey, index) => {
    if (journey.difference === maxMinutes) {
      console.log(journey);
      console.log(index);
    }
  })

  if (resultsElement) {
    resultsElement.innerHTML = `
      totalMinutes: ${totalMinutes}<br>
      averageMinutes: ${averageMinutes}<br>
      maxMinutes: ${maxMinutes}<br>
      minMinutes: ${minMinutes}<br>
      journeys: ${journeys.length}<br>
      <br>
      All data displayed is from the last 18 months
    `
  } else {
    reject('missing resultsElement');
  }
  resolve(journeys);
})