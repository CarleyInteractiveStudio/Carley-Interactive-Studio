# Supabase Email Templates for Carley Interactive Studio

This document contains the localized English HTML templates for Supabase Auth emails, styled to match the Carley Interactive Studio aesthetic.

## 1. Signup Confirmation
**Subject:** Welcome to Carley Interactive Studio! Confirm your email

```html
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #000000;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table width="500" border="0" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; border-radius: 24px; border: 1px solid #1a1a1a;">
                    <tr>
                        <td align="center" style="padding: 40px 40px 10px 40px;">
                            <img src="https://carleystudio.com/carley_foto_web/Logo_C.png" alt="Carley Logo" width="50" style="display: block;">
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 20px 40px;">
                            <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">Welcome to our community!</h1>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 10px 40px 20px 40px; color: #aaaaaa; line-height: 1.6; font-size: 16px;">
                            Thank you for joining <strong>Carley Interactive Studio</strong>! We are thrilled to have you as part of our creative ecosystem.
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 10px 40px 30px 40px; color: #aaaaaa; line-height: 1.6; font-size: 16px;">
                            To get started and activate your account, please confirm your email address by clicking the button below:
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 0 40px 40px 40px;">
                            <a href="{{ .ConfirmationURL }}" style="background-color: #00aaff; color: #ffffff; padding: 16px 36px; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block; transition: all 0.3s ease;">Confirm My Account</a>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 20px 40px 40px 40px; border-top: 1px solid #1a1a1a; color: #555555; font-size: 13px; line-height: 1.5;">
                            If you didn't create an account, you can safely ignore this email.
                            <br><br>
                            © 2026 Carley Interactive Studio
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
```

## 2. Password Reset
**Subject:** Reset your Carley Interactive Studio password

```html
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #000000;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table width="500" border="0" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; border-radius: 24px; border: 1px solid #1a1a1a;">
                    <tr>
                        <td align="center" style="padding: 40px 40px 10px 40px;">
                            <img src="https://carleystudio.com/carley_foto_web/Logo_C.png" alt="Carley Logo" width="50" style="display: block;">
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 20px 40px;">
                            <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">Password Reset</h1>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 10px 40px 30px 40px; color: #aaaaaa; line-height: 1.6; font-size: 16px;">
                            We received a request to reset your password. If this was you, click the button below to set a new one:
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 0 40px 40px 40px;">
                            <a href="{{ .ConfirmationURL }}" style="background-color: #00aaff; color: #ffffff; padding: 16px 36px; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">Reset Password</a>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 20px 40px 40px 40px; border-top: 1px solid #1a1a1a; color: #555555; font-size: 13px; line-height: 1.5;">
                            If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                            <br><br>
                            © 2026 Carley Interactive Studio
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
```

## 3. Magic Link
**Subject:** Log in to Carley Interactive Studio

```html
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #000000;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table width="500" border="0" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; border-radius: 24px; border: 1px solid #1a1a1a;">
                    <tr>
                        <td align="center" style="padding: 40px 40px 10px 40px;">
                            <img src="https://carleystudio.com/carley_foto_web/Logo_C.png" alt="Carley Logo" width="50" style="display: block;">
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 20px 40px;">
                            <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">Magic Link Login</h1>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 10px 40px 30px 40px; color: #aaaaaa; line-height: 1.6; font-size: 16px;">
                            Use the button below to sign in instantly to your account. This link will expire shortly for your security.
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 0 40px 40px 40px;">
                            <a href="{{ .ConfirmationURL }}" style="background-color: #00aaff; color: #ffffff; padding: 16px 36px; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">Sign In Now</a>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 20px 40px 40px 40px; border-top: 1px solid #1a1a1a; color: #555555; font-size: 13px; line-height: 1.5;">
                            If you didn't request this link, you can safely ignore this email.
                            <br><br>
                            © 2026 Carley Interactive Studio
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
```

## 4. Email Change
**Subject:** Confirm your new email address

```html
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #000000;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table width="500" border="0" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; border-radius: 24px; border: 1px solid #1a1a1a;">
                    <tr>
                        <td align="center" style="padding: 40px 40px 10px 40px;">
                            <img src="https://carleystudio.com/carley_foto_web/Logo_C.png" alt="Carley Logo" width="50" style="display: block;">
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 20px 40px;">
                            <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">Email Change</h1>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 10px 40px 30px 40px; color: #aaaaaa; line-height: 1.6; font-size: 16px;">
                            You are receiving this email because a change of email address was requested for your account. Please click below to confirm your new address:
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 0 40px 40px 40px;">
                            <a href="{{ .ConfirmationURL }}" style="background-color: #00aaff; color: #ffffff; padding: 16px 36px; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">Confirm New Email</a>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 20px 40px 40px 40px; border-top: 1px solid #1a1a1a; color: #555555; font-size: 13px; line-height: 1.5;">
                            If you didn't request this change, please contact our support team immediately.
                            <br><br>
                            © 2026 Carley Interactive Studio
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
```

## 5. Invite User
**Subject:** You've been invited to join Carley Interactive Studio

```html
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #000000;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table width="500" border="0" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; border-radius: 24px; border: 1px solid #1a1a1a;">
                    <tr>
                        <td align="center" style="padding: 40px 40px 10px 40px;">
                            <img src="https://carleystudio.com/carley_foto_web/Logo_C.png" alt="Carley Logo" width="50" style="display: block;">
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 20px 40px;">
                            <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">Invitation Received</h1>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 10px 40px 30px 40px; color: #aaaaaa; line-height: 1.6; font-size: 16px;">
                            You have been invited to join the <strong>Carley Interactive Studio</strong> platform. Click the button below to accept your invitation and set up your account:
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 0 40px 40px 40px;">
                            <a href="{{ .ConfirmationURL }}" style="background-color: #00aaff; color: #ffffff; padding: 16px 36px; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">Accept Invitation</a>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 20px 40px 40px 40px; border-top: 1px solid #1a1a1a; color: #555555; font-size: 13px; line-height: 1.5;">
                            If you weren't expecting this invitation, you can safely ignore this email.
                            <br><br>
                            © 2026 Carley Interactive Studio
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
```
