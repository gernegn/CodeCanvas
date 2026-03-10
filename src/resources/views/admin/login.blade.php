<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login - CodeCanvas</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;600;700&display=swap"
        rel="stylesheet">
    <link href="{{ asset('css/admin-login.css') }}" rel="stylesheet">
</head>

<body>

    <div class="container">
        <div class="left-panel">
            <div class="bg-pattern">
            </div>
        </div>

        <div class="right-panel">
            <div class="login-box">
                <h1 class="title">Login to continue!</h1>
                <p class="subtitle">Login to access your interactive<br>game database.</p>

                <form method="POST" action="{{ route('admin.login.submit') }}">
                    @csrf <div class="form-group">
                        <label>Email</label>
                        <input type="email" name="email" placeholder="codeCanvas_official@gmail.com" required
                            value="{{ old('email') }}">
                        @error('email')
                            <div class="error-text">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" name="password" placeholder="password" required>
                        @error('password')
                            <div class="error-text">{{ $message }}</div>
                        @enderror
                    </div>

                    <button type="submit" class="btn-login">LOGIN</button>
                </form>
            </div>
        </div>
    </div>

</body>

</html>
