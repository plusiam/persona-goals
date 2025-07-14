const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 아이콘 생성을 위한 간단한 SVG
const svgIcon = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="64" fill="#4F46E5"/>
  <g transform="translate(256, 256)">
    <!-- 중앙 원 -->
    <circle cx="0" cy="0" r="80" fill="white" opacity="0.9"/>
    
    <!-- 페르소나를 나타내는 3개의 작은 원 -->
    <circle cx="-120" cy="-60" r="50" fill="white" opacity="0.7"/>
    <circle cx="120" cy="-60" r="50" fill="white" opacity="0.7"/>
    <circle cx="0" cy="120" r="50" fill="white" opacity="0.7"/>
    
    <!-- 연결선 -->
    <line x1="-120" y1="-60" x2="-40" y2="-20" stroke="white" stroke-width="8" opacity="0.5"/>
    <line x1="120" y1="-60" x2="40" y2="-20" stroke="white" stroke-width="8" opacity="0.5"/>
    <line x1="0" y1="120" x2="0" y2="40" stroke="white" stroke-width="8" opacity="0.5"/>
  </g>
  
  <!-- 텍스트 -->
  <text x="256" y="420" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="white">
    PERSONA
  </text>
</svg>
`;

async function generateIcons() {
  const publicDir = path.join(__dirname, '..', 'public');
  
  // SVG를 버퍼로 변환
  const svgBuffer = Buffer.from(svgIcon);
  
  // 다양한 크기의 아이콘 생성
  const sizes = [
    { size: 96, name: 'icon-96.png' },
    { size: 192, name: 'icon-192.png' },
    { size: 512, name: 'icon-512.png' },
    { size: 180, name: 'apple-touch-icon.png' }, // iOS용
    { size: 32, name: 'favicon-32x32.png' },
    { size: 16, name: 'favicon-16x16.png' }
  ];
  
  for (const { size, name } of sizes) {
    try {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(path.join(publicDir, name));
      console.log(`Generated ${name}`);
    } catch (error) {
      console.error(`Error generating ${name}:`, error);
    }
  }
  
  // favicon.ico 생성 (multi-size)
  try {
    await sharp(svgBuffer)
      .resize(32, 32)
      .toFormat('ico')
      .toFile(path.join(publicDir, 'favicon.ico'));
    console.log('Generated favicon.ico');
  } catch (error) {
    console.error('Error generating favicon.ico:', error);
  }
}

// 실행
generateIcons().catch(console.error);