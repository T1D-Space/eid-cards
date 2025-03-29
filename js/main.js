async function generateImage(designNumber) {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const name = document.getElementById('nameInput').value;
  const selectedFont = document.getElementById('fontSelect').value;
  const img = new Image();
  img.src = `images/design${designNumber}.jpg`;

  img.onload = async function () {
    canvas.width = img.width;
    canvas.height = img.height;

    const designSettings = {
      1: { fontSize: 125, fontColor: '#005cb9', x: img.width / 2, y: 4200 },
      2: { fontSize: 125, fontColor: '#00a0e0', x: img.width / 2, y: 4488 },
      3: { fontSize: 125, fontColor: '#d53321', x: img.width / 2, y: 3000 },
      4: { fontSize: 125, fontColor: '#19478a', x: img.width / 2, y: 4330 },
      5: { fontSize: 125, fontColor: '#005cb9', x: img.width / 2, y: 4200 },
      6: { fontSize: 125, fontColor: '#005cb9', x: img.width / 2, y: 4200 }
    };

    const settings = designSettings[designNumber] 
      || { fontSize: 36, fontColor: '#006699', x: img.width / 2, y: 500 };

    // إنشاء عنصر خفي لإجبار Safari على تحميل الخط
    const safariFix = document.createElement('div');
    safariFix.style.fontFamily = selectedFont;
    safariFix.style.fontSize = `${settings.fontSize}px`;
    safariFix.style.opacity = '0';
    safariFix.style.position = 'absolute';
    safariFix.innerText = '.';
    document.body.appendChild(safariFix);

    // تشغيل "reflow" لإجبار المتصفح على معالجة الـDOM
    // (تعد حركة شائعة في Safari للتيقّن أن الخط يبدأ بالتحميل)
    const forceReflow = document.body.offsetHeight;

    try {
      // تحميل الخط بالوزن المناسب (bold إذا كنت تستعمله في ctx.font)
      await document.fonts.load(`bold ${settings.fontSize}px ${selectedFont}`);
      // الانتظار حتى تجهز جميع الخطوط (اختياري لكن مفيد أكثر في Safari)
      await document.fonts.ready;
    } catch (err) {
      // في حال لم يدعم المتصفح document.fonts أو حصل خطأ
      console.warn('document.fonts لا يعمل على هذا المتصفح أو حدث خطأ: ', err);
    }

    // إزالة العنصر الخفي بعد فترة بسيطة
    setTimeout(() => {
      document.body.removeChild(safariFix);
    }, 300);

    // بعد التحميل، ارسم البطاقة مرة أولى
    drawCard();

    // نفذ إعادة الرسم مرة أخرى بعد مهلة؛ أحيانًا يحتاج Safari إعادة ثانية
    setTimeout(drawCard, 200);

    // سجّل حدث مشاهدة التصميم (إن كنت تستعمل Google Analytics)
    if (typeof gtag === 'function') {
      gtag('event', 'view_design', {
        event_category: 'cards',
        event_label: `design${designNumber}`,
        value: 1,
        font: selectedFont
      });
    }

    function drawCard() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.font = `bold ${settings.fontSize}px ${selectedFont}`;
      ctx.fillStyle = settings.fontColor;
      ctx.textAlign = 'center';
      ctx.fillText(name, settings.x, settings.y);
      canvas.style.display = 'block';

      const downloadBtn = document.getElementById('downloadBtn');
      downloadBtn.href = canvas.toDataURL('image/png', 1.0); // جودة عالية
      downloadBtn.style.display = 'inline-block';

      // تتبع حدث التنزيل
      downloadBtn.onclick = () => {
        if (typeof gtag === 'function') {
          gtag('event', 'download_card', {
            event_category: 'cards',
            event_label: `design${designNumber}`,
            value: 1,
            font: selectedFont
          });
        }
      };
    }
  };
}
