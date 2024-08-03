const character = document.querySelector('.character');
const dangerLine = document.querySelector('.danger-line');
const objectBox = document.querySelector('.object-box');

let isJumping = false;
let gameInterval;

// মাইক্রোফোন অ্যাক্সেস করার জন্য অনুমতি চাওয়া
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);

    // একটি অডিও বিশ্লেষক নেওয়া
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    source.connect(analyser);

    // নির্দিষ্ট ফ্রিকোয়েন্সি বা শব্দের তীব্রতা শনাক্ত করার লজিক
    function detectSound() {
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);

      // আপনার নির্দিষ্ট ফ্রিকোয়েন্সি বা শব্দের তীব্রতা শনাক্ত করার লজিক
      // উদাহরণস্বরূপ, একটি নির্দিষ্ট ফ্রিকোয়েন্সির মান একটি নির্দিষ্ট থ্রেশহোল্ডের উপরে গেলে জাম্প করান
      const average = dataArray.reduce((sum, num) => sum + num) / dataArray.length;
      if (average > 15) { // আপনার প্রয়োজন অনুযায়ী থ্রেশহোল্ড পরিবর্তন করুন
        jump();
      }

      requestAnimationFrame(detectSound);
    }

    detectSound();
  })
  .catch(err => console.error('Error accessing microphone:', err));

// জাম্প করানোর ফাংশন
function jump() {
  if (!isJumping) {
    isJumping = true;
    let upCount = 10;
    let downCount = 0;

    gameInterval = setInterval(() => {
      if (upCount > 0) {
        character.style.bottom = character.offsetTop + 10 + 'px';
        upCount--;
      } else {
        character.style.bottom = character.offsetTop - 10 + 'px';
        downCount++;
      }

      if (downCount === 10) {
        clearInterval(gameInterval);
        isJumping = false;
      }
    }, 20);
  }
}
