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
</head>

<body>
    <div class="container">
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
            <div class="sec-content-left">
                <div class="content-topic">
                    <h2>คลังภาพวาด / ชิ้นงานที่ {{ $data->User_ID }}</h2>
                    <h1>{{ $data->User_Name }}</h1>
                </div>
                <div class="content-img-result">
                    <img src="{{ asset('img/result-image/' . $data->Image) }}" alt="{{ $data->Challenge }}"
                        onerror="this.src='{{ asset('img/elements-frontend/logo-01.png') }}'" />
                </div>
            </div>

            {{-- ส่วนแสดงโค้ด (ใช้ Logic ชุดที่ 2) --}}
            <div class="sec-content-right">
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
                        <p class="no-data">ไม่พบข้อมูลโค้ด</p>
                    @endif
                </div>
            </div>
        </div>
    </div>

    {{-- ✅ เรียกใช้ไฟล์เสียงที่เราสร้างไว้ --}}
    @include('components.bg-music')
</body>

</html>
