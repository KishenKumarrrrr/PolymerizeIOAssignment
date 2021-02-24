import React, { useState, useEffect } from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import axios from "axios";
import styles from './App.css';
import Plotly from 'plotly.js-dist'


function App() {

  const url = "https://api.sandbox.polymerize.io/v1/data/_get_plot";

  const [dataObject, setDataObject] = useState([]);
  const [graphObject1, setGraphObject1] = useState([]);
  const [graphObject2, setGraphObject2] = useState([]);
  const [graphObject3, setGraphObject3] = useState([]);
  const [displayData, setDisplayData] = useState(dataObject.map((entry, index) => makeRow(entry)));

  function makeRow(row) {
    return (
    <tr className = {styles.row}>
      <td>{row.bed_temperature}</td>
      <td>{row.elongation}</td>
      <td>{row.fan_speed}</td>
      <td>{row.infill_density}</td>
      <td>{row.infill_pattern}</td>
      <td>{row.layer_height}</td>
      <td>{row.material}</td>
      <td>{row.nozzle_temperature}</td>
      <td>{row.print_speed}</td>
      <td>{row.roughness}</td>
      <td>{row.tensile_strength}</td>
      <td>{row.wall_thickness}</td>
    </tr>);
  }

  function transformData(rawData) {
    let tempArray = [];
    let infill_density = [];
    let infill_pattern = [];
    let tensile_strength = [];
    for (let i = 0; i <= 45; i++) {
      const newEntry = {
        bed_temperature : rawData.bed_temperature[i],
        elongation : rawData.elongation[i],
        fan_speed : rawData.fan_speed[i],
        infill_density : rawData.infill_density[i],
        infill_pattern : rawData.infill_pattern[i],
        layer_height : rawData.layer_height[i],
        material : rawData.material[i],
        nozzle_temperature : rawData.nozzle_temperature[i],
        print_speed : rawData.print_speed[i],
        roughness : rawData.roughness[i],
        tensile_strength : rawData.tensile_strength[i],
        wall_thickness : rawData.wall_thickness[i],
      }
      infill_density.push(rawData.infill_density[i]);
      infill_pattern.push(rawData.nozzle_temperature[i]);
      tensile_strength.push(rawData.tensile_strength[i]);
      dataObject.push(newEntry);
    }
    setDataObject(tempArray);
    setGraphObject1(infill_density);
    setGraphObject2(infill_pattern);
    setGraphObject3(tensile_strength);
    setDisplayData(dataObject.map((entry, index) => makeRow(entry)));
  }

  useEffect(() => {
    axios.post(url, {"company_id" : "polymerize.io"})
    .then(res => {
      transformData(res.data.result.data); 
      console.log("data transformed");
    })
    .catch(err => console.log(err));
  }, []);

  Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/3d-scatter.csv', function(err, rows){
  
    let myData = {
      x: graphObject1,
      y: graphObject2,
      z: graphObject3,
      mode: 'markers',
      type: 'scatter3d'
    }
    
    var data = [myData];
    var layout = {margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0
      }};
    Plotly.newPlot('myDiv', data, layout);
    });

  

  return (
    <div>
      <Container>
        <Row style = {{paddingTop:"10rem"}}>
          <Table>
          <thead>
            <tr>
              <th>Bed Temperature</th>
              <th>Elongation</th>
              <th>Fan Speed</th>
              <th>Infill Density</th>
              <th>Infill Pattern</th>
              <th>Layer Height</th>
              <th>Material</th>
              <th>Nozzle Temperature</th>
              <th>Print Speed</th>
              <th>Roughness</th>
              <th>Tensile Strength</th>
              <th>Wall Thickness</th>
            </tr>
          </thead>
          <tbody>
            {displayData}
          </tbody>
          </Table>
        </Row>
        <Row>
          <div id='myDiv'></div>
        </Row>
      </Container>
    </div>
  );
}

export default App;
