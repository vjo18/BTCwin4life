import { useMemo, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { Info, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";

const eps = 1e-9;
const GENESIS_MS = Date.UTC(2009, 0, 3); // 2009-01-03

// -----------------------------
// Monthly closes (USD)
// -----------------------------
const btcMonthlyCloses = [
  { date: "2025-10-01", price: 114591.9 },
  { date: "2025-09-01", price: 114048.5 },
  { date: "2025-08-01", price: 108226.8 },
  { date: "2025-07-01", price: 115765.0 },
  { date: "2025-06-01", price: 107171.1 },
  { date: "2025-05-01", price: 104598.0 },
  { date: "2025-04-01", price: 94184.4 },
  { date: "2025-03-01", price: 82548.8 },
  { date: "2025-02-01", price: 84381.2 },
  { date: "2025-01-01", price: 94536.1 },
  { date: "2024-12-01", price: 93557.2 },
  { date: "2024-11-01", price: 96405.7 },
  { date: "2024-10-01", price: 70281.8 },
  { date: "2024-09-01", price: 63339.2 },
  { date: "2024-08-01", price: 58978.6 },
  { date: "2024-07-01", price: 64626.0 },
  { date: "2024-06-01", price: 62754.3 },
  { date: "2024-05-01", price: 67530.1 },
  { date: "2024-04-01", price: 60666.6 },
  { date: "2024-03-01", price: 71332.0 },
  { date: "2024-02-01", price: 61169.3 },
  { date: "2024-01-01", price: 42580.5 },
  { date: "2023-12-01", price: 42272.5 },
  { date: "2023-11-01", price: 37712.9 },
  { date: "2023-10-01", price: 34650.6 },
  { date: "2023-09-01", price: 26962.7 },
  { date: "2023-08-01", price: 25937.3 },
  { date: "2023-07-01", price: 29232.4 },
  { date: "2023-06-01", price: 30472.9 },
  { date: "2023-05-01", price: 27216.1 },
  { date: "2023-04-01", price: 29252.1 },
  { date: "2023-03-01", price: 28473.7 },
  { date: "2023-02-01", price: 23130.5 },
  { date: "2023-01-01", price: 23125.1 },
  { date: "2022-12-01", price: 16537.4 },
  { date: "2022-11-01", price: 17163.9 },
  { date: "2022-10-01", price: 20496.3 },
  { date: "2022-09-01", price: 19423.0 },
  { date: "2022-08-01", price: 20043.9 },
  { date: "2022-07-01", price: 23303.4 },
  { date: "2022-06-01", price: 19926.6 },
  { date: "2022-05-01", price: 31793.4 },
  { date: "2022-04-01", price: 37650.0 },
  { date: "2022-03-01", price: 45525.0 },
  { date: "2022-02-01", price: 43188.2 },
  { date: "2022-01-01", price: 38498.6 },
  { date: "2021-12-01", price: 46219.5 },
  { date: "2021-11-01", price: 56882.9 },
  { date: "2021-10-01", price: 61309.6 },
  { date: "2021-09-01", price: 43823.3 },
  { date: "2021-08-01", price: 47130.4 },
  { date: "2021-07-01", price: 41553.7 },
  { date: "2021-06-01", price: 35026.9 },
  { date: "2021-05-01", price: 37298.6 },
  { date: "2021-04-01", price: 57720.3 },
  { date: "2021-03-01", price: 58763.7 },
  { date: "2021-02-01", price: 45164.0 },
  { date: "2021-01-01", price: 33108.1 },
  { date: "2020-12-01", price: 28949.4 },
  { date: "2020-11-01", price: 19698.1 },
  { date: "2020-10-01", price: 13797.3 },
  { date: "2020-09-01", price: 10776.1 },
  { date: "2020-08-01", price: 11644.2 },
  { date: "2020-07-01", price: 11333.4 },
  { date: "2020-06-01", price: 9135.4 },
  { date: "2020-05-01", price: 9454.8 },
  { date: "2020-04-01", price: 8629.0 },
  { date: "2020-03-01", price: 6412.5 },
  { date: "2020-02-01", price: 8543.7 },
  { date: "2020-01-01", price: 9349.1 },
  { date: "2019-12-01", price: 7196.4 },
  { date: "2019-11-01", price: 7546.6 },
  { date: "2019-10-01", price: 9152.6 },
  { date: "2019-09-01", price: 8284.3 },
  { date: "2019-08-01", price: 9594.4 },
  { date: "2019-07-01", price: 10082.0 },
  { date: "2019-06-01", price: 10818.6 },
  { date: "2019-05-01", price: 8558.3 },
  { date: "2019-04-01", price: 5320.8 },
  { date: "2019-03-01", price: 4102.3 },
  { date: "2019-02-01", price: 3816.6 },
  { date: "2019-01-01", price: 3437.2 },
  { date: "2018-12-01", price: 3709.4 },
  { date: "2018-11-01", price: 4039.7 },
  { date: "2018-10-01", price: 6365.9 },
  { date: "2018-09-01", price: 6635.2 },
  { date: "2018-08-01", price: 7033.8 },
  { date: "2018-07-01", price: 7729.4 },
  { date: "2018-06-01", price: 6398.9 },
  { date: "2018-05-01", price: 7502.6 },
  { date: "2018-04-01", price: 9245.1 },
  { date: "2018-03-01", price: 6938.2 },
  { date: "2018-02-01", price: 10333.9 },
  { date: "2018-01-01", price: 10265.4 },
  { date: "2017-12-01", price: 13850.4 },
  { date: "2017-11-01", price: 9946.8 },
  { date: "2017-10-01", price: 6451.2 },
  { date: "2017-09-01", price: 4360.6 },
  { date: "2017-08-01", price: 4735.1 },
  { date: "2017-07-01", price: 2883.3 },
  { date: "2017-06-01", price: 2480.6 },
  { date: "2017-05-01", price: 2303.3 },
  { date: "2017-04-01", price: 1351.9 },
  { date: "2017-03-01", price: 1079.1 },
  { date: "2017-02-01", price: 1189.3 },
  { date: "2017-01-01", price: 965.5 },
  { date: "2016-12-01", price: 963.4 },
  { date: "2016-11-01", price: 742.5 },
  { date: "2016-10-01", price: 698.7 },
  { date: "2016-09-01", price: 608.1 },
  { date: "2016-08-01", price: 573.9 },
  { date: "2016-07-01", price: 621.9 },
  { date: "2016-06-01", price: 670.0 },
  { date: "2016-05-01", price: 528.9 },
  { date: "2016-04-01", price: 448.5 },
  { date: "2016-03-01", price: 415.7 },
  { date: "2016-02-01", price: 436.2 },
  { date: "2016-01-01", price: 369.8 },
  { date: "2015-12-01", price: 430.0 },
  { date: "2015-11-01", price: 378.0 },
  { date: "2015-10-01", price: 311.2 },
  { date: "2015-09-01", price: 235.9 },
  { date: "2015-08-01", price: 229.5 },
  { date: "2015-07-01", price: 283.7 },
  { date: "2015-06-01", price: 264.1 },
  { date: "2015-05-01", price: 229.8 },
  { date: "2015-04-01", price: 235.8 },
  { date: "2015-03-01", price: 244.1 },
  { date: "2015-02-01", price: 254.1 },
  { date: "2015-01-01", price: 218.5 },
  { date: "2014-12-01", price: 318.2 },
  { date: "2014-11-01", price: 374.9 },
  { date: "2014-10-01", price: 337.9 },
  { date: "2014-09-01", price: 388.2 },
  { date: "2014-08-01", price: 481.8 },
  { date: "2014-07-01", price: 589.5 },
  { date: "2014-06-01", price: 635.1 },
  { date: "2014-05-01", price: 627.9 },
  { date: "2014-04-01", price: 445.6 },
  { date: "2014-03-01", price: 444.7 },
  { date: "2014-02-01", price: 573.9 },
  { date: "2014-01-01", price: 938.8 },
  { date: "2013-12-01", price: 805.9 },
  { date: "2013-11-01", price: 1205.7 },
  { date: "2013-10-01", price: 211.2 },
  { date: "2013-09-01", price: 141.9 },
  { date: "2013-08-01", price: 141.0 },
  { date: "2013-07-01", price: 106.2 },
  { date: "2013-06-01", price: 97.5 },
  { date: "2013-05-01", price: 128.8 },
  { date: "2013-04-01", price: 139.2 },
  { date: "2013-03-01", price: 93.0 },
  { date: "2013-02-01", price: 33.4 },
  { date: "2013-01-01", price: 20.4 },
  { date: "2012-12-01", price: 13.5 },
  { date: "2012-11-01", price: 12.6 },
  { date: "2012-10-01", price: 11.2 },
  { date: "2012-09-01", price: 12.4 },
  { date: "2012-08-01", price: 10.2 },
  { date: "2012-07-01", price: 9.4 },
  { date: "2012-06-01", price: 6.7 },
  { date: "2012-05-01", price: 5.2 },
  { date: "2012-04-01", price: 4.9 },
  { date: "2012-03-01", price: 4.9 },
  { date: "2012-02-01", price: 4.9 },
  { date: "2012-01-01", price: 5.5 },
  { date: "2011-12-01", price: 4.7 },
  { date: "2011-11-01", price: 3.0 },
  { date: "2011-10-01", price: 3.3 },
  { date: "2011-09-01", price: 5.1 },
  { date: "2011-08-01", price: 8.2 },
  { date: "2011-07-01", price: 13.4 },
  { date: "2011-06-01", price: 16.1 },
  { date: "2011-05-01", price: 8.7 },
  { date: "2011-04-01", price: 3.5 },
  { date: "2011-03-01", price: 0.8 },
  { date: "2011-02-01", price: 0.9 },
  { date: "2011-01-01", price: 0.5 },
  { date: "2010-12-01", price: 0.3 },
  { date: "2010-11-01", price: 0.2 },
  { date: "2010-10-01", price: 0.2 },
  { date: "2010-09-01", price: 0.1 },
  { date: "2010-08-01", price: 0.1 },
];

// -----------------------------
// helpers
// -----------------------------
function daysSinceGenesisFromYearMonth(year: number, month: number) {
  const ms = Date.UTC(year, month - 1, 1);
  const d = (ms - GENESIS_MS) / (1000 * 60 * 60 * 24);
  return Math.max(eps, d);
}
function daysSinceGenesisFromDateStr(dateStr: string) {
  const ms = new Date(dateStr + "T00:00:00Z").getTime();
  const d = (ms - GENESIS_MS) / (1000 * 60 * 60 * 24);
  return Math.max(eps, d);
}

// price = a * days^b
function pricePLDays(a: number, b: number, year: number, month: number) {
  const d = daysSinceGenesisFromYearMonth(year, month);
  return a * Math.pow(d, b);
}

// linear regression in log10 space
// x = log10(days), y = log10(price)
function linearRegressionStats(xs: number[], ys: number[]) {
  const n = xs.length;
  const xMean = xs.reduce((p, c) => p + c, 0) / n;
  const yMean = ys.reduce((p, c) => p + c, 0) / n;

  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - xMean) * (ys[i] - yMean);
    den += (xs[i] - xMean) * (xs[i] - xMean);
  }
  const B = num / (den || 1e-12); // slope bExp
  const A = yMean - B * xMean; // intercept log10(a)
  let ssRes = 0;
  let ssTot = 0;
  for (let i = 0; i < n; i++) {
    const yPred = A + B * xs[i];
    ssRes += (ys[i] - yPred) ** 2;
    ssTot += (ys[i] - yMean) ** 2;
  }
  const r2 = 1 - ssRes / (ssTot || 1e-12);
  return { A, B, r2 }; // a = 10^A
}

// add months
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

function formatYTick(v: number) {
  if (!isFinite(v) || v <= 0) return "";
  if (v >= 1_000_000_000) {
    return "$" + (v / 1_000_000_000).toFixed(2) + "B";
  } else if (v >= 1_000_000) {
    return "$" + (v / 1_000_000).toFixed(2) + "M";
  } else if (v >= 1_000) {
    return "$" + (v / 1_000).toFixed(0) + "k";
  } else if (v >= 1) {
    return "$" + v.toFixed(0);
  } else {
    return "$" + v.toPrecision(2);
  }
}

// -----------------------------
// Simulation (uses aAvg / aLower / bExp)
// -----------------------------
function runSimulation(params: {
  aLower: number;
  aAvg: number;
  useLowerPostRetire: boolean;
  bExp: number;
  retire: { y: number; m: number };
  initialBTC: number;
  rOutBase: number;
  inflAnnual: number;
  horizonYears: number;
}) {
  const {
    aLower,
    aAvg,
    useLowerPostRetire,
    bExp,
    retire,
    initialBTC,
    rOutBase,
    inflAnnual,
    horizonYears,
  } = params;

  const months = horizonYears * 12 + 1;
  const data: any[] = [];

  let btc = initialBTC;
  let exhaustedAt: { y: number; m: number } | null = null;
  let cumulativeOut = 0;

  const aUsed = useLowerPostRetire ? aLower : aAvg;
  const monthlyInflFactor = Math.pow(1 + inflAnnual, 1 / 12);

  for (let k = 0; k < months; k++) {
    const ym = addMonths(retire, k);
    const price = pricePLDays(aUsed, bExp, ym.y, ym.m);

    const rOutThisMonth =
      k === 0 ? 0 : rOutBase * Math.pow(monthlyInflFactor, k);

    let sellBtc = 0;
    if (rOutThisMonth > 0 && k > 0) {
      sellBtc = rOutThisMonth / price;
      btc -= sellBtc;
      cumulativeOut += rOutThisMonth;

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
      rOutThisMonth,
      cumulativeOut,
    });
  }

  const last = data[data.length - 1];
  const priceAtRetire = pricePLDays(aUsed, bExp, retire.y, retire.m);

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

// rough requirement calc
function requiredBTCAtRetirement(params: {
  aLower: number;
  aAvg: number;
  useLowerPostRetire: boolean;
  bExp: number;
  retire: { y: number; m: number };
  rOut: number;
}) {
  const { aLower, aAvg, useLowerPostRetire, bExp, retire, rOut } = params;
  const aUsed = useLowerPostRetire ? aLower : aAvg;

  const d_r = daysSinceGenesisFromYearMonth(retire.y, retire.m);
  const P_r = aUsed * Math.pow(d_r, bExp);

  // approx using years since genesis as horizon scale
  const T_years = d_r / 365.25;
  const denom = Math.max(eps, bExp - 1);
  const B_req = (rOut * 12 * T_years) / (P_r * denom);

  return { B_req, P_r };
}

// solve BTC needed to fund indexed withdrawals
function findRequiredBTCForRoutIndexed(params: {
  aLower: number;
  aAvg: number;
  useLowerPostRetire: boolean;
  bExp: number;
  retire: { y: number; m: number };
  targetROutBase: number;
  inflAnnual: number;
  horizonYears: number;
}) {
  const {
    aLower,
    aAvg,
    useLowerPostRetire,
    bExp,
    retire,
    targetROutBase,
    inflAnnual,
    horizonYears,
  } = params;

  let low = 0;
  let high = 1_000_000;
  for (let i = 0; i < 50; i++) {
    const mid = (low + high) / 2;
    const sim = runSimulation({
      aLower,
      aAvg,
      useLowerPostRetire,
      bExp,
      retire,
      initialBTC: mid,
      rOutBase: targetROutBase,
      inflAnnual,
      horizonYears,
    });
    const exhausted = sim.exhaustedAt !== null;
    if (exhausted) {
      low = mid;
    } else {
      high = mid;
    }
    if (high - low < 1e-6) break;
  }
  return high;
}

// find max sustainable starting rOut
function findMaxRout(params: {
  aLower: number;
  aAvg: number;
  useLowerPostRetire: boolean;
  bExp: number;
  retire: { y: number; m: number };
  initialBTC: number;
  inflAnnual: number;
  horizonYears: number;
  finiteHorizonMode: boolean;
}) {
  const {
    aLower,
    aAvg,
    useLowerPostRetire,
    bExp,
    retire,
    initialBTC,
    inflAnnual,
    horizonYears,
    finiteHorizonMode,
  } = params;

  let low = 0;
  let high = 1_000_000;
  for (let i = 0; i < 50; i++) {
    const mid = (low + high) / 2;
    const testHorizonYears = finiteHorizonMode ? horizonYears : 200;
    const sim = runSimulation({
      aLower,
      aAvg,
      useLowerPostRetire,
      bExp,
      retire,
      initialBTC,
      rOutBase: mid,
      inflAnnual,
      horizonYears: testHorizonYears,
    });
    const exhaustedWithinTest = sim.exhaustedAt !== null;
    if (exhaustedWithinTest) {
      high = mid;
    } else {
      low = mid;
    }
    if (high - low < 1) break;
  }
  return low;
}

// rolling fits: cumulative regression up to each month
function buildRollingFits(data: { date: string; price: number }[]) {
  const sorted = [...data].sort(
    (a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const results: {
    ts: number;
    year: number;
    labelDate: string;
    bExp: number;
    aCoef: number;
    r2: number;
    n: number;
  }[] = [];

  const xsAll: number[] = [];
  const ysAll: number[] = [];

  for (let i = 0; i < sorted.length; i++) {
    const row = sorted[i];
    const d = daysSinceGenesisFromDateStr(row.date);
    if (d <= 0 || row.price <= 0) continue;

    xsAll.push(Math.log10(d));
    ysAll.push(Math.log10(row.price));

    if (xsAll.length < 12) continue; // skip early tiny sample

    const { A, B, r2 } = linearRegressionStats(xsAll, ysAll);
    const aCoef = 10 ** A;

    const ts = new Date(row.date + "T00:00:00Z").getTime();
    const yr = new Date(ts).getUTCFullYear();

    results.push({
      ts,
      year: yr,
      labelDate: row.date,
      bExp: B,
      aCoef,
      r2,
      n: xsAll.length,
    });
  }

  return results;
}

export default function App() {
  // retirement / financial inputs
  const [yr, setYr] = useState(2029);
  const [mr, setMr] = useState(1);
  const [initialBTC, setInitialBTC] = useState(1.62);
  const [rOut, setRout] = useState(3000);
  const [inflAnnual, setInflAnnual] = useState(0.02);
  const [horizonYears, setHorizonYears] = useState(25);
  const [finiteHorizonMode, setFiniteHorizonMode] = useState(false);

  // power law params (excel fit)
  // aAvg ~ centrale lijn
  // aLower ~ floor band (bijv. 2.5e percentiel of 40%)
  // bExp ~ exponent
  const [bExp, setBExp] = useState(5.5697);
  const [aAvg, setAAvg] = useState(8.85116e-17);
  const [aLower, setALower] = useState(8.85116e-17 * 0.4);
  const [useLowerPostRetire, setUseLowerPostRetire] = useState(true);

  // calculators / what-if inputs
  const [targetROut, setTargetROut] = useState(6000);
  const [goalYear, setGoalYear] = useState(2035);
  const [goalMonth, setGoalMonth] = useState(1);
  const [goalUsd, setGoalUsd] = useState(500000);
  const [projYear, setProjYear] = useState(2035);
  const [projMonth, setProjMonth] = useState(1);
  const [freedomTargetROut, setFreedomTargetROut] = useState(6000);
  const [inflRefAmount, setInflRefAmount] = useState(6000);
  const [inflYearsAhead, setInflYearsAhead] = useState(10);

  // chart scale toggles for the BIG BTC price chart
  const [yScale, setYScale] = useState<"linear" | "log">("log");
  const [xScale, setXScale] = useState<"time" | "logd">("time");

  // live BTC price
  const [livePrice, setLivePrice] = useState<number | null>(null);
  useEffect(() => {
    async function fetchLive() {
      try {
        const res = await fetch(
          "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"
        );
        const json = await res.json();
        if (json && json.price) {
          setLivePrice(parseFloat(json.price));
        }
      } catch (err) {
        console.error("live price error", err);
      }
    }
    fetchLive();
    const id = setInterval(fetchLive, 10000);
    return () => clearInterval(id);
  }, []);

  // --- rolling fits (for b and R² charts, and for "current" a,b,R²)
  const rollingFits = useMemo(
    () => buildRollingFits(btcMonthlyCloses),
    []
  );
  const latestFit = rollingFits.length
    ? rollingFits[rollingFits.length - 1]
    : null;

  // --- main retirement simulation
  const sim = useMemo(
    () =>
      runSimulation({
        aLower,
        aAvg,
        useLowerPostRetire,
        bExp,
        retire: { y: yr, m: Math.max(1, mr || 1) },
        initialBTC,
        rOutBase: rOut,
        inflAnnual,
        horizonYears,
      }),
    [
      aLower,
      aAvg,
      useLowerPostRetire,
      bExp,
      yr,
      mr,
      initialBTC,
      rOut,
      inflAnnual,
      horizonYears,
    ]
  );

  const maxRout = useMemo(
    () =>
      findMaxRout({
        aLower,
        aAvg,
        useLowerPostRetire,
        bExp,
        retire: { y: yr, m: Math.max(1, mr || 1) },
        initialBTC,
        inflAnnual,
        horizonYears,
        finiteHorizonMode,
      }),
    [
      aLower,
      aAvg,
      useLowerPostRetire,
      bExp,
      yr,
      mr,
      initialBTC,
      inflAnnual,
      horizonYears,
      finiteHorizonMode,
    ]
  );

  const reqNoInfl = useMemo(
    () =>
      requiredBTCAtRetirement({
        aLower,
        aAvg,
        useLowerPostRetire,
        bExp,
        retire: { y: yr, m: Math.max(1, mr || 1) },
        rOut,
      }),
    [aLower, aAvg, useLowerPostRetire, bExp, yr, mr, rOut]
  );

  const reqIndexedBtc = useMemo(
    () =>
      findRequiredBTCForRoutIndexed({
        aLower,
        aAvg,
        useLowerPostRetire,
        bExp,
        retire: { y: yr, m: Math.max(1, mr || 1) },
        targetROutBase: rOut,
        inflAnnual,
        horizonYears,
      }),
    [
      aLower,
      aAvg,
      useLowerPostRetire,
      bExp,
      yr,
      mr,
      rOut,
      inflAnnual,
      horizonYears,
    ]
  );

  const exhaustedLabel = sim.exhaustedAt
    ? `${sim.exhaustedAt.y}-${String(sim.exhaustedAt.m).padStart(2, "0")}`
    : "No (within horizon)";

  // --- one-time goal calc
  const oneTimeGoalCalc = useMemo(() => {
    const pLower = pricePLDays(aLower, bExp, goalYear, goalMonth);
    const pAvg = pricePLDays(aAvg, bExp, goalYear, goalMonth);
    return {
      priceLower: pLower,
      priceAvg: pAvg,
      btcNeededLower: goalUsd / pLower,
      btcNeededAvg: goalUsd / pAvg,
    };
  }, [goalYear, goalMonth, goalUsd, aLower, aAvg, bExp]);

  // --- projection calc
  const projPrice = useMemo(() => {
    const pLower = pricePLDays(aLower, bExp, projYear, projMonth);
    const pAvg = pricePLDays(aAvg, bExp, projYear, projMonth);
    return {
      priceLower: pLower,
      priceAvg: pAvg,
      tenLower: pLower * 10,
      tenAvg: pAvg * 10,
      hundredLower: pLower * 100,
      hundredAvg: pAvg * 100,
    };
  }, [projYear, projMonth, aLower, aAvg, bExp]);

  // --- retirement year sweep
  const retirementYearSweep = useMemo(() => {
    const arr: { year: number; btcRequired: number }[] = [];
    for (let y = yr; y <= yr + 40; y++) {
      const { B_req } = requiredBTCAtRetirement({
        aLower,
        aAvg,
        useLowerPostRetire,
        bExp,
        retire: { y, m: mr },
        rOut: targetROut,
      });
      arr.push({ year: y, btcRequired: B_req });
    }
    return arr;
  }, [yr, mr, targetROut, aLower, aAvg, useLowerPostRetire, bExp]);

  // --- financial freedom year
  const financialFreedom = useMemo(() => {
    let achievedYear: number | null = null;
    for (let y = yr; y <= 2100; y++) {
      const { B_req } = requiredBTCAtRetirement({
        aLower,
        aAvg,
        useLowerPostRetire,
        bExp,
        retire: { y, m: mr },
        rOut: freedomTargetROut,
      });
      if (initialBTC + eps >= B_req) {
        achievedYear = y;
        break;
      }
    }
    return achievedYear;
  }, [
    yr,
    mr,
    initialBTC,
    freedomTargetROut,
    aLower,
    aAvg,
    useLowerPostRetire,
    bExp,
  ]);

  // --- inflation calc
  const inflCalc = useMemo(() => {
    const futureNominal =
      inflRefAmount * Math.pow(1 + inflAnnual, inflYearsAhead);
    return { futureNominal };
  }, [inflRefAmount, inflAnnual, inflYearsAhead]);

  // --- main BTC price chart data
  // we generate monthly points from ~2010-05 tot horizon
  const topChartData = useMemo(() => {
    const endYear = yr + horizonYears;
    const rows: {
      ts: number;
      year: number;
      month: number;
      dateStr: string;
      logDaysX: number;
      plLower: number | null;
      plAvg: number | null;
      marketMonthlyClose: number | null;
    }[] = [];

    const cutoffYear = 2010;
    const cutoffMonth = 5;

    function safeVal(p: number) {
      return p >= 0.01 ? p : null;
    }

    let y0 = 2010;
    let m0 = 1;
    while (y0 < endYear || (y0 === endYear && m0 <= 12)) {
      const ts = Date.UTC(y0, m0 - 1, 1);
      const d = daysSinceGenesisFromYearMonth(y0, m0);
      const logDaysX = Math.log10(Math.max(eps, d));

      const pL = safeVal(pricePLDays(aLower, bExp, y0, m0));
      const pA = safeVal(pricePLDays(aAvg, bExp, y0, m0));

      const dateStr = new Date(ts).toISOString().slice(0, 10);
      const match = btcMonthlyCloses.find((r) => r.date === dateStr);

      const isBeforeCutoff =
        y0 < cutoffYear || (y0 === cutoffYear && m0 < cutoffMonth);

      if (!isBeforeCutoff) {
        rows.push({
          ts,
          year: y0,
          month: m0,
          dateStr,
          logDaysX,
          plLower: pL,
          plAvg: pA,
          marketMonthlyClose: match ? match.price : null,
        });
      }
      m0++;
      if (m0 > 12) {
        m0 = 1;
        y0++;
      }
    }

    return rows;
  }, [aLower, aAvg, bExp, yr, horizonYears]);

  // --- today's metrics for the KPI bar
  const today = new Date();
  const todayY = today.getUTCFullYear();
  const todayM = today.getUTCMonth() + 1;
  const dToday = daysSinceGenesisFromYearMonth(todayY, todayM);
  const plAvgToday = aAvg * Math.pow(dToday, bExp);
  const plLowerToday = aLower * Math.pow(dToday, bExp);
  const daysSinceGenesisToday = Math.floor(dToday);

  const currentA = aAvg; // centrale lijn a
  const currentB = bExp;
  const currentR2 = latestFit ? latestFit.r2 : null;

  // Axis ticks (years) for rolling charts
  // We'll create nice year ticks from first->last
  const rollingYears = rollingFits.map((r) => r.year);
  const minYear = rollingYears.length ? Math.min(...rollingYears) : 2011;
  const maxYear = rollingYears.length ? Math.max(...rollingYears) : todayY;
  const yearTicks: number[] = [];
  for (let y = minYear; y <= maxYear; y++) {
    // pick Jan 1 UTC timestamp
    yearTicks.push(Date.UTC(y, 0, 1));
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* ============ BIG POWER LAW CARD ============ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="shadow-sm">
            <CardContent className="p-5 space-y-4">
              {/* HEADER + KPI BAR */}
              <div className="flex flex-col gap-4">
                {/* title row + toggles */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">
                      BTC Power Law (days since genesis)
                    </h2>
                    <div className="text-xs text-slate-600">
                      2010 → {yr + horizonYears} (
                      {yScale === "log" ? "log y" : "linear y"},{" "}
                      {xScale === "logd" ? "log(days)" : "time x"}). Dit zou in
                      log/log bijna een rechte lijn moeten zijn.
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <span>Y log</span>
                      <Switch
                        checked={yScale === "log"}
                        onCheckedChange={(val) =>
                          setYScale(val ? "log" : "linear")
                        }
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <span>X log</span>
                      <Switch
                        checked={xScale === "logd"}
                        onCheckedChange={(val) =>
                          setXScale(val ? "logd" : "time")
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* KPI row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 text-[11px] text-slate-700">
                  <div className="rounded-xl bg-white border shadow-sm p-3 flex flex-col">
                    <div className="text-slate-500 uppercase text-[10px] tracking-wide">
                      Live BTC/USD
                    </div>
                    <div className="text-sm font-semibold text-emerald-700">
                      {livePrice ? `$${formatMoney(livePrice, 0)}` : "..."}
                    </div>
                  </div>

                  <div className="rounded-xl bg-white border shadow-sm p-3 flex flex-col">
                    <div className="text-slate-500 uppercase text-[10px] tracking-wide">
                      PL avg today
                    </div>
                    <div className="text-sm font-semibold">
                      ${formatMoney(plAvgToday, 0)}
                    </div>
                  </div>

                  <div className="rounded-xl bg-white border shadow-sm p-3 flex flex-col">
                    <div className="text-slate-500 uppercase text-[10px] tracking-wide">
                      PL support today
                    </div>
                    <div className="text-sm font-semibold text-sky-700">
                      ${formatMoney(plLowerToday, 0)}
                    </div>
                  </div>

                  <div className="rounded-xl bg-white border shadow-sm p-3 flex flex-col">
                    <div className="text-slate-500 uppercase text-[10px] tracking-wide">
                      Days since genesis
                    </div>
                    <div className="text-sm font-semibold">
                      {daysSinceGenesisToday.toLocaleString()}
                    </div>
                  </div>

                  <div className="rounded-xl bg-white border shadow-sm p-3 flex flex-col">
                    <div className="text-slate-500 uppercase text-[10px] tracking-wide">
                      a (scale)
                    </div>
                    <div className="text-sm font-semibold">
                      {currentA.toExponential(3)}
                    </div>
                  </div>

                  <div className="rounded-xl bg-white border shadow-sm p-3 flex flex-col">
                    <div className="text-slate-500 uppercase text-[10px] tracking-wide">
                      b (exponent)
                    </div>
                    <div className="text-sm font-semibold">
                      {currentB.toFixed(4)}
                    </div>
                  </div>

                  <div className="rounded-xl bg-white border shadow-sm p-3 flex flex-col">
                    <div className="text-slate-500 uppercase text-[10px] tracking-wide">
                      R² (full fit)
                    </div>
                    <div className="text-sm font-semibold">
                      {currentR2 !== null ? currentR2.toFixed(3) : "..."}
                    </div>
                  </div>
                </div>
              </div>

              {/* PRICE CHART */}
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={topChartData}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                      dataKey={xScale === "time" ? "ts" : "logDaysX"}
                      type="number"
                      scale={xScale === "time" ? "time" : "linear"}
                      domain={[
                        () => {
                          // begin altijd op eerste datapunt dat we bewaren
                          if (!topChartData.length) return "auto";
                          return xScale === "time"
                            ? topChartData[0].ts
                            : topChartData[0].logDaysX;
                        },
                        () => {
                          if (!topChartData.length) return "auto";
                          const last = topChartData[topChartData.length - 1];
                          return xScale === "time" ? last.ts : last.logDaysX;
                        },
                      ]}
                      tickFormatter={(val: number) => {
                        if (!topChartData.length) return "";
                        let closest = topChartData[0];
                        let bestDiff = Infinity;
                        for (let i = 0; i < topChartData.length; i++) {
                          const candidateVal =
                            xScale === "time"
                              ? topChartData[i].ts
                              : topChartData[i].logDaysX;
                          const diff = Math.abs(candidateVal - val);
                          if (diff < bestDiff) {
                            bestDiff = diff;
                            closest = topChartData[i];
                          }
                        }
                        return String(closest.year);
                      }}
                      tickMargin={8}
                    />

                    <YAxis
                      scale={yScale}
                      domain={[0.01, "auto"]}
                      allowDataOverflow
                      ticks={[
                        0.01, 0.1, 1, 10, 100, 1000, 10000, 100000, 1000000,
                      ]}
                      tickFormatter={(v: any) =>
                        typeof v === "number" ? formatYTick(v) : v
                      }
                    />

                    <Tooltip
                      formatter={(val: any, name: any) => {
                        if (typeof val === "number") {
                          return "$" + formatMoney(val, 0);
                        }
                        return val;
                      }}
                      labelFormatter={(labelVal: any) => {
                        if (!topChartData.length) return "";
                        let closest = topChartData[0];
                        let bestDiff = Infinity;
                        for (let i = 0; i < topChartData.length; i++) {
                          const candidateVal =
                            xScale === "time"
                              ? topChartData[i].ts
                              : topChartData[i].logDaysX;
                          const diff = Math.abs(candidateVal - labelVal);
                          if (diff < bestDiff) {
                            bestDiff = diff;
                            closest = topChartData[i];
                          }
                        }
                        return `Date: ${closest.dateStr}`;
                      }}
                    />

                    <Legend />

                    <Line
                      type="monotone"
                      dataKey="marketMonthlyClose"
                      name="BTC monthly close"
                      stroke="#f97316"
                      strokeWidth={1.8}
                      dot={false}
                      connectNulls={true}
                    />
                    <Line
                      type="monotone"
                      dataKey="plAvg"
                      name="Power law avg (aAvg)"
                      stroke="#0f172a"
                      dot={false}
                      strokeDasharray="4 2"
                      strokeWidth={1.5}
                      connectNulls={true}
                    />
                    <Line
                      type="monotone"
                      dataKey="plLower"
                      name="Power law lower (aLower)"
                      stroke="#2563eb"
                      dot={false}
                      strokeDasharray="2 2"
                      strokeWidth={1.5}
                      connectNulls={true}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="text-[11px] text-slate-500 leading-snug">
                price = a · (days_since_genesis)^b. aAvg is jouw centrale lijn
                (trend), aLower is je floor-band (bv. ~2.5e percentiel residu /
                ~40%). In log(y) vs log(days) moet dit bijna perfect lineair
                zijn. R² ~0.95+ wijst erop dat de power law historisch zeer
                strak is.
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ============ STABILITY ROW (b & R²) FULL WIDTH ============ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="shadow-sm">
            <CardContent className="p-5 space-y-6">
              <h2 className="text-lg font-semibold">
                Power Law Stability (b & R² doorheen de tijd)
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* bExp chart */}
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={rollingFits}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="ts"
                        type="number"
                        scale="time"
                        domain={[
                          yearTicks[0] ?? "auto",
                          yearTicks[yearTicks.length - 1] ?? "auto",
                        ]}
                        ticks={yearTicks}
                        tickFormatter={(val: number) => {
                          const d = new Date(val);
                          return String(d.getUTCFullYear());
                        }}
                      />
                      <YAxis />
                      <Tooltip
                        formatter={(v: any, name: any) =>
                          typeof v === "number"
                            ? name === "bExp"
                              ? v.toFixed(4)
                              : v.toFixed(3)
                            : v
                        }
                        labelFormatter={(ts: any) => {
                          const d = new Date(ts);
                          return d.toISOString().slice(0, 10);
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="bExp"
                        name="b exponent"
                        stroke="#0f172a"
                        dot={false}
                        strokeWidth={1.5}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="text-xs text-slate-600 text-center mt-2">
                    b exponent
                  </div>
                </div>

                {/* R² chart */}
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={rollingFits}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="ts"
                        type="number"
                        scale="time"
                        domain={[
                          yearTicks[0] ?? "auto",
                          yearTicks[yearTicks.length - 1] ?? "auto",
                        ]}
                        ticks={yearTicks}
                        tickFormatter={(val: number) => {
                          const d = new Date(val);
                          return String(d.getUTCFullYear());
                        }}
                      />
                      <YAxis domain={[0, 1]} />
                      <Tooltip
                        formatter={(v: any) =>
                          typeof v === "number" ? v.toFixed(3) : v
                        }
                        labelFormatter={(ts: any) => {
                          const d = new Date(ts);
                          return d.toISOString().slice(0, 10);
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="r2"
                        name="R²"
                        stroke="#2563eb"
                        dot={false}
                        strokeWidth={1.5}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="text-xs text-slate-600 text-center mt-2">
                    R²
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 leading-snug">
                Elke punt is een regressie tot en met die maand:
                log10(price) vs log10(days_since_genesis). Je ziet hoe b en R²
                evolueren doorheen de tijd. Als b convergeert en R² hoog
                blijft, is de power law opvallend stabiel.
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ============ 2-COLUMN LAYOUT (left: controls, right: portfolio etc) ============ */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="xl:col-span-1 space-y-4"
          >
            {/* MAIN SETTINGS CARD */}
            <Card className="shadow-sm">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-2xl font-semibold">BTC Win-for-Life</h1>
                  <Info className="w-5 h-5 text-slate-400" />
                </div>

                {/* INPUT GRID */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Retire year</Label>
                    <Input
                      type="number"
                      value={yr}
                      onChange={(e) => setYr(parseInt(e.target.value || "0"))}
                    />
                  </div>
                  <div>
                    <Label>Retire month</Label>
                    <Input
                      type="number"
                      min={1}
                      max={12}
                      value={mr}
                      onChange={(e) => setMr(parseInt(e.target.value || "1"))}
                    />
                  </div>
                  <div>
                    <Label>BTC at retirement</Label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={initialBTC}
                      onChange={(e) =>
                        setInitialBTC(parseFloat(e.target.value || "0"))
                      }
                    />
                  </div>
                  <div>
                    <Label>
                      Withdrawal r<sub>out</sub> (USD / month)
                    </Label>
                    <Input
                      type="number"
                      step="100"
                      value={rOut}
                      onChange={(e) => setRout(parseFloat(e.target.value || "0"))}
                    />
                  </div>
                  <div>
                    <Label>Horizon (years)</Label>
                    <Input
                      type="number"
                      min={1}
                      max={120}
                      value={horizonYears}
                      onChange={(e) =>
                        setHorizonYears(parseInt(e.target.value || "1"))
                      }
                    />
                  </div>
                  <div>
                    <Label>Inflatie (% / jaar)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={(inflAnnual * 100).toString()}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value || "0");
                        setInflAnnual(v / 100);
                      }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t" />

                {/* POWER LAW PARAMS */}
                <div className="space-y-3">
                  <Label>
                    b (power exponent): {bExp.toFixed(4)}
                  </Label>
                  <Slider
                    min={1}
                    max={8}
                    step={0.01}
                    value={[bExp]}
                    onValueChange={(v) => setBExp(v[0])}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>
                        a (Lower): {Number(aLower).toExponential(3)}
                      </Label>
                      <Input
                        type="number"
                        value={aLower}
                        onChange={(e) =>
                          setALower(parseFloat(e.target.value || "0"))
                        }
                      />
                    </div>
                    <div>
                      <Label>
                        a (Average): {Number(aAvg).toExponential(3)}
                      </Label>
                      <Input
                        type="number"
                        value={aAvg}
                        onChange={(e) =>
                          setAAvg(parseFloat(e.target.value || "0"))
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Switch
                      checked={useLowerPostRetire}
                      onCheckedChange={setUseLowerPostRetire}
                    />
                    <span className="text-sm text-slate-600">
                      Use <strong>lower band a</strong> for post-retirement
                      projections
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Switch
                      checked={finiteHorizonMode}
                      onCheckedChange={setFiniteHorizonMode}
                    />
                    <span className="text-sm text-slate-600">
                      Target <strong>current horizon</strong> only
                      <span className="block text-[11px] text-slate-500 leading-tight">
                        On = allow BTC to hit 0 by {horizonYears}y. Off = must
                        last “forever”.
                      </span>
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t" />

                {/* SUMMARY CARDS */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 rounded-2xl bg-white shadow-sm">
                    <div className="text-slate-500">BTC @ retirement</div>
                    <div className="text-xl font-semibold">
                      {sim.summary.btcAtRetire?.toFixed(6)}
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white shadow-sm">
                    <div className="text-slate-500">Price @ retirement</div>
                    <div className="text-xl font-semibold">
                      ${formatMoney(sim.summary.priceAtRetire, 0)}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white shadow-sm">
                    <div className="text-slate-500">
                      Required BTC for r_out{" "}
                      <span className="text-[10px] text-slate-400 ml-1">
                        (inflatie-indexed)
                      </span>
                    </div>
                    <div className="text-xl font-semibold">
                      {reqIndexedBtc.toFixed(6)}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white shadow-sm">
                    <div className="text-slate-500">Gap (have − need)</div>
                    <div className="text-xl font-semibold">
                      {(initialBTC - reqIndexedBtc).toFixed(6)} BTC
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white shadow-sm">
                    <div className="text-slate-500">Total withdrawn (USD)</div>
                    <div className="text-xl font-semibold">
                      ${formatMoney(sim.summary.totalWithdrawnUsd, 0)}
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white shadow-sm">
                    <div className="text-slate-500">Exhausted?</div>
                    <div
                      className={`text-xl font-semibold ${
                        sim.exhaustedAt ? "text-rose-600" : "text-emerald-600"
                      }`}
                    >
                      {exhaustedLabel}
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white shadow-sm col-span-2">
                    <div className="text-slate-500">
                      Max sustainable r<sub>out</sub>
                      <span className="text-[10px] text-slate-400 ml-1">
                        ({finiteHorizonMode ? "to horizon" : "forever"},{" "}
                        inflatie-indexed)
                      </span>
                    </div>
                    <div className="text-xl font-semibold">
                      ${formatMoney(maxRout, 0)} / mo
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setAAvg(8.85116e-17);
                      setALower(8.85116e-17 * 0.4);
                    }}
                  >
                    Preset a (LOW/AVG)
                  </Button>
                  <Button variant="secondary" onClick={() => setBExp(5.5697)}>
                    Preset b = 5.5697
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setRout(Math.round(maxRout));
                    }}
                    className="gap-2"
                  >
                    <RefreshCcw className="w-4 h-4" /> Set r<sub>out</sub> = max
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* CALCULATORS CARD */}
            <Card className="shadow-sm">
              <CardContent className="p-5 space-y-6 text-sm">
                {/* 1. Required BTC vs retire year */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-semibold">
                      Required BTC vs retire year
                    </Label>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Desired r_out ($/mo)</Label>
                      <Input
                        type="number"
                        value={targetROut}
                        onChange={(e) =>
                          setTargetROut(parseFloat(e.target.value || "0"))
                        }
                      />
                    </div>
                    <div>
                      <Label>Current retire year</Label>
                      <div className="p-2 rounded border bg-slate-50 text-slate-700 text-sm">
                        {yr}
                      </div>
                    </div>
                  </div>

                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={retirementYearSweep}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip
                          formatter={(v: any) =>
                            typeof v === "number"
                              ? v.toFixed(4) + " BTC"
                              : v
                          }
                        />
                        <Line
                          type="monotone"
                          dataKey="btcRequired"
                          name="BTC needed"
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="text-xs text-slate-600">
                    In {yr} heb je ongeveer{" "}
                    <strong>
                      {
                        retirementYearSweep.find(
                          (row) => row.year === yr
                        )?.btcRequired?.toFixed(4)
                      }{" "}
                      BTC
                    </strong>{" "}
                    nodig om ${formatMoney(targetROut, 0)}/mo te kunnen starten.
                  </div>
                </div>

                <div className="border-t" />

                {/* 2. One-time goal */}
                <div className="space-y-2">
                  <Label className="font-semibold">
                    One-time goal (house, etc.)
                  </Label>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label>Year</Label>
                      <Input
                        type="number"
                        value={goalYear}
                        onChange={(e) =>
                          setGoalYear(parseInt(e.target.value || "0"))
                        }
                      />
                    </div>
                    <div>
                      <Label>Month</Label>
                      <Input
                        type="number"
                        min={1}
                        max={12}
                        value={goalMonth}
                        onChange={(e) =>
                          setGoalMonth(parseInt(e.target.value || "1"))
                        }
                      />
                    </div>
                    <div>
                      <Label>USD needed</Label>
                      <Input
                        type="number"
                        value={goalUsd}
                        onChange={(e) =>
                          setGoalUsd(parseFloat(e.target.value || "0"))
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2 rounded bg-slate-50 border">
                      <div className="text-slate-500">Price (lower)</div>
                      <div className="font-semibold">
                        ${formatMoney(oneTimeGoalCalc.priceLower, 0)}
                      </div>
                      <div className="text-slate-500 mt-1">
                        BTC needed (lower)
                      </div>
                      <div className="font-semibold">
                        {oneTimeGoalCalc.btcNeededLower.toFixed(6)} BTC
                      </div>
                    </div>
                    <div className="p-2 rounded bg-slate-50 border">
                      <div className="text-slate-500">Price (avg)</div>
                      <div className="font-semibold">
                        ${formatMoney(oneTimeGoalCalc.priceAvg, 0)}
                      </div>
                      <div className="text-slate-500 mt-1">
                        BTC needed (avg)
                      </div>
                      <div className="font-semibold">
                        {oneTimeGoalCalc.btcNeededAvg.toFixed(6)} BTC
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t" />

                {/* 3. Max affordable monthly r_out */}
                <div className="space-y-2">
                  <Label className="font-semibold">
                    Max affordable r_out (now)
                  </Label>
                  <div className="text-xs text-slate-600">
                    Met jouw huidige {initialBTC.toFixed(4)} BTC, inflatie{" "}
                    {(inflAnnual * 100).toFixed(1)}% en horizon{" "}
                    {finiteHorizonMode ? `${horizonYears}y` : "forever"} kun je
                    starten met ongeveer
                    <div className="text-base font-semibold text-slate-900">
                      ${formatMoney(maxRout, 0)}/mo
                    </div>
                    (inflatie-indexed).
                  </div>
                </div>

                <div className="border-t" />

                {/* 4. BTC price projection */}
                <div className="space-y-2">
                  <Label className="font-semibold">BTC price projection</Label>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label>Year</Label>
                      <Input
                        type="number"
                        value={projYear}
                        onChange={(e) =>
                          setProjYear(parseInt(e.target.value || "0"))
                        }
                      />
                    </div>
                    <div>
                      <Label>Month</Label>
                      <Input
                        type="number"
                        min={1}
                        max={12}
                        value={projMonth}
                        onChange={(e) =>
                          setProjMonth(parseInt(e.target.value || "1"))
                        }
                      />
                    </div>
                    <div className="text-xs text-slate-600 flex flex-col justify-center">
                      b = {bExp.toFixed(4)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2 rounded bg-slate-50 border">
                      <div className="text-slate-500">1 BTC (lower)</div>
                      <div className="font-semibold">
                        ${formatMoney(projPrice.priceLower, 0)}
                      </div>
                      <div className="text-slate-500 mt-1">10 BTC</div>
                      <div className="font-semibold">
                        ${formatMoney(projPrice.tenLower, 0)}
                      </div>
                      <div className="text-slate-500 mt-1">100 BTC</div>
                      <div className="font-semibold">
                        ${formatMoney(projPrice.hundredLower, 0)}
                      </div>
                    </div>
                    <div className="p-2 rounded bg-slate-50 border">
                      <div className="text-slate-500">1 BTC (avg)</div>
                      <div className="font-semibold">
                        ${formatMoney(projPrice.priceAvg, 0)}
                      </div>
                      <div className="text-slate-500 mt-1">10 BTC</div>
                      <div className="font-semibold">
                        ${formatMoney(projPrice.tenAvg, 0)}
                      </div>
                      <div className="text-slate-500 mt-1">100 BTC</div>
                      <div className="font-semibold">
                        ${formatMoney(projPrice.hundredAvg, 0)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t" />

                {/* 5. Financial freedom year */}
                <div className="space-y-2">
                  <Label className="font-semibold">
                    Financial freedom year
                  </Label>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Desired r_out ($/mo)</Label>
                      <Input
                        type="number"
                        value={freedomTargetROut}
                        onChange={(e) =>
                          setFreedomTargetROut(
                            parseFloat(e.target.value || "0")
                          )
                        }
                      />
                    </div>
                    <div className="text-xs text-slate-600 flex flex-col justify-end">
                      <div>
                        Your BTC now:{" "}
                        <strong>{initialBTC.toFixed(4)} BTC</strong>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600">
                    {financialFreedom ? (
                      <>
                        Je kan ongeveer met pensioen rond{" "}
                        <strong>{financialFreedom}</strong> met $
                        {formatMoney(freedomTargetROut, 0)}/mo.
                      </>
                    ) : (
                      <>
                        Met {initialBTC.toFixed(4)} BTC bereik je $
                        {formatMoney(freedomTargetROut, 0)}/mo niet voor 2100.
                      </>
                    )}
                  </div>
                </div>

                <div className="border-t" />

                {/* 6. Inflation effect */}
                <div className="space-y-2">
                  <Label className="font-semibold">Inflation effect</Label>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label>Base ($/mo today)</Label>
                      <Input
                        type="number"
                        value={inflRefAmount}
                        onChange={(e) =>
                          setInflRefAmount(
                            parseFloat(e.target.value || "0")
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label>Years ahead</Label>
                      <Input
                        type="number"
                        value={inflYearsAhead}
                        onChange={(e) =>
                          setInflYearsAhead(parseInt(e.target.value || "0"))
                        }
                      />
                    </div>
                    <div className="text-xs text-slate-600 flex flex-col justify-end">
                      <div>Infl: {(inflAnnual * 100).toFixed(1)}%/yr</div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600">
                    Als je vandaag ${formatMoney(inflRefAmount, 0)}/mo nodig
                    hebt, dan komt dat overeen met ongeveer{" "}
                    <strong>
                      ${formatMoney(inflCalc.futureNominal, 0)}/mo
                    </strong>{" "}
                    over {inflYearsAhead} jaar bij{" "}
                    {(inflAnnual * 100).toFixed(1)}% inflatie/jaar.
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* RIGHT COLUMN */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="xl:col-span-2 space-y-6"
          >
            {/* BTC balance / portfolio value */}
            <Card className="shadow-sm">
              <CardContent className="p-5">
                <h2 className="text-lg font-semibold mb-4">
                  BTC Balance & Portfolio Value
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sim.data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="key" hide />
                        <YAxis />
                        <Tooltip
                          formatter={(v: any) =>
                            typeof v === "number" ? v.toFixed(6) : v
                          }
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="btc"
                          name="BTC balance"
                          dot={false}
                          strokeWidth={1.5}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sim.data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="key" hide />
                        <YAxis />
                        <Tooltip
                          formatter={(v: any) =>
                            typeof v === "number"
                              ? `$${formatMoney(v, 0)}`
                              : v
                          }
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="usdValue"
                          name="USD value"
                          dot={false}
                          strokeWidth={1.5}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monthly table */}
            <Card className="shadow-sm">
              <CardContent className="p-5">
                <h2 className="text-lg font-semibold mb-4">
                  Monthly table (first 240 rows shown)
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-slate-600">
                        <th className="py-2 pr-4">Year</th>
                        <th className="py-2 pr-4">Month</th>
                        <th className="py-2 pr-4">Price (USD)</th>
                        <th className="py-2 pr-4">Sell BTC</th>
                        <th className="py-2 pr-4">Withdr (USD)</th>
                        <th className="py-2 pr-4">BTC bal</th>
                        <th className="py-2 pr-4">USD value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sim.data.slice(0, 240).map((d: any, i: number) => (
                        <tr key={i} className="border-t">
                          <td className="py-1 pr-4">{d.year}</td>
                          <td className="py-1 pr-4">{d.month}</td>
                          <td className="py-1 pr-4">
                            ${formatMoney(d.price, 0)}
                          </td>
                          <td className="py-1 pr-4">
                            {d.sellBtc ? d.sellBtc.toFixed(6) : ""}
                          </td>
                          <td className="py-1 pr-4">
                            {d.rOutThisMonth
                              ? `$${formatMoney(d.rOutThisMonth, 0)}`
                              : ""}
                          </td>
                          <td className="py-1 pr-4">{d.btc.toFixed(6)}</td>
                          <td className="py-1 pr-4">
                            ${formatMoney(d.usdValue, 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="text-[11px] text-slate-500 leading-snug mt-4">
                  reqNoInfl B_req (no-infl approx):{" "}
                  {reqNoInfl.B_req.toFixed(6)} BTC @ ~$
                  {formatMoney(reqNoInfl.P_r, 0)}/BTC at retirement.
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
