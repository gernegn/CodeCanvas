@extends('admin.layout')

@push('styles')
    <link rel="stylesheet" href="{{ asset('css/admin-usercode.css') }}">
@endpush

@section('content')
    <div class="dashboard-title-section">
        <h1 class="page-title">User Data > User Code</h1>
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
                <option value="{{ route('admin.user-code', ['sort' => 'desc']) }}" {{ $sort == 'desc' ? 'selected' : '' }}>
                    Newest
                </option>
                <option value="{{ route('admin.user-code', ['sort' => 'asc']) }}" {{ $sort == 'asc' ? 'selected' : '' }}>
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
                        <th width="50%" class="th-multiline">
                            Sort Code
                            <span>(Command, Time)</span>
                        </th>
                        <th width="35%" class="th-multiline">
                            Sort Code
                            <span>(Color, Texture)</span>
                        </th>
                        <th width="10%">Delete</th>
                    </tr>
                </thead>

                <tbody>
                    @foreach ($userCodes as $code)
                        <tr>
                            <td>
                                @if ($sort == 'asc')
                                    {{-- ถ้าเรียงจากเก่าไปใหม่: 1, 2, 3... --}}
                                    {{ $loop->iteration }}
                                @else
                                    {{-- ✅ แก้ตรงนี้: เปลี่ยน $users เป็น $userCodes --}}
                                    {{ $userCodes->count() - $loop->index }}
                                @endif
                            </td>

                            <td>
                                <div class="code-container">
                                    @php
                                        // สมมติว่าข้อมูลใน DB เก็บเป็น string ยาวๆ เช่น "forward(7),moveLeft(90),..."
                                        // เราต้องระเบิด string ออกมาเป็น array (ถ้าเก็บแบบอื่นต้องปรับตรงนี้)
                                        $commands = explode(',', $code->User_Code);
                                    @endphp

                                    @foreach ($commands as $cmd)
                                        @php
                                            $cmd = trim($cmd); // ลบช่องว่างหัวท้าย
                                            $bgClass = 'bg-blue'; // ค่าเริ่มต้น (forward)

                                            if (str_contains($cmd, 'moveLeft')) {
                                                $bgClass = 'bg-orange';
                                            } elseif (str_contains($cmd, 'moveRight')) {
                                                $bgClass = 'bg-pink';
                                            }
                                        @endphp

                                        <span class="code-btn {{ $bgClass }}">{{ $cmd }}</span>
                                    @endforeach
                                </div>
                            </td>

                            <td>
                                <div class="code-container" style="flex-direction: column; align-items: center;">
                                    @if ($code->Color_Name)
                                        <span class="code-btn bg-green">addColor({{ $code->Color_Name }})</span>
                                    @endif

                                    @if ($code->Texture_Name)
                                        <span class="code-btn bg-green">addTexture({{ $code->Texture_Name }})</span>
                                    @endif
                                </div>
                            </td>

                            <td>
                                <form action="{{ route('admin.user-code.delete', $code->UserCode_ID) }}" method="POST"
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
