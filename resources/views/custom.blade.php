<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>Code Canvas</title>
    <link rel="icon" type="image/png" href="img/elements-frontend/logo-favicon.svg" />
    {{-- เชื่อม css --}}
    <link href="{{ asset('css/custom.css') }}" rel="stylesheet">

    <!-- Iconify CDN -->
    <script src="https://code.iconify.design/3/3.1.1/iconify.min.js"></script>

    <!-- IBM Font -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@100;200;300;400;500;600;700&display=swap"
        rel="stylesheet" />
</head>

<body>
    <div class="container">
        <div class="bg-grass">
            <img src="{{ asset('img/elements-frontend/grass-01.png') }}" alt="Grass01" />
        </div>
        <!-- end bg-grass -->

        <div class="bg-cloud">
            <img src="{{ asset('img/elements-frontend/cloud-01.png') }}" alt="Cloud01" />
        </div>
        <!-- end bg-cloud -->

        <div class="sec-head">
            <h1>ตกแต่งภาพวาดของคุณ</h1>
            <a href="{{ route('game.home') }}">
                <img src="{{ asset('img/elements-frontend/logo-01.png') }}" alt="logo01" />
            </a>
        </div>
        <!-- end sec-head -->

        <div class="sec-content">
            <div class="sec-content-left">
                <div class="canvas">
                    <img src="{{ asset('img/elements-frontend/wink-yellow-02.png') }}" class="wink-yellow-01"
                        alt="Wink">
                    <div class="frame-result-radius">
                        <img id="customResultImg" src="" class="box-result-img" alt="Result Image">
                    </div>
                    <img src="{{ asset('img/elements-frontend/wink-yellow-02.png') }}" class="wink-yellow-02"
                        alt="Wink">
                </div>
                <!-- end canvas -->
            </div>
            <!-- end sec-content-left -->

            <div class="sec-content-right">
                <div class="box-custom">
                    {{-- 1. ส่วนกรอกชื่อ --}}
                    <div class="custom-name">
                        <div class="topic-name">
                            <span class="iconify" data-icon="material-symbols:draw"></span>
                            <p>addName()</p>
                        </div>
                        <input type="text" id="userNameInput" placeholder="Add name here">
                    </div>

                    {{-- 2. ส่วนเลือก Color --}}
                    <div class="custom-color">
                        <div class="topic-color">
                            <span class="iconify" data-icon="material-symbols:draw"></span>
                            <p>addColor()</p>
                        </div>
                        <div class="box-color"></div>
                    </div>

                    {{-- 3. ส่วนเลือก Texture --}}
                    <div class="custom-texture">
                        <div class="topic-texture">
                            <span class="iconify" data-icon="material-symbols:draw"></span>
                            <p>addTexture()</p>
                        </div>
                        <div class="box-texture">
                            <div class="box-texture-top">
                                <div class="texture-btn box-texture-none" onclick="selectTexture('none', this)"></div>

                                <div class="texture-btn"
                                    style="background-image: url('{{ asset('img/texture/dot.png') }}');"
                                    onclick="selectTexture('dot', this)">
                                </div>

                                <div class="texture-btn"
                                    style="background-image: url('{{ asset('img/texture/grid.png') }}');"
                                    onclick="selectTexture('grid', this)">
                                </div>
                            </div>

                            <div class="box-texture-bottom">
                                <div class="texture-btn"
                                    style="background-image: url('{{ asset('img/texture/heart.png') }}');"
                                    onclick="selectTexture('heart', this)">
                                </div>

                                <div class="texture-btn"
                                    style="background-image: url('{{ asset('img/texture/line.png') }}');"
                                    onclick="selectTexture('line', this)">
                                </div>

                                <div class="texture-btn"
                                    style="background-image: url('{{ asset('img/texture/star.png') }}');"
                                    onclick="selectTexture('star', this)">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bt-confirm">
                    <button class="confirm" disabled>ยืนยัน</button>
                </div>
            </div>
            <!-- end sec-content-right -->
        </div>
        <!-- end sec-content -->

    </div>
    <!-- end container -->

    <!-- Popup -->
    <div id="customSuccessModal" class="custom-modal-overlay">
        <div class="custom-modal-container">

            <img src="{{ asset('img/elements-frontend/wink-yellow-01.png') }}" class="star-decor-img star-top-left"
                alt="star">
            <img src="{{ asset('img/elements-frontend/wink-yellow-01.png') }}" class="star-decor-img star-top-right"
                alt="star">
            <img src="{{ asset('img/elements-frontend/wink-yellow-01.png') }}" class="star-decor-img star-bottom-left"
                alt="star">

            <div class="modal-header-text">
                <h2>ยินดีด้วย คุณวาดรูป</h2>
                <h1 class="text-success">สำเร็จแล้ว!</h1>
            </div>

            <div class="modal-content-wrapper">

                <div class="result-image-box">
                    <img src="{{ asset('img/result-image/house-yellow-dot.png') }}" alt="Result"
                        id="finalResultImage">
                </div>

                <div class="qr-section">
                    <div class="qr-box">
                        <img id="qrResult"
                            src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ExampleData"
                            alt="QR Code" class="qr-code-img">
                    </div>
                    <div class="qr-text">
                        <p>สแกนเพื่อเก็บ<br>ภาพวาดของคุณ</p>
                    </div>
                </div>

            </div>
        </div>

        <a href="{{ route('game.gallery') }}" class="btn-gallery-green">
            <span class="iconify" data-icon="fluent:draw-image-24-regular"></span>
            คลังภาพวาด
        </a>
    </div>

    <!-- Script -->
    <script src="{{ asset('js/codeCanvas.js') }}"></script>
</body>

</html>
