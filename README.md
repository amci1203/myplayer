# MyPlayer (WIP)

---

I felt like doing something different that's not completely useless to me
so I decided to create a music player that utilizes the experimental
Filesystem API for myself and any other weirdo that still saves their music locally.

Chrome, Safari, and Opera support the API already as of writing this; other browsers
are unsupported.

This is a work in progress and there are bugs; bear with me here

---

## How to Run

  - Docker: If you have docker installed, build the image and bind port 3000 to
    your port of choice when you run the container

  - Node: This is a standard Next.js project; build production with `npm run build`
    and run the app with `npm start`. To use a port other than 3000, set the env var
    like so: `PORT={port} npm start`
