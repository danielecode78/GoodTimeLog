const mongoose = require("mongoose");
const Experience = require("../models/experience");
const cities = require("./cities");
const { names, categories, types } = require("./seedHelpers");
const { array } = require("joi");

mongoose.connect("mongodb://localhost:27017/goodtimelog");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const randname = (array) => array[Math.floor(Math.random() * array.length)];
const locationDefault = async () => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=trieste&format=json&limit=10&addressdetails=1`
    );
    const arrayLocation = await res.json();
    return arrayLocation[0];
  } catch (err) {
    console.log("Errore", err);
    return null;
  }
};

const seedDB = async () => {
  await Experience.deleteMany({});
  for (let i = 0; i < 10; i++) {
    const randomnum = Math.floor(Math.random() * 1000);
    const rec = new Experience({
      location: await locationDefault(),
      title: `${randname(categories)} ${randname(names)}`,
      images: [
        {
          url: "https://res.cloudinary.com/dfnso3lmu/image/upload/v1754990947/GoodTimeLog/pbyxsocdyzkonlc04qvw.jpg",
          filename: "GoodTimeLog/pbyxsocdyzkonlc04qvw",
        },
        {
          url: "https://res.cloudinary.com/dfnso3lmu/image/upload/v1754990949/GoodTimeLog/vjtvvx1ckbyxx9vcg0ur.jpg",
          filename: "GoodTimeLog/vjtvvx1ckbyxx9vcg0ur",
        },
        {
          url: "https://res.cloudinary.com/dfnso3lmu/image/upload/v1754990949/GoodTimeLog/quiwl5ooctuwhop6hwuv.jpg",
          filename: "GoodTimeLog/quiwl5ooctuwhop6hwuv",
        },
      ],
      price: randomnum / 10,
      likes: randomnum ** 2,
      revisit: randomnum < 50,
      rate: Math.floor(randomnum / 200),
      type: `${randname(types)}`,
      story:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste eius quos corporis facilis quod consectetur aut blanditiis numquam, vel molestias reprehenderit placeat sunt incidunt aliquid eveniet. Odit repellat optio inventore. Ea corrupti velit veritatis impedit ad alias? Quia at quasi quaerat numquam, voluptas maiores consequatur ullam eius corporis vitae, ipsam odio sequi labore fuga pariatur molestias, cum perspiciatis! Cupiditate, aperiam? Corrupti ea, perspiciatis tenetur maxime consectetur pariatur, obcaecati dolorum nostrum fuga beatae autem enim maiores fugiat nihil sed laboriosam quod ducimus necessitatibus cupiditate. Numquam accusamus veniam saepe nobis pariatur delectus?",
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Recusandae esse at cupiditate dolorum nulla omnis laboriosam labore, saepe mollitia. Quod dolorem voluptate incidunt animi quibusdam corrupti deleniti nostrum neque eius.",
      author: "689616aebf0f174743c1bfea",
    });
    await rec.save();
  }
};

seedDB().then(() => {
  console.log("Seed successfully done!");
  mongoose.connection.close();
});
