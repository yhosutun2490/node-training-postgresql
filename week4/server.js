require("dotenv").config()
const http = require("http")
const AppDataSource = require("./db")
const {
  creditPackageValidator,
  createCoachesSkillValidator,
  deletePackageValidator,
  deleteSkillValidator
} = require("./validation")

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

    try {
      const allData = await AppDataSource.getRepository('CREDIT_PACKAGE').find()
      res.writeHead(200, headers)
      res.write(JSON.stringify({
        status: "success",
        data: allData
      }))
    } catch(err) {
      res.writeHead(500, headers)
      res.write(JSON.stringify({
        status: "error",
        message: "伺服器錯誤"
      }))
    } finally {
      res.end()
    }
   
  } 
  // POST-新增課程購買方案
  else if (req.url === "/api/credit-package" && req.method === "POST") {
    req.on("end",async()=>{
      try { 
        // 檢核 body
        const bodyData = body?JSON.parse(body): {}
        creditPackageValidator(bodyData)

        // get datasource insert
        const {name, credit_amount ,price} = bodyData
        const packageTable = await AppDataSource.getRepository('CREDIT_PACKAGE')

        // 檢核package 名稱
        const hasSamePackageName=  await packageTable.findOne({
          where: {name}
        })
     
        if (!hasSamePackageName) {
          const result = await packageTable.insert({
            name: name,
            credit_amount: credit_amount,
            price: price
          })
        
          res.writeHead(200, headers)
          res.write(JSON.stringify({
            status: "新增成功",
            data: result
          }))
        } else {
          throw new Error('repeat_name')
        }
       
      } catch (err) {
        if (err.name === "ZodError") {
          res.writeHead(403, headers)
          res.write(JSON.stringify({
            status: "failed",
            message: "欄位未填寫正確",
          }))
        } 
        else if (err.message == 'repeat_name') {
          res.writeHead(409, headers)
          res.write(JSON.stringify({
            status: "failed",
            message: "資料重複",
          }))
        }
        else {
          res.writeHead(500, headers)
          res.write(JSON.stringify({
            status: "error",
            message: "伺服器錯誤"
          }))
        } 
      } finally {
        res.end()
      }
       
    })
    
  } 
  // Delete-刪除購買方案
  else if (req.url.startsWith("/api/credit-package/") && req.method === "DELETE") {
    try {
      const targetId = req.url.split('/').pop()
      // id 格式檢核
      deletePackageValidator({id:targetId})
 
      const packageTable = await AppDataSource.getRepository('CREDIT_PACKAGE')
    
  
      
      const result = await packageTable.delete({
        id: targetId
      })

      if (result.affected) {
        res.writeHead(200, headers)
        res.write(JSON.stringify({
          status: "success",
          data: result
        }))
      } else {
        throw new Error('id_not_found')
      }

    } catch (err) {
      if (err.message === 'id_not_found') {
        res.writeHead(400, headers)
        res.write(JSON.stringify({
          status: "failed",
          message: "ID錯誤"
        }))

      }
      else if (err.name === "ZodError") {
        res.writeHead(403, headers)
        res.write(JSON.stringify({
          status: "failed",
          message: "id未填寫正確",
        }))
      }  
      else {
        res.writeHead(500, headers)
        res.write(JSON.stringify({
          status: "error",
          message: "伺服器錯誤"
        }))
      }
    } finally {
      res.end()
    }
  } 
  // Get-取得教練專長
  else if (req.url === "/api/coaches/skill" && req.method === "GET") {

      try {
        const allData = await AppDataSource.getRepository('SKILL').find()
        res.writeHead(200, headers)
        res.write(JSON.stringify({
          status: "success",
          data: allData
        }))
      } catch(err) {
        res.writeHead(500, headers)
        res.write(JSON.stringify({
          status: "error",
          message: "伺服器錯誤"
        }))
      } finally {
        res.end()
      }
  }
   // POST-新增教練技能
   else if (req.url === "/api/coaches/skill" && req.method === "POST") {
    req.on("end",async()=>{
      try { 
        // 檢核 body
  
        const bodyData = body?JSON.parse(body): {}
        createCoachesSkillValidator(bodyData)

        // get datasource insert
        const {name} = bodyData
        const skillTable = await AppDataSource.getRepository('SKILL')

        // 檢核package 名稱
        const hasSameSkill=  await skillTable.findOne({
          where: {name}
        })
     
        if (!hasSameSkill) {
          const result = await skillTable.insert({
            name: name,
          })
        
          res.writeHead(200, headers)
          res.write(JSON.stringify({
            status: "新增成功",
            data: result
          }))
        } else {
          throw new Error('repeat_name')
        }
       
      } catch (err) {
        console.log('err',err)
        if (err.name === "ZodError") {
          res.writeHead(403, headers)
          res.write(JSON.stringify({
            status: "failed",
            message: "欄位未填寫正確",
          }))
        } 
        else if (err.message == 'repeat_name') {
          res.writeHead(409, headers)
          res.write(JSON.stringify({
            status: "failed",
            message: "資料重複",
          }))
        }
        else {
          res.writeHead(500, headers)
          res.write(JSON.stringify({
            status: "error",
            message: "伺服器錯誤"
          }))
        } 
      } finally {
        res.end()
      }
       
    })
    
  } 
  // Delete-刪除教練技能
  else if (req.url.startsWith("/api/coaches/skill") && req.method === "DELETE") {
    try {
      const targetId = req.url.split('/').pop()
      // id 格式檢核
      deleteSkillValidator({id:targetId})
 
      const skillTable = await AppDataSource.getRepository('SKILL')
  
      const result = await skillTable.delete({
          id: targetId
      })
      if (result.affected) {
        res.writeHead(200, headers)
        res.write(JSON.stringify({
          status: "success",
        }))
      } else {
        throw new Error('id_not_found')
      }
     
    } catch (err) {
      if (err.message === 'id_not_found') {
        res.writeHead(400, headers)
        res.write(JSON.stringify({
          status: "failed",
          message: "ID錯誤"
        }))

      }
      else if (err.name === "ZodError") {
        res.writeHead(403, headers)
        res.write(JSON.stringify({
          status: "failed",
          message: "id未填寫正確",
        }))
      }  
      else {
        res.writeHead(500, headers)
        res.write(JSON.stringify({
          status: "error",
          message: "伺服器錯誤"
        }))
      }
    } finally {
      res.end()
    }
  } 
  else if (req.method === "OPTIONS") {
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
