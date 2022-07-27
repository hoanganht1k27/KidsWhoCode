## STR24 - Thay thế xâu

### Yêu cầu

Viết chương trình nhập vào một văn bản là một chuỗi kí tự S . Hãy thay thế tất cả các cụm kí tự S1 bằng cụm kí tự S2 (Xâu ký tự S2 sau khi đã được thay thế vào thì không được tham gia vào quá trình tìm kiếm và thay thế tiếp nữa)

### Dữ liệu

Gồm 3 dòng:

Dòng đầu tiên là chuỗi ký tự S (0 < length(S) ≤ 2000).

Dòng thứ 2 là cụm kí tự S1 (0 < length(S1) ≤ length(S)).

Dòng thứ 3 là cụm kí tự S2 (0 < length(S2) ≤ length(S)).

### Kết quả

Là chuỗi kí tự S sau khi thay thế cụm kí tự S1 bằng cụm kí tự S2

### Ví dụ

###### input

Toi di hoc ve

hoc

lam

###### output

Toi di lam ve


###### input

acbacbacb

b

bab

###### output
acbabacbabacbab