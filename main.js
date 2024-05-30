const selectElement = document.querySelector('#chart-type');
const selectedNameElement = document.querySelector('#selected-chart-type');
const resizer = document.querySelector(".resizer"), sidebar = document.querySelector(".sidebar");
const handle = document.querySelector('.ui-resizable-s');
const inputfield = document.querySelector('#ember29');
const editor = document.querySelector('.ace-editor-container textarea');
const content = document.querySelector('.content');
const twoChart_resizer = document.querySelector('.twoChart-resizer');


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
let curr_color = "#325296";
let curr_dataset = null;
let view = null;
let curr_strokeWidth = 3;
let curr_projection = false;


const divObservers = {};


    function debounce(func, wait) {
      let timeout;
      return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
      };
    }
    
    /**
     * This function takes an object as an parameter and parses it to get the necessary parameters such as size and input data, 
     * which are then passed to the appropriate rendering functions such as changeToLineChart() or changeToScatterPlot(). 
     * The function also uses the Observer API to monitor whether the size of the div elements in which the charts are rendered changes. 
     * If a change is detected, the function will re-render the charts with the updated size.
     * 
     * @param {object} willRenderObj Parameter format{ main_chart: {name:"main-chart",type: bar-chart, dataset: []}
        }
     */
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
            for (const entry of entries){
              if (entry.contentBoxSize){
                // const entry = entries[0];
                const type = obj.type;

                  var width = div.clientWidth -30 ;
                  var height = div.clientHeight;
                  console.log("Dectet size change:");
                  if (type === "bar-chart") {
                    changeToBarChart(obj.dataset, div.id, width, height);
                    console.log("changeToBarChart---size controal",width);
                  } else if (type === "line-chart") {
                    changeToLineChart(obj.dataset, div.id , width, height);
                    console.log("changeToLineChart -- size control",width,"height:",height);
                  }else if (type === "scatter-plot-detailView") {
                    changeToScatterPlot(obj.dataset, div.id , width, height);
                    console.log("changeToScatterPlot -- size control",width,height);
                  }else if (type === "line-chart-detailView") {
                    changeToLineChart_Detail_View(obj.dataset, div.id , width, height);
                    console.log("changeToLineChart_Detail_View -- size control",width);
                  }
              }
            }
            
            
          }
          ,100)
          );
          divObservers[div.id] = resizeObserver;
          resizeObserver.observe(div,{ box : 'border-box' });
      });
    }

    /**
     * This function is responsible for creating a color control panel for the line chart. 
     * It determines the number of datasets to be displayed on the chart and creates a corresponding color control for each one.
     * Users can click on the colored circles to open a color picker to change the color of each line. 
     * This function gets called when a line chart is rendered.
     */
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

    /**
     * This function is responsible for creating a color control panel for the bar chart. 
     * It creates a color picker element and sets up an event listener for it. 
     * When the user clicks on the color box, the color picker opens, allowing the user to select a color for the bar chart. 
     * This function gets called when a bar chart is rendered.
     */
    function controlBarChartColor(){
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
    }

    /**
     * This function is used to render line charts controlled by the two Vega View APIs.
     * They parse the data passed to them and use Vega chart specifications defined in JSON files fetched using the Fetch API, 
     * and it also sets various values for the charts such as axis labels, colors, stroke widths, and chart size.
     * 
     * @param {object} myData User's input data
     * @param {string} willRenderDivId The ID of the DOM element where the chart will be rendered.
     * @param {number} width Viewable width of an element in pixels, including padding, but not the border, scrollbar or margin.
     * @param {number} height Viewable height of an element in pixels, including padding, but not the border, scrollbar or margin.
     */
    function changeToLineChart(myData,willRenderDivId,width,height){
      let renderedDiv;
      if(willRenderDivId === "main-chart"){
        renderedDiv = "#main-chart"
      }else if(willRenderDivId === "projection-chart"){
        renderedDiv = "#projection-chart"
      }
      
      
      fetch('./JSON/lineChart.json')
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
          let xscale = Object.keys(myData[0])[0];
          let yscale = Object.keys(myData[0])[1];
          // let str = xscale.toString();
          view.signal('xAxis',xscale);
          view.signal('yAxis',yscale);
          view.signal("width",width);
          view.signal("height",height);
          view.signal("graphSize",[height-30,width-35]);    //There is bug in json file, i don't why have to set -30,
          view.signal("strokeWidth",curr_strokeWidth);
          view.signal("colors",colors);
          view.runAsync();

          if(willRenderDivId === "main-chart" &&  curr_projection){
            let existedFilteredData = [];
            view.addSignalListener("detailDomain", (_, domain) => {
              if(domain != null && domain.length >= 1){   //return when user selects avavilable data, at least one element
                filteredData = filterDataByRange(myData, domain[0], domain[1]);
                if(filteredData !== null && filteredData.length >= 1 && !arraysAreEqual(existedFilteredData,filteredData)){
                  existedFilteredData = filteredData;
                  // graphSizeControl([myDiv,projectionCharts],{"main-chart": "line-chart", "projection-chart": "line-chart" },dataset);
                  let willRenderObj = {
                    projection_chart: {name:"projection-chart" , type: "line-chart", dataset: filteredData}
                  };
                  graphSizeControl(willRenderObj);
                  console.log(filteredData);
                }
              }
            });
          }
          
      }

      

    };

    /**
     * This function is used to render scatter plot using the Vega view API. 
     * They parse the data passed to them and use Vega chart specifications defined in JSON files fetched using the Fetch API, 
     * and it also sets various values for the charts such as axis labels, colors, stroke widths, and chart size.
     * 
     * @param {object} myData User's input data
     * @param {string} willRenderDivId The ID of the DOM element where the chart will be rendered.
     * @param {number} width Viewable width of an element in pixels, including padding, but not the border, scrollbar or margin.
     * @param {number} height Viewable height of an element in pixels, including padding, but not the border, scrollbar or margin.
     */
    function changeToScatterPlot(myData,willRenderDivId,width,height){
      let renderedDiv;
      if(willRenderDivId === "main-chart"){
        renderedDiv = "#main-chart"
      }else if(willRenderDivId === "projection-chart"){
        renderedDiv = "#projection-chart"
      }
      
      fetch('./JSON/scatter_plot.json')
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
          view.signal("graphSize",[height,width-80]);    //There is bug in json file, i don't know why have to set -30,
          view.signal("classification","c");
          view.runAsync();

          if(willRenderDivId === "main-chart" &&  !curr_projection){// if there is only one chart show up in screen
            let existedFilteredData = [];     //Avoid rendering duplicate content.
            view.addSignalListener("detailDomainXY", (_, domain) => {
              if(domain[0] != null && domain[1] != null){   //when user selects a region with included data, 
                let filteredData = filterDataByTwoRanges(myData, domain[0], domain[1]);
                if(filteredData !== null && filteredData.length >= 1 && !arraysAreEqual(existedFilteredData,filteredData)){
                  existedFilteredData = filteredData;
                  console.log(filteredData);
                }
              }
            });
          }
      }
    };

    /**
     * This function is used to render bar charts using the Vega view API. 
     * They parse the data passed to them and use Vega chart specifications defined in JSON files fetched using the Fetch API, 
     * and it also sets various values for the charts such as axis labels, colors, stroke widths, and chart size.
     * 
     * @param {object} myData User's input data
     * @param {string} willRenderDivId The ID of the DOM element where the chart will be rendered.
     * @param {number} width Viewable width of an element in pixels, including padding, but not the border, scrollbar or margin.
     * @param {number} height Viewable height of an element in pixels, including padding, but not the border, scrollbar or margin.
     */
    function changeToBarChart(myData,willRenderDivId,width,height){
      let renderedDiv;
      if(willRenderDivId === "main-chart"){
        renderedDiv = "#main-chart"
      }else if(willRenderDivId === "projection-chart"){
        renderedDiv = "#projection-chart"
      }
      
      
      fetch('./JSON/barChart.json')
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
          view.signal("width",width);
          view.signal("height",height-20);
          view.signal("fillColor",curr_color);
          view.runAsync();
          controlBarChartColor()
      }

    };
  
    /**
     * This function is used to render line charts using the Vega view API. 
     * They parse the data passed to them and use Vega chart specifications defined in JSON files fetched using the Fetch API, 
     * and it also sets various values for the charts such as axis labels, colors, stroke widths, and chart size.
     * 
     * @param {object} myData User's input data
     * @param {string} willRenderDivId The ID of the DOM element where the chart will be rendered.
     * @param {number} width Viewable width of an element in pixels, including padding, but not the border, scrollbar or margin.
     * @param {number} height Viewable height of an element in pixels, including padding, but not the border, scrollbar or margin.
     */
    function changeToLineChart_Detail_View(myData,willRenderDivId,width,height){
      let renderedDiv;
      if(willRenderDivId === "main-chart"){
        renderedDiv = "#main-chart"
      }else if(willRenderDivId === "projection-chart"){
        renderedDiv = "#projection-chart"
      }

      fetch('./JSON/lineChart_two.json')
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
          let xscale = Object.keys(myData[0])[0];
          let yscale = Object.keys(myData[0])[1];
          view.signal('xAxis',xscale);
          view.signal('yAxis',yscale);
          view.signal('colors',colors);
          view.signal("graphSize",[height,width-30]);
          view.signal("width",width);
          view.signal("height",height);
          view.signal("strokeWidth",curr_strokeWidth);
          view.runAsync();
          controlLineColor();
          
          let existedFilteredData = []; 
          view.addSignalListener("detailDomain", (_, domain) => {
            if(domain != null && domain.length >= 1){   //return when user selects avavilable data
              filteredData = filterDataByRange(myData, domain[0], domain[1]);
              if(filteredData !== null && filteredData.length >= 1 && !arraysAreEqual(existedFilteredData,filteredData)){
                existedFilteredData = filteredData;
                console.log(filteredData);
              }
            }
          });

          console.log(view);
      }
    }

    /**
     * This function is responsible for retrieving the user's input data and preferences from the form, parsing the input data, 
     * and updating the current dataset and visualization options accordingly. 
     * It then creates an object that encapsulates the relevant information, including the selected chart type, input data, 
     * and the div element where the chart will be rendered. Finally, this object is passed as an argument to the graphSizeControl() function,
     * which calculates the appropriate dimensions for the chart and uses them to render the chart.
      *
      * @param {Object[]} dataset - The dataset for the chart.
      * @param {string} type - The type of the chart.
      * @param {string} color - The color to use for the chart.
      * @param {boolean} projection - Flag indicating whether a projection chart is needed.
      *
     */
    function updateGraph(dataset,type,color,projection){
      const myDiv = document.getElementById('main-chart');
      const projectionCharts = document.getElementById("projection-chart");
      const twoChart_resizer = document.getElementById("twoChart-resizer");
      const content = document.getElementById("content");
      console.log("updateGraph function is called");

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
        let willRenderObj = {
          main_chart: {name:"main-chart"  , type: type, dataset: dataset},
          projection_chart: {name:"projection-chart" , type: "line-chart", dataset: dataset}
        };
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

/**
 * Initializes a function to handle the resizing of a sidebar and content area with a draggable resizer.
 * This function has internal handlers for mousedown, mousemove, and mouseup events to control the resizing process.
 * 
 * The mousedown handler tracks the initial mouse position and sets up event listeners for mouse movement and release.
 * The mousemove handler adjusts the sidebar width based on the change in mouse position.
 * The mouseup handler removes event listeners for mouse movement and release once the resizing action is done.
 *
 * @param {HTMLElement} resizer - The HTML element used as a handle to resize the sidebar and content area.
 * @param {HTMLElement} sidebar - The HTML element representing the sidebar, which will be resized.
 * @param {HTMLElement} content - The HTML element representing the content area, which will be resized indirectly.
 *
 * @function
 * @name initResizerFn
 */
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
    

  /**
   * Controls the size of an input field based on mouse movement.
   *
   * This function adds event listeners to a specified handle element to allow resizing of an input field.
   * The 'mousedown' event on the handle initiates the resizing process, activating 'mousemove' and 'mouseup' events.
   * The 'mousemove' event dynamically adjusts the input field's height based on the cursor's vertical displacement.
   * The 'mouseup' event finalizes the resizing and removes the 'mousemove' and 'mouseup' event listeners.
   * The maximum height of the input field is capped at 500 pixels.
   *
   * @param {HTMLElement} inputfield - The HTML element representing the input field to be resized.
   * @param {HTMLElement} editor - The HTML element representing the editor area, which will be resized along with the input field.
   * @param {HTMLElement} handle - The HTML element used as a handle to resize the input field and editor area.
   *
   * @function
   * @name controlSizeOfInputField
   */
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

/**
 * Sets up an event listener for a form submission.
 * Prevents the default form submission action and extracts the form data.
 * The data is then processed and used to update a graph.
 * Alerts the user if the input format is invalid.
 * 
 * @listens submit - The event that triggers the function.
 * @event 
 *
 * @param {Event} event - The submit event object.
 * @returns {undefined}
 *
 * @throws {SyntaxError} If JSON.parse fails to parse the input data.
 *
 * @property {FormData} formData - The form's data, extracted using the FormData interface.
 * @property {Array} data - The parsed input data, expected to be an array of objects.
 * @property {string} type - The type of chart to be generated.
 * @property {string} stroke - The stroke input from the form.
 * @property {string} color - The color input for the bar chart from the form.
 * @property {boolean} projection - The projection status, converted to boolean.
 */
const datasetString = `[
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
]`;
document.getElementById('ember30').value = datasetString;
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
  // const min = formData.get('domain-min');
  // const max = formData.get('domain-max');
  // const color = formData.get('color-input');
  const stroke = formData.get('stroke-input');
  curr_strokeWidth = stroke;
  const color = formData.get("bar-chart-color");
  const projection = formData.get("project");
  curr_projection = Boolean(projection);
  console.log("submit",curr_projection);
  updateGraph(data,type,color,curr_projection);
  
});


/**
 * Sets up a 'change' event listener for a chart type selector.
 *
 * When the chart type selector's value changes, this listener checks the new value and adjusts
 * the display properties of the bar chart color selector, step selector, and line chart color selector.
 * Different chart types require different selectors to be visible.
 *
 * @listens change - The event that triggers the function.
 * @event
 *
 * @property {HTMLElement} chartTypeSelect - The HTML select element for choosing the chart type.
 * @property {HTMLElement} colorSelect - The HTML element representing the barchart color selector, which is shown or hidden based on the chart type.
 * @property {HTMLElement} stepSelect - The HTML element representing the step selector, which is shown or hidden based on the chart type.
 * @property {HTMLElement} lineChartColorSelect - The HTML element representing the line chart color selector, which is shown or hidden based on the chart type.
 */
const chartTypeSelect = document.getElementById('chart-type');
const colorSelect = document.getElementById('color-change');
const stepSelect = document.getElementById('step-change');
const lineChartColorSelect = document.getElementById('linechart-control-color');

chartTypeSelect.addEventListener('change', function() {
  const selectedOptionValue = this.value;
  
  if (selectedOptionValue === 'bar-chart') {
    colorSelect.style.display = "block";      // color seletor for barchart
    stepSelect.style.display = "none";        // line width for linechart
    lineChartColorSelect.style.display = "none";    // color seletor for linechart
  }else if (selectedOptionValue === 'line-chart' || selectedOptionValue === 'line-chart-detailView') {
    colorSelect.style.display = "none";
    stepSelect.style.display = "block";
    lineChartColorSelect.style.display = "block";
  }else if(selectedOptionValue === 'scatter-plot-detailView'){
    colorSelect.style.display = "none";
    stepSelect.style.display = "none";
    lineChartColorSelect.style.display = "none";
  }else{
    colorSelect.style.display = "none";
    colorSelect.style.display = "none";
    stepSelect.style.display = "none";
  }
});









