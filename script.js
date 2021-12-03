var seq = [];
var optimal_seq = [2, 2, 1, 1, 1, 4, 0, 0, 4, 3];
var MAXINT = 100000;

var grades = 5;
var units = 6;

var residenceTimes = [[3,3,2,2,2,1],[1,2,2,2,4,5],[1,1,1,1,2,2],[1,1,2,3,1,1],[1,4,2,1,3,1]];
var consumption = [12,27,22,32,56,18];

var pipeline = [-1,-1,-1,-1,-1,-1];
var pipeline_times = [0,0,0,0,0,0];

var lineCanvas = document.getElementById("myChart");
var chartOptions = {
  legend: {
    display: true,
    position: 'top',
    labels: {
      boxWidth: 80,
      fontColor: 'black'
    },
  },
  scales: {
    yAxes: [{
      ticks: {
        beginAtZero: true
      }
    }]
  },
};

function pipeline_simulator() {
  var x=0;
  for (var t=0; t<MAXINT; t++){
    for(var i=0; i<units; i++){
      pipeline_times[i] = Math.max(0,pipeline_times[i]-1);
    }
    if(pipeline[0] == -1 && x<10) {
      // console.log(x);
      pipeline_times[0] = residenceTimes[seq[x]][0];
      pipeline[0] = seq[x];
      x++;
    }
    if(pipeline_times[units-1] == 0){
      pipeline[units-1] = -1;
    }
    for(var i=units-2; i>-1;i--){
      if(pipeline[i+1] == -1 && pipeline[i] != -1){
        if(pipeline_times[i] == 0){
          pipeline[i+1] = pipeline[i];
          pipeline_times[i+1] = residenceTimes[pipeline[i]][i+1];
          pipeline[i] = -1;
        }
      }
    }
    if(pipeline_times.reduce((a, b) => a + b, 0) == 0 && x==10){
      return t*consumption.reduce((a, b) => a + b, 0)*7.7;
    }
  }
}

function createGraph(cost) {
  lineChart.destroy();
  lineChart = new Chart(lineCanvas, {
    type: 'bar',
    data: {
      datasets: [{
        type: 'bar',
        label: 'User cost vs Optimal cost',
        data: [cost, optimalCost],
        lineTension: 0,
        backgroundColor: 'rgba(77, 172, 219, 0.3)',
        fill: false,
      }],
      labels: ["User cost", "Optimal cost"]
    },
    options: chartOptions
  });
  document.getElementById("userCost").innerHTML = "User Cost: "+cost.toFixed(2);
  document.getElementById("savings").innerHTML = "<h2>Savings: "+(100*(cost-optimalCost)/optimalCost).toFixed(2)+"%</h2>";
  document.getElementById("savings").style.display = "block";
  document.getElementById("alert").innerHTML = "";
  document.getElementById("alert").style.fontColor = "#000";
}

document.addEventListener('DOMContentLoaded', (event) => {

  var dragSrcEl = null;
  
  function handleDragStart(e) {
    this.style.opacity = '0.4';
    this.style.padding = '10px 20px'
    
    dragSrcEl = this;

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
  }

  function handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }

    e.dataTransfer.dropEffect = 'move';
    
    return false;
  }

  function handleDragEnter(e) {
    this.classList.add('over');
  }

  function handleDragLeave(e) {
    this.classList.remove('over');
  }

  function handleDrop(e) {
    if (e.stopPropagation) {
      e.stopPropagation(); // stops the browser from redirecting.
    }
    
    if (dragSrcEl != this) {
      dragSrcEl.innerHTML = this.innerHTML;
      this.innerHTML = e.dataTransfer.getData('text/html');

      seq[Number(this.id)] = Number(this.innerHTML);
      seq[Number(dragSrcEl.id)] = Number(dragSrcEl.innerHTML);
      createGraph(pipeline_simulator());
    }
    
    return false;
  }

  function handleDragEnd(e) {
    this.style.opacity = '1';
    this.style.padding = '10px'
    
    items.forEach(function (item) {
      item.classList.remove('over');
    });
  }
  
  
  let items = document.querySelectorAll('.container .box');
  items.forEach(function(item) {
    seq.push(Number(item.innerHTML));
    item.addEventListener('dragstart', handleDragStart, false);
    item.addEventListener('dragenter', handleDragEnter, false);
    item.addEventListener('dragover', handleDragOver, false);
    item.addEventListener('dragleave', handleDragLeave, false);
    item.addEventListener('drop', handleDrop, false);
    item.addEventListener('dragend', handleDragEnd, false);
  });
});

var tempStorage = seq;
seq = optimal_seq;
var optimalCost = pipeline_simulator();
document.getElementById("optimalCost").innerHTML = "Optimal Cost: "+optimalCost.toFixed(2);
seq = tempStorage;

var lineChart = new Chart(lineCanvas, {
  type: 'bar',
  data: {
    datasets: [{
      type: 'bar',
      label: 'Optimal cost',
      data: [optimalCost],
      lineTension: 0,
      backgroundColor: 'rgba(77, 172, 219, 0.3)',
      fill: false,
    }],
    labels: ["Optimal cost"]
  },
  options: chartOptions
});

function perm(xs) {
  let ret = [];

  for (let i = 0; i < xs.length; i = i + 1) {
    let rest = perm(xs.slice(0, i).concat(xs.slice(i + 1)));

    if(!rest.length) {
      ret.push([xs[i]])
    } else {
      for(let j = 0; j < rest.length; j = j + 1) {
        ret.push([xs[i]].concat(rest[j]))
      }
    }
  }
  return ret;
}

// var perms = perm(optimal_seq);
// var minTime = 100000;
// var time = 0;
// for(i in perms) {
//   seq = perms[i];
//   time = pipeline_simulator();
//   if(time < minTime){
//     minTime = time;
//     optimal_seq = seq;
//   }
// }
// console.log(optimal_seq);
