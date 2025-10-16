"use client";

import "swiper/css";
import "swiper/css/mousewheel";
import "swiper/css/pagination";

export default function PrivacyPolicyPage() {
  const effectiveDate = "16 ตุลาคม 2025";

  return (
    <main className="container mx-auto max-w-12xl px-4 py-10">
      <article className="rounded-2xl border bg-white p-6 shadow-sm md:p-8 dark:border-slate-800 dark:bg-slate-900">
        <header>
          <h1 className="text-2xl font-bold tracking-tight md:text-4xl">
            นโยบายความเป็นส่วนตัว (Privacy Policy)
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">
            เอกสารนี้อธิบายการเก็บรวบรวม ใช้ เปิดเผย และคุ้มครองข้อมูลส่วนบุคคลของผู้ใช้บริการบนเว็บไซต์และแอปพลิเคชันของเรา โปรดอ่านอย่างละเอียดก่อนใช้บริการ หากมีคำถามหรือต้องการใช้สิทธิ โปรดติดต่อทีมงานตามข้อมูลด้านล่าง
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-300">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            บังคับใช้ตั้งแต่: {effectiveDate}
          </div>
        </header>

        {/* 1 */}
        <section id="scope" className="scroll-mt-24">
          <h2 className="mt-10 text-xl font-semibold tracking-tight md:text-2xl">
            1. ขอบเขตของนโยบาย
          </h2>
          <p className="mt-3 leading-relaxed text-slate-700 dark:text-slate-300">
            นโยบายนี้มีผลบังคับใช้กับข้อมูลส่วนบุคคลที่เรารวบรวมผ่านเว็บไซต์ แอปพลิเคชัน บริการออนไลน์ และการติดต่อผ่านอีเมลหรือช่องทางอื่น ๆ ยกเว้นข้อมูลที่ได้รับการทำให้เป็นนิรนามโดยสมบูรณ์ (ไม่สามารถระบุตัวบุคคลได้)
          </p>
          <hr className="my-6 border-slate-200 dark:border-slate-800" />
        </section>

        {/* 2 */}
        <section id="definitions" className="scroll-mt-24">
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
            2. คำจำกัดความ
          </h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-slate-700 marker:text-slate-400 dark:text-slate-300">
            <li>
              <strong>ข้อมูลส่วนบุคคล</strong> — ข้อมูลที่สามารถใช้ระบุตัวบุคคลได้โดยตรงหรือโดยอ้อม เช่น ชื่อ ที่อยู่อีเมล เบอร์โทร
            </li>
            <li>
              <strong>ผู้ควบคุมข้อมูล</strong> — หน่วยงานหรือบุคคลที่ตัดสินใจวัตถุประสงค์และวิธีการประมวลผลข้อมูล
            </li>
            <li>
              <strong>ผู้ประมวลผลข้อมูล</strong> — บุคคลหรือผู้ให้บริการที่ดำเนินการตามคำสั่งของผู้ควบคุมข้อมูล
            </li>
          </ul>
          <hr className="my-6 border-slate-200 dark:border-slate-800" />
        </section>

        {/* 3 */}
        <section id="data-types" className="scroll-mt-24">
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
            3. ประเภทของข้อมูลที่เก็บรวบรวม
          </h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-slate-700 marker:text-slate-400 dark:text-slate-300">
            <li>ข้อมูลที่ผู้ใช้ให้โดยตรง: ชื่อ-นามสกุล, อีเมล, เบอร์โทร, ที่อยู่ (ถ้ามี)</li>
            <li>ข้อมูลบัญชีผู้ใช้: ชื่อผู้ใช้ รหัสผ่าน (จัดเก็บในรูปแบบเข้ารหัส) การตั้งค่าโปรไฟล์</li>
            <li>ข้อมูลการใช้งาน: ที่อยู่ IP, ประเภทอุปกรณ์, ระบบปฏิบัติการ, หน้าเพจที่เข้าชม, เวลาเข้า-ออก, พารามิเตอร์การใช้งาน</li>
            <li>ข้อมูลการชำระเงิน: ใช้ผู้ให้บริการชำระเงินภายนอก และไม่เก็บข้อมูลบัตรเครดิตบนระบบของเราโดยตรง</li>
            <li>คุกกี้และเทคโนโลยีที่คล้ายกัน: ข้อมูลเพื่อเก็บสถานะการใช้งาน ปรับปรุงประสบการณ์ และวิเคราะห์การใช้งาน</li>
          </ul>
          <hr className="my-6 border-slate-200 dark:border-slate-800" />
        </section>

        {/* 4 */}
        <section id="sources" className="scroll-mt-24">
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
            4. แหล่งที่มาของข้อมูล
          </h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-slate-700 marker:text-slate-400 dark:text-slate-300">
            <li>ผู้ใช้โดยตรงเมื่อสมัครหรือกรอกแบบฟอร์ม</li>
            <li>จากการใช้งานบริการของเรา</li>
            <li>จากบุคคลที่สาม (เช่น ผู้ให้บริการวิเคราะห์ หรือ โซเชียลล็อกอิน) หากได้รับความยินยอม</li>
          </ul>
          <hr className="my-6 border-slate-200 dark:border-slate-800" />
        </section>

        {/* 5 */}
        <section id="purposes" className="scroll-mt-24">
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
            5. วัตถุประสงค์ในการประมวลผลข้อมูล
          </h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-slate-700 marker:text-slate-400 dark:text-slate-300">
            <li>ให้บริการตามคำขอของผู้ใช้ และบริหารจัดการบัญชี</li>
            <li>ประมวลผลการชำระเงิน และออกใบเสร็จ/ภาษี</li>
            <li>ปรับปรุงคุณภาพและฟังก์ชันของเว็บไซต์/แอป และวิเคราะห์แนวโน้มการใช้งาน</li>
            <li>ส่งข้อมูลสำคัญ ข่าวสาร โปรโมชั่น (เมื่อผู้ใช้ยินยอมรับการรับข่าวสาร)</li>
            <li>ป้องกันและตรวจจับการฉ้อโกงหรือการใช้งานที่ผิดปกติ</li>
          </ul>
          <hr className="my-6 border-slate-200 dark:border-slate-800" />
        </section>

        {/* 6 */}
        <section id="retention" className="scroll-mt-24">
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
            6. ระยะเวลาในการเก็บข้อมูล
          </h2>
          <p className="mt-3 leading-relaxed text-slate-700 dark:text-slate-300">
            เราเก็บข้อมูลเท่าที่จำเป็นตามวัตถุประสงค์การใช้งาน ข้อมูลบางประเภทจะถูกเก็บตามระยะเวลาที่กฎหมายกำหนดหรือจนกว่าผู้ใช้จะร้องขอให้ลบ เช่น ข้อมูลบัญชีจะเก็บจนกว่าจะมีการยกเลิกบัญชีแล้วผ่านระยะเวลารอการลบตามนโยบายการเก็บข้อมูล
          </p>
          <hr className="my-6 border-slate-200 dark:border-slate-800" />
        </section>

        {/* 7 */}
        <section id="sharing" className="scroll-mt-24">
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
            7. การเปิดเผยและการแบ่งปันข้อมูล
          </h2>
          <p className="mt-3 leading-relaxed text-slate-700 dark:text-slate-300">
            เราอาจเปิดเผยข้อมูลของผู้ใช้ต่อ:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-2 text-slate-700 marker:text-slate-400 dark:text-slate-300">
            <li>ผู้ให้บริการภายนอก (ผู้ให้บริการโฮสติ้ง, ผู้ให้บริการวิเคราะห์, ผู้ให้บริการชำระเงิน) ซึ่งต้องปฏิบัติตามข้อกำหนดด้านความปลอดภัยและสัญญาคุ้มครองข้อมูล</li>
            <li>หน่วยงานตามกฎหมาย หากมีคำสั่งจากศาล หรือหน่วยงานกำกับดูแล</li>
            <li>ในกรณีควบรวมธุรกิจหรือขายกิจการ ข้อมูลอาจถูกโอนให้แก่ผู้รับซื้อภายใต้เงื่อนไขการคุ้มครองข้อมูล</li>
          </ul>
          <hr className="my-6 border-slate-200 dark:border-slate-800" />
        </section>

        {/* 8 */}
        <section id="cookies" className="scroll-mt-24">
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
            8. การใช้งานคุกกี้และเทคโนโลยีที่คล้ายกัน
          </h2>
          <p className="mt-3 leading-relaxed text-slate-700 dark:text-slate-300">
            เว็บไซต์ใช้คุกกี้ประเภทต่าง ๆ ได้แก่ คุกกี้ที่จำเป็นสำหรับการทำงานของเว็บไซต์ คุกกี้เพื่อวิเคราะห์ประสิทธิภาพ และคุกกี้สำหรับการตลาด ผู้ใช้สามารถจัดการการตั้งค่าคุกกี้ผ่านเบราว์เซอร์ แต่การปิดคุกกี้อาจทำให้บางฟังก์ชันไม่ทำงาน
          </p>
          <hr className="my-6 border-slate-200 dark:border-slate-800" />
        </section>

        {/* 9 */}
        <section id="security" className="scroll-mt-24">
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
            9. มาตรการรักษาความปลอดภัย
          </h2>
          <p className="mt-3 leading-relaxed text-slate-700 dark:text-slate-300">
            เรานำมาตรการทางเทคนิคและองค์กรมาใช้ เช่น การเข้ารหัสข้อมูล (TLS/HTTPS), การจัดเก็บข้อมูลที่สำคัญในรูปแบบเข้ารหัส, การควบคุมการเข้าถึงตามหน้าที่ และกระบวนการสำรองข้อมูลเพื่อป้องกันการเข้าถึงข้อมูลโดยไม่ได้รับอนุญาต การรั่วไหลหรือการทำลาย
          </p>
          <hr className="my-6 border-slate-200 dark:border-slate-800" />
        </section>

        {/* 10 */}
        <section id="transfer" className="scroll-mt-24">
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
            10. การโอนข้อมูลข้ามประเทศ
          </h2>
          <p className="mt-3 leading-relaxed text-slate-700 dark:text-slate-300">
            หากมีการโอนข้อมูลไปยังผู้ให้บริการหรือตัวประมวลผลข้อมูลในต่างประเทศ เราจะดำเนินการภายใต้มาตรการป้องกันที่เหมาะสมและเป็นไปตามข้อกำหนดทางกฎหมายที่เกี่ยวข้อง
          </p>
          <hr className="my-6 border-slate-200 dark:border-slate-800" />
        </section>

        {/* 11 */}
        <section id="rights" className="scroll-mt-24">
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
            11. สิทธิของเจ้าของข้อมูล
          </h2>
          <p className="mt-3 leading-relaxed text-slate-700 dark:text-slate-300">
            ผู้ใช้มีสิทธิในกรณีต่อข้อมูลส่วนบุคคลของตน รวมถึง:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-2 text-slate-700 marker:text-slate-400 dark:text-slate-300">
            <li>ขอเข้าถึงข้อมูลส่วนบุคคลที่เรามี</li>
            <li>ขอแก้ไขข้อมูลที่ไม่ถูกต้องหรือไม่สมบูรณ์</li>
            <li>ขอลบข้อมูล (ภายใต้ข้อจำกัดตามกฎหมาย)</li>
            <li>ขอจำกัดการประมวลผลหรือคัดค้านการประมวลผลในบางกรณี</li>
            <li>ขอรับข้อมูลในรูปแบบที่นำไปใช้ได้ (data portability) หากเป็นไปได้</li>
          </ul>
          <p className="mt-2 leading-relaxed text-slate-700 dark:text-slate-300">
            สำหรับการใช้สิทธิดังกล่าว กรุณาติดต่อทีมงานพร้อมยืนยันตัวตน เราจะตอบกลับภายในกรอบเวลาที่กฎหมายกำหนด
          </p>
          <hr className="my-6 border-slate-200 dark:border-slate-800" />
        </section>

        {/* 12 */}
        <section id="minors" className="scroll-mt-24">
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
            12. เด็กและผู้เยาว์
          </h2>
          <p className="mt-3 leading-relaxed text-slate-700 dark:text-slate-300">
            บริการไม่ได้ตั้งใจให้ใช้โดยเด็กที่ยังไม่มีความสามารถทางกฎหมายในการให้ความยินยอม หากผู้ปกครองเชื่อว่าเราเก็บข้อมูลของบุตรที่ยังไม่บรรลุนิติภาวะ โปรดติดต่อเพื่อลบข้อมูลดังกล่าว
          </p>
          <hr className="my-6 border-slate-200 dark:border-slate-800" />
        </section>

        {/* 13 */}
        <section id="changes" className="scroll-mt-24">
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
            13. การเปลี่ยนแปลงนโยบาย
          </h2>
          <p className="mt-3 leading-relaxed text-slate-700 dark:text-slate-300">
            เราอาจปรับปรุงนโยบายนี้เป็นครั้งคราว การเปลี่ยนแปลงที่มีนัยสำคัญจะประกาศบนเว็บไซต์พร้อมวันที่มีผลบังคับใช้ ผู้ใช้ควรตรวจสอบนโยบายนี้เป็นระยะ
          </p>
          <hr className="my-6 border-slate-200 dark:border-slate-800" />
        </section>

        {/* 14 */}
        <section id="contact" className="scroll-mt-24">
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
            14. ช่องทางติดต่อ
          </h2>
          <p className="mt-3 leading-relaxed text-slate-700 dark:text-slate-300">
            หากมีคำถาม ขอใช้สิทธิ หรือต้องการข้อมูลเพิ่มเติม กรุณาติดต่อ: คุณเจมสุราษ{" "}
            <a
              href="mailto:support@example.com"
              className="font-medium text-blue-600 underline-offset-4 hover:underline dark:text-blue-400"
            >
              support@example.com
            </a>
          </p>
        </section>

        {/* Footer actions */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
          <em>มีผลตั้งแต่: {effectiveDate}</em>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 transition hover:bg-white dark:border-slate-700 dark:hover:bg-slate-800"
          >
            ↑ กลับขึ้นด้านบน
          </a>
        </div>
      </article>
    </main>
  );
}
