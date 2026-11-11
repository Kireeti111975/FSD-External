const express = require('express'), mongoose = require('mongoose'), path = require('path'), app = express();
const PORT = process.env.PORT === '8080' ? 3000 : (process.env.PORT || 5000);

mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://student:lab123@cluster0.mongodb.net/outings?retryWrites=true&w=majority').catch(()=>{});

const Pass = mongoose.model('Pass', new mongoose.Schema({
  studentName: { type: String, required: true }, rollNumber: { type: String, required: true },
    purpose: { type: String, required: true }, outDate: { type: String, required: true },
      inTime: { type: String, required: true }, status: { type: String, default: 'Pending' }
      }, { timestamps: true }));

      let mem = [];
      const isDb = () => mongoose.connection.readyState === 1;

      app.use(express.json());

      app.get('/passes', async (req, res) => res.json(isDb() ? await Pass.find().sort({ createdAt: -1 }) : mem.slice().reverse()));

      app.post('/passes', async (req, res) => {
        if (isDb()) return res.status(201).json(await Pass.create(req.body));
          const doc = { _id: Date.now().toString(), status: 'Pending', ...req.body };
            mem.push(doc); res.status(201).json(doc);
            });

            app.put('/passes/:id', async (req, res) => {
              if (isDb()) return res.json(await Pass.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }));
                const p = mem.find(x => x._id === req.params.id); if (p) p.status = req.body.status; res.json(p);
                });

                app.delete('/passes/:id', async (req, res) => {
                  if (isDb()) await Pass.findByIdAndDelete(req.params.id); else mem = mem.filter(x => x._id !== req.params.id);
                    res.json({ success: true });
                    });

                    app.get('/App.jsx', (req, res) => res.type('application/javascript').sendFile(path.resolve('App.jsx')));

                    app.get('*', (req, res) => res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Campus Outing & Day-Pass System</title><script src="https://cdn.tailwindcss.com"></script><script src="https://unpkg.com/react@18/umd/react.development.js"></script><script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script><script src="https://unpkg.com/@babel/standalone/babel.min.js"></script></head><body class="bg-slate-100 min-h-screen"><div id="root"></div><script type="text/babel" src="/App.jsx"></script></body></html>`));

                    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
                    