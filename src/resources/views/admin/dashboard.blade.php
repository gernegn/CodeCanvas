@extends('admin.layout')

@section('content')
    <div class="dashboard-title-section">
        <h1>Dashboard Overview</h1>
        <p class="current-date" id="current-date"></p>
    </div>

    <div class="dashboard-grid">

        <div class="grid-column">

            <div class="card stat-card">
                <div class="card-header">
                    <div class="icon-box pink">
                        <i class='bx bx-user'></i>
                    </div>
                    <span class="card-label-1">Total Plays</span>
                </div>
                <div class="card-value" id="totalPlays">-</div>
            </div>

            <div class="card chart-card">
                <div class="card-header-custom">
                    <div class="header-left">
                        <div class="icon-circle-green">
                            <i class='bx bx-time-five'></i>
                        </div>
                        <h3 class="card-title">Quantity</h3>
                    </div>
                    <span class="badge-today">Today</span>
                </div>

                <div class="chart-body">
                    <p class="y-axis-title">Quantity</p>

                    <div class="chart-area-wrapper">
                        <div class="y-axis-labels" id="yAxisLabels">
                            <span>-</span><span>-</span>
                        </div>

                        <div class="y-axis-line"></div>

                        <div class="bars-container" id="barsContainer">
                            {{-- Rendered by JS --}}
                        </div>
                    </div>

                    <div class="x-axis-wrapper">
                        <span class="x-label">0</span>
                        <div class="timeline-dots">
                            <i></i><i></i><i></i><i></i><i></i><i></i>
                            <i></i><i></i><i></i><i></i><i></i><i></i>
                        </div>
                        <span class="x-label highlight">12</span>
                        <div class="timeline-dots">
                            <i></i><i></i><i></i><i></i><i></i><i></i>
                            <i></i><i></i><i></i><i></i><i></i><i></i>
                        </div>
                        <span class="x-label">24</span>
                        <span class="x-label-title">Time</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid-column">
            <div class="card challenge-card">
                <div class="card-header">
                    <div class="icon-box blue"><i class='bx bx-refresh'></i></div>
                    <span class="card-label-3">Most played challenge</span>
                </div>
                <div class="challenge-content">

                    <div class="main-stat">
                        <h2 id="rank1Percent">-</h2>
                        <p id="rank1Name">-</p>
                    </div>

                    <div class="ranking-chart">

                        <div class="rank-item">
                            <span id="rank2Percent">-</span>
                            <small id="rank2Name">-</small>
                            <div class="rank-bar orange">
                                <span>02</span>
                            </div>
                        </div>

                        {{-- rank1: highlight bar เปล่า ไม่มี % หรือชื่อ เหมือนของเดิม --}}
                        <div class="rank-item highlight">
                            <div class="rank-bar pink">
                                <span>01</span>
                            </div>
                        </div>

                        <div class="rank-item">
                            <span id="rank3Percent">-</span>
                            <small id="rank3Name">-</small>
                            <div class="rank-bar green">
                                <span>03</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div class="card activity-card">
                <div class="card-header">
                    <div class="icon-box yellow"><i class='bx bx-history'></i></div>
                    <span class="card-label-4">Recent Activity</span>
                </div>

                <div class="activity-list" id="activityList">
                    {{-- Rendered by JS --}}
                </div>
            </div>
        </div>

    </div>

    @push('scripts')
        <script src="https://js.pusher.com/8.2.0/pusher.min.js"></script>
        <script>
            // แสดงวันที่ปัจจุบัน
            const today = new Date();
            document.getElementById('current-date').textContent =
                String(today.getDate()).padStart(2, '0') + '/' +
                String(today.getMonth() + 1).padStart(2, '0') + '/' +
                today.getFullYear();

            async function getData() {
                try {
                    const response = await fetch('/admin/dashboard/getdata');
                    const data = await response.json();
                    renderDashboard(data);
                } catch (e) {
                    console.error('Fetch error:', e);
                }
            }

            function getPercent(rank, totalPlays) {
                if (!rank) return '-';
                if (rank.percent !== undefined) return rank.percent + '%';
                if (rank.total_count !== undefined && totalPlays > 0)
                    return Math.round((rank.total_count / totalPlays) * 100) + '%';
                return '-';
            }

            function getChallenge(rank) {
                if (!rank) return '-';
                if (rank.challenge !== undefined) return rank.challenge;
                return rank.game?.Challenge ?? '-';
            }

            function renderDashboard(data) {
                // Total Plays
                document.getElementById('totalPlays').textContent =
                    Number(data.totalPlays).toLocaleString();

                // Y-Axis Labels
                document.getElementById('yAxisLabels').innerHTML =
                    `<span>${data.yAxisMax}</span><span>${Math.round(data.yAxisMax / 2)}</span>`;

                // Bars Chart
                const barsContainer = document.getElementById('barsContainer');
                barsContainer.innerHTML = '';
                Object.entries(data.chartData).forEach(([hour, count]) => {
                    const height = data.yAxisMax > 0 ? (count / data.yAxisMax) * 100 : 0;
                    const slot = document.createElement('div');
                    slot.className = `bar-slot${count > 0 ? ' has-value' : ''}`;
                    slot.style.width = '3.5%';
                    slot.innerHTML = count > 0 ?
                        `<div class="bar" style="height: ${height}%;"></div><span class="value">${count}</span>` :
                        `<div class="bar" style="height: 0%;"></div>`;
                    barsContainer.appendChild(slot);
                });

                // Rank
                document.getElementById('rank1Percent').textContent = getPercent(data.rank1, data.totalPlays);
                document.getElementById('rank1Name').textContent = getChallenge(data.rank1);
                document.getElementById('rank2Percent').textContent = getPercent(data.rank2, data.totalPlays);
                document.getElementById('rank2Name').textContent = getChallenge(data.rank2);
                document.getElementById('rank3Percent').textContent = getPercent(data.rank3, data.totalPlays);
                document.getElementById('rank3Name').textContent = getChallenge(data.rank3);

                // Recent Activities
                const activityList = document.getElementById('activityList');
                if (data.recentActivities && data.recentActivities.length > 0) {
                    activityList.innerHTML = data.recentActivities.map(activity => {

                        // ✅ ส่วนที่แก้ไข: จัดการแสดงผลวันที่ และเวลาแบบมี AM/PM
                        let date = '-';
                        if (activity.created_at) {
                            const d = new Date(activity.created_at);

                            // 1. ดึงแค่วันที่ (รูปแบบ DD/MM/YYYY)
                            const datePart = d.toLocaleDateString('th-TH', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                            });

                            // 2. ดึงเวลาแบบ 12 ชั่วโมงพร้อม AM/PM (เช่น 02:30 PM)
                            const timePart = d.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            });

                            // เอามาต่อกัน
                            date = `${datePart} ${timePart}`;
                        }

                        // แปลงเวลา Timestamp_Min เป็น "Xm Ys"
                        let timeString = '-';
                        if (activity.Timestamp_Min) {
                            let timeParts = String(activity.Timestamp_Min).split('.');
                            let mins = timeParts[0] || '0';
                            let secs = timeParts[1] || '0';

                            if (mins === '0') {
                                timeString = `${secs}s`;
                            } else {
                                timeString = `${mins}m ${secs}s`;
                            }
                        }

                        return `
                            <div class="activity-item">
                                <div class="user-avatar"><i class='bx bx-user'></i></div>
                                <div class="activity-info">
                                    <p>completed in <strong>${timeString}</strong></p>
                                    <small>on ${date}</small>
                                </div>
                            </div>
                        `;
                    }).join('');
                } else {
                    activityList.innerHTML = `<p style="text-align:center; color:#999; padding:20px;">No recent activity</p>`;
                }
            }

            // Pusher
            Pusher.logToConsole = true;
            var pusher = new Pusher("{{ env('PUSHER_APP_KEY') }}", {
                cluster: "{{ env('PUSHER_APP_CLUSTER') }}",
                forceTLS: true
            });

            var channel = pusher.subscribe('user-save');
            channel.bind('userSave', function(data) {
                console.log('Received data:', data);
                getData();
            });

            getData();
        </script>
    @endpush
@endsection
