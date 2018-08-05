import d3 from 'd3';
import ping from './ping';

const margin = {top: 20, right: 20, bottom: 30, left: 50};
const width = 600 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const y = d3.scale.linear().range([height, 0]);
const yAxis = d3.svg.axis().scale(y).orient('left');

const x = d3.scale.linear().range([0, width]);
const xAxis = d3.svg.axis().scale(x).orient('bottom').ticks(3)

const line = d3.svg.line().x((d) => d.x).y((d) => y(d.ping));

const svg = d3.select('svg#chart')
  .attr({
    width: width + margin.left + margin.right,
    height: height + margin.top + margin.bottom
  })
  .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);
/*
svg.append('g')
  .attr({'class': 'x axis', 'transform': `translate(0, ${height})`})
  .append('line').attr({x1: 0, y1: 0, x2: width, y2: 0});
*/

const xAxisGroup = svg.append('g').attr({'class': 'x axis', 'transform': `translate(0, ${height})`}).call(xAxis);
xAxisGroup.append('text').attr({x: width - 50, dx: '.41em' }).style('text-anchor', 'end').text('Time since first Ping (s)');
const yAxisGroup = svg.append('g').attr('class', 'y axis').call(yAxis);

yAxisGroup.append('text')
  .attr({transform: 'rotate(-90)', y: 6, dy: '.71em'})
  .style('text-anchor', 'end')
  .text('Ping (ms)');

const path = svg.append('path').attr('class', 'line');

const draw = (data, delay) => {
  const pointWidth = width / (data.length - 1);
  for (let i = 0; i < data.length; i++) {
    data[i].x = i * pointWidth + i;
  }

  x.domain([0, delay*data.length / 1000.0])
  y.domain(d3.extent(data, (d) => d.ping));
  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);

  if (data.length > 1) path.datum(data).attr('d', line);
};

let isRunning = false;
let data;
let intervalID;

const $urlInput = document.querySelector('#url');
const $delayInput = document.querySelector('#delay');
const $submitButton = document.querySelector('button[type="submit"]');
const $pingStatus = document.querySelector('.pingstatus')

document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();

  isRunning = !isRunning;

  $submitButton.textContent = isRunning ? 'Stop' : 'Start';

  if (isRunning) {
    data = [];
    const url = $urlInput.value;
    const delay = parseInt($delayInput.value);
    intervalID = setInterval(() => ping(url).then((delta) => {
      data.push({ping: delta});
      draw(data, delay);
      $pingStatus.textContent = delta.toString() + " ms"; 
    }), delay);
  } else {
    clearInterval(intervalID);
  }
});
