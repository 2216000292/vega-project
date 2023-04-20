

const zoomLevel = 1.1;
const selectElement = document.querySelector('#chart-type');
const selectedNameElement = document.querySelector('#selected-chart-type');


// let myInput = document.querySelector('#graph-data');
// let curr_data = [];
let curr_width = 400;
let curr_height = 200; 
let defaultColor = "yellow";
let curr_color = "black";
let curr_step = 10;
let curr_dataset = null;
let curr_type = "";
var view = null;
let curr_strokeWidth = 3;
var resizer = document.querySelector(".resizer"), sidebar = document.querySelector(".sidebar");
var handle = document.querySelector('.ui-resizable-s');
var inputfield = document.querySelector('#ember29');
var editor = document.querySelector('.ace-editor-container textarea');
var content = document.querySelector('.content');
var twoChart_resizer = document.querySelector('.twoChart-resizer');
var curr_projection;
var curr_charts = ["",""];

let colors = [
  "red", 
  "blue", 
  "teal", 
  "navy", 
  "maroon", 
  "purple", 
  "fuchsia", 
  "indigo", 
  "black", 
  "gray", 
  "silver", 
  "olive", 
  "lime", 
  "green", 
  "aqua", 
  "teal", 
  "navy", 
  "purple", 
  "fuchsia", 
  "indigo"
];
const divObservers = {};

var startY, startHeight;
    
    function arraysAreEqual(arr1, arr2) {
      if (arr1.length !== arr2.length) {
        return false;
      }

      for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
          return false;
        }
      }

      return true;
    }

    function renderProjectionChart(didRenderDivId,type,data){
      const projection = document.getElementById(didRenderDivId);
      var width =  projection.clientWidth-30;
      var height =  projection.clientHeight-30;
      if(type === "line-chart"){
        changeToLineChart(data,"projection-chart",width,height);
      }
      // graphSizeControl(projection,type,data);

    }

    // function graphSizeControl(didRenderDiv,type,data){   // accept div as the parameter
    //   if (resizeObserver) {
    //     resizeObserver.disconnect();
    //   }
    //   resizeObserver = new ResizeObserver(entries => {
    //   console.log("graphSizeControl is called----type:-",type);
    //   for (let entry of entries) {
    //     if(view !== null && curr_charts[0] !== ""){

    //         var width = didRenderDiv.clientWidth-30;
    //         var height = didRenderDiv.clientHeight-30;
    //         console.log("Dectet size change:",width,height);
    //         if(type === "multiple-line-chart"){
    //           changeToMultiLineChart(data,"#main-chart",width,height);
    //           console.log("changeToMultiLineChart---size controal");
    //         }else if(type === "line-chart"){
    //           changeToLineChart(data,"main-chart",width,height);
    //           console.log("changeToLineChart -- size control");
    //         }
            
    //       }
    //     }
    //   });
    //   resizeObserver.observe(didRenderDiv);
    // }

    // 创建一个对象来存储div的observer

// 创建一个对象来存储div的observer


    function debounce(func, wait) {
      let timeout;
      return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
      };
    }

    // function graphSizeControl(divs, types, data) {
    //   // disconnect all divs's observer
    //   divs.forEach(div => {
    //     if (divObservers.hasOwnProperty(div.id)) {
    //       divObservers[div.id].disconnect();
    //     }
    //   });

    //   //create new connection for each div
    //   divs.forEach(didRenderDiv => {
    //     const resizeObserver = new ResizeObserver(
    //       debounce(
    //       entries => {
    //         const entry = entries[0];
    //         const type = types[didRenderDiv.id];
    //         if (view !== null) {
    //           var width = didRenderDiv.clientWidth - 30;
    //           var height = didRenderDiv.clientHeight - 30;
    //           console.log("Dectet size change:");
    //           if (type === "bar-chart") {
    //             changeToBarChart(data, didRenderDiv.id, width, height);
    //             console.log("changeToBarChart---size controal",width);
    //           } else if (type === "line-chart") {
    //             changeToLineChart(data,didRenderDiv.id , width, height);
    //             console.log("changeToLineChart -- size control",width);
    //           }
    //         }
    //       }
    //       ,50)
    //       );

    //       // add new observer to each object
    //       divObservers[didRenderDiv.id] = resizeObserver;
    //       // start observe div
    //       resizeObserver.observe(didRenderDiv);

    //   });
    // }

    
    function graphSizeControl(willRenderObj) {

      Object.values(willRenderObj).forEach(obj => {
        const div = document.getElementById(obj.name);
        if (divObservers.hasOwnProperty(div.id)) {
          divObservers[div.id].disconnect();
        }
      });

      Object.values(willRenderObj).forEach(obj => {
        const div = document.getElementById(obj.name);
        const resizeObserver = new ResizeObserver(
          debounce(
          entries => {
            const entry = entries[0];
            const type = obj.type;

              var width = div.clientWidth - 30;
              var height = div.clientHeight - 30;
              console.log("Dectet size change:");
              if (type === "bar-chart") {
                changeToBarChart(obj.dataset, div.id, width, height);
                console.log("changeToBarChart---size controal",width);
              } else if (type === "line-chart") {
                changeToLineChart(obj.dataset, div.id , width, height);
                console.log("changeToLineChart -- size control",width);
              }else if (type === "scatter-plot") {
                changeToScatterPlot(obj.dataset, div.id , width, height);
                console.log("changeToScatterPlot -- size control",width);
              }
            
          }
          ,50)
          );
          divObservers[div.id] = resizeObserver;
          resizeObserver.observe(div);
      });
    }


    function controlLineColor(){
      const datasetCount = [...new Set(curr_dataset.map(item => item.c))].length;
      document.getElementById("linechart-control-color").innerHTML = '';   //avoid overlapping with the old content.
      for (let i = 0; i < datasetCount; i++) {
        const div = document.createElement('div');
        div.classList.add('dataset-' + i);
        div.style.backgroundColor = '#e8e7e1';
        div.style.padding = '10px';
        div.style.marginBottom = '5px';

        div.style.display = 'flex';           
        div.style.alignItems = 'center';
        div.style.justifyContent = 'left';
        div.style.borderRadius = '10px';

        const circle = document.createElement('div');
        circle.style.backgroundColor = colors[i];
        circle.classList.add('circle');
        circle.onclick = toggleColorPicker;

        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.classList.add('color-picker');
        colorPicker.onchange = setColor;
      
        const lineLabel = document.createElement('span'); // Added span element
        lineLabel.textContent = `Line-${i}`; // Set the text content to "line-?"
        lineLabel.style.marginLeft = '10px';

        circle.appendChild(colorPicker);
        div.appendChild(circle);
        div.appendChild(lineLabel);
        
        document.getElementById("linechart-control-color").appendChild(div);
      }

      function toggleColorPicker(event) {
        const circle = event.currentTarget;
        const colorPicker = circle.querySelector('.color-picker');
        colorPicker.click();
      }

      function setColor(event) {
        const colorPicker = event.target;
        const circle = colorPicker.parentElement;
        const datasetDiv = circle.parentElement;
        circle.style.backgroundColor = colorPicker.value;
        
        const parentDiv = document.getElementById('linechart-control-color');
        const index = Array.prototype.indexOf.call(parentDiv.children, datasetDiv);
        colors[index] = colorPicker.value;
        
        
        view.signal('colors',colors.slice());
        view.runAsync();
      }
    }

    function filterDataByXRange(data, xMin, xMax) {
      return data.filter(item => item.x >= xMin && item.x <= xMax);
    }

    function changeToLineChart(myData,willRenderDivId,width,height){
      let renderedDiv;
      if(willRenderDivId === "main-chart"){
        renderedDiv = "#main-chart"
      }else if(willRenderDivId === "projection-chart"){
        renderedDiv = "#projection-chart"
      }
      
      
      fetch('lineChart.json')
      .then(res => res.json())
      .then(spec => render(spec))
      .catch(err => console.error(err));

      function render(spec) {
          view = new vega.View(vega.parse(spec), {
          renderer:  'svg',  // renderer (canvas or svg)
          container: renderedDiv,   // parent DOM container
          hover:     true 
          })
          .insert("chartData", myData)
          // return view.runAfter(
          //   console.log(view.signal('xAxis'))
          // )
          let xscale = Object.keys(myData[0])[0];
          let yscale = Object.keys(myData[0])[1];
          // let str = xscale.toString();
          view.signal('xAxis',xscale);
          view.signal('yAxis',yscale);
          view.signal("width",width);
          view.signal("height",height);
          view.signal("graphSize",[height-30,width-30]);    //There is bug in json file, i don't why have to set -30,
          view.signal("strokeWidth",curr_strokeWidth);
          view.signal("colors",colors)
          // view.signal('yAxis',yscale)
          view.runAsync();

          if(willRenderDivId === "main-chart" &&  curr_projection){
            let existedFilteredData = [];
            view.addSignalListener("detailDomain", (_, domain) => {
              if(domain != null && domain.length >= 1){   //return when user selects avavilable data, at least one element
                filteredData = filterDataByXRange(curr_dataset, domain[0], domain[1]);
                if(filteredData !== null && filteredData.length >= 1 && !arraysAreEqual(existedFilteredData,filteredData)){
                  existedFilteredData = filteredData;
                  // graphSizeControl([myDiv,projectionCharts],{"main-chart": "line-chart", "projection-chart": "line-chart" },dataset);
                  let willRenderObj = {
                    projection_chart: {name:"projection-chart" , type: "line-chart", dataset: filteredData}
                  };
                  graphSizeControl(willRenderObj);
                  console.log(filteredData);
                  // renderProjectionChart("projection-chart","line-chart",filteredData);
                }
              }
            });
          }
          
      }

      

    };

    function changeToMultiLineChart(myData,willRenderDiv,width,height){
      
      fetch('lineChart_multi.json')
      .then(res => res.json())
      .then(spec => render(spec))
      .catch(err => console.error(err));

      function render(spec) {

          view = new vega.View(vega.parse(spec), {
          renderer:  'svg',  // renderer (canvas or svg)
          container: willRenderDiv,   // parent DOM container
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
          // view.signal('ymin',min);
          view.signal('colors',colors);

          // if(max > 0){
          //   view.signal('ymax',max);
          // }else{
          //   view.signal('ymax',140);
          // } 
          
          // view.height([curr_height]).width([curr_width]);
          view.signal("width",width);
          view.signal("height",height);
//           view.addEventListener('mouseover', (event, item) => {
//             const itemInfo = document.getElementById('item-info');
//             if (item) {
//                 // let arr = item.mark.source.value;
//                 // let content = "";
//                 // for (let i = 0; i < arr.length; i++) {
//                 //   content += JSON.stringify(arr[i].datum, null, 2) + "\n";
//                 // }
//                 // itemInfo.innerText = content;
//                 let arr = item.mark.source.value;
//                 let html = "<table><tr><th>X</th><th>Y</th><th>C</th></tr>";
//                 arr.forEach(d => {
//                   html += `<tr><td>${d.datum.x}</td><td>${d.datum.y}</td><td>${d.datum.c}</td></tr>`;
//                 });
//                 html += "</table>";
//                 itemInfo.innerHTML = html;

                
//               };
          // });

          view.runAsync();
          controlLineColor();
      }

      

    };

    function changeToScatterPlot(myData,willRenderDivId,width,height){
      let renderedDiv;
      if(willRenderDivId === "main-chart"){
        renderedDiv = "#main-chart"
      }else if(willRenderDivId === "projection-chart"){
        renderedDiv = "#projection-chart"
      }
      
      fetch('scatter_plot.json')
      .then(res => res.json())
      .then(spec => render(spec))
      .catch(err => console.error(err));

      function render(spec) {
          view = new vega.View(vega.parse(spec), {
          renderer:  'svg',  // renderer (canvas or svg)
          container: renderedDiv,   // parent DOM container
          hover:     true 
          })
          .insert("chartData", myData)
          // return view.runAfter(
          //   console.log(view.signal('xAxis'))
          // )
          let xscale = Object.keys(myData[0])[0];
          let yscale = Object.keys(myData[0])[1];
          // let str = xscale.toString();
          view.signal('xAxis',xscale);
          view.signal('yAxis',yscale);
          view.signal("width",width);
          view.signal("height",height);
          view.signal("graphSize",[height,width-30]);    //There is bug in json file, i don't know why have to set -30,
          view.runAsync();
      }
    };

    function changeToBarChart(myData,willRenderDivId,width,height){
      let renderedDiv;
      if(willRenderDivId === "main-chart"){
        renderedDiv = "#main-chart"
      }else if(willRenderDivId === "projection-chart"){
        renderedDiv = "#projection-chart"
      }
      
      
      fetch('barChart.json')
      .then(res => res.json())
      .then(spec => render(spec))
      .catch(err => console.error(err));

      function render(spec) {
          view = new vega.View(vega.parse(spec), {
          renderer:  'svg',  // renderer (canvas or svg)
          container: renderedDiv,   // parent DOM container
          hover:     true 
          })
          .insert("table", myData)
          let xscale = Object.keys(myData[0])[0];
          let yscale = Object.keys(myData[0])[1];
          view.signal('xAxis',xscale);
          view.signal('yAxis',yscale);
          // view.height([curr_height]).width([curr_width])
          
          // const tooltipHandler = new vegaTooltip.Handler().call;
          // console.log(view.tooltip(tooltipHandler));
          view.signal("width",width);
          view.signal("height",height);
          view.signal("fillColor",curr_color);

          // view.addEventListener('mouseover', (event, item) => {
          //   if (item && item.datum) {
          //     const itemInfo = document.getElementById('item-info');
          //     itemInfo.innerText = JSON.stringify(item.datum, null, 2);
          //   }
          // });
          
          view.runAsync();
          
      }

    };

    function changeToAreaChart(){
      fetch('areaChart.json')
      .then(res => res.json())
      .then(spec => render(spec))
      .catch(err => console.error(err));

      function render(spec) {
        view = new vega.View(vega.parse(spec), {
        renderer:  'svg',  // renderer (canvas or svg)
        container: '#vis',   // parent DOM container
        hover:     true 
        })
        view.signal("graphSize",[curr_height,900]);
        view.signal("height",curr_height);
        view.runAsync();
        
    }
    }
  
    function  changeToMultiLineProjection(myData,willRenderDiv){

      fetch('lineChart_two.json')
      .then(res => res.json())
      .then(spec => render(spec))
      .catch(err => console.error(err));

      function render(spec) {

          view = new vega.View(vega.parse(spec), {
          renderer:  'svg',  // renderer (canvas or svg)
          container: willRenderDiv,   // parent DOM container
          hover:     true 
          })
          .insert("chartData", myData)
          let xscale = Object.keys(myData[0])[0];
          let yscale = Object.keys(myData[0])[1];
          view.signal('xAxis',xscale);
          view.signal('yAxis',yscale);
          view.signal('colors',colors);
          view.signal("graphSize",[curr_height,curr_width]);
          view.signal("width",curr_width);
          view.signal("height",curr_height);
          
          view.runAsync();
          controlLineColor();
          
          view.addSignalListener("detailDomain", (_, domain) => {
            if(domain != null && domain.length >= 1){   //return when user selects avavilable data, at least one element
              filteredData = filterDataByXRange(curr_dataset, domain[0], domain[1]);
              console.log(filteredData);
            }
          });
      }
    }


    function updateGraph(dataset,type,color,projection){
      const myDiv = document.getElementById('main-chart');
      const projectionCharts = document.getElementById("projection-chart");
      const twoChart_resizer = document.getElementById("twoChart-resizer");
      const content = document.getElementById("content");
      curr_width = myDiv.clientWidth-30;
      curr_height = myDiv.clientHeight-30;
      console.log("updateGraph function is called, height&width=>",curr_width, curr_height);

      // if(type === "line-chart"){
      //   console.log("changeToLineChart() is called")
      //   if(Object.keys(dataset[0]).length !== 3){
      //     alert("The array format you entered cannot be converted to line chart")
      //   }else{
      //     changeToLineChart(dataset,"main-chart",curr_width,curr_height);
      //   }
      // }else if(type === "bar-chart"){
      //   console.log("changeToBarChart() is called")
      //   if(Object.keys(dataset[0]).length !== 2){
      //     alert("The array format you entered cannot be converted to Bar chart")
      //   }else{
      //     changeToBarChart(dataset);
      //   }
      // }else if(type === "multiple-line-chart"){
      //   console.log("changeToMultiLineChart() is called")
      //   if(Object.keys(dataset[0]).length !== 3){
      //     alert("The array format you entered cannot be converted to multiple line chart")
      //   }else{
      //     changeToMultiLineChart(dataset,"#main-chart",curr_width,curr_height);
      //   }
        
      // }else if(type === "area-chart"){
      //   console.log("AreaChart() is called")
      //   if(Object.keys(dataset[0]).length <= 2){
      //     alert("The array format you entered cannot be converted to multiple line chart")
      //   }else{
      //     changeToAreaChart();
      //   }
        
      // }else if(type === "multiple-line-chart-two"){
      //   console.log("multiple-line-chart-two() is called")
      //   if(Object.keys(dataset[0]).length != 3){
      //     alert("The array format you entered cannot be converted to multiple line projection chart")
      //   }else{
      //     changeToMultiLineProjection(dataset,"#main-chart");
      //   }
      // }

      if(projection){
        projectionCharts.style.display = "block";
        twoChart_resizer.style.display = "block";
        myDiv.style.height = "10%";                 //这里删除会出现无限渲染的bug
        curr_width = myDiv.clientWidth-30;
        curr_height = myDiv.clientHeight-30;
        let willRenderObj = {
          main_chart: {name:"main-chart"  , type: type, dataset: dataset},
          projection_chart: {name:"projection-chart" , type: "line-chart", dataset: dataset}
        };
        
        // graphSizeControl([myDiv,projectionCharts],{"main-chart": "line-chart", "projection-chart": "line-chart" },dataset);
        graphSizeControl(willRenderObj);
        contorlAdjacentDiv(twoChart_resizer);
      }else{
        projectionCharts.style.display = "none";
        twoChart_resizer.style.display = "none";
        let willRenderObj = {
          main_chart: {name:"main-chart"  , type: type, dataset: dataset}
        };
        graphSizeControl(willRenderObj);
      }

      if(color != ""){
        curr_color = color;
      }
      
      
    };

    //resizer between sidebar and chart
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
        const newLeftWidth = ((w + dx) * 100) / resizer.parentNode.getBoundingClientRect().width;;
        
        if ( newLeftWidth > 5 && newLeftWidth < 70) {
          sidebar.style.width = `${newLeftWidth}%`;
        }
      }

  
      function rs_mouseupHandler() {
        // remove event mousemove && mouseup
        document.removeEventListener("mouseup", rs_mouseupHandler);
        document.removeEventListener("mousemove", rs_mousemoveHandler);
      }
  
      

      resizer.addEventListener("mousedown", rs_mousedownHandler);

    };
    initResizerFn( resizer, sidebar , content);           
    

    //resizer in sidebar
    function contorlSizeOfInputField(inputfield,editor,handle){

      handle.addEventListener('mousedown', function(e) {
        startY = e.clientY;
        startHeight = parseInt(getComputedStyle(inputfield).height);
        document.addEventListener('mousemove', handleResize);
        document.addEventListener('mouseup', stopResize);
      });
      function handleResize(e) {
        var diffY = e.clientY - startY;
        var newHeight = startHeight + diffY;
        if(newHeight < 500){      // set the sidebar maximum height of inpout field to 500
          editor.style.height = (newHeight) + 'px'; // adjust for padding/margin
          inputfield.style.height = newHeight + 'px';
        }
      }
      function stopResize() {
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', stopResize);
      }

    }
    contorlSizeOfInputField(inputfield,editor,handle);    


     //general resizer function, only available use when user resize "height"
    function contorlAdjacentDiv(resizer){
      const prevSibling = resizer.previousElementSibling;
      const nextSibling = resizer.nextElementSibling;
      resizer.addEventListener('mousedown', function(e) {
        x = e.clientX;
        y = e.clientY;
        prevSiblingHeight = prevSibling.getBoundingClientRect().height;
        console.log(prevSiblingHeight);
        document.addEventListener('mousemove', handleResize);
        document.addEventListener('mouseup', stopResize);
      });
      function handleResize(e) {
        resizer.style.cursor = 'col-resize';
        document.body.style.cursor = 'col-resize';
        prevSibling.style.userSelect = 'none';
        prevSibling.style.pointerEvents = 'none';
        nextSibling.style.userSelect = 'none';
        nextSibling.style.pointerEvents = 'none';

        const dx = e.clientX - x;
        const dy = e.clientY - y;
        const newPrevSiblingHeight = ((prevSiblingHeight + dy) * 100) / resizer.parentNode.getBoundingClientRect().height;
        if(newPrevSiblingHeight > 3 && newPrevSiblingHeight < 97){
          prevSibling.style.height = `${newPrevSiblingHeight}%`;
        }
      }
      function stopResize() {
        resizer.style.removeProperty('cursor');
        document.body.style.removeProperty('cursor');
        prevSibling.style.removeProperty('user-select');
        prevSibling.style.removeProperty('pointer-events');
        nextSibling.style.removeProperty('user-select');
        nextSibling.style.removeProperty('pointer-events');
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', stopResize);
      }
    }

    // if(curr_projection){
    //   contorlAdjacentDiv(twoChart_resizer);  
    //   graphSizeControl(document.getElementById("main-chart"));
    // }      

    
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

  curr_dataset = data;
  const type = formData.get('chart-type');
  curr_type = type;
  const min = formData.get('domain-min');
  const max = formData.get('domain-max');
  // const color = formData.get('color-input');
  const stroke = formData.get('stroke-input');
  curr_strokeWidth = stroke;
  const color = formData.get("bar-chart-color");
  const projection = formData.get("project");
  curr_projection = Boolean(projection);
  console.log("submit",curr_projection);
  updateGraph(data,type,color,curr_projection);
  // Reset the form
});





const chartTypeSelect = document.getElementById('chart-type');
const colorSelect = document.getElementById('color-change');
const stepSelect = document.getElementById('step-change');
const lineChartColorSelect = document.getElementById('linechart-control-color');

chartTypeSelect.addEventListener('change', function() {
  const selectedOptionValue = this.value;
  
  if (selectedOptionValue === 'bar-chart') {
    colorSelect.style.display = "block";
    stepSelect.style.display = "none";
    lineChartColorSelect.style.display = "none";
  }else if (selectedOptionValue === 'line-chart') {
    colorSelect.style.display = "none";
    stepSelect.style.display = "block";
    lineChartColorSelect.style.display = "none";
  }
   else if(selectedOptionValue === 'multiple-line-chart' || selectedOptionValue === 'multiple-line-chart-two'){
   colorSelect.style.display = "none";
   stepSelect.style.display = "none";
   lineChartColorSelect.style.display = "block";
   }
   else{
    colorSelect.style.display = "none";
    stepSelect.style.display = "none";
  }
});


// set barchart color----------------------------------------------------------------------------
const color_box_div = document.getElementById('color-box');
const color_box_div_colorPicker = document.getElementById('colorPicker-barchart');
// Add a change event listener to the colorPicker element
color_box_div_colorPicker.addEventListener('change', () => {
  // Get the current value of the colorPicker element
  const color = color_box_div_colorPicker.value;
  color_box_div.style.backgroundColor = color;
});

// Add a click event listener to the div
color_box_div.addEventListener('click', () => {
  color_box_div_colorPicker.click();
});
// set barchart color-------------------------------------------------------------------------------







