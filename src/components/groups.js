import React, { Component, PureComponent } from "react";
import axios from "axios";
import { Col, Row, Container } from "react-bootstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

class Groups extends Component {
  state = {
    data: null
  };

  async componentDidMount() {
    let resp = await axios.post(`http://84.201.146.38:3000/action`, {
      action: "getDatesAndGroups"
    });

    this.setState({
      data: resp.data.data
    });
  }

  render() {
    try {
      const data = this.state.data.map((item, idx) => {
        item["Dates"].forEach(dt => {
          let ac = dt["AvailableCapacity"];
          let fc = dt["FreeCapacity"];
          let load = ac !== 0 ? Math.round(((ac - fc) / ac) * 100, 2) : 100;
          dt["load"] = load;
          dt["Start"] = dt["Start"].slice(0, 10);
        });

        let avg =
          item["AAC"] !== 0
            ? (
                ((parseFloat(item["AAC"]) - parseFloat(item["AFC"])) /
                  parseFloat(item["AAC"])) *
                100
              ).toFixed(2)
            : 100;

        return (
          <Row key={idx}>
            <Col
              sm={2}
              className="d-flex border border-primary rounded my-1 py-1 justify-content-center flex-column"
            >
              <Row>
                <Col>{item["ResourceGroupId"]}</Col>
              </Row>
              <Row>
                <Col>Average Load: {avg}%</Col>
              </Row>
            </Col>
            <Col>
              <BarChart
                data={item["Dates"]}
                width={800}
                height={100}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Start" />
                <YAxis type="number" domain={[0, 100]} />
                <Tooltip />

                <Bar dataKey="load" fill="#8884d8" />
              </BarChart>
            </Col>
          </Row>
        );
      });
      return (
        <Container fluid>
          <Row></Row>
          {data}
        </Container>
      );
    } catch (err) {
      return "Loading data";
    }
  }
}

export default Groups;
