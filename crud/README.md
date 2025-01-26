# Dự án CRUD

## Mô tả

**Người dùng** đăng ký, đăng nhập tài khoản và đăng các bài **post**

Ở đây mình sẽ dùng cơ sở dữ liệu quan hệ (SQL) để lưu trữ dữ liệu.

Cụ thể là

- DB: SQLite
- Schema drawing tool: [dbdiagram.io](https://dbdiagram.io) (Sử dụng DBML - Database Markup Language)
- ORM: Prisma

> Cho ai chưa biết thì ORM là gì: ORM (Object-Relational Mapping) là thư viện giúp tương tác với database thông qua ngôn ngữ lập trình (ví dụ như JavaScript) mà không cần viết truy vấn SQL.

Ví dụ:

```javascript
const createMany = await prisma.user.createMany({
  data: [
    { name: 'Bob', email: 'bob@prisma.io' },
    { name: 'Bobo', email: 'bob@prisma.io' }, // Duplicate unique key!
    { name: 'Yewande', email: 'yewande@prisma.io' },
    { name: 'Angelique', email: 'angelique@prisma.io' },
  ],
  skipDuplicates: true, // Skip 'Bobo'
})
```

Thay vì

```sql
INSERT INTO user (name, email)
VALUES
  ('Bob', 'bob@prisma.io'),
  ('Bobo', 'bob@prisma.io'),
  ('Yewande', 'yewande@prisma.io'),
  ('Angelique', 'angelique@prisma.io')
ON CONFLICT (email) DO NOTHING;
```

## Giải thích lý do chọn stack trên

- Chọn SQL vì doanh nghiệp ngoài kia dùng SQL rất nhiều (hơn hẳn NoSQL)

- SQLite vì các bạn không cần cài đặt phần mềm gì cả, chỉ cần cài package npm là có ngay database. SQLite cũng được tích hợp sẵn trong Prisma. Tất nhiên bạn cũng có thể tự download cài đặt SQLite trên máy tính để tương tác với database một cách trực tiếp nếu muốn.

- dbdiagram.io vì nó miễn phí, hỗ trợ DBML nên có thể dùng ChatGPT để tạo schema dễ dàng

- Prisma: Best Node.js ORM

## Phân tích cơ sở dữ liệu

Thường với mình sẽ có 3 bước:

- Phân tích chức năng
- Vẽ schema bằng DBML
- Tạo schema trong Prisma

### Phân tích chức năng

- Người dùng đăng ký tài khoản: email, name, password, confirm password
- Người dùng đăng nhập: email, password
- Người dùng đăng bài post: title, content
- Áp dụng JWT cho việc xác thực người dùng, tích hợp Access Token và Refresh Token: Access Token sẽ là stateless, Refresh Token sẽ lưu trên database (stateful)
- Một người dùng có thể có nhiều post
- Một người dùng có thể đăng nhập trên nhiều thiết bị => Có nhiều Refresh Token cho mỗi người dùng

Từ yêu cầu trên chúng ta sẽ có 3 bảng: User, Post, RefreshToken

> Quy tắc đặt tên bảng: Mình sẽ đặt tên bảng và trường theo [quy tắc Prisma](https://www.prisma.io/docs/orm/reference/prisma-schema-reference#naming-conventions)

### Vẽ schema bằng DBML

Tham khảo tài liệu [DBML](https://dbml.dbdiagram.io/home) để biết cách viết schema

Datatype khi code bằng DBML rất linh động, các bạn có thể gõ bất kỳ text nào mà bạn muốn. Vì vậy mình thường dùng datatype theo Prisma để dễ hiểu hơn (thay vì dùng datatype của sqlite).

> Prisma sẽ tự động chuyển đổi datatype mà bạn khai báo trong schema thành datatype của database mà bạn đang dùng theo [quy tắc họ đề ra](https://www.prisma.io/docs/orm/reference/prisma-schema-reference#model-field-scalar-types)

> Để hiểu sâu hơn về các kiểu dữ liệu của SQLite thì các bạn có thể lên google gõ "sqlite data types" hoặc vào chatgpt gõ "các kiểu dữ liệu trong sqlite". Trong video này tránh việc làm phức tạp quá, mình chỉ thao tác qua Prisma thôi.

Quan hệ giữa các bảng:

- Một người dùng có thể có nhiều post: Mối quan hệ 1-n
- Một người dùng có thể có nhiều Refresh Token: Mối quan hệ 1-n

Mỗi bảng **phải có** ít nhất 1 trường unique để phân biệt giữa các item với nhau.

```dbml
Project CRUD {
  database_type: 'SQLite'
  Note: 'Sử dụng Prisma ORM. Columne Type cũng theo Prisma'
}

Table User {
  id        Int      [pk, increment]
  email     String   [unique]
  name      String
  password  String
  createdAt DateTime [default: `now()`]
  updatedAt DateTime [note: '@updatedAt']
}

Table Post {
  id        Int      [pk, increment]
  title     String
  content   String
  authorId  Int
  createdAt DateTime [default: `now()`]
  updatedAt DateTime [note: '@updatedAt']
}

Ref: Post.authorId > User.id [delete: cascade, update: no action]  // Khi xóa người dùng thì xóa hết post của người đó

Table RefreshToken {
  token     String   [unique] // Có thể pk cũng được, nhưng mình không cần liên kết khóa ngoại nên thôi
  userId    Int
  expiresAt DateTime
  createdAt DateTime [default: `now()`]
}

Ref: RefreshToken.userId > User.id  [delete: cascade, update: no action] // Khi xóa người dùng thì xóa hết token của người đó
```

> FAQ: Trường khóa chính khác gì với trường unique trong sql? PK thì đem đi tạo quan hệ được, còn unique thì không.

### Tạo schema trong Prisma

Khuyến khích dành ra 1 ngày để đọc doc của Prisma để biết cách nó vận hành, cách code.

Trong tương lai mình sẽ làm 1 video Prisma Tutorial trên kênh youtube Được Dev.

Cài đặt Prisma Extension cho VSCode để tạo schema dễ dàng hơn
