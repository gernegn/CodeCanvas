<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Code Canvas</title>
    <link rel="icon" type="image/png" href="img/elements-frontend/logo-favicon.svg" />
    {{-- เชื่อม css --}}
    <link href="{{ asset('css/gallery.css') }}?v={{ time() }}" rel="stylesheet">

    <script src="https://code.iconify.design/3/3.1.1/iconify.min.js"></script>

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@100;200;300;400;500;600;700&display=swap"
        rel="stylesheet" />
</head>

<body>
    <div class="container">
        <div class="anim-bg-container">
            <img src="{{ asset('img/elements-frontend/cloud-white.png') }}" class="anim-cloud cloud-1" alt="cloud">
            <img src="{{ asset('img/elements-frontend/cloud-light.png') }}" class="anim-cloud cloud-2" alt="cloud">
            <img src="{{ asset('img/elements-frontend/cloud-medium.png') }}" class="anim-cloud cloud-3" alt="cloud">
            <img src="{{ asset('img/elements-frontend/cloud-dark.png') }}" class="anim-cloud cloud-4" alt="cloud">

            <img src="{{ asset('img/elements-frontend/1clover.png') }}" class="anim-leaf leaf-1" alt="leaf">
            <img src="{{ asset('img/elements-frontend/1clover.png') }}" class="anim-leaf leaf-2" alt="leaf">
            <img src="{{ asset('img/elements-frontend/1clover.png') }}" class="anim-leaf leaf-3" alt="leaf">
            <img src="{{ asset('img/elements-frontend/1clover.png') }}" class="anim-leaf leaf-4" alt="leaf">
        </div>

        <div class="bg-grass">
            <img src="{{ asset('img/elements-frontend/grass-01.png') }}" alt="Grass01" />
        </div>
        <div class="bg-cloud">
            <img src="{{ asset('img/elements-frontend/cloud-01.png') }}" alt="Cloud01" />
        </div>
        <div class="sec-head">
            <div class="btn-box">
                <button class="bt-back" onclick="window.location.href='{{ route('game.home') }}'">
                    <span class="iconify" data-icon="fa7-solid:home"></span>
                </button>
            </div>

            {{-- ✅ แก้ไขหัวข้อให้บอกจำนวนรูปทั้งหมดที่มีในฐานข้อมูล --}}
            <h1 class="challenge">Gallery of {{ $images->total() ?? 0 }} Artworks</h1>

            <a href="{{ route('game.home') }}">
                <img src="{{ asset('img/elements-frontend/logo-01.png') }}" alt="logo01" />
            </a>
        </div>
        <div class="sec-content">
            <div class="sec-content-top">

                {{-- ตรวจสอบว่ามีข้อมูลรูปภาพส่งมาหรือไม่ --}}
                @if ($images->count() > 0)

                    {{-- แบ่งข้อมูล 8 ตัว เป็น 2 ก้อน (ก้อนละ 4 ตัว) สำหรับแถวบนและล่าง --}}
                    @php
                        $chunks = $images->chunk(4);
                    @endphp

                    {{-- === แถวบน (Row Top) === --}}
                    <div class="row-top">
                        @foreach ($chunks[0] as $index => $img)
                            <div class="box-result">

                                {{-- 2. รูปภาพ --}}
                                <div class="img-result">
                                    <img src="{{ asset('img/result-image/' . $img->Image) }}" alt="User Art"
                                        onerror="this.src='{{ asset('img/elements-frontend/logo-01.png') }}'" />
                                </div>

                                {{-- 3. ส่วนแสดงชื่อ และ จำนวนโค้ด --}}
                                <div class="name-result">
                                    {{ $img->User_Name ?? 'Unknown Artist' }}

                                    {{-- ✅ คำนวณจำนวนโค้ดที่ใช้วาด --}}
                                    @php
                                        $codeCount = 0;
                                        if (isset($img->User_Code) && !empty($img->User_Code)) {
                                            // นับจำนวนคำสั่งจากคอมม่า (,)
                                            $codeCount = count(explode(',', $img->User_Code));
                                        } elseif (isset($img->code_count)) {
                                            $codeCount = $img->code_count;
                                        }
                                    @endphp

                                    {{-- ✅ แสดงจำนวนโค้ด --}}
                                    <div class="code-count">Drawn with {{ $codeCount }} codes</div>
                                </div>

                                {{-- ✅ ลูกเล่น Hover เอาเมาส์ชี้แล้วขึ้นคำว่า "ดูรายละเอียด" --}}
                                <div class="hover-overlay">
                                    <div class="hover-btn">Detail</div>
                                </div>

                                {{-- 4. ลิ้งค์ล่องหน --}}
                                <a href="{{ route('game.detail', ['id' => $img->User_ID]) }}" class="click-layer"></a>
                            </div>
                        @endforeach

                        {{-- (ส่วนกล่องเปล่า for loop คงไว้เหมือนเดิม) --}}
                        @for ($i = count($chunks[0]); $i < 4; $i++)
                            <div class="box-result" style="visibility: hidden;"></div>
                        @endfor
                    </div>

                    {{-- === แถวล่าง (Row Bottom) === --}}
                    <div class="row-bottom">
                        @if (isset($chunks[1]))
                            @foreach ($chunks[1] as $index => $img)
                                <div class="box-result">

                                    {{-- 2. รูปภาพ --}}
                                    <div class="img-result">
                                        <img src="{{ asset('img/result-image/' . $img->Image) }}" alt="User Art"
                                            onerror="this.src='{{ asset('img/elements-frontend/logo-01.png') }}'" />
                                    </div>

                                    {{-- 3. ส่วนแสดงชื่อ และ จำนวนโค้ด --}}
                                    <div class="name-result">
                                        {{ $img->User_Name ?? 'Unknown Artist' }}

                                        {{-- ✅ คำนวณจำนวนโค้ดที่ใช้วาด --}}
                                        @php
                                            $codeCount = 0;
                                            if (isset($img->User_Code) && !empty($img->User_Code)) {
                                                $codeCount = count(explode(',', $img->User_Code));
                                            } elseif (isset($img->code_count)) {
                                                $codeCount = $img->code_count;
                                            }
                                        @endphp

                                        {{-- ✅ แสดงจำนวนโค้ด --}}
                                        <div class="code-count">Drawn with {{ $codeCount }} codes</div>
                                    </div>

                                    {{-- ✅ ลูกเล่น Hover เอาเมาส์ชี้แล้วขึ้นคำว่า "ดูรายละเอียด" --}}
                                    <div class="hover-overlay">
                                        <div class="hover-btn">Detail</div>
                                    </div>

                                    {{-- 4. ลิ้งค์ล่องหน --}}
                                    <a href="{{ route('game.detail', ['id' => $img->User_ID]) }}"
                                        class="click-layer"></a>
                                </div>
                            @endforeach

                            {{-- (ส่วนกล่องเปล่า for loop คงไว้เหมือนเดิม) --}}
                            @for ($i = count($chunks[1]); $i < 4; $i++)
                                <div class="box-result" style="visibility: hidden;"></div>
                            @endfor
                        @else
                            <div class="box-result" style="visibility: hidden;"></div>
                        @endif
                    </div>
                @else
                    {{-- กรณีไม่มีข้อมูลใน Database เลย --}}
                    <div style="width: 100%; text-align: center; margin-top: 5rem;">
                        <h2 style="color: #666;">No drawings yet. Start Creating</h2>
                    </div>
                @endif
            </div>

            {{-- === ส่วนปุ่มเปลี่ยนหน้า (Pagination) === --}}
            <div class="sec-content-bottom">

                {{-- ปุ่มย้อนกลับ (Prev) --}}
                @if ($images->onFirstPage())
                    {{-- ถ้าอยู่หน้าแรก ให้ปุ่มกดไม่ได้ --}}
                    <button class="gallery-bt-prev" style="opacity: 0.5; cursor: default;">
                        <span class="iconify" data-icon="material-symbols:arrow-back-ios-rounded"></span>
                    </button>
                @else
                    {{-- ถ้าไม่ใช่หน้าแรก ให้ลิ้งค์ไปหน้าก่อนหน้า --}}
                    <a href="{{ $images->previousPageUrl() }}">
                        <button class="gallery-bt-prev">
                            <span class="iconify" data-icon="material-symbols:arrow-back-ios-rounded"></span>
                        </button>
                    </a>
                @endif

                {{-- ตัวเลขหน้า 1/5 --}}
                <h3 class="text-num">
                    {{ $images->currentPage() }}/{{ $images->lastPage() > 0 ? $images->lastPage() : 1 }}
                </h3>

                {{-- ปุ่มถัดไป (Next) --}}
                @if ($images->hasMorePages())
                    <a href="{{ $images->nextPageUrl() }}">
                        <button class="gallery-bt-next">
                            <span class="iconify" data-icon="material-symbols:arrow-forward-ios-rounded"></span>
                        </button>
                    </a>
                @else
                    <button class="gallery-bt-next" style="opacity: 0.5; cursor: default;">
                        <span class="iconify" data-icon="material-symbols:arrow-forward-ios-rounded"></span>
                    </button>
                @endif
            </div>
        </div>
    </div>
    <script src="{{ asset('js/codeCanvas.js') }}"></script>

    {{-- ✅ เรียกใช้ไฟล์เสียงที่เราสร้างไว้ --}}
    @include('components.bg-music')
</body>

</html>
