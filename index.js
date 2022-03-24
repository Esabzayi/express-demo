
// Sab sy pehle isko call krien gy taky app me expres js ko use kr saky
const express = require('express');
// iska eik constant bana lein gy taky usko diffrent req ka liye use krien
const app = express();
// Express mein Predefined nahi hta ka json consume ho to isko bolana parta hai
app.use(express.json());
// Validation packge
const Joi = require('joi');

// eik array jisme course hain Diffrent Api test krna ka Liye
const Courses = [
    { id: 1, Name: 'Information Security' },
    { id: 2, Name: 'Cloud Computing' },
    { id: 3, Name: 'Artificial Intelligence' },
];

// .............Get Request............... //

// Main or Default Page
app.get('/', (req, res) => {

    res.send("Hello World !!!");

});

// Getting All Courses
app.get('/api/courses', (req, res) => {

    res.send(Courses);

});

// Getting a Single Course 
app.get('/api/courses/:id', (req, res) => {

    const courses = Courses.find(x => x.id == parseInt(req.params.id));

    if (!courses) {
        res.status(404).send('Course not Found');
    }
    else {
        res.send(courses);
    }
});

// We can Also have multiple Params in our Route 
app.get('/api/posts/:year/:month', (req, res) => {

    // By this we get year
    // res.send(req.params.year);

    // by this we get all params such as year and month in this case
    res.send(req.params);

    // we can also get query params such as ?sortBy=name
    //res.send(req.query);
})


// ...............POST REQUESTS............//

app.post('/api/courses', (req, res) => {

    // ya validation yahan ka luiye to thk hai magar real world me kam nai kry gi qk zada objects hoongy
    // iska liye packge use kry gy "npm joi" iska liye package install kro aur phir scheme define kro

    const { error } = validateCourse(req.body); // equals result.error

    if (error) {
        // 400 Bad Req
        res.status(400).send(error.details[0].message);
        return;
    }

    const course = {
        id: Courses.length + 1,
        // Req.Body.... iska bd jo bh variable hum banai gy uska name ajai ga aur bad me json body me isko send karde gy
        Name: req.body.Name
    };
    // ya Sab Courses mein Dal rahai hain is Course ko
    Courses.push(course);
    // ab is sy reponse le rahy hain
    res.send(Courses);
});


// ................Updte / PUT Request ................//
app.put('/api/courses/:id', (req, res) => {

    // Look up if it exist or not 
    const courses = Courses.find(x => x.id == parseInt(req.params.id));

    if (!courses) {
        res.status(404).send('Course not Found');
        return;
    }


    // Validate ka data sai bh hai ya nahi

    const { error } = validateCourse(req.body); // equals result.error

    if (error) {
        // 400 Bad Req
        res.status(400).send(error.details[0].message);
        return;
    }

    // Update Course
    courses.Name = req.body.Name;

    // Finally Return Updated Value 
    res.send(Courses);
});

// All Validation Logic in One Place
function validateCourse(course) {
    const schema = Joi.object({
        Name: Joi.string().min(3).required(),
    });
    const result = schema.validate(course);
    return Joi.validate(course, schema);
}

// ........Delete .................
app.delete('/api/courses/:id', (req, res) => {

    // Look up if it exist or not 
    const course = Courses.find(x => x.id == parseInt(req.params.id));

    if (!course) {
        res.status(404).send('Course not Found');
        return;
    }

    const index = Courses.indexOf(course);
    Courses.splice(index, 1);

    // Return 
    res.send(course);
});
// PORT 
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on Port ${port}...`));