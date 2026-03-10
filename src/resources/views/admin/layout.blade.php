<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Admin Dashboard - CodeCanvas</title>

    {{-- ลิงก์ Font --}}
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    {{-- ลิงก์ Icon --}}
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>

    {{-- ลิงก์เชื่อม CSS --}}
    <link rel="stylesheet" href="{{ asset('css/admin-dashboard.css') }}">

    @stack('styles')
</head>

<body>

    <div class="app-container">
        @include('admin.sidebar')

        <main class="main-content">
            <header class="top-header">
                <div class="header-left">
                </div>
                <div class="header-right">
                </div>
            </header>

            <div class="content-wrapper">
                @yield('content')
            </div>
        </main>
    </div>

    @stack('scripts')

</body>

</html>
