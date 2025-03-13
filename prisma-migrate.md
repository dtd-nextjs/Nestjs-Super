# Prisma Migrate

## 1. prisma db push

Trước giờ chúng ta migrate bằng câu lệnh `prisma db push` với Single Source of Truth (SSOT) là file `schema.prisma`.

> Single Source of Truth (SSOT) ở đây có thể hiểu là nơi duy nhất chứa thông tin của database. Mọi thứ đều được suy ra từ đây

### Cách hoạt động

- Prisma so sánh schema trong file schema.prisma với trạng thái hiện tại của cơ sở dữ liệu.

- Nếu có sự khác biệt (ví dụ: thêm bảng, thay đổi kiểu dữ liệu), Prisma tự động áp dụng các thay đổi cần thiết.

- Không tạo file migration: Thay đổi được áp dụng trực tiếp mà không lưu lại lịch sử dưới dạng script SQL.

### Ưu nhược điểm

**Ưu điểm**:

- Migrate nhanh chóng, không cần phải tạo các file migration (`.sql`).

- Từ đó phù hợp cho giai đoạn phát thảo và thử nghiệm schema database, nên được sử dụng trong môi trường không quan trọng dữ liệu như development.

**Nhược điểm**:

- Không thể migration rollback (down migration), chỉ có thể push forward (Thực ra là có thể rollback thủ công bằng cách sửa lại file `schema.prisma` và push lại, nhưng đôi khi không push được đòi hỏi bạn phải sửa nhiều lần)

- Không lưu lịch sử migration, khó theo dõi thay đổi

- Cấu trúc database phụ thuộc vào prisma schema, nhưng prisma schema lại không có những tính năng đặc biệt của database như Partial Unique Indexes, Partial Indexes trên Postgresql. Vì vậy bạn bị giới hạn tính năng của database.

## 2. Thêm Prisma Migrate vào một database có sẵn

Có thể gọi là chuyển đổi từ cách dùng `prisma db push` sang `prisma migrate`.

Tham khảo: [Adding Prisma Migrate to an existing project](https://www.prisma.io/docs/orm/prisma-migrate/getting-started#adding-prisma-migrate-to-an-existing-project)

Các bước thực hiện

### 1. Đồng bộ `schema.prisma` với database hiện tại

Nếu chưa có file `schema.prisma`, hãy tạo 1 file `schema.prisma` cơ bản kết nối với database hiện tại và chạy câu lệnh sau để prisma đọc database và cập nhật file `schema.prisma`:

```bash
prisma db pull
```

Nếu bạn đã có sẵn file `schema.prisma` do đang sử dụng cách `prisma db push`, thì hãy chạy lại câu lệnh `prisma db push` 1 lần nữa để chắc chắn là file `schema.prisma` đồng bộ với database hiện tại.

### 2. Tạo baseline migration

1. Tạo thư mục `prisma/migrations/0_init`
2. Dựa vào file `schema.prisma`, tạo file migration bằng câu lệnh sau

   ```bash
   npx prisma migrate diff \
   --from-empty \
   --to-schema-datamodel prisma/schema.prisma \
   --script > prisma/migrations/0_init/migration.sql
   ```

3. Đánh dấu là file `0_init/migration.sql` đã được áp dụng. Câu lệnh dưới đây sẽ không thay đổi cấu trúc database, nó chỉ cập nhật dữ liệu trong table `_prisma_migrations`

   ```bash
   npx prisma migrate resolve --applied 0_init
   ```

4. Bây giờ có thể coi là chúng ta đã chuyển từ `prisma db push` sang `prisma migrate` thành công. Commit lại file `schema.prisma` và thư mục `prisma/migrations` lên git.

## 3. Thêm một tính năng mà Prisma Schema không hỗ trợ

Để làm thì schema của các bạn phải sync với database hiện tại và dự án phải sử dụng `prisma migrate` thay vì `prisma db push`

Ví dụ mình muốn thêm Partial Unique Indexes vào một table trên Postgresql. Prisma Schema không hỗ trợ tính năng này, nhưng chúng ta có thể thêm bằng cách sửa file migration.

1. Tạo một file migration `npx prisma migrate dev --create-only`. Câu lệnh này yêu cầu Prisma kiểm tra file `schema.prisma` với trạng thái database để tạo ra file migration mới. `--create-only` Tùy chọn này giới hạn hành động của lệnh chỉ ở bước tạo file migration, mà không thực hiện bước áp dụng (apply) migration vào cơ sở dữ liệu. Ở bước này thì nó sẽ tạo ra file sql rỗng

2. Paste nội dung sau vào file migration mới tạo

   ```sql
   CREATE UNIQUE INDEX permission_path_method_unique
   ON "Permission" (path, method)
   WHERE "deletedAt" IS NULL;
   ```

3. Chạy migration `npx prisma migrate dev`

## 4. Edit Custom Migration

Trong nhiều trường hợp khi thay đổi schema, nếu thực hiện migrate sẽ bị mất data. Để xử lý trường hợp này, chúng ta cần phải edit lại file migration

Tham khảo: [Customizing migrations](https://www.prisma.io/docs/orm/prisma-migrate/workflows/customizing-migrations)
