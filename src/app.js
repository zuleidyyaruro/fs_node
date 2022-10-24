const http = require('http');
const path = require('path');
const fs = require('fs').promises;

// Autor: Zuleidy Yaruro

const PORT = 8000;

const app = http.createServer(async (req, res) => {

    const method = req.method;
    const url = req.url;

    if (url === '/tasks') {

        const jsonPath = path.resolve('./data.json');
        const jsonFile = await fs.readFile(jsonPath, 'utf8');

        if (method === 'GET') {

            res.setHeader("Content-Type", "application/json");
            res.write(jsonFile);

        } else if (method === 'POST') {

            req.on("data", async (data) => {
                const newTask = JSON.parse(data);
                const arr = JSON.parse(jsonFile);
                arr.push(newTask);
                await fs.writeFile(jsonPath, JSON.stringify(arr));
            });

            res.writeHead(201, {"Content-Type": "application/json"});

        } else if (method === 'PUT') {

            req.on("data", async (data) => {
                const task = JSON.parse(data);
                const arr = JSON.parse(jsonFile);
                const index = arr.findIndex(item => item.id === task.id);
                arr.splice(index, 1);
                const newArr = {
                    "id":task.id,
                    "title": task.title,
                    "description": task.description,
                    "status": task.status,
                }
                arr.push(newArr);
                await fs.writeFile(jsonPath, JSON.stringify(arr));
            });

            res.writeHead(204, {"Content-Type": "application/json"});

        } else if (method === 'DELETE') {

            req.on("data", async (data) => {
                const taskId = JSON.parse(data);
                const arr = JSON.parse(jsonFile);
                const index = arr.findIndex(item => item.id === taskId.id);
                arr.splice(index, 1);
                await fs.writeFile(jsonPath, JSON.stringify(arr));
            });

            res.writeHead(204, {"Content-Type": "application/json"});

        }

        res.end()
    }
})

app.listen(PORT, () => {
    console.log('Server running on port', PORT)
});