const express = require("express");
const axios = require("axios")
const app = express();
const port = 3000;

app.use(express.json())

app.get("/", async (req, res) => {
    try {
        const response = await getPost()
        console.log(response)
        res.send(response)
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
})

const getPost = async () => {
    let updateResponses = []
    try {
        const postsResponse = await axios.get('https://jsonplaceholder.typicode.com/posts')
        const posts = postsResponse.data
        for (key in posts) {
            let post = posts[key];
            const updateResponse = await updatePost(post.id, post.title, post.body)
            updateResponses.push(updateResponse)
        }

    } catch (e) {
        console.log(e)
        updateResponses.push(`Error processing the Request ${e}`);
    } finally {
        return updateResponses;
    }
}

const updatePost = async (id, title, body) => {
    let finalReponse;
    try {
        // Uncomment below line to get error for each id divisible by 5
        //    id = id%2==0 ? id+'s' : id;
        const url = `https://jsonplaceholder.typicode.com/posts/${id}`
        const updateResponse = await axios.put(url, {
            "id": id,
            "title": title,
            "body": body
        })
        // console.log(`Id : ${id}, Status : ${updateResponse.status})`)
        finalReponse = updateResponse.status
    } catch (error) {
        // console.log(`Id : ${id} , Error : ${error}`)
        finalReponse = getError(error)
    }
    const data = { "id": id, "finalReponse": finalReponse }
    return data
}

const getError = (error) => {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);

        return `Error failed with status ${error.response.status} and errorBody : ${error.response.data}`
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
        return `Unable to get a response from the server`
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        return `Error failed with status 500 and errorBody : ${error.message}`
    }
}

app.listen(port, () => console.log(`listening on port ${port}`))