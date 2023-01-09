import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import axios from 'axios';
const https = require('https');


export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [mlModelInput, setmlModelInput] = useState("text-davinci-003");
  const [numUserStoryInput, setnumUserStoryInput] = useState("3");
  const [numTaskInput, setnumTaskInput] = useState("3");

  const [result, setResult] = useState();

  async function postADO() {
    console.log(process.env)
    const username = ''
    const password = process.env.AZURE_PAT || ''
    console.log(password)
    const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64')

    const organization = 'cloudbuilder33'
    const project = "Sand%20Castle"
    const type = "Task"

    // GET https://dev.azure.com/{organization}/{project}/_apis/wit/workitems/{id}?api-version=7.0
    // POST https://dev.azure.com/fabrikam/{project}/_apis/wit/workitems/${type}?api-version=7.0
    console.log(document)
    axios({
      method: 'POST',
      //url: 'https://dev.azure.com/'+ organization + '/' +project + '/_apis/wit/workitems/14?api-version=7.0',
      url: 'https://dev.azure.com/' + organization + '/' + project + '/_apis/wit/workitems/$Task?api-version=7.0',
      headers: {
        'Authorization': `Basic ${token}`,
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json-patch+json'
      },
      data:
        [
          {
            "op": "add",
            "path": "/fields/System.Title",
            "from": null,
            "value": `BacklogBuilder - ${animalInput}`,
          },
          {
            "op": "add",
            "path": "/fields/System.Description",
            "from": null,
            "value": `${result}`,
          }
        ]
    })
      .then(function (response) {
        console.log(response.request.responseText);
      })

  }

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: animalInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      console.log(data.result)
      setResult(data.result);
      // reset Input Field
      // setAnimalInput("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div className={styles.topLevel}>
      <Head>
        <title>Backlog Writer BETA</title>
        <link rel="icon" href="/backlogwriter.jpg" />
      </Head>

      <main className={styles.main}>
        <div className={styles.header}>
        <img src="/backlogwriter.jpg" className={styles.icon} />
        <h3>Backlog Writer BETA</h3>
        <h4>AI-Generated User Stories with Acceptance Criteria and Step-by-Step Tasks</h4>
        </div>
        <form onSubmit={onSubmit}>
          <label htmlFor="mlModel">Epic</label>
          <input
            type="text"
            name="animal"
            placeholder="Enter an Epic to be Accomplished"
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
          />
          <label htmlFor="mlModel">ML Model</label>
          <select id="mlModel" name="mlModel" value={mlModelInput} onChange={(e) => { setmlModelInput(e.target.value); console.log("updated mlModelInput: " + e.target.value) }}>
            <option value="text-davinci-003">text-davinci-003</option>
            <option value="text-curie-001">text-curie-001</option>
            <option value="text-babbage-001">text-babbage-001</option>
            <option value="text-ada-001">text-ada-001</option>
          </select>

          <label htmlFor="numUserStories">Number of User Stories</label>
          <input type="number" min="2" max="5" value={numUserStoryInput} onChange={(e) => { setnumUserStoryInput(e.target.value); console.log("updated numUserStoryInput: " + e.target.value) }}/>

          <label htmlFor="numUserStories">Number of Tasks per Story</label>
          <input type="number" min="2" max="5" value={numTaskInput} onChange={(e) => { setnumTaskInput(e.target.value); console.log("updated numTaskInput: " + e.target.value) }}/>
          <br />

          <input type="submit" value="Generate Work Items" />
          <br />

          <input id="exportADO" type="button" value="Import to Azure DevOps" onClick={postADO} />

        </form>
        <br />
      </main>
      <div className={styles.reviewArea}>
        <h3>Review Below :</h3>
        <textarea id="result" rows="30" cols="120" className={styles.result} value={result}></textarea>
        <input type="button" value="Everything Look Good? Complete Review" onClick={postADO} />

      </div>
    </div>
  );
}
