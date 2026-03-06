export default function StatsBar() {
  const stats = [
    { number: '88', label: 'Total Units' },
    { number: '6', label: 'Floor Plans' },
    { number: '1925', label: 'Est.' },
    { number: '53210', label: 'Milwaukee, WI' },
  ];

  return (
    <aside className="stats-bar">
      <div className="container">
        <div className="stats-inner">
          {stats.map((s) => (
            <div key={s.label} className="stat-item">
              <div className="stat-number">{s.number}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
