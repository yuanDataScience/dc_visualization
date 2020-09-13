//import * as d3 from 'd3';
//import d3Tip from 'd3-tip';
//import crossfilter from 'crossfilter2';
//import * as dc from 'dc';

function print_filter(filter) {
    var f=eval(filter);
    if (typeof(f.length) != "undefined") {}else{}
    if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
    if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
    console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
}

//let numericBarChart = new dc.BarChart('#numbericBarChart');

const data = [
    {date: "2011-11-14T16:17:54Z", quantity: 2, total: 190, tip: 100, type: "tab"},
    {date: "2011-11-14T16:20:19Z", quantity: 2, total: 190, tip: 100, type: "tab"},
    {date: "2011-11-14T16:28:54Z", quantity: 1, total: 300, tip: 200, type: "visa"},
    {date: "2011-11-14T16:30:43Z", quantity: 2, total: 90, tip: 0, type: "tab"},
    {date: "2011-11-14T16:48:46Z", quantity: 2, total: 90, tip: 0, type: "tab"},
    {date: "2011-11-14T16:53:41Z", quantity: 2, total: 90, tip: 0, type: "tab"},
    {date: "2011-11-14T16:54:06Z", quantity: 1, total: 100, tip: 0, type: "cash"},
    {date: "2011-11-14T16:58:03Z", quantity: 2, total: 90, tip: 0, type: "tab"},
    {date: "2011-11-14T17:07:21Z", quantity: 2, total: 90, tip: 0, type: "tab"},
    {date: "2011-11-14T17:22:59Z", quantity: 2, total: 90, tip: 0, type: "tab"},
    {date: "2011-11-14T17:25:45Z", quantity: 2, total: 200, tip: 0, type: "cash"},
    {date: "2011-11-14T17:29:52Z", quantity: 1, total: 200, tip: 100, type: "visa"}
    ];

data.forEach( d => {
    d.date = new Date(d.date);

})

console.log("data", data);

const payments = crossfilter(data);

//process data for date column


// facts.groupAll() functions and print values by console.log
// console.log("groupAll().value()",payments.groupAll().value());
// console.log("groupAll().reduceCount().value()",payments.groupAll().reduceCount().value());
// console.log("size", payments.size());
// console.log("reduceSumtip", payments.groupAll().reduceSum(d => d.tip).value());

//console.log doesn't work on facts (payments)
console.log("payments", payments);

//use print_filter

//print_filter works for facts (payments)
console.log("facts(payments) using print_filter: ...");
print_filter('payments');

//print_filter doesn't work for groupAll() and groupAll().value()
console.log("groupAll().value() using print_filter: ...");
print_filter('payments.groupAll().value()');


// dimensions

//print dimension using print_filter, which show all the records ordered by dimension in descending order 
let typeDimension = payments.dimension( d => d.type);
// console.log("type dimension by print_filter: ...");
// print_filter("typeDimension");

//print the dimension.top() using console.log, which shows the descending order of typeDimension
//console.log("typeDimesion.top(3)",typeDimension.top(3));

//print the dimension.bottom() using console.log, which shows the ascending order of typeDimension
//console.log("typeDimesion.bottom(3)",typeDimension.bottom(3));

//print the dimension.top(Infinity)[1] using console.log, which shows the 2nd descending order of typeDimension
//console.log("typeDimesion.top(Infinity)",typeDimension.top(Infinity)[1]);

let scatterDimension = payments.dimension( d => [d.total, d.tip]);
// console.log("scatter dimension: ...");
// print_filter("scatterDimension");


//dimension.group()
// console.log("print typeDimension.group() by print_filter");
// print_filter("typeDimension.group()");



typeDimension.group().top(2);
//typeDimension.group().bottom(2);


//group operations
let typeGroup = typeDimension.group();
// console.log("typeGroup.all() by console.log", typeGroup.all());
// console.log("typeDimension.groupAll().Value", typeDimension.groupAll().value());

//dimension.group().top(2)
print_filter("typeGroup.top(Infinity)");
// console.log("typeGroup.top(Infinity) by console.log",typeGroup.top(Infinity));
// console.log(typeDimension.group().size());

let dateDimension = payments.dimension( d => d.date);
let dateGroup = dateDimension.group().reduceSum( d => d.total);

let hourGroup = dateDimension.group( d => d.getHours());
// console.log(hourGroup.all());
// console.log(hourGroup.top(Infinity));
// console.log(typeDimension.group().bottom(1));

//dateDimension.groupAll()
print_filter("dateDimension.group()");
console.log(dateDimension.group().all());


dc.config.defaultColors(d3.schemeCategory10);

const barChart = new dc.BarChart("#barChart");
barChart
  .width(1360)
  .height(300)
  //.margins({top:0, bottom:0, left:0, right:0})
  .dimension(typeDimension)
  .group(typeGroup)
  .x(d3.scaleBand().domain(['cash','tab','visa']))
  .xUnits(dc.units.ordinal)
  //.gap(10)
  .barPadding(0.2)
  .outerPadding(0.2)
  .yAxisLabel("number of clients")
  .yAxis().ticks(4)
  
  ;

// barchart with numeric values on x axis
const totalDimension = payments.dimension( d => d.total);
const totalGroup = totalDimension.group( d => Math.floor(d/100)*100);

//print_filter(totalGroup);

/************************************************************************ */
/* 1. centerBar is not automatic in scaleLinear, unlike scaleBand
   2. use fp.precision to cover the entire 100 unit for bars 
   3. should use new dc.BarChart(parent) to create new chart instance
   4  use chart.yAxis().ticks(5) to set the ticks and avoid errors
************  ***************************************************          */


const numericBarChart = new dc.BarChart("#numericBarChart");
numericBarChart
  .width(1360).height(200)
  .dimension(totalDimension)
  .group(totalGroup)
  .x(d3.scaleLinear().domain([0,400]))
  //.centerBar(true)
  .xUnits(dc.units.fp.precision(100))
  .yAxisLabel("number of clients")
  .xAxisLabel("total amount")

numericBarChart.yAxis().ticks(5);
numericBarChart.xAxis().ticks(4); 

/*******************************************************************************
 * 1. lineChart plots the total vs. date on dateDimension
 * 2. render horizontal grid lines
 * 3. render area
 **************************************************************************** */

const lineChart = new dc.LineChart("#lineChart");
lineChart
    .width(1360).height(200)
    .dimension(dateDimension)
    .group(dateGroup)
    .x(d3.scaleTime().domain(d3.extent(data.map(d => d.date))))
    .yAxisLabel("transaction")
    .renderHorizontalGridLines(true)
    .renderArea(true);

lineChart.xAxis().ticks(4);
lineChart.yAxis().ticks(5);


/*******************************************************************************
 * 1. stacked lineCharts of total and tip
 * 2. the baseline is defined by group function
 * 3. the stacked line is defined by stack function
 * 4. the labels of dc.legend() are defined by group and stack label
 ******************************************************************************/

const dateGroupTotal = dateDimension.group().reduceSum(d => d.total);
const dateGroupTip = dateDimension.group().reduceSum( d=> d.tip);
const stackedChart = new dc.LineChart("#stackedChart")
stackedChart
    .width(1360).height(200)
    .dimension(dateDimension)
    .margins({top:10, bottom:30, right:10, left:20})
    .group(dateGroupTotal,"total spend")
    .stack(dateGroupTip, "tip")
    .yAxisLabel("transction spend")
    .renderHorizontalGridLines(true)
    .renderArea(true)
    .x(d3.scaleTime().domain(d3.extent(data.map(d => d.date))))
    .legend(dc.legend().x(1200).y(5).itemHeight(12).gap(5));


/**********************************************************************************
 * 1. create dateDimension, and group of d.total on this dimension
 * 2. x dimension defined by dateDimension, y by group
 * 3. label and title, d is transferred as key, value pairs
 *********************************************************************************/

const pieChart = new dc.PieChart("#pieChart");   
pieChart
    .width(400).height(400)
    .dimension(dateDimension)
    .group(dateGroupTotal)
    .label(d => `${d.key.getDay()} ${d.key.getHours()}`)
    .title( d => `${d.key} $ ${d.value}`);

/************************************************************************************
 * 1. scatterPlot defines the x and y axis in dimension 
 * 2. group() is the row count
 * 3. x, y are the dimension[0] and dimension[1] (d.key)
 * 4. colorAccessor is the d.value
 * 5. symbol using d3.symbolCross or othe symbols
 * 6. filter in filterPrinter refers to the x, y coordinates of the clicked area
 *    the two points are filter[0][0] and filter[0][1]
 **************************************************************************************/

const scatterDim = payments.dimension(d => [d.total, d.tip]);
const scatterGroup = scatterDim.group();

const scatterPlot = new dc.ScatterPlot("#scatterPlot");
scatterPlot
    .width(1360).height(200)
    .dimension(scatterDim)
    .group(scatterGroup)
    .x(d3.scaleLinear().domain(d3.extent(data.map( d => d.total))))
    .symbolSize(20)
    .clipPadding(70)
    .colorAccessor( d => d.value)
    .symbol(d3.symbolCross)
    .yAxisLabel("Tip Size")
    .excludedColor('grey')
    .excludedSize(20)
    .excludedOpacity(.2)
    .filterPrinter(filter => { let rs = `[${Math.round(filter[0][0][0],0)},${Math.round(filter[0][0][1],0)}]->[${Math.round(filter[0][1][0],0)},${Math.round(filter[0][1][1],0)}]`;
        return rs;
        }
        )
    ;
 

/************************************************************************************************
 * 1. scatterDimension is a two element array, the same as scatter plot for bubble plot
 * 2. colorAccessor is d.value (d.key and d.value)
 * 3. r(), x(), y() defines the scales
 * 4. keyAccessor(), valueAccessor() and radiusValueAccessor() defines x, y and size of bubbles
 * 5. title is the tooltip. variable transferred are d.key and d.value
 * 6. maxBubbleRelativeSize defines the max bubble size
 * 7. render horizontal and vertical grid lines
 **************************************************************************************************/

const bubbleChart = new dc.BubbleChart("#bubbleChart");
bubbleChart
    .width(1360).height(500)
    .dimension(scatterDim)
    .group(scatterGroup)
    .clipPadding(30)
    .colorAccessor( d => d.value)
    .colors(d3.schemeCategory10)
    .colorDomain([0,7])
    .r(d3.scaleLinear().domain([1,6]))
    .y(d3.scaleLinear().domain([0,200]))
    .x(d3.scaleLinear().domain([0,300]))
    .keyAccessor( d => d.key[0])
    .valueAccessor( d => d.key[1])
    .radiusValueAccessor(d => d.value)
    .title( d => `x: ${d.key[0]} y: ${d.key[1]} value: ${d.value}`)
    .maxBubbleRelativeSize(0.02)
    .yAxisLabel("Tip Size")
    .renderHorizontalGridLines(true)
    .renderVerticalGridLines(true);


// datatable
/*********************************************************************** 
//do not have to use a unique key. Can use any dimension.
//in datatable, group is different from the group in CF. Here group is
//used to group the records in the table
**********************************************************************/    

const dataTable = new dc.DataTable("#dataTable")
dataTable
    .width(1360).height(300)
    //.dimension(dateDimension)
     .section(d => d.type)
    .dimension(typeDimension)
    //.columns(['date','quantity','total','tip','type'])
    .columns([{label:'time', format: d=>d.date.getHours()},'quantity','total','tip','type'])
    .on("renderlet", dataTable => dataTable.selectAll('.dc-table-group').classed('table-info',true))
    //.size(5)
    .sortBy(d => d.type)
    .order(d3.ascending)
    .on('preRender', update_offset)
    .on('preRedraw', update_offset)
    .on('pretransition', display);
    ;

let ofs = 0;
let pag = 10;

function update_offset() {
    let totFilteredRecs = payments.groupAll().value();
    let end = ofs + pag > totFilteredRecs ? totFilteredRecs : ofs + pag;
    ofs = ofs >= totFilteredRecs ? Math.floor((totFilteredRecs - 1) / pag) * pag : ofs;
    ofs = ofs < 0 ? 0 : ofs;

    dataTable.beginSlice(ofs);
    dataTable.endSlice(ofs+pag);
      
}
      
function display() {
    let totFilteredRecs = payments.groupAll().value();
    let end = ofs + pag > totFilteredRecs ? totFilteredRecs : ofs + pag;
    d3.select('#begin')
      .text(end === 0? ofs : ofs + 1);
    d3.select('#end')
      .text(end);
    d3.select('#last')
      .attr('disabled', ofs-pag<0 ? 'true' : null);
    d3.select('#next')
      .attr('disabled', ofs+pag>=totFilteredRecs ? 'true' : null);
    d3.select('#size').text(totFilteredRecs);
    if(totFilteredRecs != payments.size()){
        d3.select('#totalsize').text("(filtered Total: " + payments.size() + " )");
          
    }else{
        d3.select('#totalsize').text('');
          }
      
}

function next(){
    ofs += pag;
    update_offset();
    dataTable.redraw();}


      
function last(){
    ofs -= pag;
    update_offset();
    dataTable.redraw();
}
 

   
//stackedBarChart
/*************************************************************************************
 * 1.     typeDiemsion is the x axis that all staked y values share 
 * 2.     define the group by reduce(). reduceInitial returns i = {} 
 * 2.1.   reduceAdd adds the record values to i[property] 
 * 2.2.   reduceRemove removes the record values from i[property]
 * 3.     define x axis using dimension, and stacked y values using
 *        group/stack(groupName, label name, and which value will be used)
 * 4.     define scales
 * 5.     define legend. The dc.legend automatically matches group label to the color
 ***************************************************************************************/

const typeGroupQuantity = typeDimension.group().reduce(
    (i, d) => {i[d.quantity]=(i[d.quantity]||0)+d.total; return i;}, //reduceAdd
    (i, d) => {i[d.quantity]=(i[d.quantity]||0)-d.total; return i;}, //reduceRemove
    ()=>{ return {}; } //reduceInitial  
    );
const stackedBarChart = new dc.BarChart("#stackedBarChart");
stackedBarChart
    .width(1360).height(300)
    .dimension(typeDimension)
    .group(typeGroupQuantity, "group 1", d => d.value[1]||0)
    .stack(typeGroupQuantity, "group 2", d => d.value[2]||0)
    .x(d3.scaleBand().domain(['cash','tab','visa']))
    .xUnits(dc.units.ordinal)
    .legend(dc.legend().x(1100).y(10).itemHeight(12).gap(5))
    ;


/****************************************************************************************
 * 1. rangeChart and parentChart share the same dimension as x axis
 * 2. row count is used the y value of the range chart
 * 3. the x scale is defined for both range and parent charts
 * 4. turn off the brush by brushOn(false) of parent chart
 * 5. integrate range chart by .rangeChart(volChart)
 * 6. define the stacked y values by group() and stack() with the groups defined
 * 7. legend defines the group() and stack() values
 *****************************************************************************************/

const volGroup = dateDimension.group()
const volChart = new dc.BarChart("#rangeChart");
volChart
    .width(1360).height(70)
    .margins({top:10, bottom:30, right:10, left:50})
    .dimension(dateDimension)
    .group(volGroup)
    .x(d3.scaleTime().domain(d3.extent(data.map( d => d.date))))

volChart.xAxis().ticks(4);
volChart.yAxis().ticks(0);
const parentChart = new dc.LineChart("#parentChart");
parentChart
    .width(1360).height(200)
    .brushOn(false)
    .rangeChart(volChart)
    .dimension(dateDimension)
    .margins({top:10, bottom:30, right:10, left:40})
    .group(dateGroupTotal,"total spend")
    .stack(dateGroupTip, "tip")
    .yAxisLabel("transction spend")
    .renderHorizontalGridLines(true)
    .renderArea(true)
    .x(d3.scaleTime().domain(d3.extent(data.map(d => d.date))))
    .legend(dc.legend().x(1200).y(5).itemHeight(12).gap(5));
  
  ;

  /******************************************************************************************
   * 1. numberDisplay display the total of a property of all the selected records
   * 2. numberDIsplay dosn't have dimesion, only a total property, which transferred by group()
   * 3. only has a valueAccessor that defines the values to be shown
   ******************************************************************************************/

  const totalNumberGroup = payments.groupAll().reduceSum(d => d.total);
  const numberDisplay = new dc.NumberDisplay("#number-display");
  numberDisplay.group(totalNumberGroup).valueAccessor(d => d);


  //define variables used in the plot function for asynchronous requests
  
 
  const compChart = new dc.CompositeChart("#compChart");


  /*********************************************************************************************
   * 1. dataCount shows how many rows are selected from the total number of rows
   * 2. crossfilter function accepsts the crossfilter obj
   * 3. groupAll accepts the total row count (payments.groupAll().reduceCount())
   * 4. the filter-count and total-count are hardcoded in html files and automatically updated by dc
   **********************************************************************************************/
  const dataCount = new dc.DataCount(".dc-data-count");
  const all = payments.groupAll();
  dataCount.crossfilter(payments).groupAll(all)
    .html({
        some: '<strong>%filter-count</strong> selected out of <strong>%total-count</strong> records|<a href="javascript:dc.filterAll();dc.renderAll();">Reset All</a>',
        all: 'All records selected. Please click on the graph to apply filters'
    })
  const boxPlot = new dc.BoxPlot("#boxPlot");
  const seriesChart = new dc.SeriesChart("#seriesChart");


plot();


async function plot(){
    try{

    //boxplot
    /*********************************************************************
     * first, define the dimension (x axis) of the data
     * second, define the group by pushing and splicing records to the i array
     *  *********************************************************************/    

    const experiments = await d3.csv("../data/morley.csv"); 
    experiments.forEach( d => {
        d.Speed = +d.Speed;
        d.Run =+d.Run;
           }) 
    const facts = crossfilter(experiments);
    //print_filter(facts);
    
    const experimentDimension = facts.dimension( d => `Expt ${d.Expt}`);
    const speedArrayGroup = experimentDimension.group().reduce(
        (i, d) => {i.push(d.Speed); return i;},
        (i,d) => {i.splice(i.indexOf(d.Speed),1); return i;},
        () => {return [];}
    );

    
    boxPlot
        .width(1360).height(300)
        .colors("red")
        .margins({top:40, bottom:60, right:80, left:60})
        .dimension(experimentDimension)
        .group(speedArrayGroup)
        .boldOutlier(true)        
        ;

    //Series chart
    /**************************************************************************************************
     * 1. in series chart, all series share the same x axis and have the same chart type
     * 2. define the "basic" dimension consisting of both x axis and series dimension as an array
     * 3. define a separate dimension of the x axis
     * 4. define the value using cf group command based on the basic, array dimension
     * 5. initialize a dc.SeriesChart obj
     * 6. in .chart() method, define the chart type, and othe parameters of the series chart
     * 7. define group()
     * 8. define keyAccessor(), valueAccessor() and seriesAccessor()
     * 9. define x scales
     * 10.define legend, which automatically matches the series by colors
     * 11.SeriesChart doesn't fit well to brush. Set brushOn(false) for both Series and child charts
     * ********************************************************************************************** */ 
    const runDimension = facts.dimension( d => [d.Expt, d.Run]);
    const runGroup = runDimension.group().reduceSum( d => d.Speed) ;    

    const runDimensionLine = facts.dimension( d => d.Run);    
    const speedGroup = runDimensionLine.group().reduceSum(d => d.Speed/5);
    const scatterGroup = runDimension.group().reduceSum( d => d.Speed);
    
    seriesChart
        .width(1360).height(300)
        .margins({top:40,bottom:60,right:80,left:60})
        .brushOn(false)
        .chart(chart => new dc.LineChart(chart).curve(d3.curveLinearClosed).brushOn(false))
        .dimension(runDimension)
        .group(runGroup)
        .keyAccessor(d => d.key[1])
        .valueAccessor(d => d.value)
        .seriesAccessor(d => d.key[0])
        .x(d3.scaleLinear().domain([0,20]))
        .legend(dc.legend().x(100).y(200).itemHeight(12).gap(5)
                  .horizontal(2).legendWidth(1360).itemWidth(70));

    
    /*******************************************************************************************************
     * 1. compsite chart combines different chart types, and don't have to share the same x axis
     * 2. initialize compositeChart obj in dc. Define dimension, whcih will be inherited by child charts by default
     * 3. define scales, if needed
     * 4. in compose command, include an array of the sepecific child charts by new dc.chart()
     * 5. transfer the compositeChart obj in the new dc.chart() command, and define dimension and group
     ********************************************************************************************************/

    compChart
        .width(1360).height(300)
        .margins({top:40,bottom:60,right:80,left:60})
        .dimension(runDimensionLine)
        .x(d3.scaleLinear().domain([1,20]))
        .compose([
            new dc.LineChart(compChart).group(speedGroup),
            new dc.ScatterPlot(compChart)
                  .dimension(runDimension)
                  .group(scatterGroup)
                  .keyAccessor(d => d.key[1])
                  .valueAccessor( d => d.value)
        ]);

    

    dc.renderAll();   

    }catch(error){
        console.log(error);
    }
    
    
}




  








