# Gửi Email

Email sử dụng giao thức SMTP, IMAP, POP3 để gửi và nhận email. Nó khác với giao thức HTTP mà chúng ta lướt web hằng ngày.

Vì vậy để gửi email người ta có 2 giải pháp

## 1. Tự build một Server riêng để gửi email

Cách này rất tốn thời gian, chi phí và không hiệu quả. Vì dễ bị các hệ thống email như Gmail, Yahoo, Outlook,.. chặn do không đáp ứng các tiêu chuẩn an toàn, chống spam,...

## 2. Sử dụng dịch vụ của các công ty cung cấp dịch vụ email như AWS SES, SendGrid, Mailgun, Resend, vv

Cách này hiệu quả hơn, chi phí thấp, dễ sử dụng, hỗ trợ nhiều tính năng như gửi email theo hàng loạt, theo dõi email, chống spam,..

Với cách này thường sẽ có 2 mode

- **Sandbox mode**: Chỉ cho phép gửi email đến các email đã được xác nhận trước

- **Production mode**: Cho phép gửi email đến bất kỳ email nào. Đòi hỏi phải xác minh tên miền, tài khoản,..

Đây cũng là cách mà thực tế các công ty dùng nhiều nhất.

> Hiện tại mình đang dùng AWS SES cho website edu của mình. Vì nó siêu rẻ

Trong khóa học này mình sẽ hướng dẫn các bạn dùng Resend để gửi email, thay vì Node-mailer như một số video tutorial khác.

Vì Resend dạo gần đây siêu hot, dễ dùng, UX và UI no.1

Nếu bạn không thích Resend, có thể dùng AWS SES, mình đã [hướng dẫn tại đây](https://duthanhduoc.com/blog/huong-dan-gui-email-voi-aws-ses-va-nodejs) hoặc Node-mailer
