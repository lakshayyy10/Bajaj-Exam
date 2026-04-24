# BFHL Hierarchy Explorer 
##  Live Demo
*  Frontend: https://69eb700cf89e18f518bb3995--remarkable-longma-ed3d95.netlify.app/
*  Backend API: https://bajaj-exam-hp52.onrender.com/bfhl

---

##  What the API Does

The API processes a list of directed edges like:

```
A->B, A->C, B->D
```

and returns:

*  Valid hierarchies (tree structures)
*  Cycle detection
*  Invalid inputs
*  Duplicate edges
*  Summary (tree count, cycles, largest tree)

---

##  Tech Stack

* **Backend:** Node.js + Express
* **Frontend:** HTML, CSS, Vanilla JavaScript
* **Deployment:**

  * Backend → Render
  * Frontend → Netlify

---

##  Project Structure

```
bajaj/
├── backend/
│   ├── server.js
│   └── processor.js
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
└── README.md
```

---

##  Running Locally

### 1. Start Backend

```
cd backend
npm install
npm start
```

Server runs at:

```
http://localhost:3000
```

---

### 2. Run Frontend

Open:

```
frontend/index.html
```

Or serve it:

```
npx serve frontend
```

---
##  API Endpoint

### POST `/bfhl`

#### Request Body

```json
{
  "data": ["A->B", "A->C", "B->D"]
}
```

#### Response Includes

* `hierarchies`
* `invalid_entries`
* `duplicate_edges`
* `summary`

---

##  Example

Input:

```
A->B, A->C, B->D
```

Output:

* Root: A
* Depth: 3
* Tree: A → B → D, A → C

---

##  Important Notes

* Only uppercase single-letter nodes are valid
* Self-loops are treated as invalid
* Duplicate edges are tracked but not reused

---

##  Submitted by

Lakshay
RA2311003010229
SRM Institute of Science and Technology

---

