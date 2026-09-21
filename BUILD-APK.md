# วิธี Build เป็น APK (Android)

แอพของคุณพร้อมเป็น PWA แล้ว (manifest.json + sw.js + icons) มี 3 วิธีเลือกตามความสะดวก:

---

## วิธีที่ 1: ติดตั้งแบบ PWA ทันที (ง่ายสุด ไม่ต้อง Build)
> ได้ไอคอนเหมือนแอพจริง เปิดแบบ standalone ไม่มีแถบเบราว์เซอร์

1. บนมือถือ Android เปิด Chrome → ไปที่เว็บแอพ:
   - ถ้าเปิดจาก PC เดียวกัน: `http://192.168.1.38:8000`
   - ถ้าอัพโหลดขึ้นเน็ตแล้ว: `https://xxx.netlify.app`
2. กด `⋮` (3 จุดมุมขวา) → **ติดตั้งแอป / Add to Home screen / Install app**
3. จะได้ไอคอน `Cheki Timer ♡` บนหน้าโฮม เปิดได้เหมือน APK เลย มีเสียงปลุก + กันจอดับครบ

---

## วิธีที่ 2: สร้างไฟล์ .APK จริงด้วย PWABuilder (ไม่ต้องลง Android Studio)

1. อัพโหลด `index.html` + `manifest.json` + `sw.js` + `icon-*.png` ขึ้น hosting https ฟรี:
   - ลากทั้งโฟลเดอร์ไปวางที่ **https://app.netlify.com/drop** หรือ **https://tiiny.host**
   - จะได้ลิงก์ `https://your-app.netlify.app` (ต้องเป็น https เท่านั้น)
2. ไปที่ **https://www.pwabuilder.com** → วางลิงก์ → กด `Start` → `Build My PWA`
3. เลือก `Android` → กด `Generate APK` → ดาวน์โหลดไฟล์ `.apk`
4. ส่ง apk เข้ามือถือ → เปิดไฟล์ → Allow install unknown apps → ติดตั้ง

---

## วิธีที่ 3: Build ด้วย Capacitor + GitHub Actions (ได้ APK แบบไม่ต้องลง SDK ในเครื่อง)

โปรเจคนี้มี `capacitor.config.json` ให้แล้ว

### บนเครื่องที่ลง Android Studio (ถ้ามี)
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap add android
npx cap copy
npx cap open android   # เปิด Android Studio แล้วกด Build > Build APK
```

### แบบ Cloud Build (ไม่ต้องลงอะไรเลย)
1. สร้าง repo บน GitHub → push โฟลเดอร์นี้ขึ้นไป
2. ไฟล์ `.github/workflows/build-apk.yml` จะรันอัตโนมัติ
3. ไปที่ GitHub → Actions → ดาวน์โหลด `ChekiTimer.apk` จาก Artifacts
4. ติดตั้งบน Android ได้เลย

---

## ไฟล์สำคัญที่มีให้แล้ว
- `manifest.json` - ข้อมูล PWA
- `sw.js` - ทำให้ออฟไลน์ได้
- `icon-192.png` / `icon-512.png` / `icon.svg` - ไอคอนแอพ
- `capacitor.config.json` - ตั้งค่า Capacitor (appId: com.chekitimer.app)
- `server.js` - รัน `npm start` แล้วเปิด `http://localhost:8000`

ต้องการให้ผม Build APK ให้เลยผ่าน GitHub Actions บอกได้ครับ ผมจะตั้ง repo ให้พร้อมโหลดได้ทันที

---

## Build ลง iOS (IPA)

**ทางเลือกที่ 1: PWA ติดตั้งทันที (แนะนำ ใช้ได้เลย ไม่ต้องมี Mac)**
- บน iPhone เปิด Safari → `https://xxx.netlify.app` → กด `แชร์ ⬆️ → เพิ่มไปยังหน้าจอโฮม` → ได้ไอคอนเหมือนแอพจริง มีเสียงปลุกวน+กันจอดับครบ (iOS 17+ รองรับดีมาก)

**ทางเลือกที่ 2: Build IPA จริง (ต้องมี Mac + Apple Developer)**
- มีไฟล์ `.github/workflows/build-ios.yml` ให้แล้ว → push ขึ้น GitHub → Actions จะรันบน `macos-latest`
- จะได้ `ios-project` เป็น artifact ต้องเปิดด้วย Xcode บน Mac แล้ว `Archive` → ต้องมี Apple Developer Account ($99/ปี) ถึงจะลงเครื่องจริง/TestFlight ได้
- แบบไม่มี signing (`CODE_SIGNING_ALLOWED=NO`) จะได้แค่ไฟล์ `.app` สำหรับ Simulator ไม่สามารถลง iPhone จริงโดยตรงได้ ต้องใช้ AltStore / Apple Configurator sideload

**สรุป:** ถ้าแค่อยากใช้เองบน iPhone ตอนนี้ → ใช้ **PWA** เร็วสุดครับ ถ้าอยากขึ้น App Store จริงต้องมี Mac + Apple Developer
