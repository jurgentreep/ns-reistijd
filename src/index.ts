import { parse } from 'papaparse';
import moment from 'moment';
import './style.css';

const csvFormElement: HTMLFormElement | null = document.querySelector('.csv-form');
const inputElement: HTMLInputElement | null = document.querySelector('input');
const resultsElement: HTMLDivElement | null = document.querySelector('.results');
const stationSelectElement: HTMLSelectElement | null = document.querySelector('.station-select');
const selectFormElement: HTMLFormElement | null = document.querySelector('.select-form');
const dateFormat = 'DD-MM-YYYY HH:mm';

interface State {
  journeys: Journey[] | null
}

const state: State = {
  journeys: null
};

if (csvFormElement) {
  csvFormElement.addEventListener('submit', event => {
    event.preventDefault();

    parseFile()
      .then(filterData)
      // .then(logRawData)
      .then(parseData)
      .then(fillSelects)
      .then(calculateDifference)
      .then(addJourneysToState)
      .then(displayResults)
      .then(console.log)
      .catch(console.error)
  })
} else {
  throw new Error('missing csvFormElement');
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
  if (inputElement && inputElement.files && inputElement.files.length) {
    parse(inputElement.files[0], {
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
  departure: moment.Moment
  arrival: moment.Moment
  difference: number
  departureStation: string
  arrivalStation: string
}

const parseData: (data: string[][]) => Promise<Journey[]> = (data) => new Promise((resolve, reject) => {
  resolve(
    data.map(entry => {
      const departure = createMoment(entry[CsvEntry.Date], entry[CsvEntry.DepartureTime]);
      const arrival = createMoment(entry[CsvEntry.Date], entry[CsvEntry.ArrivalTime]);

      // There's a chance you check in before 00:00 and check out after 00:00
      if (arrival.isBefore(departure)) {
        arrival.add(1, 'days');
      }

      return {
        departure,
        arrival,
        difference: 0,
        departureStation: entry[CsvEntry.DepartureStation],
        arrivalStation: entry[CsvEntry.ArrivalStation]
      }
    })
  )
})

const calculateDifference: (journeys: Journey[]) => Promise<Journey[]> = (journeys) => new Promise((resolve, reject) => {
  resolve(
    journeys.map(journey => {
      const { arrival, departure } = journey;

      return {
        ...journey,
        difference: arrival.diff(departure, 'minutes')
      }
    })
  )
})

const addJourneysToState: (journeys: Journey[]) => Promise<Journey[]> = (journeys) => new Promise((resolve, reject) => {
  state.journeys = journeys;
  resolve(journeys)
})

const displayResults: (journeys: Journey[]) => Promise<Journey[]> = (journeys) => new Promise((resolve, reject) => {
  const journeyTimes = journeys.map(journey => journey.difference);
  const totalMinutes = journeyTimes.reduce((acc, journeyTime) => acc + journeyTime);
  const averageMinutes = totalMinutes / journeys.length;
  const maxMinutes = Math.max(...journeyTimes);
  const minMinutes = Math.min(...journeyTimes);

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

const fillSelects: (journeys: Journey[]) => Promise<Journey[]> = (journeys) => new Promise((resolve, reject) => {
  const arrivalStations = journeys.map(journey => journey.arrivalStation);
  const departureStations = journeys.map(journey => journey.departureStation);
  let stations = arrivalStations.concat(departureStations);
  stations = [...new Set(stations)];

  if (stationSelectElement) {
    stationSelectElement.innerHTML = stations.map(station => `<option value="${station}">${station}</option>`).join();
  } else {
    throw new Error('missing stationSelectElement');
  }

  resolve(journeys);
});

if (selectFormElement) {
  selectFormElement.addEventListener('submit', event => {
    event.preventDefault();

    if (stationSelectElement) {
      const selectOptions = stationSelectElement.selectedOptions;
      const stations = Array.from(selectOptions).map(option => option.value);

      if (state.journeys) {
        const filteredJourneys = state.journeys.filter(journey => {
          return stations.includes(journey.arrivalStation)
            && stations.includes(journey.departureStation)
        })

        displayResults(filteredJourneys);
      } else {
        throw new Error('missing state.journeys');
      }
    } else {
      throw new Error('missing stationSelectElement');
    }
  })
} else {
  throw new Error('missing selectFormElement');
}