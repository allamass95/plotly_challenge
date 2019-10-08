
function buildMetadata(sample) {
  var sampleMeta = "/metadata/" + sample;
  console.log(sampleMeta);

  d3.json(sampleMeta).then(function(response) {
    var panelData = d3.select("#sample-metadata");
    var newData = [response]
    panelData.html("");
    newData.forEach (function(data) {
      Object.entries(data).forEach(([key, value]) => {
      var row = panelData.append("tr");
      row.append("td").html(`<strong><font size = '1.0'>${key}</font></strong>:`);
      row.append("td").html(`<font size = '1.0'>${value}</font>`);
      })
    });
  });   
}

function buildCharts(sample) {
  var chartData = "/samples/" + sample;
  d3.json(chartData).then(function(i) {
      var trace1 = {
      mode: 'markers',
      text: i.otu_labels,
      x: i.otu_ids,
      y: i.sample_values,
      marker: {
      size: i.sample_values,
      color: i.otu_ids,
      }
    }

      var bubData = [trace1];
      var bubLayout = {
      width: 1000,
      height: 600,
      title: "Bubble Chart"
    };

    Plotly.newPlot("bubble", bubData, bubLayout);

  
      var trace2 = {
      values: i.sample_values.slice(0,10),
      hovertext: i.otu_labels.slice(0,10),
      labels: i.otu_ids.slice(0,10),
      type: "pie",
    };

    var pieData = [trace2];
    var pieLayout = {
    height: 550,
    title: "Pie Chart - samples",
    width: 550
     
     
    }
    Plotly.newPlot('pie', pieData, pieLayout);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
