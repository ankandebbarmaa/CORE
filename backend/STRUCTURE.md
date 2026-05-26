Backend structure overview

backend/
  src/
    server.js                # startup script, imports app and initializeDatabase
    mongo-app.js             # primary express app with routes and handlers
    app.js                   # legacy/simple express app
    db.js                    # database layer (mongo + file fallback)
    cloudinary.js            # cloudinary helper and uploadImage
    config/
      index.js               # central env-based config (created)
    middleware/
      auth.js                # authenticate/authorize middleware (created)
    models/
      Product.js
      Order.js
      Visit.js
    data/
      products.json
      orders.json
      visits.json

Notes:
- Route handlers currently live in `mongo-app.js`. Auth middleware and config have been moved to their own files for better structure.
- If you want, I can extract controllers into `controllers/` and routers into `routes/` next, e.g. `controllers/products.js`, `routes/products.js`.
