@extends('admin.layout')

@push('styles')
    <link rel="stylesheet" href="{{ asset('css/admin-gamecode.css') }}">
@endpush

@section('content')
    <div class="dashboard-title-section">
        <h1 class="page-title">Game Content > Game Code</h1>
        <p class="current-date">{{ now()->format('d/m/Y') }}</p>
    </div>

    <div class="code-grid">

        <div class="code-card">
            <div class="card-header-flex">
                <div class="header-icon-circle">
                    <i class='bx bxs-color-fill'></i>
                </div>
                <h2 class="header-title">{{ count($colors) }} Color Codes</h2>
            </div>

            <ul class="code-list">
                @foreach ($colors as $color)
                    <li class="code-item">
                        <div class="color-circle"
                            style="background-color: {{ $color->Color_Code }};
                            {{ $color->Color_Name == 'None' ? 'border: 2px solid #eee;' : '' }}">
                        </div>

                        <span class="item-label">{{ $color->Color_Name }}</span>
                    </li>
                @endforeach
            </ul>
        </div>
        {{-- end color --}}

        <div class="code-card">
            <div class="card-header-flex">
                <div class="header-icon-circle">
                    <i class='bx bxs-layer'></i>
                </div>
                <h2 class="header-title">5 Texture Codes</h2>
            </div>

            <ul class="code-list">
                <li class="code-item">
                    <div class="color-circle cc-none"></div>
                    <span class="item-label">None</span>
                </li>

                <li class="code-item">
                    <div class="color-circle cc-grey"></div>
                    <span class="item-label">Dot</span>
                </li>

                <li class="code-item">
                    <img src="{{ asset('img/elements-backend/gamecode-grid.png') }}" class="texture-img" alt="Grid">
                    <span class="item-label">Grid</span>
                </li>

                <li class="code-item">
                    <img src="{{ asset('img/elements-backend/gamecode-heart.png') }}" class="texture-img" alt="Heart">
                    <span class="item-label">Heart</span>
                </li>

                <li class="code-item">
                    <img src="{{ asset('img/elements-backend/gamecode-line.png') }}" class="texture-img" alt="Line">
                    <span class="item-label">Line</span>
                </li>

                <li class="code-item">
                    <img src="{{ asset('img/elements-backend/gamecode-star.png') }}" class="texture-img" alt="Star">
                    <span class="item-label">Star</span>
                </li>

            </ul>
        </div>

    </div>
@endsection
