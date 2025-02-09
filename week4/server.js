require("dotenv").config()
const http = require("http")
const AppDataSource = require("./db")
const { Console } = require("console")

const requestListener = async (req, res) => {
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
   'Content-Type': 'application/json'
 }
  let body = ""
  req.on("data", (chunk) => {
    body += chunk
  })

  if (req.url === "/api/credit-package" && req.method === "GET") {
    console.log('get api')
    res.writeHead(200, headers)
    res.write(JSON.stringify({
      status: "success",
      data: []
    }))
    res.end()
  } 
  // POST-新增課程購買方案
  else if (req.url === "/api/credit-package" && req.method === "POST") {
    req.on("end",()=>{

    })
    
  } else if (req.url.startsWith("/api/credit-package/") && req.method === "DELETE") {
    
  } else if (req.method === "OPTIONS") {
    res.writeHead(200, headers)
    res.end()
  } else {
    res.writeHead(404, headers)
    res.write(JSON.stringify({
      status: "failed",
      message: "無此網站路由",
    }))
    res.end()
  }
}

const server = http.createServer(requestListener)

async function startServer() {
  await AppDataSource.initialize()
  console.log("資料庫連接成功")
  server.listen(process.env.PORT)
  console.log(`伺服器啟動成功, port: ${process.env.PORT}`)
  return server;
}


module.exports = startServer();
