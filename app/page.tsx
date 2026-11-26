"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

// ราคาเริ่มต้นจาก 00-Context/01-Company.md
const PRESETS = [
  { label: "ไอลีฟ ทาวน์โฮม", price: 2_190_000 },
  { label: "ไอลีฟ บ้านแฝด", price: 3_290_000 },
  { label: "ไอลีฟ บ้านเดี่ยว", price: 4_290_000 },
];

// ธนาคารส่วนใหญ่ให้ยอดผ่อนหนี้ทุกก้อนรวมกันไม่เกินราว 40% ของรายได้ (DSR)
const DSR = 0.4;

const baht = (n: number) =>
  Number.isFinite(n) ? Math.round(n).toLocaleString("th-TH") : "-";

function monthlyPayment(loan: number, ratePct: number, years: number) {
  const n = years * 12;
  if (loan <= 0 || n <= 0) return 0;
  const r = ratePct / 100 / 12;
  if (r === 0) return loan / n;
  return (loan * r) / (1 - Math.pow(1 + r, -n));
}

function NumberField({
  label,
  value,
  onChange,
  suffix,
  step = 1,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix: string;
  step?: number;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-lg text-kanda-black">{label}</span>
      <div className="mt-1 flex items-center rounded-xl border border-neutral-300 bg-white focus-within:border-kanda-orange focus-within:ring-2 focus-within:ring-kanda-orange/20">
        <input
          type="number"
          inputMode="decimal"
          min={0}
          step={step}
          value={value}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
          className="w-full rounded-xl bg-transparent px-4 py-3 text-xl text-kanda-black outline-none"
        />
        <span className="pr-4 whitespace-nowrap text-kanda-gray">{suffix}</span>
      </div>
      {hint && <span className="mt-1 block text-sm text-kanda-gray">{hint}</span>}
    </label>
  );
}

export default function Home() {
  const [price, setPrice] = useState(PRESETS[0].price);
  const [downPct, setDownPct] = useState(10);
  const [rate, setRate] = useState(3.5);
  const [years, setYears] = useState(30);
  const [otherDebt, setOtherDebt] = useState(0);

  const r = useMemo(() => {
    const down = (price * downPct) / 100;
    const loan = Math.max(price - down, 0);
    const pay = monthlyPayment(loan, rate, years);
    const total = pay * years * 12;
    const minIncome = (pay + otherDebt) / DSR;
    return { down, loan, pay, total, interest: total - loan, minIncome };
  }, [price, downPct, rate, years, otherDebt]);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12">
      <header className="flex flex-col items-center text-center">
        <Image
          src="/logo-kanda.jpg"
          alt="Kanda — Smile of living"
          width={220}
          height={110}
          priority
          className="h-auto w-44"
        />
        <h1 className="mt-6 text-4xl sm:text-5xl">
          คำนวณ<span className="text-kanda-orange">ผ่อนบ้าน</span>
        </h1>
        <p className="mt-2 text-lg">
          ลองใส่ตัวเลขดูนะคะ จะได้วางแผนบ้านหลังใหม่ให้ครอบครัวได้สบายใจค่ะ 🏡
        </p>
        <div className="mt-6 h-px w-24 bg-kanda-orange/40" />
      </header>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {/* ฝั่งกรอกข้อมูล */}
        <section className="space-y-5">
          <div>
            <span className="text-lg text-kanda-black">เลือกแบบบ้าน (ราคาเริ่มต้น)</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setPrice(p.price)}
                  className={`rounded-full border px-4 py-1.5 text-base transition ${
                    price === p.price
                      ? "border-kanda-orange bg-kanda-orange text-white"
                      : "border-neutral-300 text-kanda-gray hover:border-kanda-orange hover:text-kanda-orange"
                  }`}
                >
                  {p.label} · เริ่ม {(p.price / 1_000_000).toFixed(2)} ล้าน
                </button>
              ))}
            </div>
          </div>

          <NumberField label="ราคาบ้าน" value={price} onChange={setPrice} suffix="บาท" step={10000} />
          <NumberField
            label="เงินดาวน์"
            value={downPct}
            onChange={(v) => setDownPct(Math.min(v, 100))}
            suffix="%"
            hint={`= ${baht(r.down)} บาท`}
          />
          <NumberField label="อัตราดอกเบี้ยเฉลี่ย" value={rate} onChange={setRate} suffix="% ต่อปี" step={0.05} />
          <NumberField label="ระยะเวลาผ่อน" value={years} onChange={(v) => setYears(Math.min(v, 40))} suffix="ปี" />
          <NumberField
            label="ภาระหนี้อื่นต่อเดือน (ถ้ามี)"
            value={otherDebt}
            onChange={setOtherDebt}
            suffix="บาท"
            step={500}
            hint="เช่น ผ่อนรถ บัตรเครดิต สินเชื่อส่วนบุคคล"
          />
        </section>

        {/* ฝั่งผลลัพธ์ */}
        <section className="space-y-4">
          <div className="rounded-2xl border border-neutral-200 p-6 shadow-sm">
            <p className="text-lg">ยอดผ่อนต่อเดือนโดยประมาณ</p>
            <p className="mt-1 text-5xl font-bold text-kanda-orange">
              {baht(r.pay)} <span className="text-2xl font-normal text-kanda-gray">บาท</span>
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 p-6 shadow-sm">
            <p className="text-lg">รายได้ขั้นต่ำที่ธนาคารน่าจะอนุมัติ</p>
            <p className="mt-1 text-4xl font-bold text-kanda-black">
              {baht(r.minIncome)} <span className="text-2xl font-normal text-kanda-gray">บาท/เดือน</span>
            </p>
            <p className="mt-2 text-sm">
              คิดจากหนี้ทุกก้อนรวมกันไม่เกิน {DSR * 100}% ของรายได้ ซึ่งเป็นเกณฑ์ที่ธนาคารส่วนใหญ่ใช้ค่ะ
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-3 rounded-2xl bg-neutral-50 p-6 text-base">
            <dt>ยอดกู้</dt>
            <dd className="text-right text-kanda-black">{baht(r.loan)} บาท</dd>
            <dt>เงินดาวน์</dt>
            <dd className="text-right text-kanda-black">{baht(r.down)} บาท</dd>
            <dt>ดอกเบี้ยรวมตลอดสัญญา</dt>
            <dd className="text-right text-kanda-black">{baht(r.interest)} บาท</dd>
            <dt>ยอดชำระรวมทั้งหมด</dt>
            <dd className="text-right text-kanda-black">{baht(r.total)} บาท</dd>
          </dl>

          <p className="text-sm leading-relaxed">
            * ตัวเลขนี้เป็นการคำนวณเบื้องต้นเท่านั้นนะคะ ยอดผ่อนและวงเงินจริงขึ้นอยู่กับอัตราดอกเบี้ย
            และเงื่อนไขของแต่ละธนาคาร สอบถามรายละเอียดเพิ่มเติมกับเจ้าหน้าที่ได้เลยค่ะ 😊
          </p>
        </section>
      </div>

      <footer className="mt-12 border-t border-kanda-orange/30 pt-6 text-center text-base">
        <p className="text-kanda-black">เพื่อรอยยิ้มของครอบครัว และคนรุ่นต่อๆ ไป</p>
        <p className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
          <a href="tel:0942493985" className="hover:text-kanda-orange">📞 094-249-3985</a>
          <a href="https://lin.ee/rT5CncV" target="_blank" rel="noreferrer" className="hover:text-kanda-orange">💬 LINE: @kanda.property</a>
          <a href="https://www.kd.co.th" target="_blank" rel="noreferrer" className="hover:text-kanda-orange">🌐 www.kd.co.th</a>
        </p>
      </footer>
    </main>
  );
}
