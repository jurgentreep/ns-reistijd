(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{"/7QA":function(e,t,r){"use strict";var n=this&&this.__assign||function(){return(n=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var i in t=arguments[r])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e}).apply(this,arguments)},i=this&&this.__read||function(e,t){var r="function"==typeof Symbol&&e[Symbol.iterator];if(!r)return e;var n,i,o=r.call(e),a=[];try{for(;(void 0===t||t-- >0)&&!(n=o.next()).done;)a.push(n.value)}catch(e){i={error:e}}finally{try{n&&!n.done&&(r=o.return)&&r.call(o)}finally{if(i)throw i.error}}return a},o=this&&this.__spread||function(){for(var e=[],t=0;t<arguments.length;t++)e=e.concat(i(arguments[t]));return e},a=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});var u=r("NpuA"),s=a(r("wd/R"));r("OMi8");var c,l=document.querySelector(".csv-form"),f=document.querySelector("input"),m=document.querySelector(".results"),p=document.querySelector(".station-select"),d=document.querySelector(".select-form"),v={journeys:null};if(!l)throw new Error("missing csvFormElement");l.addEventListener("submit",function(e){e.preventDefault(),h().then(y).then(S).then(M).then(b).then(g).then(D).then(console.log).catch(console.error)}),function(e){e[e.Date=0]="Date",e[e.DepartureTime=1]="DepartureTime",e[e.DepartureStation=2]="DepartureStation",e[e.ArrivalTime=3]="ArrivalTime",e[e.ArrivalStation=4]="ArrivalStation",e[e.Spent=5]="Spent",e[e.Earned=6]="Earned",e[e.Transaction=7]="Transaction",e[e.Class=8]="Class",e[e.Product=9]="Product",e[e.Private=10]="Private",e[e.Note=11]="Note"}(c||(c={}));var h=function(){return new Promise(function(e,t){f&&f.files&&f.files.length?u.parse(f.files[0],{complete:function(t){var r=t.data;r.splice(0,1),e(r)}}):t("Invalid input")})},y=function(e){return new Promise(function(t,r){t(e.filter(function(e){return e[c.Date]&&e[c.DepartureTime]&&e[c.ArrivalTime]}))})},w=function(e,t){return s.default(e+" "+t,"DD-MM-YYYY HH:mm")},S=function(e){return new Promise(function(t,r){t(e.map(function(e){var t=w(e[c.Date],e[c.DepartureTime]),r=w(e[c.Date],e[c.ArrivalTime]);return r.isBefore(t)&&r.add(1,"days"),{departure:t,arrival:r,difference:0,departureStation:e[c.DepartureStation],arrivalStation:e[c.ArrivalStation]}}))})},b=function(e){return new Promise(function(t,r){t(e.map(function(e){var t=e.arrival,r=e.departure;return n({},e,{difference:t.diff(r,"minutes")})}))})},g=function(e){return new Promise(function(t,r){v.journeys=e,t(e)})},D=function(e){return new Promise(function(t,r){var n=e.map(function(e){return e.difference}),i=n.reduce(function(e,t){return e+t}),a=i/e.length,u=Math.max.apply(Math,o(n)),s=Math.min.apply(Math,o(n));m?m.innerHTML="\n      totalMinutes: "+i+"<br>\n      averageMinutes: "+a+"<br>\n      maxMinutes: "+u+"<br>\n      minMinutes: "+s+"<br>\n      journeys: "+e.length+"<br>\n      <br>\n      All data displayed is from the last 18 months\n    ":r("missing resultsElement"),t(e)})},M=function(e){return new Promise(function(t,r){var n=e.map(function(e){return e.arrivalStation}),i=e.map(function(e){return e.departureStation}),a=n.concat(i);if(a=o(new Set(a)),!p)throw new Error("missing stationSelectElement");p.innerHTML=a.map(function(e){return'<option value="'+e+'">'+e+"</option>"}).join(),t(e)})};if(!d)throw new Error("missing selectFormElement");d.addEventListener("submit",function(e){if(e.preventDefault(),!p)throw new Error("missing stationSelectElement");var t=p.selectedOptions,r=Array.from(t).map(function(e){return e.value});if(!v.journeys)throw new Error("missing state.journeys");var n=v.journeys.filter(function(e){return r.includes(e.arrivalStation)&&r.includes(e.departureStation)});D(n)})},J6RI:function(e,t,r){(e.exports=r("JPst")(!1)).push([e.i,".mb-1 {\r\n  margin-bottom: 1rem;\r\n}",""])},OMi8:function(e,t,r){var n=r("J6RI");"string"==typeof n&&(n=[[e.i,n,""]]);var i={hmr:!0,transform:void 0,insertInto:void 0};r("aET+")(n,i);n.locals&&(e.exports=n.locals)}},[["/7QA",1,2]]]);