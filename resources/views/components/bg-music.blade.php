<audio id="bgMusic" loop autoplay>
    <source src="{{ asset('/public/audio/bg-sound.mp3') }}" type="audio/mpeg">
</audio>

<script>
    const bgMusic = document.getElementById("bgMusic");
    bgMusic.volume = 0.1; // ความดัง 10%

    // ✅ 1. เปลี่ยนจาก 'load' เป็น 'pageshow' เพื่อให้ทำงานตอนกดปุ่ม Back ด้วย
    window.addEventListener('pageshow', function(event) {
        const savedTime = sessionStorage.getItem('bgMusicTime');
        const isPlaying = sessionStorage.getItem('bgMusicPlaying');

        // ถ้ามีเวลาเดิมบันทึกไว้ ให้ข้ามไปวินาทีนั้น
        if (savedTime) {
            bgMusic.currentTime = parseFloat(savedTime);
        }

        // ✅ 2. เช็คว่าถ้าก่อนเปลี่ยนหน้า เพลงกำลังเล่นอยู่ ก็ให้สั่งเล่นต่อ
        if (isPlaying === 'true' || isPlaying === null) {
            let playPromise = bgMusic.play();

            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    sessionStorage.setItem('bgMusicPlaying', 'true');
                }).catch(error => {
                    console.log("รอผู้ใช้คลิกหน้าจอเพื่อเล่นเสียง (อาจโดนบล็อกจากเบราว์เซอร์)");
                    document.body.addEventListener('click', function playOnInteraction() {
                        bgMusic.play();
                        sessionStorage.setItem('bgMusicPlaying', 'true');
                        document.body.removeEventListener('click', playOnInteraction);
                    }, {
                        once: true
                    });
                });
            }
        }
    });

    // ✅ 3. ตอนออกจากหน้า (ไม่ว่าจะกดไปหน้าอื่น หรือกด Back) ให้บันทึกเวลาและสถานะไว้เสมอ
    window.addEventListener('beforeunload', function() {
        sessionStorage.setItem('bgMusicTime', bgMusic.currentTime);
        sessionStorage.setItem('bgMusicPlaying', !bgMusic.paused); // บันทึกว่าเพลงกำลังเล่นอยู่ไหม
    });
</script>
