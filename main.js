

const zoomLevel = 1.1;
const selectElement = document.querySelector('#chart-type');
const selectedNameElement = document.querySelector('#selected-chart-type');



var spec_vega_barChart = {
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "description": "A basic bar chart example, with value labels shown upon mouse hover.",
  "width": 400,
  "height": 200,
  "padding": 5,

  "data": [
    {
      "name": "table",
      "values": []
    }
  ],

  "signals": [
    {
      "name": "tooltip",
      "value": {},
      "on": [
        {"events": "rect:mouseover", "update": "datum"},
        {"events": "rect:mouseout",  "update": "{}"}
      ],
    },
    {
      "name": "fillColor",
      "value": "red"
    }
  ],

  "scales": [
    {
      "name": "xscale",
      "type": "band",
      "domain": {"data": "table", "field": "category"},
      "range": "width",
      "padding": 0.05,
      "round": true
    },
    {
      "name": "yscale",
      "domain": {"data": "table", "field": "amount"},
      "nice": true,
      "range": "height"
    }
  ],

  "axes": [
    { "orient": "bottom", "scale": "xscale" },
    { "orient": "left", "scale": "yscale" }
  ],

  "marks": [
    {
      "type": "rect",
      "from": {"data":"table"},
      "encode": {
        "enter": {
          "x": {"scale": "xscale", "field": "category"},
          "width": {"scale": "xscale", "band": 1},
          "y": {"scale": "yscale", "field": "amount"},
          "y2": {"scale": "yscale", "value": 0}
        },
        "update": {
          // "fill": {"value": "steelblue"}
          "fill": {"signal": "fillColor"}
        }
        
        ,
        "hover": {
          "fill": {"value": "red"}
        }
      }
    },
    {
      "type": "text",
      "encode": {
        "enter": {
          "align": {"value": "center"},
          "baseline": {"value": "bottom"},
          "fill": {"value": "#333"},
          //"fill": {"signal": "fillColor.value"}
        },
        "update": {
          "x": {"scale": "xscale", "signal": "tooltip.category", "band": 0.5},
          "y": {"scale": "yscale", "signal": "tooltip.amount", "offset": -2},
          "text": {"signal": "tooltip.amount"},
          "fillOpacity": [
            {"test": "datum === tooltip", "value": 0},
            {"value": 1}
          ]
        }
      }
    }
  ]
}

let myData2 = [
        {"category": "B", "amount": 33},
        {"category": "D", "amount": 55},
        {"category": "E", "amount": 81},
        {"category": "F", "amount": 53},
        {"category": "G", "amount": 19},
        {"category": "A", "amount": 22},
        {"category": "C", "amount": 44},
        {"category": "H", "amount": 87}    
]

let myData3 = [
          {"x": 0, "y": 28, "c":0}, {"x": 0, "y": 20, "c":1},
          {"x": 1, "y": 43, "c":0}, {"x": 1, "y": 35, "c":1},
          {"x": 2, "y": 81, "c":0}, {"x": 2, "y": 10, "c":1},
          {"x": 3, "y": 19, "c":0}, {"x": 3, "y": 15, "c":1},
          {"x": 4, "y": 52, "c":0}, {"x": 4, "y": 48, "c":1},
          {"x": 5, "y": 24, "c":0}, {"x": 5, "y": 28, "c":1},
          {"x": 6, "y": 87, "c":0}, {"x": 6, "y": 66, "c":1},
          {"x": 7, "y": 17, "c":0}, {"x": 7, "y": 27, "c":1},
          {"x": 8, "y": 68, "c":0}, {"x": 8, "y": 16, "c":1},
          {"x": 9, "y": 49, "c":0}, {"x": 9, "y": 25, "c":1}
        ]

let myData4 = [
          {"x": 0, "y": 28, "c":0},
          {"x": 1, "y": 43, "c":0},
          {"x": 2, "y": 81, "c":0},
          {"x": 3, "y": 19, "c":0},
          {"x": 4, "y": 52, "c":0},
          {"x": 5, "y": 24, "c":0},
          {"x": 6, "y": 87, "c":0}, 
          {"x": 7, "y": 17, "c":0},
          {"x": 8, "y": 68, "c":0},
          {"x": 9, "y": 49, "c":0}
        ]


// let myInput = document.querySelector('#graph-data');
// let curr_data = [];
let curr_width = 400;
let curr_height = 200; 
var view;
var resizer = document.querySelector(".resizer"),
   sidebar = document.querySelector(".sidebar");

var handle = document.querySelector('.ui-resizable-s');
var container = document.querySelector('#ember29');
var editor = document.querySelector('.ace-editor-container textarea');
var content = document.querySelector('.content');
   
var startY, startHeight;

// myInput.addEventListener('blur', function(event) {
//   try {
//     curr_data = JSON.parse(event.target.value);
//   } catch (error) {
//     alert("Invalid input format, please enter the text as following format:            [{'x': '3', 'y': 21},{'x': '5', 'y': 32}]     ");
// }
//    //changeToBarChart(curr_data);
// });



// fetch('barChart.json')
//       .then(res => res.json())
//       .then(spec => render(spec))
//       .catch(err => console.error(err));

// var view;
// function render(spec) {
//     view = new vega.View(vega.parse(spec), {
//     renderer:  'svg',  // renderer (canvas or svg)
//     container: '#vis',   // parent DOM container
//     })
//     .insert('table', myData2)
//     return view.runAsync();
// }


// view = new vega.View(vega.parse(spec_vega_barChart))
//     .renderer("svg")  // set renderer (canvas or svg)
//     .initialize(document.querySelector("#vis")) // initialize view within parent DOM container
//     .insert("table", myData2) // Insert the named data source
//     .hover()             // enable hover encode set processing
//     .run();


    // function changeColor(){
    //   view.signal('fillColor',['green']).runAsync();
    //   console.log(view.signal('fillColor'))
    // }
    // document.getElementById('color').addEventListener('click', ()=> {
		// 	changeColor();
		// });



		// function changeSize(zoomFactor){
		// 	curr_height = view.height();
		// 	curr_width = view.width();
		// 	curr_height *= zoomFactor;
		// 	curr_width *= zoomFactor;
		// 	view.height([curr_height]).width([curr_width]).runAsync();
		// }

    // function changeToLineChart(){
    //   let xscale = Object.keys(view.data('table')[0])[0];
    //   let yscale = Object.keys(view.data('table')[0])[1];
    //   fetch('lineChart.json')
    //   .then(res => res.json())
    //   .then(spec => render(spec))
    //   .catch(err => console.error(err));

    //   function render(spec) {
    //       view = new vega.View(vega.parse(spec), {
    //       renderer:  'svg',  // renderer (canvas or svg)
    //       container: '#vis',   // parent DOM container
    //       })
    //       .insert('table', myData2)
    //       .signal('xAxis',[xscale])
    //       .signal('yAxis',[yscale])
    //       return view.runAsync();
    //   }
    // };
    function changeToLineChart(myData){
      fetch('lineChart.json')
      .then(res => res.json())
      .then(spec => render(spec))
      .catch(err => console.error(err));

      function render(spec) {
          view = new vega.View(vega.parse(spec), {
          renderer:  'svg',  // renderer (canvas or svg)
          container: '#vis',   // parent DOM container
          hover:     true 
          })
          .insert("table", myData)
          // return view.runAfter(
          //   console.log(view.signal('xAxis'))
          // )
          let xscale = Object.keys(myData[0])[0];
          let yscale = Object.keys(myData[0])[1];
          // let str = xscale.toString();
          view.signal('xAxis',xscale);
          view.signal('yAxis',yscale);
          view.height([curr_height]).width([curr_width])
          view.signal("width",curr_width);
          view.signal("height",curr_height);
          // view.signal('yAxis',yscale)
          view.runAsync();
      }

    };

    function changeToMultiLineChart(myData,min,max){
      fetch('lineChart_multi.json')
      .then(res => res.json())
      .then(spec => render(spec))
      .catch(err => console.error(err));

      function render(spec) {
          view = new vega.View(vega.parse(spec), {
          renderer:  'svg',  // renderer (canvas or svg)
          container: '#vis',   // parent DOM container
          hover:     true 
          })
          .insert("table", myData)
          // return view.runAfter(
          //   console.log(view.signal('xAxis'))
          // )
          let xscale = Object.keys(myData[0])[0];
          let yscale = Object.keys(myData[0])[1];
          // let str = xscale.toString();
          view.signal('xAxis',xscale);
          view.signal('yAxis',yscale);
          view.signal('ymin',min);

          if(max > 0){
            view.signal('ymax',max);
          }else{
            view.signal('ymax',140);
          } 
          
          // view.height([curr_height]).width([curr_width]);
          view.signal("width",curr_width);
          view.signal("height",curr_height);
          
          view.addEventListener('mouseover', (event, item) => {
            const itemInfo = document.getElementById('item-info');
            if (item) {
                // let arr = item.mark.source.value;
                // let content = "";
                // for (let i = 0; i < arr.length; i++) {
                //   content += JSON.stringify(arr[i].datum, null, 2) + "\n";
                // }
                // itemInfo.innerText = content;
                let arr = item.mark.source.value;
                let html = "<table><tr><th>X</th><th>Y</th><th>C</th></tr>";
                arr.forEach(d => {
                  html += `<tr><td>${d.datum.x}</td><td>${d.datum.y}</td><td>${d.datum.c}</td></tr>`;
                });
                html += "</table>";
                itemInfo.innerHTML = html;

                
              };
          });

              
    
          
          view.runAsync();
      }

    };

    function changeToBarChart(myData){
      fetch('barChart_test.json')
      .then(res => res.json())
      .then(spec => render(spec))
      .catch(err => console.error(err));

      function render(spec) {
          view = new vega.View(vega.parse(spec), {
          renderer:  'svg',  // renderer (canvas or svg)
          container: '#vis',   // parent DOM container
          hover:     true 
          })
          .insert("table", myData)
          let xscale = Object.keys(myData[0])[0];
          let yscale = Object.keys(myData[0])[1];
          view.signal('xAxis',xscale);
          view.signal('yAxis',yscale);
          view.height([curr_height]).width([curr_width])
          
          // const tooltipHandler = new vegaTooltip.Handler().call;
          // console.log(view.tooltip(tooltipHandler));
          view.signal("width",curr_width);
          view.signal("height",curr_height);

          view.addEventListener('mouseover', (event, item) => {
            if (item && item.datum) {
              const itemInfo = document.getElementById('item-info');
              itemInfo.innerText = JSON.stringify(item.datum, null, 2);
            }
          });
          
          view.runAsync();
      }

    };


  //   selectElement.addEventListener('change', (event) => {
  //   // selectedNameElement.textContent = `You selected ${event.target.value}!`;
  //   if(event.target.value === "line-chart"){
  //     console.log("changeToLineChart() is called")
  //     if(Object.keys(curr_data[0]).length !== 2){
  //       alert("The array format you entered cannot be converted to line chart")
  //     }else{
  //       changeToLineChart(curr_data);
  //     }
  //   }else if(event.target.value === "bar-chart"){
  //     console.log("changeToBarChart() is called")
  //     if(Object.keys(curr_data[0]).length !== 2){
  //       alert("The array format you entered cannot be converted to Bar chart")
  //     }else{
  //       changeToBarChart(curr_data);
  //     }
  //   }else if(event.target.value === "multiple-line-chart"){
  //     console.log("changeToMultiLineChart() is called")
  //     if(Object.keys(curr_data[0]).length !== 3){
  //       alert("The array format you entered cannot be converted to multiple line chart")
  //     }else{
  //       changeToMultiLineChart(curr_data);
  //     }
      
  //   }
  // });


  function updateGraph(dataset,type,min,max){

    const myDiv = document.getElementById('content');
    curr_width = myDiv.clientWidth-40;
    curr_height = myDiv.clientHeight-40;
    console.log(curr_width,curr_height);


    if(type === "line-chart"){
      console.log("changeToLineChart() is called")
      if(Object.keys(dataset[0]).length !== 2){
        alert("The array format you entered cannot be converted to line chart")
      }else{
        changeToLineChart(dataset);
      }
    }else if(type === "bar-chart"){
      console.log("changeToBarChart() is called")
      if(Object.keys(dataset[0]).length !== 2){
        alert("The array format you entered cannot be converted to Bar chart")
      }else{
        changeToBarChart(dataset);
      }
    }else if(type === "multiple-line-chart"){
      console.log("changeToMultiLineChart() is called")
      if(Object.keys(dataset[0]).length !== 3){
        alert("The array format you entered cannot be converted to multiple line chart")
      }else{
        changeToMultiLineChart(dataset,min,max);
      }
      
    }
  };

  function initResizerFn( resizer, sidebar , content) {

    // track current mouse position in x var
    var x, w, contentW;
 
    function rs_mousedownHandler( e ) {
 
       x = e.clientX;
 
       var sbWidth = window.getComputedStyle( sidebar ).width;
       w = parseInt( sbWidth, 10 );
       var contentWidth = window.getComputedStyle( content ).width;
       contentW = parseInt( contentWidth, 10 );
 
       document.addEventListener("mousemove", rs_mousemoveHandler);
       document.addEventListener("mouseup", rs_mouseupHandler);
    }
 
    function rs_mousemoveHandler( e ) {
       var dx = e.clientX - x;
 
       var cw = w + dx; // complete width
       var rightw = contentW - dx;
       
       if ( cw < 1000 && cw > 70) {
          sidebar.style.width = `${ cw }px`;
          view.signal("width",rightw-40).runAsync();

          // document.querySelector('.ace-editor-container textarea').style.width = `${ cw }px`;
       }

       

    }

 
    function rs_mouseupHandler() {
       // remove event mousemove && mouseup
       document.removeEventListener("mouseup", rs_mouseupHandler);
       document.removeEventListener("mousemove", rs_mousemoveHandler);
    }
 
    resizer.addEventListener("mousedown", rs_mousedownHandler);
 }



 
initResizerFn( resizer, sidebar , content);

const form = document.querySelector('#my-form');
form.addEventListener('submit', function(event) {
  event.preventDefault(); // prevent the default form submission behavior
  
  // Do something with the form data, such as sending it to a server
  const formData = new FormData(form);
  
  var data;
  try {
    data = JSON.parse(formData.get('myInput'));
  } catch (error) {
    alert("Invalid input format, please enter the text as following format:            [{'x': '3', 'y': 21},{'x': '5', 'y': 32}]     ");
  }

  const type = formData.get('chart-type');
  const min = formData.get('domain-min');
  const max = formData.get('domain-max');

  updateGraph(data,type,min,max);
  // Reset the form
  

});




// var splitter = document.getElementById("splitter");
// var left = document.getElementById("left");
// var right = document.getElementById("right");

// splitter.addEventListener("mousedown", function(event) {
//   document.addEventListener("mousemove", resize);
//   document.addEventListener("mouseup", stopResize);
// });

// function resize(event) {
//   var x = event.clientY
//   var containerRect = document.getElementById("con").getBoundingClientRect();
//   var containerHeight = containerRect.height;
//   var splitterRect = splitter.getBoundingClientRect();
//   var splitterHeight = splitterRect.height;
//   var leftHeight = x - containerRect.left - splitterHeight / 2;
//   var rightHeight = containerHeight - leftHeight - splitterHeight;
  
//   if(leftHeight > 20 && rightHeight > 20){
//     left.style.height = leftHeight + "px";
//   	right.style.height = rightHeight + "px";
//   }else{
//     console.log(leftHeight)
//   }
  	
// }

// function stopResize() {
//   document.removeEventListener("mousemove", resize);
//   document.removeEventListener("mouseup", stopResize);
// }



handle.addEventListener('mousedown', function(e) {
  startY = e.clientY;
  startHeight = parseInt(getComputedStyle(container).height);
  document.addEventListener('mousemove', handleResize);
  document.addEventListener('mouseup', stopResize);
});

function handleResize(e) {
  var diffY = e.clientY - startY;
  var newHeight = startHeight + diffY;
  editor.style.height = (newHeight) + 'px'; // adjust for padding/margin
  container.style.height = newHeight + 'px';
}

function stopResize() {
  document.removeEventListener('mousemove', handleResize);
  document.removeEventListener('mouseup', stopResize);
}

