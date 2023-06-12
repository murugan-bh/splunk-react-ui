// App.js
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { useEffect, useState } from "react";
import { Data } from "./utils/Data";
import "./styles.css";
import PieChart from "./components/PieChart";
import { BarChart } from "./components/BarChart";
import LineChart from "./components/LineChart";
import "./App.css"

Chart.register(CategoryScale);

export default function App() {
    const [sessionKey, setSessionKey] = useState("")
    const [searchID, setSearchID] = useState("")

    const splunkServer = "https://localhost:8089"
    const splunkUserName = "rest_admin"
    const splunkPassword = "Pa55word"

    async function GetSessionKey() {
        var key = await fetch(splunkServer + '/services/auth/login', {
            method: 'POST',
            body: new URLSearchParams({
                username: splunkUserName,
                password: splunkPassword,
                output_mode: 'json',
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("data --> ", data)
                return data['sessionKey']; // indicates a successful request
            });

        return { sessionKey: key };
    }

    GetSessionKey().then(result => {
        setSessionKey(result.sessionKey)
    })

    useEffect(() => {
        console.log("sessionKey is updated ", sessionKey)
        // GetSearch().then(result => {
        //     console.log("search ID result -> ", result.searchdata)
        //     setSearchID(result.searchdata.sid)
        //     return result.searchdata.sid
        // }).then((id => {
        //     console.log("id from 2nd page --> ", id)
        async function searchEvents() {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
            myHeaders.append("Authorization", "Bearer " + sessionKey);

            var urlencoded = new URLSearchParams();
            urlencoded.append("search", "savedsearch SampleSavedSearch");
            urlencoded.append("status_buckets", 300);

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow'
            };

            var searchPromise = await fetch(splunkServer + "/services/search/v2/jobs/export?output_mode=json", requestOptions).then(result => {
                return result
            })

            return searchPromise

        }
        searchEvents().then(result => {
            console.log(result.text())
            return result
        })
            .then(result => console.log(JSON.parse(result)))
            .catch(error => console.log('error', error));


        // GetSearchResult(id).then(searchResults => {
        //     console.log("searchResults => ", searchResults)
        // })
        // }))

    }, [sessionKey])

    async function GetSearchResult(search_id) {
        console.log("search_id --> ", search_id)

        // var searchResults = await fetch(splunkServer + '/services/search/v2/jobs/' + search_id+"/results?output_mode=json", {
        //     method: 'GET',
        //     headers: {
        //         "Authorization": "Bearer " + sessionKey
        //     },
        // })
        //     .then((response) => {
        //         console.log("response -> ", response)
        //         return response.json()
        //     })
        //     .then((data) => {
        //         console.log("search results data --> ", data)
        //         return data
        //     });
        // return { searchResults: searchResults };


        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + sessionKey);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        var result = await fetch(splunkServer + "/services/search/v2/jobs/" + search_id + "/results?f=sourcetype&f=count&output_mode=json", requestOptions)
            .then(response => response)
            .then(result => {
                console.log(result)
                return result
            })
            .catch(error => console.log('error', error));
        return { result }
    }

    async function GetSearch() {
        var searchdata = await fetch(splunkServer + '/servicesNS/admin/search/search/jobs', {
            method: 'POST',
            body: new URLSearchParams({
                output_mode: 'json',
                status_buckets: 0,
                // search: "| tstats count as count where index=_internal by sourcetype",
                search: "search index=_introspection | stats count by sourcetype",
                max_count: 50000,
                earliest_time: "-2m@m",
                latest_time: "-1m@m"
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                "Authorization": "Bearer " + sessionKey
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("search ID data --> ", data)
                return data
            });

        return { searchdata: searchdata };
    }

    const [chartData, setChartData] = useState({
        labels: Data.map((data) => data.year),
        datasets: [
            {
                label: "Users Gained ",
                data: Data.map((data) => data.userGain),
                backgroundColor: [
                    "rgba(75,192,192,1)",
                    "#ecf0f1",
                    "#50AF95",
                    "#f3ba2f",
                    "#2a71d0"
                ],
                borderColor: "black",
                borderWidth: 2
            }
        ]
    });

    return (
        <div className="App">

        </div>
    );
}