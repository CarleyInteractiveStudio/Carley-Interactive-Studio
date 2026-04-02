# Supabase Email Templates for Carley Interactive Studio

This document contains the localized English HTML templates for Supabase Auth emails, optimized for the Supabase Studio dashboard to avoid saving errors.

### ⚠️ IMPORTANT: How to Save in Supabase
If you get an error when saving, try copying **ONLY** the code inside the `<body>` tags (between `<body>` and `</body>`) and pasting it into the Supabase editor.

---

## 1. Signup Confirmation
**Subject:** Welcome to our community! Confirm your email

```html
<table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #000000; font-family: sans-serif; color: #ffffff; padding: 40px 0;">
    <tr>
        <td align="center">
            <table width="500" border="0" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; border-radius: 20px; border: 1px solid #333333;">
                <tr>
                    <td align="center" style="padding: 40px 40px 10px 40px;">
                        <img src="https://carleystudio.com/carley_foto_web/Logo_C.png" alt="Carley Logo" width="50" style="display: block;" />
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding: 20px 40px;">
                        <h1 style="margin: 0; font-size: 24px; font-weight: bold; color: #ffffff;">Welcome to our community!</h1>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding: 10px 40px 30px 40px; color: #aaaaaa; line-height: 1.6; font-size: 16px;">
                        Thank you for joining <strong>Carley Interactive Studio</strong>! To activate your account, please confirm your email address by clicking the button below:
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding: 0 40px 40px 40px;">
                        <a href="{{ .ConfirmationURL }}" style="background-color: #00aaff; color: #ffffff; padding: 15px 30px; border-radius: 40px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">Confirm My Account</a>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding: 20px 40px 40px 40px; border-top: 1px solid #1a1a1a; color: #555555; font-size: 12px;">
                        If you didn't create an account, you can safely ignore this email.
                        <br /><br />
                        © 2026 Carley Interactive Studio
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
```

## 2. Password Reset
**Subject:** Reset your Carley Interactive Studio password

```html
<table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #000000; font-family: sans-serif; color: #ffffff; padding: 40px 0;">
    <tr>
        <td align="center">
            <table width="500" border="0" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; border-radius: 20px; border: 1px solid #333333;">
                <tr>
                    <td align="center" style="padding: 40px 40px 10px 40px;">
                        <img src="https://carleystudio.com/carley_foto_web/Logo_C.png" alt="Carley Logo" width="50" style="display: block;" />
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding: 20px 40px;">
                        <h1 style="margin: 0; font-size: 24px; font-weight: bold; color: #ffffff;">Password Reset</h1>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding: 10px 40px 30px 40px; color: #aaaaaa; line-height: 1.6; font-size: 16px;">
                        We received a request to reset your password. Click the button below to set a new one:
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding: 0 40px 40px 40px;">
                        <a href="{{ .ConfirmationURL }}" style="background-color: #00aaff; color: #ffffff; padding: 15px 30px; border-radius: 40px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">Reset Password</a>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding: 20px 40px 40px 40px; border-top: 1px solid #1a1a1a; color: #555555; font-size: 12px;">
                        If you didn't request a password reset, you can safely ignore this email.
                        <br /><br />
                        © 2026 Carley Interactive Studio
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
```

## 3. Magic Link
**Subject:** Log in to Carley Interactive Studio

```html
<table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #000000; font-family: sans-serif; color: #ffffff; padding: 40px 0;">
    <tr>
        <td align="center">
            <table width="500" border="0" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; border-radius: 20px; border: 1px solid #333333;">
                <tr>
                    <td align="center" style="padding: 40px 40px 10px 40px;">
                        <img src="https://carleystudio.com/carley_foto_web/Logo_C.png" alt="Carley Logo" width="50" style="display: block;" />
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding: 20px 40px;">
                        <h1 style="margin: 0; font-size: 24px; font-weight: bold; color: #ffffff;">Magic Link Login</h1>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding: 10px 40px 30px 40px; color: #aaaaaa; line-height: 1.6; font-size: 16px;">
                        Use the button below to sign in instantly to your account:
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding: 0 40px 40px 40px;">
                        <a href="{{ .ConfirmationURL }}" style="background-color: #00aaff; color: #ffffff; padding: 15px 30px; border-radius: 40px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">Sign In Now</a>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding: 20px 40px 40px 40px; border-top: 1px solid #1a1a1a; color: #555555; font-size: 12px;">
                        If you didn't request this link, you can safely ignore this email.
                        <br /><br />
                        © 2026 Carley Interactive Studio
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
```

## 4. Email Change
**Subject:** Confirm your new email address

```html
<table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #000000; font-family: sans-serif; color: #ffffff; padding: 40px 0;">
    <tr>
        <td align="center">
            <table width="500" border="0" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; border-radius: 20px; border: 1px solid #333333;">
                <tr>
                    <td align="center" style="padding: 40px 40px 10px 40px;">
                        <img src="https://carleystudio.com/carley_foto_web/Logo_C.png" alt="Carley Logo" width="50" style="display: block;" />
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding: 20px 40px;">
                        <h1 style="margin: 0; font-size: 24px; font-weight: bold; color: #ffffff;">Email Change</h1>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding: 10px 40px 30px 40px; color: #aaaaaa; line-height: 1.6; font-size: 16px;">
                        A change of email address was requested for your account. Please click below to confirm:
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding: 0 40px 40px 40px;">
                        <a href="{{ .ConfirmationURL }}" style="background-color: #00aaff; color: #ffffff; padding: 15px 30px; border-radius: 40px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">Confirm New Email</a>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding: 20px 40px 40px 40px; border-top: 1px solid #1a1a1a; color: #555555; font-size: 12px;">
                        If you didn't request this change, please contact support.
                        <br /><br />
                        © 2026 Carley Interactive Studio
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
```

## 5. Invite User
**Subject:** You've been invited to join Carley Interactive Studio

```html
<table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #000000; font-family: sans-serif; color: #ffffff; padding: 40px 0;">
    <tr>
        <td align="center">
            <table width="500" border="0" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; border-radius: 20px; border: 1px solid #333333;">
                <tr>
                    <td align="center" style="padding: 40px 40px 10px 40px;">
                        <img src="https://carleystudio.com/carley_foto_web/Logo_C.png" alt="Carley Logo" width="50" style="display: block;" />
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding: 20px 40px;">
                        <h1 style="margin: 0; font-size: 24px; font-weight: bold; color: #ffffff;">Invitation Received</h1>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding: 10px 40px 30px 40px; color: #aaaaaa; line-height: 1.6; font-size: 16px;">
                        You have been invited to join the <strong>Carley Interactive Studio</strong> platform. Click below to accept:
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding: 0 40px 40px 40px;">
                        <a href="{{ .ConfirmationURL }}" style="background-color: #00aaff; color: #ffffff; padding: 15px 30px; border-radius: 40px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">Accept Invitation</a>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding: 20px 40px 40px 40px; border-top: 1px solid #1a1a1a; color: #555555; font-size: 12px;">
                        If you weren't expecting this invitation, you can safely ignore this email.
                        <br /><br />
                        © 2026 Carley Interactive Studio
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
```
