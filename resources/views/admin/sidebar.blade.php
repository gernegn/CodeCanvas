<aside class="sidebar">
    <div class="sidebar-header">
        <div class="brand-logo">
            <img src="{{ asset('img/elements-frontend/logo-01.png') }}" alt="CodeCanvas Logo">
        </div>
    </div>

    <ul class="sidebar-menu">
        <li>
            <a href="{{ route('admin.dashboard') }}"
                class="menu-item {{ Request::routeIs('admin.dashboard') ? 'active' : '' }}">
                <i class='bx bxs-dashboard'></i>
                <span>Dashboard</span>
            </a>
        </li>

        <li class="menu-title">
            <i class='bx bxs-joystick-alt'></i> Game Content
        </li>

        <li>
            <a href="{{ route('admin.game-general') }}"
                class="menu-item {{ Request::routeIs('admin.game-general') ? 'active' : '' }}">
                <i class='bx bx-list-ul'></i>
                <span>Game General</span>
            </a>
        </li>
        <li>
            <a href="{{ route('admin.game-code') }}"
                class="menu-item {{ Request::routeIs('admin.game-code') ? 'active' : '' }}">
                <i class='bx bxs-joystick'></i>
                <span>Game Code</span>
            </a>
        </li>

        <li class="menu-title">
            <i class='bx bxs-bar-chart-square'></i> User Data
        </li>

        <li>
            <a href="{{ route('admin.users') }}"
                class="menu-item {{ Request::routeIs('admin.users') ? 'active' : '' }}">
                <i class='bx bxs-user-detail'></i>
                <span>User General</span>
            </a>
        </li>
        <li>
            <a href="{{ route('admin.user-code') }}"
                class="menu-item {{ Request::routeIs('admin.user-code') ? 'active' : '' }}">
                <i class='bx bx-code-block'></i>
                <span>User Code</span>
            </a>
        </li>
    </ul>

    <div class="sidebar-footer">
        <form action="{{ route('admin.logout') }}" method="POST">
            @csrf
            <button type="submit" class="logout-btn">
                <i class='bx bx-log-out'></i> Logout
            </button>
        </form>
    </div>
</aside>
