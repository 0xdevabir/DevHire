type Props = {
  searched: number;
  shortlisted: number;
  repos: number;
};

const labels = ["Searched", "Shortlisted", "Repos"] as const;

export default function StatsChart({ searched, shortlisted, repos }: Props) {
  const values = [searched, shortlisted, repos];
  const maxValue = Math.max(1, ...values);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="text-base font-semibold">Activity Snapshot</h2>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {values.map((value, index) => (
          <div key={labels[index]} className="flex flex-col items-center">
            <div className="flex h-36 w-full items-end rounded-md bg-slate-100 p-2">
              <div
                className="w-full rounded-sm bg-slate-900"
                style={{ height: `${(value / maxValue) * 100}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">{labels[index]}</p>
            <p className="text-sm font-semibold">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
