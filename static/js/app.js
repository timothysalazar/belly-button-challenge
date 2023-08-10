// Use the D3 library to read in samples.json from 
// the URL https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json.
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

d3.json(url).then(function (data) {
  console.log(data)

  //function for initializing page
  function init() {
    //populate dropdown menu with all names and select first sample to initialize page
    populateDropdown(data.names);
    let init_sample = data.names[0];

    //create plots, display metadata
    createBarChart(init_sample);
    createBubbleChart(init_sample);
    displayMetadata(init_sample);
  }

  //define populateDropdown to populate the dropdown menu with the "names" of all samples
  function populateDropdown(sample_names) {
    let dropdown = d3.select("#selDataset");
    sample_names.forEach(sample => {
      dropdown.append("option").attr("value", sample).text(sample);
    });
  }

  //define createBarChart to create a horizontal bar chart displaying top 10 OTUs found in selected individual
  function createBarChart(sample) {
    let sample_data = data.samples.filter(id => id.id === sample)[0];

    let trace = {
      x: sample_data.sample_values.slice(0, 10),
      y: sample_data.otu_ids.map(number => `OTU ${number}`).slice(0, 10),
      text: sample_data.otu_labels.slice(0, 10),
      type: "bar",
      orientation: "h"
    };
    let layout = {
      title: "Top 10 OTUs",
      xaxis: { title: "Sample Value" }
    };
    Plotly.newPlot("bar", [trace], layout);
  }

  //define createBubbleChart that displays each sample
  function createBubbleChart(sample) {
    let sample_data = data.samples.filter(id => id.id === sample)[0];

    let trace = {
      x: sample_data.otu_ids,
      y: sample_data.sample_values,
      text: sample_data.otu_labels,
      mode: "markers",
      marker: {
        size: sample_data.sample_values,
        color: sample_data.otu_ids,
        colorscale: "Plasma"
      }
    };
    let layout = {
      title: "OTU Bubble Chart",
      xaxis: { title: "OTU IDs" },
      yaxis: { title: "Sample Values" }
    };
    Plotly.newPlot("bubble", [trace], layout);
  }

  //define displayMetadata to show a table containing individual's demographic information
  function displayMetadata(sample) {
    let meta_data = data.metadata.filter(x => x.id == sample)[0];
    let box = d3.select("#sample-metadata");
    box.html("");

    Object.entries(meta_data).forEach(([key, value]) => {
      box.append("p").text(`${key.toUpperCase()}: ${value}`);
    });
  }


  //define function newSample to update page when a different sample is chosen by user
  function newSample(sample) {
    createBarChart(sample);
    createBubbleChart(sample);
    displayMetadata(sample);
  }

  //event listener for when a different sample is chosen by user
  d3.select("#selDataset").on("change", function () {
    let new_sample = d3.select(this).property("value");
    newSample(new_sample);
  })

  //call function to initialize page
  init();
})
