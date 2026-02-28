@extends('admin.layout')

@push('styles')
    <link rel="stylesheet" href="{{ asset('css/admin-gamegeneral.css') }}">

    <style>
        /* ล็อคหน้าจอหลักไม่ให้เลื่อน */
        .content-wrapper {
            overflow: hidden !important;
        }

        /* อนุญาตให้กล่องตารางเลื่อนขึ้นลงได้ */
        .table-card {
            flex: 1;
            overflow-y: auto !important;
            min-height: 0;
        }

        /* ล็อคหัวตารางให้อยู่กับที่ (Sticky Header) */
        .custom-table th {
            position: sticky;
            top: 0;
            z-index: 10;
            background-color: #fff;
            box-shadow: 0 2px 0px #f0f0f0;
            /* สร้างเส้นขอบจำลองตอนเลื่อน */
        }
    </style>
@endpush

@section('content')
    <div class="dashboard-title-section">
        <h1 class="page-title">Game Content > Game General</h1>
        <p class="current-date">{{ now()->format('d/m/Y') }}</p>
    </div>

    <div class="card table-card">
        <table class="custom-table">
            <thead>
                <tr>
                    <th style="width: 10%;">ID</th>
                    <th style="width: 30%;">Challenge</th>
                    <th style="width: 30%;">Original Image</th>
                    <th style="width: 20%;">Status</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($games as $game)
                    <tr>
                        <td class="text-id">{{ $game->Challenge_ID }}</td>

                        <td class="text-name">{{ $game->Challenge }}</td>

                        <td>
                            <div class="img-preview-box">
                                @if ($game->Original_Image)
                                    <img src="{{ asset('img/original-image/' . $game->Original_Image) }}"
                                        alt="{{ $game->Challenge }}"
                                        style="max-width: 90%; max-height: 90%; object-fit: contain;">
                                @else
                                    <span style="color:#ccc;">No Image</span>
                                @endif
                            </div>
                        </td>

                        <td>
                            <label class="toggle-switch">
                                <input type="checkbox" class="status-toggle" data-id="{{ $game->Challenge_ID }}"
                                    {{ $game->Status == 1 ? 'checked' : '' }}>
                                <span class="slider"></span>
                            </label>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
@endsection

@push('scripts')
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // 1. เลือกปุ่ม Toggle ทั้งหมดที่มี class 'status-toggle'
            const toggles = document.querySelectorAll('.status-toggle');

            toggles.forEach(toggle => {
                toggle.addEventListener('change', function() {
                    // 2. เก็บค่า ID และ Status ใหม่
                    const gameId = this.getAttribute('data-id');
                    const newStatus = this.checked ? 1 : 0; // ถ้าติ๊ก = 1, ไม่ติ๊ก = 0

                    // 3. ส่งข้อมูลไปหา Controller ผ่าน fetch (AJAX)
                    fetch("{{ route('admin.game.update-status') }}", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "X-CSRF-TOKEN": document.querySelector(
                                    'meta[name="csrf-token"]').getAttribute('content')
                            },
                            body: JSON.stringify({
                                id: gameId,
                                status: newStatus
                            })
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                console.log("Update Success: ID " + gameId + " to " +
                                    newStatus);
                                // อาจจะใส่ Alert หรือ Toast แจ้งเตือนตรงนี้ก็ได้
                            } else {
                                alert("Error updating status!");
                                // ถ้าพัง ให้ดีดปุ่มกลับคืนค่าเดิม
                                this.checked = !this.checked;
                            }
                        })
                        .catch(error => {
                            console.error("Error:", error);
                            alert("Something went wrong");
                            this.checked = !this.checked;
                        });
                });
            });
        });
    </script>
@endpush
