import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import studentsData from "./data/studentsData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 8080;
const HOST = "127.0.0.1";

let students = [...studentsData];

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "view"));
app.use(express.urlencoded({ extended: true }));
app.use("/css", express.static(path.join(__dirname, "assets/css")));

const formatDate = ({ day, month, year }) =>
  `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`;

const parseISODate = iso => {
  const [year, month, day] = iso.split("-").map(Number);
  return { day, month, year };
};

app.get("/", (req, res) => res.render("home"));

app.get("/users", (req, res) => {
  const studentsWithFormattedBirth = students.map(s => ({
    ...s,
    birthFormatted: formatDate(s.birth)
  }));
  console.log("Dates envoyées à Pug :", studentsWithFormattedBirth.map(s => s.birthFormatted));
  res.render("users", { students: studentsWithFormattedBirth });
});

app.post("/add", (req, res) => {
  const { name, birth } = req.body;
  students.push({
    id: students.length ? Math.max(...students.map(s => s.id)) + 1 : 1,
    name,
    birth: parseISODate(birth)
  });
  res.redirect("/users");
});

app.get("/edit/:id", (req, res) => {
  const student = students.find(s => s.id === +req.params.id);
  if (!student) return res.redirect("/users");
  res.render("edit", {
    student: {
      ...student,
      birthISO: `${student.birth.year}-${String(student.birth.month).padStart(2, "0")}-${String(student.birth.day).padStart(2, "0")}`
    }
  });
});

app.post("/edit/:id", (req, res) => {
  const student = students.find(s => s.id === +req.params.id);
  if (student) {
    student.name = req.body.name;
    student.birth = parseISODate(req.body.birth);
  }
  res.redirect("/users");
});

app.post("/delete/:id", (req, res) => {
  students = students.filter(s => s.id !== +req.params.id);
  res.redirect("/users");
});

app.listen(PORT, HOST, () => console.log(`Serveur lancé : http://${HOST}:${PORT}`));
