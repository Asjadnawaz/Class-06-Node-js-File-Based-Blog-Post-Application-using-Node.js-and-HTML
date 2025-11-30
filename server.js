// Import required modules
import http from "http"; // For creating HTTP server
import fs from "fs";     // For file read/write operations

// Create the HTTP server
const server = http.createServer((req, res) => {

  // -------------------------------
  // Serve Frontend HTML file
  // -------------------------------
  if (req.url == "/" && req.method == "GET") {
    fs.readFile("./index.html", (err, data) => {
      if (err) {
        // Send error message if HTML file not found
        return res.end("Error Loading Home Page");
      }

      // Set content type and send HTML file
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
    return;
  }

  // -------------------------------
  // Get All Posts (Read from JSON)
  // -------------------------------
  if (req.url == "/posts" && req.method == "GET") {
    // Read posts from data.json
    const posts = fs.readFileSync("./data.json", "utf-8");

    // Send JSON response
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(posts);
    return;
  }

  // -------------------------------
  // Create a New Post
  // -------------------------------
  if (req.url == "/create-post" && req.method == "POST") {
    let data = "";

    // Collect data from frontend (request body)
    req.on("data", (chunk) => {
        data += chunk;    
    });

    // After receiving all data
    req.on("end", () => {
      // Parse JSON data sent from frontend
      const { title, content } = JSON.parse(data);   

      // Read existing posts from data.json
      const posts = JSON.parse(fs.readFileSync("./data.json", "utf-8"));

      // Create new post object
      const newpost = {
        id: new Date().getMilliseconds(), // Unique ID based on milliseconds
        title,
        content
      };

      // Add new post to posts array
      posts.push(newpost);
      
      // Save updated posts array back to data.json
      fs.writeFileSync("./data.json", JSON.stringify(posts, null, 2));

      // Send success response
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Post Created!" }));
    });

    return;
  }

  // -------------------------------
  // Delete a Post
  // -------------------------------
  if (req.url == "/delete-post" && req.method == "POST") {
    let data = '';

    // Collect post ID to delete
    req.on("data", (chunk) => data += chunk);

    req.on("end", () => {
        // Parse the ID from request
        const { id } = JSON.parse(data);

        // Read all posts
        let posts = JSON.parse(fs.readFileSync("./data.json", "utf-8"));

        // Filter out the post with the given ID
        posts = posts.filter((p) => p.id != id);

        // Save updated posts array back to data.json
        fs.writeFileSync("./data.json", JSON.stringify(posts, null, 2));
    });

    // Send success response
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify({message: "Post Deleted"}));

    return;
  }

}); // End of server.createServer

// -------------------------------
// Start the Server
// -------------------------------
server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
