const { useState, useEffect } = React;

function App() {
  const [passes, setPasses] = useState([]), [view, setView] = useState('student');
  const [f, setF] = useState({ studentName: '', rollNumber: '', purpose: '', outDate: '', inTime: '' });

  const load = () => fetch('/passes').then(r => r.json()).then(setPasses);
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    await fetch('/passes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) });
    setF({ studentName: '', rollNumber: '', purpose: '', outDate: '', inTime: '' });
    load();
  };
  const update = async (id, status) => { await fetch(`/passes/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) }); load(); };
  const del = async (id) => { await fetch(`/passes/${id}`, { method: 'DELETE' }); load(); };

  return (
    <div className="max-w-3xl mx-auto space-y-4 p-4">
      <div className="flex justify-between items-center bg-white p-3 rounded shadow">
        <h1 className="font-bold text-indigo-700">Campus Outing Portal</h1>
        <div className="space-x-2">
          {['student', 'warden'].map(v => (
            <button key={v} onClick={() => setView(v)} className={`px-3 py-1 rounded text-xs font-semibold capitalize ${view === v ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>{v}</button>
          ))}
        </div>
      </div>
      {view === 'student' ? (
        <div className="space-y-4">
          <form onSubmit={submit} className="bg-white p-4 rounded shadow grid grid-cols-2 md:grid-cols-3 gap-2">
            <input className="border p-1.5 rounded text-sm" placeholder="Name" required value={f.studentName} onChange={e => setF({...f, studentName: e.target.value})} />
            <input className="border p-1.5 rounded text-sm" placeholder="Roll No" required value={f.rollNumber} onChange={e => setF({...f, rollNumber: e.target.value})} />
            <input className="border p-1.5 rounded text-sm" placeholder="Purpose" required value={f.purpose} onChange={e => setF({...f, purpose: e.target.value})} />
            <input className="border p-1.5 rounded text-sm" type="date" required value={f.outDate} onChange={e => setF({...f, outDate: e.target.value})} />
            <input className="border p-1.5 rounded text-sm" type="time" required value={f.inTime} onChange={e => setF({...f, inTime: e.target.value})} />
            <button className="bg-indigo-600 text-white text-sm font-semibold rounded p-1.5">Apply Pass</button>
          </form>
          <div className="bg-white p-4 rounded shadow space-y-2">
            <h2 className="font-bold text-sm text-gray-600">My Requests</h2>
            {passes.map(p => (
              <div key={p._id} className="border p-2 rounded flex justify-between text-sm">
                <span><b>{p.studentName}</b> ({p.rollNumber}) — {p.purpose}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${p.status === 'Approved' ? 'bg-green-100 text-green-700' : p.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{p.status}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white p-4 rounded shadow space-y-2">
          <h2 className="font-bold text-sm text-gray-600">Warden Approval Queue</h2>
          {passes.map(p => (
            <div key={p._id} className="border p-2 rounded flex items-center justify-between text-sm">
              <div><b>{p.studentName}</b> ({p.rollNumber}) | <span className="text-gray-500">{p.purpose} - {p.outDate} ({p.inTime})</span> <span className="text-xs font-bold text-indigo-600">[{p.status}]</span></div>
              <div className="space-x-1">
                <button onClick={() => update(p._id, 'Approved')} className="bg-emerald-600 text-white text-xs px-2 py-1 rounded">Approve</button>
                <button onClick={() => update(p._id, 'Rejected')} className="bg-amber-600 text-white text-xs px-2 py-1 rounded">Reject</button>
                <button onClick={() => del(p._id)} className="bg-rose-600 text-white text-xs px-2 py-1 rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
