import http from "http";
import fs from "fs";

const server = http.createServer((req, res) => {

  // Serve frontend file
  if (req.url == "/" && req.method == "GET") {
    fs.readFile("./index.html", (err, data) => {
      if (err) return res.end("Error Loading Home Page");
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
    return;
  }

  // GET all posts
  if (req.url == "/posts" && req.method == "GET") {
    const posts = fs.readFileSync("./data.json", "utf-8");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(posts);
    return;
  }

  // CREATE post
  if (req.url == "/create-post" && req.method == "POST") {
    let data = "";

    req.on("data", (chunk) => {
        data += chunk;    
    });

    req.on("end", () => {
      const { title, content } = JSON.parse(data);   
      const posts = JSON.parse(fs.readFileSync("./data.json", "utf-8"));

      const newpost = {
        id: new Date().getMilliseconds(),
        title,
        content
      };

      posts.push(newpost);
      
      fs.writeFileSync("./data.json", JSON.stringify(posts, null, 2));

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Post Created!" }));
    });

    return;
  }

  // DELETE post

    if (req.url == "/delete-post" && req.method == "POST") {
        let data = '';
        req.on("data", (chunk) => data += chunk);
        req.on("end", () => {
            const {id} = JSON.parse(data);

            let posts = JSON.parse(fs.readFileSync("./data.json", "utf-8"));

            posts = posts.filter((p) => p.id != id);

            fs.writeFileSync("./data.json", JSON.stringify(posts, null, 2));
        });

        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify({message: "Post Deleted"}));

        return;
    }

    }); 



// Start Server
server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});



