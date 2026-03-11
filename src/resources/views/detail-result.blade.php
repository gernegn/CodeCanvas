<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Code Canvas - Detail</title>
    <link rel="icon" type="image/png" href="{{ asset('img/elements-frontend/logo-favicon.svg') }}" />

    {{-- ใส่ ?v=time() เพื่อแก้ปัญหาจำค่าเก่า --}}
    <link href="{{ asset('css/detail-result.css') }}?v={{ time() }}" rel="stylesheet">

    <script src="https://code.iconify.design/3/3.1.1/iconify.min.js"></script>
    <link
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@100;200;300;400;500;600;700&display=swap"
        rel="stylesheet" />

    {{-- ✅ เพิ่ม Font Sriracha และ Caveat เข้ามาที่นี่ --}}
    <link href="https://fonts.googleapis.com/css2?family=Sriracha&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap" rel="stylesheet">
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

        <div class="bg">
            <img src="{{ asset('img/elements-frontend/bg.png') }}" alt="Background" />
        </div>

        <div class="sec-head">
            <div class="btn-box">
                <button class="bt-back" onclick="window.location.href='{{ route('game.gallery') }}'">
                    <span class="iconify" data-icon="material-symbols:arrow-back-ios-rounded"></span>
                </button>
            </div>
            <a href="{{ route('game.home') }}">
                <img src="{{ asset('img/elements-frontend/logo-01.png') }}" alt="logo01" />
            </a>
        </div>

        <div class="sec-content">

            {{-- ✅ 1. คำนวณจำนวนโค้ดทั้งหมดเตรียมไว้ --}}
            @php
                $codeCount = 0;
                $codeList = [];
                if (isset($ccv_UserCode) && $ccv_UserCode && $ccv_UserCode->User_Code) {
                    // แยกโค้ดด้วยคอมม่า และลบช่องว่างทิ้ง
                    $codeList = array_filter(array_map('trim', explode(',', $ccv_UserCode->User_Code)));
                    $codeCount = count($codeList);
                }
            @endphp

            {{-- --- ฝั่งซ้าย --- --}}
            <div class="sec-content-left">
                {{-- ✅ 2. เพิ่มกล่องสีขาวครอบเนื้อหา --}}
                <div class="left-white-box">
                    <div class="content-topic">
                        <h2>Galleries / Artwork No. {{ $data->User_ID }}</h2>

                        {{-- ✅ เช็คภาษาด้วย PHP (ถ้ามีภาษาไทยให้ตัวแปร $isThai เป็น true) --}}
                        @php
                            $isThai = preg_match('/[\x{0E00}-\x{0E7F}]/u', $data->User_Name);
                            $fontClass = $isThai ? 'font-sriracha' : 'font-caveat';
                        @endphp

                        <h1 class="{{ $fontClass }}">{{ $data->User_Name }}</h1>
                    </div>
                    <div class="content-img-result">
                        <img src="{{ asset('img/result-image/' . $data->Image) }}" alt="{{ $data->Challenge }}"
                            onerror="this.src='{{ asset('img/elements-frontend/logo-01.png') }}'" />
                    </div>
                </div>
            </div>

            {{-- ส่วนแสดงโค้ด (ใช้ Logic ชุดที่ 2) --}}
            <div class="sec-content-right">

                {{-- ✅ 3. เพิ่ม Header บอกจำนวนโค้ด --}}
                <div class="code-panel-header">
                    <h3>Drawn with {{ $codeCount }} codes</h3>
                </div>

                <div class="code-panel">
                    @if (isset($ccv_UserCode) && $ccv_UserCode && $ccv_UserCode->User_Code)
                        @foreach (explode(',', $ccv_UserCode->User_Code) as $code)
                            @php
                                $c = trim($code);
                                $colorClass = 'cmd-default';

                                // Logic ตรวจสอบคำสั่งแบบ Case Insensitive
                                if (stripos($c, 'forward') !== false) {
                                    $colorClass = 'cmd-forward';
                                } elseif (stripos($c, 'moveLeft') !== false) {
                                    $colorClass = 'cmd-left';
                                } elseif (stripos($c, 'moveRight') !== false) {
                                    $colorClass = 'cmd-right';
                                }
                            @endphp

                            <div class="code-pill {{ $colorClass }}">
                                {{ $c }}
                            </div>
                        @endforeach
                    @else
                        <p class="no-data">Oops!<br>We couldn't find any code.</p>
                    @endif
                </div>
            </div>
        </div>
    </div>

    {{-- ✅ เรียกใช้ไฟล์เสียงที่เราสร้างไว้ --}}
    @include('components.bg-music')
</body>

</html>
