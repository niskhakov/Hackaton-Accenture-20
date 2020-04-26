const mysql = require('mysql2/promise');
const fs = require("fs");

// create the connection to database
const config = {
    host: 'rc1b-l0gsh0l575p5ncaf.mdb.yandexcloud.net',
    port: 3306,
    user: 'eln',
    password: '<password>',
    database: 'vis',
    ssl: {
        ca: fs.readFileSync('/home/timur/.mysql/root.crt'),
    }
};



const query = async(sql) => {
    const connection = await mysql.createConnection(config)
    const [rows, fields] = await connection.execute(sql);
    connection.end()
    return rows
}


const Actions = {
    'getAll': async(req, res) => {
        // console.log("getAll executed")

        let sql = ""
        if (req.body.limit) {
            // console.log("limit rows to " + req.body.limit)
            sql = "select * from ResourceGroupPeriod ORDER BY ResourceGroupID ASC, Start ASC LIMIT " + parseInt(req.body.limit)
        }
        else {
            sql = "select * from ResourceGroupPeriod ORDER BY ResourceGroupID ASC, Start ASC"
        }
        const rows = await query(sql)
        res.json({
            status: 200,
            message: "Ok",
            data: rows
        })
    },
    "getGroups": async(req, res) => {
        const sql = "SELECT AVG(AvailableCapacity) as AAC, AVG(FreeCapacity) as AFC, ResourceGroupId FROM ResourceGroupPeriod group by ResourceGroupId ;"
        const rows = await query(sql)
        res.json({
            status: 200,
            message: "Ok",
            data: rows
        })
    },
    "getDatesAndGroups": async(req, res) => {
        const sql = "SELECT ResourceGroupId, AVG(AvailableCapacity) as AAC, AVG(FreeCapacity) as AFC FROM ResourceGroupPeriod group by ResourceGroupId ;"
        const groups = await query(sql)
        let result = new Array(groups.length)
        await Promise.all(groups.map(async(item, idx) => {
            let dates = await query(`SELECT Start, AvailableCapacity, FreeCapacity, HasFiniteCapacity FROM ResourceGroupPeriod WHERE ResourceGroupID = '${item["ResourceGroupId"]}' ORDER BY Start ASC`)
            if (dates.length !== 58) {
                console.error("Not 58 elements", item["ResourceGroupId"])
            }
            result[idx] = {
                ResourceGroupId: item["ResourceGroupId"],
                AAC: item["AAC"],
                AFC: item["AFC"],
                Dates: dates
            }
        }))

        res.json({
            status: 200,
            message: "Ok",
            data: result
        })

    }

}


module.exports = Actions
