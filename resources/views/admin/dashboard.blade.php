@extends('admin.layout')

@section('content')
    <div class="dashboard-title-section">
        <h1>Dashboard Overview</h1>
        <p class="current-date">{{ now()->format('d/m/Y') }}</p>
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
                <div class="card-value">{{ number_format($totalPlays) }}</div>
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
                        <div class="y-axis-labels">
                            <span>{{ $yAxisMax }}</span> <span>{{ round($yAxisMax / 2) }}</span>
                        </div>

                        <div class="y-axis-line"></div>

                        <div class="bars-container">
                            @foreach ($chartData as $hour => $count)
                                @php
                                    // คำนวณความสูงเป็น % เทียบกับค่าสูงสุด
                                    $height = ($count / $yAxisMax) * 100;
                                @endphp

                                <div class="bar-slot {{ $count > 0 ? 'has-value' : '' }}" style="width: 3.5%;">
                                    @if ($count > 0)
                                        <div class="bar" style="height: {{ $height }}%;"></div>
                                        <span class="value">{{ $count }}</span>
                                    @else
                                        <div class="bar" style="height: 0%;"></div>
                                    @endif
                                </div>
                            @endforeach
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
                        <h2>{{ $calcPercent($rank1) }}%</h2>
                        <p>{{ $rank1->game->Challenge ?? '-' }}</p>
                    </div>

                    <div class="ranking-chart">

                        <div class="rank-item">
                            <span>{{ $calcPercent($rank2) }}%</span>
                            <small>{{ $rank2->game->Challenge ?? '-' }}</small>
                            <div class="rank-bar orange">
                                <span>02</span>
                            </div>
                        </div>

                        <div class="rank-item highlight">
                            <div class="rank-bar pink">
                                <span>01</span>
                            </div>
                        </div>

                        <div class="rank-item">
                            <span>{{ $calcPercent($rank3) }}%</span>
                            <small>{{ $rank3->game->Challenge ?? '-' }}</small>
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

                <div class="activity-list">
                    @foreach ($recentActivities as $activity)
                        <div class="activity-item">
                            <div class="user-avatar"><i class='bx bx-user'></i></div>
                            <div class="activity-info">
                                <p>completed in <strong>{{ $activity->Timestamp_Min }}s</strong></p>

                                <small>on
                                    {{ $activity->created_at ? $activity->created_at->format('d-m-Y H:i') : '-' }}</small>
                            </div>
                        </div>
                    @endforeach

                    @if ($recentActivities->isEmpty())
                        <p style="text-align:center; color:#999; padding:20px;">No recent activity</p>
                    @endif
                </div>
            </div>
        </div>

    </div>
@endsection
