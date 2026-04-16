# RedSeam Clothing

## Project Overview

Redberry E-learing is an online platform which suggests consumers to choose the course they like and also choose the preferable day, time and session type.
Session type incldes three variants
-hybrid
-in person
-online

- Sort courses by five categories: newest first, price low to high, price high to low, Most popular, title: A-Z.
- Users chooses course adds up time date and session type, then takes the course.

## Features

- User registration and login.
- Successful registration automatically logs the user in.
- Avatar upload during registration; if none is provided, then avatar svg is displayed.
- Filter and sort courses based on user preference.
- Pagination on the products page.
- Modal for successful successfull registration, enrollment conflict, course completion.
- Loading states before displaying page content.

## Tech Stack

- Frontend: React, TypeScript, TailwindCSS
- State Management: Jotai, React Hook Form
- Validation: Zod, React Hook Form
- Routing: React Router DOM
- API Calls: Axios (`httpClient`)
- qs for displaying the filter results in url
- Optimized for 1920x1080 screen resolution
- husky installed so the following orders run after commit, to avoid chaotic code
    - yarn ts-check
    - yarn lint
    - yarn prettier

## How to Use

1. Clone the repository:

    git clone https://github.com/ZazaGordeziani/Redberry-E-learning.git

    install npm by just typing npm i or npm install in terminal and hit enter

    create .env file and set VITE_API_BASE_URL based on the following endpoint
    https://api.redclass.redberryinternship.ge/api
    npm run dev - to start the project

Vercel link to see the completed project - https://redberry-e-learning.vercel.app/
