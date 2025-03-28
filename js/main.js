function generateImage(designNumber) {
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
      1: { fontSize: 28, fontColor: '#feffff', x: img.width * 0.7, y: 1155 },
      2: { fontSize: 38, fontColor: '#0f4c82', x: img.width / 2, y: 957 },
      3: { fontSize: 55, fontColor: '#333333', x: img.width / 2, y: 1660 },
      4: { fontSize: 40, fontColor: '#000000', x: 300, y: 1680 },
      5: { fontSize: 36, fontColor: '#fefeff', x: img.width / 2, y: 1035 },
      6: { fontSize: 30, fontColor: '#4e615f', x: 180, y: 855 }
    };

    const settings = designSettings[designNumber] || { fontSize: 36, fontColor: '#006699', x: img.width / 2, y: 500 };

    // 🔧 حل Safari: إجبار تحميل الخط
    const safariFix = document.createElement('div');
    safariFix.style.fontFamily = selectedFont;
    safariFix.style.fontSize = `${settings.fontSize}px`;
    safariFix.style.opacity = '0';
    safariFix.style.position = 'absolute';
    safariFix.innerText = '.';
    document.body.appendChild(safariFix);
    setTimeout(() => {
      document.body.removeChild(safariFix);
    }, 200);

    await document.fonts.load(`${settings.fontSize}px ${selectedFont}`);

    drawCard();
    setTimeout(drawCard, 100); // إعادة رسم لضمان تحميل الخط

    // 📊 تتبع عرض التصميم
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
      downloadBtn.href = canvas.toDataURL("image/png", 1.0); // جودة عالية
      downloadBtn.style.display = 'inline-block';

      // 📊 تتبع التحميل
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
