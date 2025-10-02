import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { Info, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";

const eps = 1e-9;

function pricePL(c: number, alpha: number, year: number, month: number) {
  const t = year + (month - 0.5) / 12;
  const x = Math.max(eps, t - 2009);
  return c * Math.pow(x, alpha);
}

function addMonths(ym: { y: number; m: number }, k: number) {
  const total = ym.y * 12 + (ym.m - 1) + k;
  const y = Math.floor(total / 12);
  const m = (total % 12) + 1;
  return { y, m };
}

function formatMoney(x: number, decimals = 0) {
  if (!isFinite(x)) return "-";
  return x.toLocaleString(undefined, { maximumFractionDigits: decimals });
}

function runSimulation(params: {
  cLower: number;
  cAvg: number;
  useLowerPostRetire: boolean;
  alpha: number;
  retire: { y: number; m: number };
  initialBTC: number;
  rOut: number;
  horizonYears: number;
}) {
  const { cLower, cAvg, useLowerPostRetire, alpha, retire, initialBTC, rOut, horizonYears } = params;

  const months = horizonYears * 12 + 1;
  const data: any[] = [];

  let btc = initialBTC;
  let exhaustedAt: { y: number; m: number } | null = null;
  let cumulativeOut = 0;

  const cUsed = useLowerPostRetire ? cLower : cAvg;

  for (let k = 0; k < months; k++) {
    const ym = addMonths(retire, k);
    const price = pricePL(cUsed, alpha, ym.y, ym.m);

    let sellBtc = 0;
    if (rOut > 0 && k > 0) {
      sellBtc = rOut / price;
      btc -= sellBtc;
      cumulativeOut += rOut;
      if (btc < 0 && !exhaustedAt) {
        exhaustedAt = { ...ym };
      }
      btc = Math.max(0, btc);
    }

    data.push({
      key: `${ym.y}-${ym.m}`,
      year: ym.y,
      month: ym.m,
      price,
      btc,
      usdValue: btc * price,
      sellBtc,
      cumulativeOut,
    });
  }

  const last = data[data.length - 1];
  const priceAtRetire = pricePL(cUsed, alpha, retire.y, retire.m);

  return {
    data,
    exhaustedAt,
    summary: {
      btcAtEnd: last.btc,
      usdAtEnd: last.usdValue,
      btcAtRetire: initialBTC,
      priceAtRetire,
      totalWithdrawnUsd: cumulativeOut,
    },
  };
}

function requiredBTCAtRetirement(params: {
  cLower: number;
  cAvg: number;
  useLowerPostRetire: boolean;
  alpha: number;
  retire: { y: number; m: number };
  rOut: number;
}) {
  const { cLower, cAvg, useLowerPostRetire, alpha, retire, rOut } = params;
  const cUsed = useLowerPostRetire ? cLower : cAvg;
  const t_r = Math.max(eps, retire.y + retire.m / 12 - 2009);
  const P_r = cUsed * Math.pow(t_r, alpha);
  const B_req = (rOut * 12 * t_r) / (P_r * Math.max(eps, (alpha - 1)));
  return { B_req, P_r, t_r };
}

function findMaxRout(params: Omit<Parameters<typeof runSimulation>[0], "rOut">) {
  let low = 0;
  let high = 1_000_000;
  for (let i = 0; i < 50; i++) {
    const mid = (low + high) / 2;
    const sim = runSimulation({ ...params, rOut: mid });
    if (sim.exhaustedAt) {
      high = mid;
    } else {
      low = mid;
    }
    if (high - low < 1) break;
  }
  return low;
}

export default function App() {
  const [yr, setYr] = useState(2025);
  const [mr, setMr] = useState(1);
  const [initialBTC, setInitialBTC] = useState(7.62);
  const [rOut, setRout] = useState(6000);
  const [alpha, setAlpha] = useState(5.7);
  const [cLower, setCLower] = useState(0.00441);
  const [cAvg, setCAvg] = useState(0.0096);
  const [useLowerPostRetire, setUseLowerPostRetire] = useState(true);
  const [horizonYears, setHorizonYears] = useState(80);

  const sim = useMemo(() =>
    runSimulation({ cLower, cAvg, useLowerPostRetire, alpha, retire: { y: yr, m: Math.max(1, mr || 1) }, initialBTC, rOut, horizonYears }),
    [cLower, cAvg, useLowerPostRetire, alpha, yr, mr, initialBTC, rOut, horizonYears]
  );

  const maxRout = useMemo(() =>
    findMaxRout({ cLower, cAvg, useLowerPostRetire, alpha, retire: { y: yr, m: Math.max(1, mr || 1) }, initialBTC, horizonYears }),
    [cLower, cAvg, useLowerPostRetire, alpha, yr, mr, initialBTC, horizonYears]
  );

  const req = useMemo(() => requiredBTCAtRetirement({ cLower, cAvg, useLowerPostRetire, alpha, retire: { y: yr, m: Math.max(1, mr || 1) }, rOut }),
    [cLower, cAvg, useLowerPostRetire, alpha, yr, mr, rOut]
  );

  const exhaustedLabel = sim.exhaustedAt ? `${sim.exhaustedAt.y}-${String(sim.exhaustedAt.m).padStart(2, "0")}` : "No (within horizon)";

  return (
    <div className="min-h-screen w-full bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="xl:col-span-1 space-y-4">
          <Card className="shadow-sm">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between mb-2">
  <h1 className="text-2xl font-semibold">BTC Win‑for‑Life</h1>
  <Info className="w-5 h-5 text-slate-400" />
</div>

<div className="grid grid-cols-2 gap-4">
  <div>
    <Label>Retire year</Label>
    <Input type="number" value={yr} onChange={(e)=>setYr(parseInt(e.target.value||"0"))} />
  </div>
  <div>
    <Label>Retire month</Label>
    <Input type="number" min={1} max={12} value={mr} onChange={(e)=>setMr(parseInt(e.target.value||"1"))} />
  </div>
  <div>
    <Label>BTC at retirement</Label>
    <Input type="number" step="0.0001" value={initialBTC} onChange={(e)=>setInitialBTC(parseFloat(e.target.value||"0"))} />
  </div>
  <div>
    <Label>Withdrawal r<sub>out</sub> (USD / month)</Label>
    <Input type="number" step="100" value={rOut} onChange={(e)=>setRout(parseFloat(e.target.value||"0"))} />
  </div>
  <div>
    <Label>Horizon (years)</Label>
    <Input type="number" min={1} max={120} value={horizonYears} onChange={(e)=>setHorizonYears(parseInt(e.target.value||"1"))} />
  </div>
</div>

<div className="pt-2 border-t" />

<div className="space-y-3">
  <Label>α (power exponent): {alpha.toFixed(2)}</Label>
  <Slider min={1} max={8} step={0.01} value={[alpha]} onValueChange={(v)=>setAlpha(v[0])} />
  <div className="grid grid-cols-2 gap-4">
    <div>
      <Label>c (Lower): {cLower}</Label>
      <Input type="number" step="0.00001" value={cLower} onChange={(e)=>setCLower(parseFloat(e.target.value||"0"))} />
    </div>
    <div>
      <Label>c (Average): {cAvg}</Label>
      <Input type="number" step="0.00001" value={cAvg} onChange={(e)=>setCAvg(parseFloat(e.target.value||"0"))} />
    </div>
  </div>
  <div className="flex items-center gap-3">
    <Switch checked={useLowerPostRetire} onCheckedChange={setUseLowerPostRetire} />
    <span className="text-sm text-slate-600">Use <strong>lower bound c</strong> for post‑retirement projections</span>
  </div>
</div>

<div className="pt-2 border-t" />

<div className="grid grid-cols-2 gap-4 text-sm">
  <div className="p-3 rounded-2xl bg-white shadow-sm">
    <div className="text-slate-500">BTC @ retirement</div>
    <div className="text-xl font-semibold">{sim.summary.btcAtRetire?.toFixed(6)}</div>
  </div>
  <div className="p-3 rounded-2xl bg-white shadow-sm">
    <div className="text-slate-500">Price @ retirement</div>
    <div className="text-xl font-semibold">${formatMoney(sim.summary.priceAtRetire,0)}</div>
  </div>
  <div className="p-3 rounded-2xl bg-white shadow-sm">
    <div className="text-slate-500">Required BTC for r_out</div>
    <div className="text-xl font-semibold">{req.B_req.toFixed(6)}</div>
  </div>
  <div className="p-3 rounded-2xl bg-white shadow-sm">
    <div className="text-slate-500">Gap (have − need)</div>
    <div className="text-xl font-semibold">{(initialBTC - req.B_req).toFixed(6)} BTC</div>
  </div>
  <div className="p-3 rounded-2xl bg-white shadow-sm">
    <div className="text-slate-500">Total withdrawn (USD)</div>
    <div className="text-xl font-semibold">${formatMoney(sim.summary.totalWithdrawnUsd,0)}</div>
  </div>
  <div className="p-3 rounded-2xl bg-white shadow-sm">
    <div className="text-slate-500">Exhausted?</div>
    <div className={`text-xl font-semibold ${sim.exhaustedAt ? "text-rose-600" : "text-emerald-600"}`}>{exhaustedLabel}</div>
  </div>
  <div className="p-3 rounded-2xl bg-white shadow-sm">
    <div className="text-slate-500">Max sustainable r<sub>out</sub></div>
    <div className="text-xl font-semibold">${formatMoney(maxRout,0)} / mo</div>
  </div>
</div>

<div className="flex flex-wrap gap-2">
  <Button variant="secondary" onClick={()=>{setCLower(0.00441); setCAvg(0.0096);}}>Preset c (LB/AVG)</Button>
  <Button variant="secondary" onClick={()=>{setAlpha(5.7);}}>Preset α = 5.7</Button>
  <Button variant="outline" onClick={()=>{setRout(Math.round(maxRout));}} className="gap-2">
    <RefreshCcw className="w-4 h-4"/> Set r<sub>out</sub> = max
  </Button>
</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="xl:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <CardContent className="p-5">
              <h2 className="text-lg font-semibold mb-4">BTC Balance & Portfolio Value</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <div className="h-72">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={sim.data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="key" hide />
        <YAxis />
        <Tooltip formatter={(v:any)=>typeof v==='number'?v.toFixed(6):v} />
        <Legend />
        <Line type="monotone" dataKey="btc" name="BTC balance" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
  <div className="h-72">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={sim.data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="key" hide />
        <YAxis />
        <Tooltip formatter={(v:any)=> typeof v==='number'? `$${formatMoney(v,0)}`:v} />
        <Legend />
        <Line type="monotone" dataKey="usdValue" name="USD value" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-5">
              <h2 className="text-lg font-semibold mb-4">Monthly table (first 240 rows shown)</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-600">
                      <th className="py-2 pr-4">Year</th>
                      <th className="py-2 pr-4">Month</th>
                      <th className="py-2 pr-4">Price (USD)</th>
                      <th className="py-2 pr-4">Sell BTC</th>
                      <th className="py-2 pr-4">BTC bal</th>
                      <th className="py-2 pr-4">USD value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sim.data.slice(0,240).map((d:any, i:number)=> (
                      <tr key={i} className="border-t">
                        <td className="py-1 pr-4">{d.year}</td>
                        <td className="py-1 pr-4">{d.month}</td>
                        <td className="py-1 pr-4">${formatMoney(d.price,0)}</td>
                        <td className="py-1 pr-4">{d.sellBtc? d.sellBtc.toFixed(6): ""}</td>
                        <td className="py-1 pr-4">{d.btc.toFixed(6)}</td>
                        <td className="py-1 pr-4">${formatMoney(d.usdValue,0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
