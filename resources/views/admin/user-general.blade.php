@extends('admin.layout')

@push('styles')
    <link rel="stylesheet" href="{{ asset('css/admin-usergeneral.css') }}">
@endpush

@section('content')
    <div class="dashboard-title-section">
        <h1 class="page-title">User Data > User General</h1>
        <p class="current-date">{{ now()->format('d/m/Y') }}</p>
    </div>

    <div class="search-section">
        <form action="#" method="GET" class="search-form">
            <div class="search-box">
                <input type="text" class="search-input" placeholder="Search...">
                <i class='bx bx-search search-icon'></i>
            </div>
        </form>

        <div class="filter-box">
            <label for="sortOrder" style="margin-right: 10px; font-weight: 500;">Sort by:</label>
            <select id="sortOrder" class="filter-select" onchange="window.location.href=this.value;">
                <option value="{{ route('admin.users', ['sort' => 'desc']) }}" {{ $sort == 'desc' ? 'selected' : '' }}>
                    Newest
                </option>
                <option value="{{ route('admin.users', ['sort' => 'asc']) }}" {{ $sort == 'asc' ? 'selected' : '' }}>
                    Oldest
                </option>
            </select>
        </div>
    </div>

    <div class="table-card">
        <div class="table-responsive">
            <table class="custom-table">
                <thead>
                    <tr>
                        <th width="5%">ID</th>
                        <th width="15%">Challenge</th>
                        <th width="15%">User Name</th>
                        <th width="15%">Image created</th>
                        <th width="10%">Time</th>
                        <th width="20%">Date/Time</th>
                        <th width="10%">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($users as $user)
                        <tr>
                            <td>{{ $user->User_ID }}</td>

                            <td>{{ $user->game->Challenge ?? '-' }}</td>

                            <td>{{ $user->User_Name ?? '-' }}</td>

                            <td>
                                <div class="img-placeholder">
                                    @if ($user->Image)
                                        @php
                                            // 1. ระเบิดชื่อไฟล์ด้วยเครื่องหมาย - (ขีดกลาง)
                                            // ตัวอย่าง: "fish-red-heart.png" จะได้เป็น array ["fish", "red", "heart.png"]
                                            $parts = explode('-', $user->Image);

                                            // 2. เอาตัวแรกออกมาใช้เป็นชื่อโฟลเดอร์ (เช่น "fish")
                                            $folderName = $parts[0];
                                        @endphp

                                        <img src="{{ asset('img/user-image/' . $folderName . '/' . $user->Image) }}"
                                            alt="User Image">
                                    @else
                                        <span style="font-size: 2rem;">-</span>
                                    @endif
                                </div>
                            </td>

                            <td>{{ $user->Timestamp_Min ?? '-' }}</td>


                            <td>
                                @if ($user->created_at)
                                    {{ $user->created_at->format('H:i:s') }}<br>
                                    <small style="color:#888;">{{ $user->created_at->format('d/m/Y') }}</small>
                                @else
                                    -
                                @endif
                            </td>

                            <td>
                                <form action="{{ route('admin.users.delete', $user->User_ID) }}" method="POST"
                                    onsubmit="return confirm('Are you sure you want to delete this item?');">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn-delete">
                                        <i class='bx bxs-trash'></i>
                                    </button>
                                </form>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
@endsection
