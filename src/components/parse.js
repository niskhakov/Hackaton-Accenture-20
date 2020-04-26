import React, { Component } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";

const parseAvailableCapacityFormat = capacity => {
  let res = capacity;
  let result;

  result = capacity.match(
    /((?<days>[0-9]+) days?,?)? ?((?<hours>\d+):(?<minutes>\d+):(?<seconds>\d+\.?\d*))?/i
  );

  let ds, hs, ms, ss;
  if (result) {
    const { days, hours, minutes, seconds } = result.groups;
    ds = parseInt(days) || 0;
    hs = parseInt(hours) || 0;
    ms = parseInt(minutes) || 0;
    ss = parseFloat(seconds) || 0;

    // console.log(capacity, { ds, hs, ms, ss });
    return ds * 24 * 60 * 60 + hs * 60 * 60 + ms * 60 + ss;
  } else {
    console.error("Cannot parse object: " + capacity);
  }

  return res;
};

const parseDate = dt => {
  return dt.slice(0, 10);
};

export default class ParseData extends Component {
  state = {
    data: null
  };

  async retrieveAllData() {
    let resp = await axios.post(`http://84.201.146.38:3000/action`, {
      action: "getAll"
    });

    this.setState({
      data: resp.data.data
    });
  }

  async componentDidMount() {
    // const d = await d3.csv(data);
    // console.log(d.slice(0, 10));
    // let json = [];
    // d.forEach(item =>
    //   json.push({
    //     Id: item["Id"],
    //     ResourceGroupID: item["ResourceGroupID"],
    //     AvailableCapacity: parseAvailableCapacityFormat(
    //       item["AvailableCapacity"]
    //     ),
    //     FreeCapacity: parseAvailableCapacityFormat(item["FreeCapacity"]),
    //     Start: item["Start"],
    //     HasFiniteCapacity: item["HasFiniteCapacity"]
    //   })
    // );

    // let dataStr =
    //   "data:text/json;charset=utf-8," +
    //   encodeURIComponent(JSON.stringify(json));
    // let dlAnchorElem = document.getElementById("downloadAnchorElem");
    // dlAnchorElem.setAttribute("href", dataStr);
    // dlAnchorElem.setAttribute("download", "data.json");
    // dlAnchorElem.click();

    let resp = await axios.post(`http://84.201.146.38:3000/action`, {
      action: "getAll",
      limit: 200
    });

    // console.log(resp.data.data);

    this.setState({
      data: resp.data.data
    });

    this.retrieveAllData();
  }

  render() {
    const text =
      this.state.data &&
      this.state.data.map((item, idx) => {
        let ac = item["AvailableCapacity"];
        let fc = item["FreeCapacity"];
        let load = ac !== 0 ? Math.round(((ac - fc) / ac) * 100, 2) : 100;
        return (
          <tr key={idx}>
            <td>{item["#"]}</td>
            <td>{item["ResourceGroupID"]}</td>
            <td>{item["Id"]}</td>
            <td>{parseDate(item["Start"])}</td>
            <td>{ac}</td>
            <td>{fc}</td>
            <td>{load}</td>
          </tr>
        );
      });

    return (
      <Container>
        <a id="downloadAnchorElem">Some</a>
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Resource Group Id</th>
              <th>Resource Id</th>
              <th>Start Date</th>
              <th>Available Capacity</th>
              <th>Free Capacity</th>
              <th>Load</th>
            </tr>
          </thead>
          <tbody>{text}</tbody>
        </Table>
      </Container>
    );
  }
}
