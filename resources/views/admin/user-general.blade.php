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
        <form action="{{ route('admin.users') }}" method="GET" class="search-form">
            {{-- เก็บค่า sort เดิมไว้ --}}
            <input type="hidden" name="sort" value="{{ request('sort', 'desc') }}">

            <div class="search-box">
                <input type="text" name="search" class="search-input" placeholder="ค้นหา..." value="">

                {{-- ✅ ย้าย Class มาที่ปุ่มแทน --}}
                <button type="submit" class="search-btn">
                    <i class='bx bx-search'></i>
                </button>
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
                            {{-- คำนวณเลขลำดับตามการ Sort --}}
                            <td>
                                @if ($sort == 'asc')
                                    {{-- ถ้าเรียงจากเก่าไปใหม่: 1, 2, 3... --}}
                                    {{ $loop->iteration }}
                                @else
                                    {{-- ถ้าเรียงจากใหม่ไปเก่า: 3, 2, 1... (จำนวนทั้งหมด - Index ปัจจุบัน) --}}
                                    {{ $allData->search(function ($item) use ($user) {
                                        return $item->User_ID == $user->User_ID;
                                    }) + 1 }}
                                @endif
                            </td>

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

                                        <img src="{{ asset('img/result-image/' . $user->Image) }}" alt="User Image">
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
