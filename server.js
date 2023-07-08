/*********************************************************************************
*  WEB700 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Kristienne Jewel ID: 129417226 Date: July 08, 2023
*
*  Online (Cyclic) Link: https://gifted-slip-bull.cyclic.app/
*
********************************************************************************/ 

let express = require("express");
let HTTP_PORT = process.env.PORT || 8080;
let app = express();
let path = require("path");
let collegeData = require("./modules/collegeData");
const { countReset } = require("console");
app.use(express.urlencoded({ extended: true}));


app.get('/students/add', (req, res)=>{
    res.sendFile(__dirname + '/views/addStudent.html');
})

app.post("/students/add", (req, res) => {
    collegeData.addStudent(req.body)
    .then(() => {
        res.redirect("/student");
    })
    .catch((error)=>{
        console.error(error);
        res.redirect('404!' + error);
    });
});

app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, "views","home.html"));
});

app.get("/about", (req, res)=>{
    res.sendFile(path.join(__dirname, "views","about.html"));
});

app.get("/htmlDemo", (req, res)=>{
    res.sendFile(path.join(__dirname, "views","htmlDemo.html"));
});

app.get("/theme.css", (req, res) => {
    res.sendFile(path.join(__dirname, "/css/theme.css"));
});

app.get("/tas", (req, res)=>{
    collegeData.getTAs()
    .then((tas)=>{
        if(tas.length == 0){
            res.json({message: "error"});
        }else{
            res.json(tas);
        }
    })
    .catch((err)=>{
        res.status(500).json({error:err.message});
    });
});

app.get("/courses", (req,res)=>{
    collegeData.getCourses()
    .then((courses)=>{
        if(courses.length===0){
            res.json({message:"error"});
        }else{
            res.json(courses);
        }
    })
    .catch((err)=>{
        res.status(500).json({error:err.message});
    });
});

app.get("/student/:num", (req,res)=>{
    var paramNum = req.params.num;
    collegeData.getStudentByNum(paramNum)
    .then((student)=>{
        if(!student){
            console.log("error");
        }else{
            res.json(student);
        }
    })
    .catch((err)=>{
        res.status(500).json({error: err.message});
    });
});

app.get("/student", (req,res)=>{
    var courses = req.query.course;
    collegeData.getAllStudents()
    .then((students)=>{
        if(students.length === 0){
            console.log("no student")
        }else{
            if(courses){
                return collegeData.getStudentsByCourse(courses);
            }else{
                return students;
            }
        }
    })
    .then((studentByCourse) => {
        res.json(studentByCourse)
    })
    .catch((err)=>{
        res.status(500).json({error: err.message});
    });
});

collegeData.initialize()
    .then(()=>{
        app.listen(HTTP_PORT, () =>{
            console.log("server listening on port: " + HTTP_PORT);
        });
    })
    .catch((err)=>{
        console.error(err)
    });