import React, { Component } from "react"
import * as d3 from "d3"
import data from "../data/resgroupperiod.csv"

const parseAvailableCapacityFormat = (capacity) => {
  let res = capacity

  const first = /(?<days>[0-9]+) days?/i
  const firstLength = parseInt(capacity.match(first).groups.days)

  const second = /(?<hours>\d+):(?<minutes>\d+):(?<seconds>\d+)\.?(?<millis>\d+)?/i

  return res
}

export default class ParseData extends Component {
  state = {
    data: null,
  }

  async componentDidMount() {
    const d = await d3.csv(data)
    console.log(d)
    this.setState({ data: d.slice(0, 50) })
  }

  render() {
    const text =
      this.state.data &&
      this.state.data.map((item, idx) => (
        <div key={idx}>
          {item["#"]} resgrid: {item["ResourceGroupID"]} AvailableCapacity:{" "}
          {parseAvailableCapacityFormat(item["AvailableCapacity"])}
        </div>
      ))

    return <div>{text && text}</div>
  }
}
