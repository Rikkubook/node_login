# Node-login

- passport 驗證
  使用 passport 來進行使用者的登入認證
- passport-google-oauth20
  使用 Google OAuth 2.0 策略進行身份驗證。
  (注意：目前Google服務只開放測試，且只對特定帳號開放。)
- ejs 模板
- mongoose 操作MongoDB資料庫。
- express-session
  中間件來管理使用者會話。 儲存用戶的登入狀態和數據，並跨多個頁面請求保持這些資訊。
- connect-flash
  儲存一次性的訊息（flash訊息）。 常用於登入錯誤、表單提交訊息等場景。
- validator
  進行驗證

## 描述

當註冊即可登入，並且有座 middleware 控管

- 學生登入
  - 個人頁 /profile
  - 個人頁 /profile/post
- 老師登入
  - 學生列表畫面 /studentsList
  - 學生資料新增 /studentInsert/:id
  - 學生編輯畫面 /studentEdit/:id
  - 學生呈現畫面 /studentPage/:id
  - 學生刪除畫面 /studentDelete/:id
